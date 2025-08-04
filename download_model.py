#!/usr/bin/env python3
"""
OASK Model Download Script
Downloads the Gemma 3n-E4B-it model for the OASK application.

This script MUST be run before starting the server for the first time.
The model files (~16GB) will be downloaded to server/models/gemma-3n-E4B-it/
"""

import os
import sys
from pathlib import Path

def check_model_exists():
    """Check if the model is already downloaded."""
    model_dir = Path(__file__).parent / "server" / "models" / "gemma-3n-E4B-it"
    config_file = model_dir / "config.json"
    return config_file.exists()

def download_model():
    """Download the Gemma 3n-E4B-it model using transformers."""
    
    # Check if model already exists
    if check_model_exists():
        print("✅ Gemma 3n-E4B-it model already downloaded!")
        print("🚀 You can run the application with: python server/server.py")
        return
    
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, AutoProcessor
        from huggingface_hub import snapshot_download
        import torch
        
        print("🤖 OASK Model Setup")
        print("Downloading Gemma 3n-E4B-it model...")
        print("⚠️  This will download ~16GB of model files")
        print("📡 Internet connection required for first-time setup")
        
        model_name = "google/gemma-3n-e4b-it"
        model_dir = Path(__file__).parent / "server" / "models" / "gemma-3n-E4B-it"
        
        # Create directory if it doesn't exist
        model_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"📥 Downloading to: {model_dir}")
        print("⏳ This may take 10-30 minutes depending on your internet speed...")
        
        # Download model files
        snapshot_download(
            repo_id=model_name,
            local_dir=str(model_dir),
            local_dir_use_symlinks=False
        )
        
        print("✅ Model download completed!")
        print("📁 Model saved to:", model_dir)
        print("🚀 You can now run the application with: python server/server.py")
        print("💡 The application will run completely offline after this setup")
        
    except ImportError as e:
        print("❌ Required packages not installed!")
        print("Please install requirements first: pip install -r requirements.txt")
        print("Then run this script again: python download_model.py")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        print("Please check your internet connection and try again.")
        print("💡 You may need to accept the Gemma license at: https://huggingface.co/google/gemma-3n-e4b-it")
        sys.exit(1)

if __name__ == "__main__":
    download_model()
