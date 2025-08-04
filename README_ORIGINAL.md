# O/ASK (Offline AI Survival Kit) - Gemma 3n Challenge Submission

## Development Hardware Specifications

**CPU:**
- AMD Ryzen 7 9800X3D 8-Core Processor
- 8 physical cores, 16 logical processors
- Base architecture with AVX2 support

**Memory:**
- 64 GB RAM (66,206,380,032 bytes total physical memory)

**GPU:**
- Primary: AMD Radeon RX 9070 XT (4GB VRAM)
- Integrated: AMD Radeon(TM) Graphics (2GB shared memory)

**Note:** This application runs entirely on CPU for maximum compatibility and does not require GPU acceleration.

## Operating System & Platform

**OS:** Microsoft Windows 11
- **Version:** 10.0.26100.0
- **Platform:** Win32NT
- **Shell:** PowerShell 5.1

## Third-Party Software Dependencies

### Python Environment (Required)
- **Python 3.8+** (tested with Python 3.13)
- **pip** package manager

### Server Dependencies (Backend)
Install via: `pip install -r server/requirements.txt`

**Core AI/ML Packages:**
- `torch>=2.0.0` - PyTorch deep learning framework
- `transformers>=4.30.0` - Hugging Face transformers library
- `accelerate>=0.20.0` - Hugging Face model acceleration

**Web Framework:**
- `fastapi>=0.100.0` - Modern web framework for APIs
- `uvicorn>=0.20.0` - ASGI server for FastAPI

**System Monitoring:**
- `psutil>=5.9.0` - System and process monitoring
- `py-cpuinfo>=9.0.0` - CPU feature detection (optional)

**File Processing:**
- `pillow>=9.0.0` - Image processing
- `python-multipart>=0.0.6` - Multipart form data handling

**Optional Extensions:**
- `PyPDF2` - PDF document processing (graceful degradation if missing)
- `python-docx` - Word document processing (graceful degradation if missing)  
- `SpeechRecognition` - Audio transcription (graceful degradation if missing)

**Development:**
- `pytest>=7.0.0` - Testing framework

### Client Dependencies (Frontend)
Install via: `npm install` in the `client/` directory

**Core Framework:**
- `react@^19.1.0` - React frontend framework
- `react-dom@^19.1.0` - React DOM rendering

**Build Tools:**
- `vite@^7.0.0` - Fast build tool and dev server
- `@vitejs/plugin-react@^4.6.0` - Vite React plugin

**Styling:**
- `tailwindcss@^4.1.11` - Utility-first CSS framework
- `autoprefixer@^10.4.21` - CSS vendor prefixing
- `postcss@^8.5.6` - CSS post-processing

### AI Model
- **Gemma 3n-E4B-it** (9B parameters, multimodal)
- Approximately 17GB storage requirement
- No GPU required (CPU-optimized execution)

## Installation Steps

### 1. Clone/Extract the Project
```bash
# Extract the archive to your desired location
cd /path/to/oask
```

### 2. Python Dependencies Setup
```bash
# Install all Python dependencies with exact versions
pip install -r requirements.txt
```

**Alternative Method (if needed):**
```bash
# Backend-specific installation
cd server
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Model Verification
The Gemma 3n-E4B-it model is included in the package. Verify you have:
- **17GB+ free disk space** for the model and software
- **16GB+ RAM** for optimal performance

## How to Train Your Model

**Important:** The Gemma 3n-E4B-it model comes **pre-trained** and ready for use. No additional training is required or supported in this implementation.

### Model Checkpoint System

**Trained Model Storage:** The complete Gemma 3n-E4B-it model is saved to disk as checkpoint files in the directory specified by `SETTINGS.json`:

**Model Checkpoint Directory:** `./server/models/` (as defined in `SETTINGS.json["MODEL_CHECKPOINT_DIR"]`)

**Complete Model Files:**
- **Primary Model:** `./server/models/gemma-3n-E4B-it/`
  - `model-00001-of-00004.safetensors` - Model weights (part 1/4)
  - `model-00002-of-00004.safetensors` - Model weights (part 2/4) 
  - `model-00003-of-00004.safetensors` - Model weights (part 3/4)
  - `model-00004-of-00004.safetensors` - Model weights (part 4/4)
  - `model.safetensors.index.json` - Weight mapping index
  - `config.json` - Model architecture configuration
  - `generation_config.json` - Text generation parameters
  - `preprocessor_config.json` - Input preprocessing settings
  - `tokenizer.json` - Tokenization configuration
  - `tokenizer.model` - Tokenizer model file
  - Complete multimodal processor for text + image inputs

**Model Loading:** The application automatically loads the saved model checkpoints on startup, enabling immediate predictions without retraining. The model loading process:
1. Reads checkpoint files from `MODEL_CHECKPOINT_DIR`  
2. Initializes the complete 9B parameter Gemma 3n model
3. Configures multimodal processing (text + images)
4. Optimizes for CPU-based inference
5. Ready for predictions on new data via web interface or API

**Storage Requirements:** ~17GB total for complete model checkpoints and configuration files.

### Personality-Based Customization (Limited Training Alternative)

Instead of traditional model training, OASK provides a **Personalities System** that allows programmatic customization of the AI's behavior through system prompts:

1. **Default Personality:** Simple helpful assistant behavior
2. **Custom Personalities:** User-defined system prompts that modify AI behavior

**To add a custom personality:**
1. Launch the application
2. Navigate to Personalities  
3. Click "Add Personality"
4. Provide a name and detailed system prompt
5. Save and select the personality for use

**System Prompt Examples:**
- Technical expert: "You are a senior software engineer specializing in Python and web development..."
- Creative writer: "You are a creative writing assistant who helps with storytelling and narrative development..."
- Domain specialist: "You are an expert in [specific field] with deep knowledge of [specific topics]..."

This approach provides **behavioral training** without modifying the underlying model weights.

## How to Make Predictions on a New Test Set

### Starting the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   python server.py
   ```
   The server will start on `http://localhost:8001`

2. **Start the Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

3. **Access the Application:**
   Open your web browser to `http://localhost:5173`

### Making Predictions

**Text-Only Predictions:**
1. Select a personality (or use default)
2. Type your input text in the message box  
3. Click Send or press Enter
4. The model will generate a response based on the input

**Multimodal Predictions (Text + Images):**
1. Click the Choose file attachment button
2. Upload image files (JPG, PNG, GIF, WebP supported)
3. Add your text prompt
4. Submit for multimodal analysis

**File Processing:**
- **PDFs:** Text extraction and analysis
- **Word Documents:** Content extraction and processing  
- **Audio Files:** Transcription support

**API Endpoint for Direct Integration:**
- @app.post("/ask")
async def ask(
    text: str = Form(...),           # Required: User's text input
    system_prompt: str = Form(None), # Optional: AI personality/instructions
    image: UploadFile = File(None),  # Optional: Image file upload
    image_data: str = Form(None),    # Optional: Base64 encoded image
    chat_id: str = Form(None)        # Optional: Existing chat ID for continuation
):

## Important Side Effects and Data Handling

### Data Persistence
- **Chat History:** Stored in `chats.json` (persistent across sessions)
- **Categories:** Stored in `categories.json` (persistent across sessions)  
- **User Preferences:** Stored in browser localStorage (client-side only)
- **Personalities:** Stored in browser localStorage (client-side only)

### File Processing Side Effects
- **Temporary Files:** Uploaded files are processed in temporary directories and automatically cleaned up
- **No Original Data Modification:** The system never modifies or overwrites original uploaded files
- **Memory Usage:** Large files (especially images) are processed in memory temporarily

### Analysis Data Generation
- **System Analysis:** Performance analysis packages are generated in `server/analysis_output/`
- **Log Files:** Model analysis logs are created in the server directory
- **Cleanup Available:** Analysis data can be cleared via the application settings

### Network Requirements
- **Initial Setup:** Internet required for software download (one-time, ~17GB)
- **Runtime:** Completely offline operation after download
- **No Data Transmission:** All processing happens locally; no data sent to external servers

## Data Backup and Restore

### Backup Functionality
The application provides comprehensive data backup through the Settings interface:

**Backup Contents:**
- **Chat History:** All conversations and messages
- **Chat Categories:** User-defined organizational categories
- **Notes:** Personal notes and note categories
- **Personalities:** Custom AI personality configurations
- **User Preferences:** Interface settings (theme, button size, text size)

**Backup Format:**
- **File Type:** JSON format (.json extension)
- **Structure:** Hierarchical JSON containing all user data
- **Size:** Typically small (few KB to few MB depending on chat history)
- **Compatibility:** Human-readable and cross-platform compatible

**Creating a Backup:**
1. Access Settings from the main interface
2. Click "Backup"
4. Saves the generated JSON file to your Downloads

### Restore Functionality

**What is Restored:**
- ✅ **Text Data:** All chat conversations, messages, and responses
- ✅ **Notes:** Personal notes and organizational categories
- ✅ **Personalities:** Custom AI behavior configurations
- ✅ **Categories:** Chat organization and categorization
- ✅ **Preferences:** UI settings and customizations

**What is NOT Restored:**
- ❌ **Images:** Uploaded images are not included in backups
- ❌ **Files:** Attached documents (PDFs, DOCX, etc.) are not preserved
- ❌ **Audio:** Audio files and transcriptions are not backed up
- ❌ **Analysis Data:** Performance analysis packages are excluded

**Restoration Process:**
1. Access Settings
2. Click "Choose file"
3. Select your previously saved JSON backup file
4. Confirm the restoration (this will overwrite current data)
5. Application will reload with restored data

**Important Restoration Notes:**
- **Overwrite Warning:** Restoration completely replaces current data
- **Image References:** Chat messages may reference "[Image was provided]" but images themselves are not restored
- **File References:** File attachments will show as "[File: filename.ext]" but files are not restored
- **Incremental Restore:** No merge functionality - restoration is complete replacement

### Data Erasure
**Complete Data Reset:**
- Available through Settings → "Clear All"
- Permanently removes all chats, notes, personalities, attachments, analysis logs and preferences
- **Warning:** This action cannot be undone
- Model files and application code remain intact

## Accessibility Features

The application includes comprehensive accessibility and customization options available through the Settings interface:

### Visual Accessibility
**Theme Options:**
- **Light Mode:** High contrast with dark text on light backgrounds
- **Dark Mode:** Reduced eye strain with light text on dark backgrounds
- **Automatic Switching:** Follows system theme preferences when available

### Interface Scaling
**Button Size Options:**
- **Normal:** Compact interface for users comfortable with smaller controls
- **Large:** Enhanced accessibility for users who prefer larger interactive elements
- **Extra Large:** Maximum size for users with dexterity or vision considerations

**Text Size Options:**
- **Normal:** Compact text display for information-dense viewing
- **Large:** Enhanced readability for improved accessibility
- **Extra Large:** Maximum text size for users with vision considerations

### Navigation Features
**Keyboard Support:**
- **Enter Key:** Submit messages without mouse interaction
- **Tab Navigation:** Navigate through interface elements
- **Escape Key:** Close dialogs and dropdowns

**Mouse and Touch:**
- **Click Areas:** Large clickable regions for buttons and controls
- **Hover States:** Visual feedback for interactive elements
- **Touch-Friendly:** Responsive design supports touch interfaces

### Accessibility Settings Persistence
- **Local Storage:** All accessibility preferences are saved locally
- **Session Persistence:** Settings maintained across browser sessions
- **Backup Integration:** Accessibility preferences included in data backups
- **Instant Application:** Changes take effect immediately without restart

## Configuration Files

**No Additional Configuration Required:** This application is designed to be completely self-contained and requires no external configuration files. Unlike many AI systems that require setup in user directories, OASK includes all necessary configuration within the package itself.

**Included Configuration Files:**
- **Model Configuration:** `server/models/gemma-3n-E4B-it/config.json` - Complete model setup
- **Generation Settings:** `server/models/gemma-3n-E4B-it/generation_config.json` - AI response parameters
- **Preprocessing Config:** `server/models/gemma-3n-E4B-it/preprocessor_config.json` - Input processing settings
- **Application Data:** `chats.json` and `categories.json` - User data storage (created automatically)
- **Path Configuration:** `SETTINGS.json` - Directory paths for all I/O operations

**SETTINGS.json Path Configuration:**
```json
{
  "RAW_DATA_DIR": "./",
  "TRAIN_DATA_CLEAN_PATH": "./server/models/gemma-3n-E4B-it/",
  "TEST_DATA_CLEAN_PATH": "./",
  "MODEL_CHECKPOINT_DIR": "./server/models/",
  "LOGS_DIR": "./server/analysis_output/",
  "SUBMISSION_DIR": "./server/analysis_output/"
}
```

**Path Explanations:**
- **RAW_DATA_DIR**: Root directory for input data and user files
- **TRAIN_DATA_CLEAN_PATH**: Pre-trained Gemma 3n-E4B-it model location (no additional training data)
- **TEST_DATA_CLEAN_PATH**: Directory for new test inputs via web interface
- **MODEL_CHECKPOINT_DIR**: Directory containing the complete AI model
- **LOGS_DIR**: Performance analysis, system logs, and debug output
- **SUBMISSION_DIR**: Generated analysis packages and system reports

**Offline Operation:** The system explicitly disables all external configuration dependencies:
- **Local Files Only:** `local_files_only=True` forces use of bundled model files
- **No Cache Directory:** `cache_dir=None` prevents external cache dependencies
- **Offline Environment:** Environment variables prevent internet access attempts

**Judges Setup:** Simply extract the 7z archive and run - no configuration file setup required.

## Key Assumptions and Requirements

### Directory Structure Assumptions
- **Model Storage:** Models stored in `server/models/` directory (included in package)
- **Temporary Processing:** System assumes write access to system temp directory
- **Configuration Files:** All configs included in package; `chats.json` and `categories.json` created automatically

### Runtime Requirements
- **Memory:** Minimum 16GB RAM recommended for optimal performance
- **CPU:** Multi-core processor recommended (optimized for AMD Ryzen architecture)
- **Storage:** 17GB+ free space (~16GB for model + other files)
- **Ports:** Assumes ports 8001 (backend) and 5173 (frontend) are available

### Model Assumptions
- **Context Limits:** 32K token context window for total input, 128K for text-only
- **Image Processing:** Images automatically resized to 896x896 pixels
- **Token Management:** Conversations automatically trimmed when approaching context limits

### System State Assumptions
- **Clean Startup:** No specific folder emptying required
- **Concurrent Access:** Designed for single-user operation (no multi-user session management)
- **Browser Support:** Modern browser with ES6+ support required for frontend

### Graceful Degradation
- **Optional Dependencies:** System continues to function with reduced capabilities if optional packages are missing
- **File Format Support:** Unsupported file types are handled gracefully with informative error messages
- **Hardware Adaptation:** Automatically adapts to available system resources

## Performance Optimization

The system includes automatic hardware detection and optimization:
- **CPU Feature Detection:** Leverages AVX, AVX2, and other CPU extensions when available
- **Memory Management:** Intelligent memory allocation based on available system RAM
- **Thread Optimization:** Optimized thread affinity for high-end processors
- **Context Management:** Automatic conversation trimming to maintain performance

## Troubleshooting

**Common Issues:**
- **Model Download Fails:** Ensure stable internet connection and sufficient disk space
- **High Memory Usage:** Reduce conversation length or restart application
- **Port Conflicts:** Modify port configurations in `server.py` and `vite.config.js`
- **Permission Errors:** Ensure write access to installation directory

**Debug Features:**
- **System Analysis:** Built-in hardware and performance analysis
- **Verbose Logging:** Detailed logging available in server console
- **Analysis Packages:** Automatically generated debug packages for troubleshooting

---
