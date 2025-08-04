# Dummies Guide to OASK

A simple guide to get OASK running on your Windows computer.

## What You Need
- Windows 10 or 11
- Python 3.8 or newer
- Node.js (any recent version)
- **17 GB free space** (for the AI model)
- **16 GB RAM** (for running the AI)
- **Internet connection** (for initial setup only)

## ⚠️ IMPORTANT: You Must Download the AI Model First!

**The AI model is NOT included** - it's too big for download packages. You must download it separately.

## Step 1: Extract the Files
1. Right-click the OASK archive file
2. Choose "Extract All" or use 7-Zip
3. Extract to a folder like `C:\OASK`

## Step 2: Install Python Dependencies
1. Open PowerShell as Administrator
2. Navigate to your OASK folder:
   ```powershell
   cd "C:\OASK"
   ```
3. Install Python packages:
   ```powershell
   pip install -r requirements.txt
   ```
   Wait for it to finish (takes 5-10 minutes).

## Step 3: Download the AI Model (REQUIRED!)
**This is the most important step!**

1. In the same PowerShell window, run:
   ```powershell
   python download_model.py
   ```
2. **This downloads 16 GB of AI model files** - it takes 10-30 minutes
3. You'll see messages like "Downloading Gemma 3n-E4B-it model..."
4. Wait until you see "✅ Model download completed!"
5. **This only needs to be done once**

## Step 4: Install Frontend Dependencies
1. Go to the client folder:
   ```powershell
   cd client
   ```
2. Install Node.js packages:
   ```powershell
   npm install
   ```
   Wait for it to finish (takes 2-3 minutes).

## Step 5: Start the AI Server
1. Go back to the main folder:
   ```powershell
   cd ..
   ```
2. Go to the server folder:
   ```powershell
   cd server
   ```
3. Start the AI server:
   ```powershell
   python server.py
   ```
   Leave this window open. You'll see "Uvicorn running on http://0.0.0.0:8001" when ready.

## Step 6: Start the Web Interface
1. Open a NEW PowerShell window
2. Navigate to your OASK folder:
   ```powershell
   cd "C:\OASK"
   ```
3. Go to the client folder:
   ```powershell
   cd client
   ```
4. Start the web interface:
   ```powershell
   npm run dev
   ```
   You'll see "Local: http://localhost:5173"

## Step 7: Open OASK in Your Browser
1. Open any web browser
2. Go to: `http://localhost:5173`
3. OASK will load and be ready to use

## If Something Goes Wrong

### "Model not found" error
- **You forgot Step 3!** Run `python download_model.py`
- Make sure it completed successfully

### Download is very slow
- This is normal - the AI model is huge (16 GB)
- Use a stable internet connection
- Don't interrupt the download

### Python errors during model download
- You may need to accept the Gemma license at: https://huggingface.co/google/gemma-3n-e4b-it
- Make sure you have a Hugging Face account

## After Setup: OASK Runs Completely Offline!

Once the model is downloaded, OASK needs **no internet connection** to work.

## Using OASK

### Chat
- Type messages in the text box at the bottom
- Press Enter or click 'O/ASK it!'
- The AI responds to your questions

### Upload Files
- Click the Choose file button
- Upload images, PDFs, or documents
- Discuss the uploaded files

### Personalities
- Click "Personalities" to change how the AI behaves
- Choose from existing personalities or create custom ones

### Categories
- Organize your conversations into categories
- Click "Categories" to create and manage them

### Notes
- Save important information in Notes
- Access via the Notes section
- Organize your notes into categories

### Settings
- Change theme (light/dark)
- Adjust text and button sizes
- Backup or restore or clear your data

## Stopping OASK
1. Close your browser
2. In both PowerShell windows, press `Ctrl+C`
3. Close the PowerShell windows

## Troubleshooting
- **Server won't start**: Make sure Python is installed and try again
- **Can't access website**: Check that both servers are running
- **Slow responses**: Wait longer - AI processing takes time
- **Out of memory**: Close other programs or restart OASK

That's it! You're now running your own offline AI assistant.
