"""
Mock HuggingFace API server for offline operation
"""
import http.server
import socketserver
import json
import threading
import time
import urllib.parse
from pathlib import Path

class MockHFHandler(http.server.SimpleHTTPRequestHandler):
    """Handler for mock HuggingFace API requests"""
    
    def do_GET(self):
        """Handle GET requests"""
        print(f"Mock HF API: GET {self.path}")
        
        # Parse URL
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        
        # Handle additional_chat_templates request
        if 'additional_chat_templates' in path:
            response_data = []  # Return empty array for chat templates
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            return
        
        # Handle model info requests
        if '/api/models/' in path:
            # Extract model name from path
            model_name = path.split('/api/models/')[-1].split('/')[0]
            
            response_data = {
                "id": model_name,
                "siblings": [
                    {"rfilename": "config.json"},
                    {"rfilename": "tokenizer.json"},
                    {"rfilename": "tokenizer_config.json"},
                    {"rfilename": "model.safetensors"}
                ],
                "spaces": [],
                "tags": ["text-generation", "pytorch", "safetensors"],
                "pipeline_tag": "text-generation",
                "library_name": "transformers",
                "transformersInfo": {
                    "auto_model": "AutoModelForCausalLM",
                    "pipeline_tag": "text-generation",
                    "processor": "AutoTokenizer"
                },
                "cardData": {
                    "pipeline_tag": "text-generation"
                }
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            return
        
        # Handle tree/main requests
        if '/tree/main' in path:
            response_data = []  # Return empty array for file tree
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            return
        
        # Handle resolve requests
        if '/resolve/' in path:
            # Return a mock file URL
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'')
            return
        
        # Default: return empty response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({}).encode())
    
    def do_HEAD(self):
        """Handle HEAD requests"""
        print(f"Mock HF API: HEAD {self.path}")
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to reduce logging noise"""
        pass

class MockHFServer:
    """Mock HuggingFace API server"""
    
    def __init__(self, port=8080):
        self.port = port
        self.server = None
        self.thread = None
        
    def start(self):
        """Start the mock server"""
        try:
            self.server = socketserver.TCPServer(("", self.port), MockHFHandler)
            self.thread = threading.Thread(target=self.server.serve_forever)
            self.thread.daemon = True
            self.thread.start()
            print(f"Mock HuggingFace server started on port {self.port}")
            time.sleep(0.1)  # Give server time to start
        except Exception as e:
            print(f"Mock HF server error: {e}")
    
    def stop(self):
        """Stop the mock server"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            if self.thread:
                self.thread.join()
            print("Mock HuggingFace server stopped")

# Global mock server instance
mock_server = MockHFServer()

if __name__ == "__main__":
    print("Starting mock HuggingFace server...")
    mock_server.start()
    
    try:
        print("Mock server running. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping mock server...")
        mock_server.stop()
