#!/usr/bin/env python3
"""
OASK Server Test Suite
======================

Comprehensive testing script that validates the OASK system according to entry_points.md:
1. Runs system tests to verify model loading
2. Tests API endpoints for prediction functionality  
3. Validates configuration from SETTINGS.json
4. Reports system status and performance metrics

Usage: python test_server.py
"""
import requests
import time
import json
import os
import sys
from pathlib import Path
from datetime import datetime

def load_settings():
    """Load and validate SETTINGS.json configuration"""
    print("🔧 Loading SETTINGS.json configuration...")
    
    settings_path = Path("../SETTINGS.json")
    if not settings_path.exists():
        print("✗ SETTINGS.json not found in parent directory")
        return None
    
    try:
        with open(settings_path, 'r') as f:
            settings = json.load(f)
        
        # Validate required keys
        required_keys = [
            "RAW_DATA_DIR", "TRAIN_DATA_CLEAN_PATH", "TEST_DATA_CLEAN_PATH",
            "MODEL_CHECKPOINT_DIR", "LOGS_DIR", "SUBMISSION_DIR"
        ]
        
        missing_keys = [key for key in required_keys if key not in settings]
        if missing_keys:
            print(f"✗ Missing required keys in SETTINGS.json: {missing_keys}")
            return None
        
        print("✓ SETTINGS.json loaded and validated successfully")
        return settings
    
    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON in SETTINGS.json: {e}")
        return None
    except Exception as e:
        print(f"✗ Error loading SETTINGS.json: {e}")
        return None

def validate_model_files(settings):
    """Verify model checkpoint files exist in MODEL_CHECKPOINT_DIR"""
    print("🤖 Validating model checkpoint files...")
    
    # Handle relative paths from the server directory (where script runs)
    model_checkpoint_dir = settings["MODEL_CHECKPOINT_DIR"]
    if model_checkpoint_dir.startswith("./"):
        # Remove ./ and go up one level since we're in server/
        model_dir = Path("..") / model_checkpoint_dir[2:] / "gemma-3n-E4B-it"
    else:
        model_dir = Path(model_checkpoint_dir) / "gemma-3n-E4B-it"
    
    model_dir = model_dir.resolve()
    
    required_files = [
        "config.json",
        "generation_config.json", 
        "preprocessor_config.json",
        "tokenizer.json",
        "model.safetensors.index.json",
        "model-00001-of-00004.safetensors",
        "model-00002-of-00004.safetensors",
        "model-00003-of-00004.safetensors",
        "model-00004-of-00004.safetensors"
    ]
    
    print(f"  Checking model directory: {model_dir}")
    
    if not model_dir.exists():
        print(f"✗ Model directory does not exist: {model_dir}")
        return False
    
    missing_files = []
    total_size = 0
    
    for file_name in required_files:
        file_path = model_dir / file_name
        if file_path.exists():
            total_size += file_path.stat().st_size
        else:
            missing_files.append(file_name)
    
    if missing_files:
        print(f"✗ Missing model files: {missing_files}")
        return False
    
    print(f"✓ All model checkpoint files present ({total_size / (1024**3):.1f} GB)")
    return True

def check_server_running():
    """Check if the OASK server is running and responsive"""
    print("🌐 Checking if OASK server is running...")
    
    try:
        response = requests.get("http://localhost:8001/categories", timeout=5)
        if response.status_code == 200:
            print("✓ Server is running and responsive")
            return True
        else:
            print(f"✗ Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server - make sure 'python server.py' is running")
        return False
    except Exception as e:
        print(f"✗ Error checking server: {e}")
        return False

def test_api_endpoints():
    """Test core API endpoints for prediction functionality"""
    print("🔄 Testing API endpoints...")
    
    tests = [
        {
            "name": "Basic text prediction",
            "endpoint": "http://localhost:8001/ask",
            "data": {"text": "Hello, can you respond with just 'Hi there!'?", "chat_id": "test-123"},
            "expected_keys": ["response", "chat_id"],
            "method": "form"  # Use form data for /ask endpoint
        },
        {
            "name": "Categories endpoint",
            "endpoint": "http://localhost:8001/categories",
            "data": {},
            "expected_keys": [],  # Categories returns a list
            "method": "json"
        }
    ]
    
    passed_tests = 0
    
    for test in tests:
        print(f"  Testing: {test['name']}")
        
        try:
            if test['data']:
                if test.get("method") == "form":
                    # Send as form data for /ask endpoint
                    response = requests.post(test["endpoint"], data=test["data"], timeout=30)
                else:
                    # Send as JSON for other endpoints
                    response = requests.post(test["endpoint"], json=test["data"], timeout=30)
            else:
                response = requests.get(test["endpoint"], timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                
                # Check for expected keys if it's a dict
                if isinstance(result, dict) and test["expected_keys"]:
                    missing_keys = [key for key in test["expected_keys"] if key not in result]
                    if missing_keys:
                        print(f"    ✗ Missing expected keys: {missing_keys}")
                    else:
                        print(f"    ✓ {test['name']} passed")
                        passed_tests += 1
                else:
                    print(f"    ✓ {test['name']} passed")
                    passed_tests += 1
            else:
                print(f"    ✗ HTTP {response.status_code}: {response.text[:100]}")
                
        except requests.exceptions.Timeout:
            print(f"    ✗ {test['name']} timed out")
        except Exception as e:
            print(f"    ✗ {test['name']} failed: {e}")
    
    print(f"📊 API Tests: {passed_tests}/{len(tests)} passed")
    return passed_tests == len(tests)

def check_log_directory(settings):
    """Verify log directory exists and contains analysis files"""
    print("📝 Checking log directory and analysis files...")
    
    # Handle relative paths from the server directory (where script runs)
    logs_dir_path = settings["LOGS_DIR"]
    if logs_dir_path.startswith("./"):
        # Remove ./ and go up one level since we're in server/
        logs_dir = Path("..") / logs_dir_path[2:]
    else:
        logs_dir = Path(logs_dir_path)
    
    logs_dir = logs_dir.resolve()
    
    print(f"  Checking logs directory: {logs_dir}")
    
    if not logs_dir.exists():
        print(f"✗ Logs directory does not exist: {logs_dir}")
        return False
    
    # Count analysis files
    analysis_files = list(logs_dir.glob("*.json")) + list(logs_dir.glob("*.log"))
    
    if analysis_files:
        print(f"✓ Logs directory contains {len(analysis_files)} analysis files")
        return True
    else:
        print("⚠ Logs directory exists but contains no analysis files (may be normal for first run)")
        return True

def run_comprehensive_test():
    """Run all tests and return overall system status"""
    print("🚀 Starting OASK Server Test Suite")
    print("=" * 50)
    
    start_time = datetime.now()
    test_results = []
    test_names = []
    
    # Test 1: Load and validate SETTINGS.json
    print("\n📋 Test 1: Configuration Validation")
    settings = load_settings()
    test_results.append(settings is not None)
    test_names.append("SETTINGS.json validation")
    
    if not settings:
        print("\n❌ Cannot continue testing without valid SETTINGS.json")
        return False
    
    # Test 2: Validate model files
    print("\n📋 Test 2: Model Checkpoint Validation")
    model_result = validate_model_files(settings)
    test_results.append(model_result)
    test_names.append("Model checkpoint files")
    
    # Test 3: Check if server is running
    print("\n📋 Test 3: Server Connectivity")
    server_running = check_server_running()
    test_results.append(server_running)
    test_names.append("Server connectivity")
    
    if not server_running:
        print("\n⚠ Server not running - some tests will be skipped")
        print("To start server: python server.py")
    else:
        # Test 4: Test API endpoints
        print("\n📋 Test 4: API Endpoint Testing")
        api_result = test_api_endpoints()
        test_results.append(api_result)
        test_names.append("API endpoints")
    
    # Test 5: Check log directory
    print("\n📋 Test 5: Log Directory Validation")
    log_result = check_log_directory(settings)
    test_results.append(log_result)
    test_names.append("Log directory")
    
    # Results summary
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    passed_tests = sum(test_results)
    total_tests = len(test_results)
    
    print("\n" + "=" * 50)
    print("🏁 Test Results Summary")
    print(f"Tests Passed: {passed_tests}/{total_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    print(f"Duration: {duration:.2f} seconds")
    
    # Detailed breakdown
    print("\n📊 Detailed Test Results:")
    for i, (name, result) in enumerate(zip(test_names, test_results), 1):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {i}. {name}: {status}")
    
    if passed_tests == total_tests:
        print("\n🎉 All tests passed! OASK system is ready for use.")
        print("📝 System validation complete.")
        return True
    else:
        failed_tests = total_tests - passed_tests
        print(f"\n⚠ {failed_tests} test(s) failed. Check output above for details.")
        if not server_running and failed_tests == 1:
            print("💡 Note: Server connectivity failure is expected when server is not running.")
            print("   Start the server with 'python server.py' to run full test suite.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1)
