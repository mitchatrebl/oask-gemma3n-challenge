# OASK Entry Points

This document lists the commands required to run the OASK (Offline AI Survival Kit) system. The system uses a pre-trained Gemma 3n-E4B-it model and provides predictions through a web interface.

## System Architecture

**Note:** OASK uses a pre-trained model approach where:
- No data preparation or training is required
- The complete Gemma 3n-E4B-it model (9B parameters) is included
- Predictions are made through a web interface or API endpoints
- All paths are managed through `SETTINGS.json`

## Entry Points

### 1. Data Preparation (Not Required)

**Command:** Not applicable - no data preparation needed

**Rationale:** The Gemma 3n-E4B-it model comes pre-trained and ready for use. No additional data preprocessing is required as the model handles:
- Raw text input processing
- Image preprocessing (automatic resize to 896x896)
- Multimodal input handling (text + images)
- File processing (PDF, DOCX, audio transcription)

### 2. Model Training (Not Required)

**Command:** Not applicable - no training needed

**Rationale:** The system uses the pre-trained Gemma 3n-E4B-it model with 9B parameters. The model checkpoints are already saved in `MODEL_CHECKPOINT_DIR` as specified in `SETTINGS.json`:

**Model Location:** `./server/models/gemma-3n-E4B-it/`
- Complete model weights in `.safetensors` format
- Configuration files for architecture and generation
- Tokenizer and preprocessing components
- Multimodal processor for text and image inputs

### 3. Make Predictions

**Primary Entry Point:**
```bash
cd server
python server.py
```

**What this command does:**
1. **Reads model path** from `SETTINGS.json["MODEL_CHECKPOINT_DIR"]`
2. **Loads pre-trained model** from `./server/models/gemma-3n-E4B-it/`
3. **Initializes web server** on `http://localhost:8001`
4. **Enables prediction endpoints** for new data processing
5. **Logs operations** to `SETTINGS.json["LOGS_DIR"]` (`./server/analysis_output/`)

**Frontend Interface:**
```bash
cd client
npm run dev
```

**What this command does:**
1. **Starts React development server** on `http://localhost:5173`
2. **Provides web interface** for making predictions
3. **Handles test data input** from users via file uploads and text input
4. **Connects to prediction API** for processing new samples

## Prediction Workflow

### Web Interface Predictions
1. **Access Application:** Open `http://localhost:5173` in browser
2. **Input Test Data:** 
   - Type text directly into interface
   - Upload images (JPG, PNG, GIF, WebP)
   - Upload documents (PDF, DOCX)
   - Upload audio files (with transcription)
3. **Receive Predictions:** AI generates responses using loaded model
4. **View Results:** Predictions displayed in real-time chat interface

### API Predictions
**Direct API Access:**
```bash
curl -X POST "http://localhost:8001/chat" \
  -F "text=Your test input here" \
  -F "image=@/path/to/test/image.jpg"
```

**What this does:**
1. **Reads test data** from request (equivalent to `TEST_DATA_CLEAN_PATH`)
2. **Loads model** from `MODEL_CHECKPOINT_DIR`
3. **Processes input** through multimodal pipeline
4. **Returns predictions** as JSON response
5. **Logs activity** to `LOGS_DIR`

## File Processing Entry Points

### PDF Processing
The system automatically processes PDF files when uploaded:
- **Input:** PDF files via web interface
- **Processing:** Text extraction using PyPDF2/pdfplumber
- **Output:** Extracted text sent to model for analysis

### Audio Processing  
The system handles audio transcription when available:
- **Input:** Audio files (MP3, M4A, WAV)
- **Processing:** Speech recognition (optional dependency)
- **Output:** Transcribed text sent to model

### Image Processing
All images are automatically preprocessed:
- **Input:** Image files via web interface
- **Processing:** Resize to 896x896, format conversion
- **Output:** Processed images sent to multimodal model

## System Monitoring

### Performance Analysis
The system generates comprehensive analysis during operation:
- **Location:** `SETTINGS.json["LOGS_DIR"]` (`./server/analysis_output/`)
- **Contents:** Performance metrics, system analysis, debug logs
- **Format:** JSON files with detailed hardware and model performance data

### Log Files
Real-time logging during predictions:
- **Server Logs:** Console output with detailed processing information
- **Analysis Packages:** Automatically generated ZIP files with system diagnostics
- **Model Analysis:** Hardware optimization and performance tracking

## Development and Testing

### Testing Entry Point
```bash
cd server
python test_server.py
```

**What this does:**
1. **Runs system tests** to verify model loading
2. **Tests API endpoints** for prediction functionality
3. **Validates configuration** from `SETTINGS.json`
4. **Reports system status** and performance metrics

### Debug Mode
```bash
cd server
python server.py --debug
```

**Enhanced logging and analysis:**
1. **Verbose output** for all operations
2. **Detailed model performance** tracking  
3. **Extended analysis packages** for troubleshooting
4. **Real-time system monitoring** data

## Summary

**Main Commands:**
1. **Start Backend:** `cd server && python server.py`
2. **Start Frontend:** `cd client && npm run dev` 
3. **Access Application:** Open `http://localhost:5173`
4. **Make Predictions:** Use web interface or API endpoints

**Key Features:**
- **No training required** - uses pre-trained Gemma 3n-E4B-it model
- **Real-time predictions** on new test data via web interface
- **Multimodal support** - text, images, documents, and audio
- **Complete offline operation** after initial setup
- **Automatic path management** via `SETTINGS.json`
- **Comprehensive logging** and performance analysis
