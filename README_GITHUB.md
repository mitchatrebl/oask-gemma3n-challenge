# OASK - Offline AI Survival Kit 🤖
## Gemma 3n Challenge Submission

[![Gemma 3n](https://img.shields.io/badge/Model-Gemma%203n--E4B--it-blue)](https://huggingface.co/google/gemma-3n-e4b-it)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB)](https://python.org/)

**A comprehensive offline AI assistant powered by Google's Gemma 3n-E4B-it multimodal model, designed for complete offline operation without internet dependencies.**

## 🏆 Challenge Submission Details

This repository contains the complete implementation of Gemma 3n-E4B-it (9B parameters) in a production-ready web application. The implementation demonstrates:

- **Full Gemma 3n Integration**: Complete implementation using Hugging Face transformers
- **Multimodal Capabilities**: Text, image, and document processing
- **Offline Operation**: Zero internet dependencies after setup
- **Production Web Interface**: React frontend with FastAPI backend
- **CPU Optimized**: Runs efficiently on consumer hardware without GPU requirements

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- 16GB+ RAM recommended
- 20GB+ free disk space

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/oask-gemma3n-challenge.git
   cd oask-gemma3n-challenge
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Download Gemma 3n model** ⚠️ **REQUIRED STEP**
   ```bash
   python download_model.py
   ```
   This downloads ~16GB of model files. **Must be run before first use!**

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   python server/server.py
   
   # Terminal 2 - Frontend  
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - API Documentation: http://localhost:8001/docs

## ⚠️ Important Setup Notes

### Model Download is Required
- **The model is NOT downloaded automatically** when running the server
- **You MUST run `python download_model.py` first** 
- This is a one-time setup that downloads ~16GB of model files
- Internet connection required only for this initial download
- After download, the app runs completely offline

### Why Separate Download?
- Model files are too large for GitHub (16GB vs 100MB limit)
- Ensures you have the latest model from Hugging Face
- Allows validation of Gemma license acceptance
- Separates setup from runtime for cleaner architecture

## 🔧 Gemma 3n Implementation Details

### Model Architecture
- **Model**: Google Gemma 3n-E4B-it (9B parameters)
- **Type**: Multimodal (text, image, audio, video inputs)
- **Context**: 32K tokens total, 128K text-only
- **Framework**: Hugging Face Transformers 4.53.0+

### Key Implementation Files
- **`server/unified_model_runner.py`**: Core Gemma 3n model integration
- **`server/server.py`**: FastAPI backend with model endpoints
- **`client/src/App.jsx`**: React frontend with chat interface

### Model Loading and Inference
```python
# Core implementation in unified_model_runner.py
from transformers import AutoProcessor, Gemma3nForConditionalGeneration

class GemmaModelManager:
    def __init__(self):
        self.model = Gemma3nForConditionalGeneration.from_pretrained(
            "google/gemma-3n-E4B-it",
            device_map="auto",
            torch_dtype=torch.bfloat16,
            local_files_only=True
        )
        self.processor = AutoProcessor.from_pretrained(
            "google/gemma-3n-E4B-it",
            local_files_only=True
        )
```

### Multimodal Processing
- **Text**: Direct text input and chat conversations
- **Images**: Automatic resize to 896x896, supports JPEG/PNG/WebP
- **Documents**: PDF and DOCX text extraction
- **Audio**: Speech-to-text transcription (optional)

## 📁 Project Structure

```
oask/
├── server/                          # FastAPI Backend
│   ├── server.py                   # Main server and API endpoints
│   ├── unified_model_runner.py     # Gemma 3n model implementation
│   ├── test_server.py             # Server testing utilities
│   └── models/                    # Model storage directory
│       └── gemma-3n-E4B-it/      # Downloaded Gemma 3n model
├── client/                        # React Frontend
│   ├── src/
│   │   ├── App.jsx               # Main React application
│   │   └── main.jsx              # React entry point
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js           # Vite build configuration
├── requirements.txt              # Python dependencies
├── SETTINGS.json                # Application configuration
└── README.md                    # This file
```

## 🔬 Technical Features

### Offline Operation
- **Local Model Storage**: Complete model files stored locally
- **No Internet Dependencies**: `local_files_only=True` prevents external calls
- **Cached Processing**: All tokenization and processing done locally

### Performance Optimizations
- **CPU-First Design**: Optimized for CPU inference without GPU requirements
- **Memory Management**: Intelligent conversation truncation for long contexts
- **Hardware Detection**: Automatic optimization for available CPU features

### Production Features
- **RESTful API**: Full OpenAPI/Swagger documentation
- **Error Handling**: Comprehensive error handling and logging
- **Multi-format Support**: Text, images, documents, and audio
- **Real-time Streaming**: WebSocket-like streaming responses

## 🧪 Testing and Validation

Run the test suite to validate Gemma 3n integration:

```bash
# Server tests
python server/test_server.py

# Frontend tests (if available)
cd client
npm test
```

## 📊 Model Performance

- **Model Size**: 9B parameters (~17GB on disk)
- **Context Window**: 32K tokens (multimodal), 128K (text-only)  
- **Inference Speed**: ~2-5 tokens/second on modern CPU
- **Memory Usage**: 16-24GB RAM during operation

## 🔒 Offline Security

- **No External Calls**: All processing happens locally
- **Data Privacy**: No data leaves your machine
- **Secure by Design**: No network dependencies after model download

## 📖 Documentation

- **API Documentation**: http://localhost:8001/docs (when running)
- **User Guide**: `DUMMIES_GUIDE_TO_OASK.md`
- **Technical Details**: `entry_points.md`

## 🎯 Challenge Requirements Met

✅ **Public Repository**: This GitHub repository serves as the source of truth  
✅ **Gemma 3n Implementation**: Complete integration with multimodal capabilities  
✅ **Well Documented**: Comprehensive documentation and code comments  
✅ **Reproducible**: Clear installation and setup instructions  
✅ **Production Ready**: Full web interface with API backend  

## 🤝 Contributing

This is a challenge submission repository. For issues or questions:

1. Check the documentation in `DUMMIES_GUIDE_TO_OASK.md`
2. Review the technical implementation in `entry_points.md`
3. Open an issue with detailed steps to reproduce any problems

## 📜 License

This project uses the Gemma model under Google's Gemma license. Please review the license terms in the model directory.

## 🙏 Acknowledgments

- **Google DeepMind**: For the Gemma 3n model
- **Hugging Face**: For the transformers library and model hosting
- **Challenge Organizers**: For the opportunity to showcase this implementation

---

**Note**: This implementation prioritizes offline operation and educational value. The complete source code demonstrates production-quality integration of Gemma 3n in a real-world application.
