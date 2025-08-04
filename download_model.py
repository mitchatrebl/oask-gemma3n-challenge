#!/usr/bin/env python3
"""
OASK Model Download Script
Downloads the Gemma 3n-E4B-it model for the OASK application.
"""

import os
import sys
from pathlib import Path

def download_model():
    """Download the Gemma 3n-E4B-it model using transformers."""
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, AutoProcessor
        from huggingface_hub import snapshot_download
        import torch
        
        print("🤖 OASK Model Setup")
        print("Downloading Gemma 3n-E4B-it model...")
        print("⚠️  This will download ~16GB of model files")
        
        model_name = "google/gemma-3n-e4b-it"
        model_dir = Path(__file__).parent / "server" / "models" / "gemma-3n-E4B-it"
        
        # Create directory if it doesn't exist
        model_dir.mkdir(parents=True, exist_ok=True)
        
        # Download model files
        print(f"📥 Downloading to: {model_dir}")
        snapshot_download(
            repo_id=model_name,
            local_dir=str(model_dir),
            local_dir_use_symlinks=False
        )
        
        print("✅ Model download completed!")
        print("🚀 You can now run the application with: python server/server.py")
        
    except ImportError as e:
        print("❌ Required packages not installed!")
        print("Please install requirements first: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        print("Please check your internet connection and try again.")
        sys.exit(1)

if __name__ == "__main__":
    download_model()
