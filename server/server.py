"""
OASK (Offline AI Survival Kit) - Main Server
===========================================

This is the core FastAPI server that handles all client requests and coordinates
with the AI model runner. It provides a complete offline AI chat experience
with multimodal support (text + images).

Key Features:
- RESTful API endpoints for chat functionality
- Multimodal message processing (text, images, files)
- Thread-safe model processing with queuing
- Comprehensive file format support (PDF, DOCX, images, audio)
- Complete offline operation (no internet required)
- Persistent chat storage and categorization

Architecture:
- FastAPI for high-performance async API
- Subprocess model execution for isolation and stability  
- Thread-safe processing queue to handle concurrent requests
- Pickle-based IPC for complex data structures
- CORS enabled for web client compatibility
"""

from fastapi import FastAPI, Form, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import sys
import pickle
import uuid
import tempfile
import uvicorn
from io import BytesIO
from PIL import Image
import json
import os
from datetime import datetime
import threading
import time

# =============================================================================
# OPTIONAL DEPENDENCIES - Advanced File Processing
# =============================================================================
# These imports are optional and provide extended functionality for processing
# various file formats. The server gracefully degrades if packages aren't installed.

# PDF Processing - Extracts text from PDF documents
try:
    import PyPDF2
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

# Speech Recognition - Converts audio to text
try:
    import speech_recognition as sr
    SPEECH_SUPPORT = True
except ImportError:
    SPEECH_SUPPORT = False

# Word Document Processing - Extracts text from DOCX files  
try:
    from docx import Document
    DOCX_SUPPORT = True
except ImportError:
    DOCX_SUPPORT = False

# =============================================================================
# FILE CONTENT EXTRACTION FUNCTIONS
# =============================================================================

def extract_text_content(file_content: bytes, filename: str, content_type: str) -> str:
    """
    Extract text content from various file types for AI processing.
    
    Supports:
    - Plain text files (.txt)
    - PDF documents (.pdf) - requires PyPDF2
    - Word documents (.docx) - requires python-docx
    - Images (converted to description placeholder)
    
    Args:
        file_content: Raw bytes of the uploaded file
        filename: Original filename with extension
        content_type: MIME type of the file
        
    Returns:
        Extracted text content or descriptive placeholder
    """
    try:
        # Text files
        if filename.lower().endswith('.txt') or content_type.startswith('text/'):
            try:
                # Try UTF-8 first, then other common encodings
                for encoding in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
                    try:
                        text = file_content.decode(encoding)
                        return f"Text file content:\n\n{text}"
                    except UnicodeDecodeError:
                        continue
                return "[Error: Could not decode text file]"
            except Exception as e:
                return f"[Error reading text file: {str(e)}]"
        
        # PDF files
        elif filename.lower().endswith('.pdf') and PDF_SUPPORT:
            try:
                pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
                text_parts = []
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text.strip():
                        text_parts.append(f"Page {page_num + 1}:\n{page_text}")
                
                if text_parts:
                    return f"PDF content ({len(pdf_reader.pages)} pages):\n\n" + "\n\n".join(text_parts)
                else:
                    return "[PDF contains no extractable text]"
            except Exception as e:
                return f"[Error reading PDF: {str(e)}]"
        
        # Word documents
        elif filename.lower().endswith('.docx') and DOCX_SUPPORT:
            try:
                doc = Document(BytesIO(file_content))
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                if paragraphs:
                    return f"Word document content:\n\n" + "\n\n".join(paragraphs)
                else:
                    return "[Word document contains no text]"
            except Exception as e:
                return f"[Error reading Word document: {str(e)}]"
        
        # Fallback for unsupported document types
        elif filename.lower().endswith(('.pdf', '.doc', '.docx')):
            if filename.lower().endswith('.pdf') and not PDF_SUPPORT:
                return f"[PDF file uploaded: {filename}] (PDF extraction not available - install PyPDF2)"
            elif filename.lower().endswith('.docx') and not DOCX_SUPPORT:
                return f"[Word document uploaded: {filename}] (DOCX extraction not available - install python-docx)"
            else:
                return f"[Document uploaded: {filename}] (Extraction not supported for this format)"
        
        else:
            return f"[File uploaded: {filename}] (Content extraction not supported for this file type)"
            
    except Exception as e:
        return f"[Error processing file {filename}: {str(e)}]"

def transcribe_audio(file_content: bytes, filename: str) -> str:
    """Transcribe audio content to text with enhanced format support"""
    if not SPEECH_SUPPORT:
        return f"[Audio file uploaded: {filename}] (Audio transcription not available - install SpeechRecognition)"
    
    try:
        # Save audio to temporary file
        file_extension = os.path.splitext(filename)[1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            recognizer = sr.Recognizer()
            
            # Handle different audio formats
            if file_extension in ['.wav', '.flac', '.aiff', '.aif']:
                # Direct support for WAV, FLAC, AIFF
                try:
                    with sr.AudioFile(temp_file_path) as source:
                        audio = recognizer.record(source)
                    text = recognizer.recognize_google(audio)
                    return f"Audio transcription from {filename}:\n\n{text}"
                except Exception as format_error:
                    return f"[Audio file uploaded: {filename}] (Format error: {str(format_error)})"
            
            elif file_extension in ['.mp3', '.m4a', '.ogg', '.mp4']:
                # Convert other formats using pydub if available
                try:
                    from pydub import AudioSegment
                    from pydub.utils import which
                    
                    # Check if ffmpeg is available for conversion
                    if not which("ffmpeg"):
                        return f"[Audio file uploaded: {filename}] (MP3/M4A support requires ffmpeg - file received but cannot convert)"
                    
                    # Convert to WAV for processing
                    audio_segment = AudioSegment.from_file(temp_file_path)
                    wav_path = temp_file_path + "_converted.wav"
                    audio_segment.export(wav_path, format="wav")
                    
                    # Transcribe converted file
                    with sr.AudioFile(wav_path) as source:
                        audio = recognizer.record(source)
                    text = recognizer.recognize_google(audio)
                    
                    # Clean up converted file
                    try:
                        os.unlink(wav_path)
                    except:
                        pass
                    
                    return f"Audio transcription from {filename} (converted from {file_extension}):\n\n{text}"
                    
                except ImportError:
                    return f"[Audio file uploaded: {filename}] (MP3/M4A conversion not available - install pydub and ffmpeg)"
                except Exception as convert_error:
                    return f"[Audio file uploaded: {filename}] (Conversion error: {str(convert_error)})"
            
            else:
                return f"[Audio file uploaded: {filename}] (Unsupported format: {file_extension}. Supported: .wav, .flac, .aiff, .mp3, .m4a)"
            
        except sr.UnknownValueError:
            return f"[Audio file uploaded: {filename}] (Audio processed but no speech detected - file may be silent, music-only, or unclear)"
        except sr.RequestError as e:
            return f"[Audio file uploaded: {filename}] (Speech recognition service error: {str(e)})"
        except Exception as e:
            error_msg = str(e)
            if "could not be read" in error_msg.lower():
                return f"[Audio file uploaded: {filename}] (Audio format not compatible - try WAV, FLAC, or AIFF format)"
            else:
                return f"[Audio file uploaded: {filename}] (Processing error: {error_msg})"
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
                
    except Exception as e:
        return f"[Error processing audio file {filename}: {str(e)}]"

# =============================================================================
# FASTAPI APPLICATION SETUP & GLOBAL STATE
# =============================================================================

# Initialize FastAPI application
app = FastAPI(
    title="OASK - Offline AI Survival Kit", 
    description="Complete offline AI chat server with multimodal support",
    version="1.0.0"
)

# Thread-safe processing state management
# These globals ensure only one AI request processes at a time
current_process = None  # Stores the active subprocess handle
processing_lock = threading.Lock()  # Prevents race conditions

# Configure CORS for web client compatibility  
# Allows the React frontend to communicate with this API server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Accept requests from any domain (demo setup)
    allow_methods=["*"],  # Support all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Accept all request headers
)

# =============================================================================
# DATA PERSISTENCE SETUP
# =============================================================================

# File paths for persistent storage
CHATS_FILE = "chats.json"      # Stores all conversation history
CATEGORIES_FILE = "categories.json"  # Stores chat organization categories

# Initialize persistent storage files with default data if they don't exist
if not os.path.exists(CHATS_FILE):
    with open(CHATS_FILE, 'w') as f:
        json.dump([], f)  # Empty list for new installation

if not os.path.exists(CATEGORIES_FILE):
    with open(CATEGORIES_FILE, 'w') as f:
        # Default category for uncategorized chats
        json.dump([{"id": "uncategorized", "name": "Uncategorized"}], f)

# =============================================================================
# DATA ACCESS HELPER FUNCTIONS
# =============================================================================

def load_chats():
    """
    Load all chat conversations from persistent storage.
    Returns empty list if file is corrupted or missing.
    """
    try:
        with open(CHATS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_chats(chats):
    """
    Save chat conversations to persistent storage with pretty formatting.
    
    Args:
        chats: List of chat objects with messages and metadata
    """
    with open(CHATS_FILE, 'w') as f:
        json.dump(chats, f, indent=2)

def load_categories():
    try:
        with open(CATEGORIES_FILE, 'r') as f:
            return json.load(f)
    except:
        return [{"id": "uncategorized", "name": "Uncategorized"}]

def save_categories(categories):
    with open(CATEGORIES_FILE, 'w') as f:
        json.dump(categories, f, indent=2)

def migrate_old_chats():
    """Migrate old chat structure to new conversation structure"""
    chats = load_chats()
    migrated = False
    
    for chat in chats:
        # Ensure category_id exists
        if "category_id" not in chat:
            chat["category_id"] = "uncategorized"
            migrated = True
            
        if "question" in chat and "response" in chat and "conversation" not in chat:
            # Convert old structure to new conversation format
            old_turn = {
                "timestamp": chat.get("timestamp", datetime.now().isoformat()),
                "question": chat["question"],
                "response": chat["response"],
                "has_image": chat.get("has_image", False),
                "image_data": None  # Old chats won't have image data
            }
            chat["conversation"] = [old_turn]
            # Remove old fields
            chat.pop("question", None)
            chat.pop("response", None)
            chat.pop("has_image", None)
            migrated = True
        elif "conversation" in chat:
            # Ensure existing conversations have image_data field
            for turn in chat["conversation"]:
                if "image_data" not in turn:
                    turn["image_data"] = None
                    migrated = True
    
    if migrated:
        save_chats(chats)
        print("Migrated old chat structure to new conversation format")

# Migrate existing chats on startup
migrate_old_chats()

@app.post("/stop")
async def stop_processing_request():
    global current_process
    with processing_lock:
        if current_process and current_process.poll() is None:  # Process is still running
            try:
                current_process.terminate()
                # Wait a bit for graceful termination
                try:
                    current_process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    # Force kill if it doesn't terminate gracefully
                    current_process.kill()
                    current_process.wait()
                print("Model process terminated successfully")
            except Exception as e:
                print(f"Error terminating process: {e}")
            finally:
                current_process = None
    return {"message": "Processing stop requested and process terminated"}

# =============================================================================
# MAIN AI CHAT API ENDPOINT
# =============================================================================

@app.post("/ask")
async def ask(
    text: str = Form(...),           # Required: User's text input
    system_prompt: str = Form(None), # Optional: AI personality/instructions
    image: UploadFile = File(None),  # Optional: Image file upload
    image_data: str = Form(None),    # Optional: Base64 encoded image
    chat_id: str = Form(None)        # Optional: Existing chat ID for continuation
):
    """
    Main AI chat endpoint - processes user input and returns AI response.
    
    This endpoint handles:
    - Text-only conversations
    - Multimodal conversations (text + images)
    - File uploads with content extraction
    - Chat continuation (adding to existing conversations)
    - Custom AI personalities via system prompts
    
    The processing is done in a separate subprocess for isolation and stability.
    Only one request can be processed at a time to manage system resources.
    
    Args:
        text: User's message text (required)
        system_prompt: Custom AI personality instructions (optional)
        image: Uploaded image file (optional) 
        image_data: Base64 encoded image data (optional)
        chat_id: ID of existing chat to continue (optional)
        
    Returns:
        JSON response with AI reply and conversation metadata
    """
    global current_process
    
    # Debug logging for development and demonstration
    print(f"=== PROCESSING REQUEST ===")
    print(f"Text length: {len(text)}")
    print(f"System prompt: {'Present' if system_prompt else 'None'}")
    print(f"Image: {'Present' if image or image_data else 'None'}")
    print(f"Chat ID: {chat_id or 'New chat'}")
    print(f"========================")
    
    # Thread-safe processing - only one request at a time
    with processing_lock:
        # Kill any existing process
        if current_process and current_process.poll() is None:
            try:
                current_process.terminate()
                current_process.wait(timeout=1)
            except:
                try:
                    current_process.kill()
                    current_process.wait()
                except:
                    pass
        current_process = None
    
    try:
        # Load existing chat to get conversation history
        chats = load_chats()
        current_chat = None
        
        if chat_id:
            current_chat = next((chat for chat in chats if chat["id"] == chat_id), None)
        
        # Truncate overly long system prompts to prevent model hangs
        final_system_prompt = system_prompt or "You are a helpful assistant."
        max_system_chars = 2000  # Conservative limit to prevent hanging
        if len(final_system_prompt) > max_system_chars:
            # Truncate and find a good breaking point
            truncated = final_system_prompt[:max_system_chars].strip()
            last_period = truncated.rfind('.')
            last_space = truncated.rfind(' ')
            if last_period > max_system_chars - 50:
                truncated = truncated[:last_period + 1]
            elif last_space > max_system_chars - 20:
                truncated = truncated[:last_space]
            
            # Ensure we never exceed the absolute limit
            if len(truncated) > max_system_chars:
                truncated = truncated[:max_system_chars].strip()
            
            print(f"WARNING: System prompt truncated from {len(final_system_prompt)} to {len(truncated)} characters")
            print(f"Original: {final_system_prompt[:50]}...")
            print(f"Truncated: {truncated}")
            final_system_prompt = truncated
        
        messages = [
            {
                "role": "system",
                "content": [{"type": "text", "text": final_system_prompt}]
            }
        ]
        
        # Add conversation history if this is a continuing chat
        if current_chat and "conversation" in current_chat:
            for turn in current_chat["conversation"]:
                # Add user message
                user_content = []
                if turn.get("question"):
                    user_content.append({"type": "text", "text": turn["question"]})
                if turn.get("has_image"):
                    user_content.append({"type": "text", "text": "[Image was provided]"})
                
                if user_content:
                    messages.append({
                        "role": "user",
                        "content": user_content
                    })
                
                # Add assistant response
                if turn.get("response"):
                    messages.append({
                        "role": "assistant",
                        "content": [{"type": "text", "text": turn["response"]}]
                    })
        
        # Add the current user message
        current_user_content = []
        if image:
            file_content = await image.read()
            file_type = image.content_type or ''
            filename = image.filename or ''
            
            # Determine file type and process accordingly
            if file_type.startswith('image/') or filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp')):
                # Process as image
                try:
                    img = Image.open(BytesIO(file_content)).convert("RGB")
                    current_user_content.append({"type": "image", "image": img})
                except Exception as e:
                    current_user_content.append({"type": "text", "text": f"[Error processing image: {str(e)}]"})
            
            elif file_type.startswith('audio/') or filename.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a', '.flac')):
                # Process as audio - transcribe to text
                audio_text = transcribe_audio(file_content, filename)
                current_user_content.append({"type": "audio", "audio": file_content})
                current_user_content.append({"type": "text", "text": audio_text})
            
            elif file_type.startswith('video/') or filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                # Process as video - for now, indicate video was provided  
                current_user_content.append({"type": "text", "text": f"[Video file uploaded: {filename}]"})
            
            elif filename.lower().endswith(('.pdf', '.doc', '.docx', '.txt')) or file_type.startswith('text/'):
                # Extract text content from documents
                extracted_text = extract_text_content(file_content, filename, file_type)
                current_user_content.append({"type": "text", "text": extracted_text})
            
            else:
                # Unknown file type
                current_user_content.append({"type": "text", "text": f"[File uploaded: {filename}]"})
        
        if text:
            current_user_content.append({"type": "text", "text": text})
        
        messages.append({
            "role": "user",
            "content": current_user_content
        })

        # Create temporary files for subprocess communication
        import tempfile
        import uuid
        
        process_id = str(uuid.uuid4())
        messages_file = f"temp_messages_{process_id}.pkl"
        output_file = f"temp_output_{process_id}.pkl"
        
        # Save messages to pickle file
        with open(messages_file, 'wb') as f:
            pickle.dump(messages, f)
        
        # Start the model process using the unified script
        python_executable = sys.executable
        script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "unified_model_runner.py")
        
        print(f"DEBUG: Python executable: {python_executable}")
        print(f"DEBUG: Script path: {script_path}")
        print(f"DEBUG: Script exists: {os.path.exists(script_path)}")
        print(f"DEBUG: Messages file: {messages_file}")
        print(f"DEBUG: Output file: {output_file}")
        print(f"DEBUG: Working directory: {os.getcwd()}")
        
        with processing_lock:
            current_process = subprocess.Popen([
                python_executable, script_path, messages_file, output_file
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for the process to complete without timeout to allow longer generations
        
        # Initialize variables for performance and analysis data
        performance_info = None
        model_config_info = None
        analysis_package = None
        
        try:
            print(f"DEBUG: Waiting for process completion...")
            current_process.wait()  # No timeout - allow unlimited generation time
            print(f"DEBUG: Process completed with return code: {current_process.returncode}")
            
            # Get stdout and stderr for debugging
            stdout, stderr = current_process.communicate()
            print(f"DEBUG: STDOUT: {stdout.decode()}")
            print(f"DEBUG: STDERR: {stderr.decode()}")
            
            # Check if output file exists and load result
            print(f"DEBUG: Checking if output file exists: {os.path.exists(output_file)}")
            if os.path.exists(output_file):
                print(f"DEBUG: Loading result from output file...")
                with open(output_file, 'rb') as f:
                    result = pickle.load(f)
                
                print(f"DEBUG: Result loaded: {result.get('success', False)}")
                if not result["success"]:
                    return {"error": f"Model error: {result['error']}"}
                
                reply = result["reply"]
                print("Generation completed successfully")
                print(f"RESPONSE: {reply}")
                
                # Extract performance and model configuration data safely
                # Include performance information if available
                if "performance" in result:
                    perf = result["performance"]
                    performance_info = {
                        "duration_seconds": perf.get("duration_seconds", 0),
                        "memory_used_mb": perf.get("memory_used_mb", 0),
                        "operation": perf.get("operation", "message_processing")
                    }
                    print(f"🚀 Performance: Duration: {perf.get('duration_seconds', 0):.1f}s, "
                          f"Memory: {perf.get('memory_used_mb', 0):.1f}MB, "
                          f"Operation: {perf.get('operation', 'unknown')}")
                
                # Include model configuration if available (safely extract without torch objects)
                if "model_config" in result:
                    model_config = result["model_config"]
                    model_config_info = {
                        "config_class": model_config.get("config_class", "unknown"),
                        "num_threads": model_config.get("num_threads", 0),
                        "memory_gb": model_config.get("memory_gb", 0),
                        "optimization_profile": model_config.get("optimization_profile", "unknown")
                    }
                    print(f"⚙️ Model Config: {model_config_info.get('config_class', 'unknown')} profile, "
                          f"{model_config_info.get('num_threads', 0)} threads")
                
                # Include analysis package if available
                if "analysis_package" in result:
                    analysis_package = result["analysis_package"]
                    print(f"📊 Analysis package created: {analysis_package}")
                
            else:
                return {"error": "No output generated"}
                
        except Exception as e:
            return {"error": f"Process error: {str(e)}"}
        finally:
            # Clean up temporary files
            try:
                if os.path.exists(messages_file):
                    os.remove(messages_file)
                if os.path.exists(output_file):
                    os.remove(output_file)
            except:
                pass
            
            # Clear process reference
            with processing_lock:
                current_process = None
        
        # Check if process was terminated (killed by stop button)
        if current_process and current_process.returncode < 0:
            return {"error": "Processing was stopped"}
        
        # Create new conversation turn
        new_turn = {
            "timestamp": datetime.now().isoformat(),
            "question": text,
            "response": reply,
            "has_image": image is not None,
            "image_data": image_data if image_data else None
        }
        
        # Update or create chat entry
        chat_entry = {
            "id": chat_id or str(datetime.now().timestamp()),
            "timestamp": datetime.now().isoformat(),
            "conversation": [],
            "category_id": "uncategorized"  # Default category
        }
        
        chat_found = False
        for i, chat in enumerate(chats):
            if chat["id"] == chat_entry["id"]:
                chat_entry = chat
                chat_found = True
                break
        
        # Initialize conversation array if it doesn't exist
        if "conversation" not in chat_entry:
            chat_entry["conversation"] = []
        
        # Handle legacy format conversion if needed
        if "question" in chat_entry and "response" in chat_entry and not chat_entry.get("conversation"):
            old_turn = {
                "timestamp": chat_entry.get("timestamp", datetime.now().isoformat()),
                "question": chat_entry["question"],
                "response": chat_entry["response"],
                "has_image": chat_entry.get("has_image", False),
                "image_data": None  # Old chats won't have image data
            }
            chat_entry["conversation"] = [old_turn]
            # Remove old fields
            chat_entry.pop("question", None)
            chat_entry.pop("response", None)
            chat_entry.pop("has_image", None)
        
        # Add new turn to conversation
        chat_entry["conversation"].append(new_turn)
        chat_entry["timestamp"] = datetime.now().isoformat()  # Update chat timestamp
        
        # Update chats list
        if chat_found:
            # Move to top (most recent)
            chats = [chat for chat in chats if chat["id"] != chat_entry["id"]]
            chats.insert(0, chat_entry)
        else:
            chats.insert(0, chat_entry)
        
        save_chats(chats)
        
        # Prepare response with analysis data - safe JSON response
        response_data = {
            "response": reply, 
            "chat_id": chat_entry["id"], 
            "conversation": chat_entry["conversation"]
        }
        
        # Add performance and analysis data if available
        if performance_info:
            response_data["performance"] = performance_info
        if model_config_info:
            response_data["model_config"] = model_config_info
        if analysis_package:
            response_data["analysis_package"] = analysis_package
        
        return response_data
        
    except Exception as e:
        print(f"DEBUG: Server error: {str(e)}")
        return {"error": f"Server error: {str(e)}"}

@app.get("/chats")
async def get_chats():
    chats = load_chats()
    return {"chats": chats}

@app.get("/chats/{chat_id}")
async def get_chat(chat_id: str):
    chats = load_chats()
    chat = next((chat for chat in chats if chat["id"] == chat_id), None)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"chat": chat}

@app.delete("/chats/{chat_id}")
async def delete_chat(chat_id: str):
    chats = load_chats()
    chats = [chat for chat in chats if chat["id"] != chat_id]
    save_chats(chats)
    return {"message": "Chat deleted successfully"}

@app.put("/chats/{chat_id}")
async def update_chat(chat_id: str, title: str = Form(...)):
    chats = load_chats()
    for chat in chats:
        if chat["id"] == chat_id:
            chat["title"] = title
            save_chats(chats)
            return {"message": "Chat updated successfully"}
    raise HTTPException(status_code=404, detail="Chat not found")

@app.put("/chats/{chat_id}/rename")
async def rename_chat(chat_id: str, new_name: str = Form(...)):
    chats = load_chats()
    for chat in chats:
        if chat["id"] == chat_id:
            chat["name"] = new_name
            save_chats(chats)
            return {"message": "Chat renamed successfully"}
    raise HTTPException(status_code=404, detail="Chat not found")

# Category management endpoints
@app.get("/categories")
async def get_categories():
    categories = load_categories()
    return {"categories": categories}

@app.post("/categories")
async def create_category(name: str = Form(...)):
    categories = load_categories()
    new_category = {
        "id": str(uuid.uuid4()),
        "name": name
    }
    categories.append(new_category)
    save_categories(categories)
    return {"category": new_category}

@app.put("/categories/{category_id}")
async def update_category(category_id: str, name: str = Form(...)):
    categories = load_categories()
    for category in categories:
        if category["id"] == category_id:
            category["name"] = name
            save_categories(categories)
            return {"message": "Category updated successfully"}
    raise HTTPException(status_code=404, detail="Category not found")

@app.put("/categories/{category_id}/rename")
async def rename_category(category_id: str, new_name: str = Form(...)):
    categories = load_categories()
    for category in categories:
        if category["id"] == category_id:
            category["name"] = new_name
            save_categories(categories)
            return {"message": "Category renamed successfully"}
    raise HTTPException(status_code=404, detail="Category not found")

@app.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    categories = load_categories()
    if category_id == "uncategorized":
        raise HTTPException(status_code=400, detail="Cannot delete uncategorized category")
    
    # Move all chats from this category to uncategorized
    chats = load_chats()
    for chat in chats:
        if chat.get("category_id") == category_id:
            chat["category_id"] = "uncategorized"
    save_chats(chats)
    
    # Remove the category
    categories = [cat for cat in categories if cat["id"] != category_id]
    save_categories(categories)
    return {"message": "Category deleted successfully"}

@app.put("/chats/{chat_id}/category")
async def move_chat_to_category(chat_id: str, category_id: str = Form(...)):
    chats = load_chats()
    for chat in chats:
        if chat["id"] == chat_id:
            chat["category_id"] = category_id
            save_chats(chats)
            return {"message": "Chat moved successfully"}
    raise HTTPException(status_code=404, detail="Chat not found")

@app.delete("/analysis-data")
async def clear_analysis_data():
    """Clear all analysis output files and packages"""
    try:
        import shutil
        import glob
        
        deleted_files = []
        
        # Clear analysis_output folder in server directory
        analysis_output_dir = "analysis_output"
        if os.path.exists(analysis_output_dir):
            for file in glob.glob(os.path.join(analysis_output_dir, "*")):
                try:
                    os.remove(file)
                    deleted_files.append(f"server/{os.path.basename(file)}")
                except Exception as e:
                    print(f"Error deleting {file}: {e}")
        
        # Clear analysis_output folder in root directory (parent of server)
        root_analysis_output_dir = "../analysis_output"
        if os.path.exists(root_analysis_output_dir):
            for file in glob.glob(os.path.join(root_analysis_output_dir, "*")):
                try:
                    os.remove(file)
                    deleted_files.append(f"root/{os.path.basename(file)}")
                except Exception as e:
                    print(f"Error deleting {file}: {e}")
        
        # Clear analysis package zip files in server directory
        for file in glob.glob("analysis_package_*.zip"):
            try:
                os.remove(file)
                deleted_files.append(f"server/{os.path.basename(file)}")
            except Exception as e:
                print(f"Error deleting {file}: {e}")
        
        # Clear analysis package zip files in root directory
        for file in glob.glob("../analysis_package_*.zip"):
            try:
                os.remove(file)
                deleted_files.append(f"root/{os.path.basename(file)}")
            except Exception as e:
                print(f"Error deleting {file}: {e}")
        
        # Clear temporary files in server directory
        for pattern in ["temp_messages_*.pkl", "test_messages.pkl", "test_output.pkl"]:
            for file in glob.glob(pattern):
                try:
                    os.remove(file)
                    deleted_files.append(f"server/{os.path.basename(file)}")
                except Exception as e:
                    print(f"Error deleting {file}: {e}")
        
        # Clear temporary files in root directory
        for pattern in ["../temp_messages_*.pkl", "../test_messages.pkl", "../test_output.pkl"]:
            for file in glob.glob(pattern):
                try:
                    os.remove(file)
                    deleted_files.append(f"root/{os.path.basename(file)}")
                except Exception as e:
                    print(f"Error deleting {file}: {e}")
        
        return {
            "message": "Analysis data cleared successfully",
            "deleted_files": deleted_files,
            "count": len(deleted_files)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear analysis data: {str(e)}")

@app.delete("/clear-all-data")
async def clear_all_chat_data():
    """Clear all chats and reset categories to default"""
    try:
        # Clear all chats
        save_chats([])
        
        # Reset categories to just uncategorized
        default_categories = [{"id": "uncategorized", "name": "Uncategorized"}]
        save_categories(default_categories)
        
        return {
            "message": "All chats and categories cleared successfully",
            "chats_cleared": True,
            "categories_reset": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear chat data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
