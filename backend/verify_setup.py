#!/usr/bin/env python3
"""
LungVision AI - Setup Verification Checklist
Run this to verify your installation is complete and correct
"""

import os
import sys
import json
from pathlib import Path

# Get the project root (parent of backend directory)
script_dir = Path(__file__).parent
project_root = script_dir.parent
os.chdir(project_root)

def check_mark(success):
    return "✅" if success else "❌"

def print_header(title):
    print(f"\n{title}")
    print("=" * 60)

def check_python_dependencies():
    """Check if all Python dependencies are available"""
    print_header("Python Dependencies")
    
    dependencies = {
        'tensorflow': 'Machine Learning Model',
        'flask': 'Backend Server',
        'flask_cors': 'CORS Support',
        'numpy': 'Numerical Computing',
        'PIL': 'Image Processing',
        'dotenv': 'Environment Configuration'
    }
    
    all_ok = True
    for package, description in dependencies.items():
        try:
            __import__(package)
            print(f"{check_mark(True)} {package:15} - {description}")
        except ImportError:
            print(f"{check_mark(False)} {package:15} - {description}")
            all_ok = False
    
    return all_ok

def check_model_file():
    """Check if model file exists"""
    print_header("Model File")
    
    model_path = Path("backend/model_5class.h5")
    exists = model_path.exists()
    
    if exists:
        size_mb = model_path.stat().st_size / (1024 * 1024)
        print(f"{check_mark(True)} backend/model_5class.h5 found ({size_mb:.1f} MB)")
    else:
        print(f"{check_mark(False)} model_5class.h5 not found")
        print(f"   Expected location: {model_path.absolute()}")
        print(f"   Run: cp model_5class.h5 backend/")
    
    return exists

def check_model_loadable():
    """Check if model can be loaded"""
    print_header("Model Loadability")
    
    try:
        import tensorflow as tf
    except ImportError:
        print(f"{check_mark(False)} TensorFlow not installed - skipping model load test")
        return False
    
    model_path = Path("backend/model_5class.h5")
    
    if not model_path.exists():
        print(f"{check_mark(False)} Model file not found at {model_path}")
        return False
    
    try:
        model = tf.keras.models.load_model(str(model_path))
        print(f"{check_mark(True)} Model loaded successfully")
        print(f"   Input shape:  {model.input_shape}")
        print(f"   Output shape: {model.output_shape}")
        
        # Check expected output size (should be 5 for 5-class classification)
        if model.output_shape[-1] == 5:
            print(f"{check_mark(True)} Output size is 5 (correct for 5-class)")
            return True
        else:
            print(f"{check_mark(False)} Output size is {model.output_shape[-1]} (expected 5)")
            return False
    except Exception as e:
        print(f"{check_mark(False)} Failed to load model: {str(e)}")
        return False

def check_environment_files():
    """Check if configuration files exist"""
    print_header("Environment Configuration")
    
    files = {
        '.env': 'Frontend configuration',
        'backend/.env': 'Backend configuration',
    }
    
    all_ok = True
    for filepath, description in files.items():
        path = Path(filepath)
        exists = path.exists()
        status = check_mark(exists)
        print(f"{status} {filepath:25} - {description}")
        if not exists:
            print(f"   Run: cp .env.example .env  (for root .env)")
            if 'backend' in filepath:
                print(f"   Run: cp backend/.env.example backend/.env")
        if exists and filepath == '.env':
            # Check if VITE_API_KEY is set
            with open(filepath) as f:
                content = f.read()
                has_api_key = 'VITE_API_KEY=' in content
                has_model_api = 'VITE_MODEL_API=' in content
                if has_api_key and has_model_api:
                    print(f"   {check_mark(True)} Contains required environment variables")
                else:
                    print(f"   {check_mark(False)} Missing environment variables")
                    if not has_api_key:
                        print(f"      - Missing VITE_API_KEY")
                    if not has_model_api:
                        print(f"      - Missing VITE_MODEL_API")
        all_ok = all_ok and exists
    
    return all_ok

def check_frontend_files():
    """Check if frontend files exist"""
    print_header("Frontend Files")
    
    required_files = [
        'src/services/geminiService.ts',
        'src/App.tsx',
        'package.json',
        'vite.config.ts'
    ]
    
    all_ok = True
    for filepath in required_files:
        path = Path(filepath)
        exists = path.exists()
        status = check_mark(exists)
        print(f"{status} {filepath}")
        all_ok = all_ok and exists
    
    return all_ok

def check_backend_files():
    """Check if backend files exist"""
    print_header("Backend Files")
    
    required_files = [
        'backend/app.py',
        'backend/requirements.txt',
        'backend/.env.example',
    ]
    
    all_ok = True
    for filepath in required_files:
        path = Path(filepath)
        exists = path.exists()
        status = check_mark(exists)
        print(f"{status} {filepath}")
        all_ok = all_ok and exists
    
    return all_ok

def check_documentation():
    """Check if documentation files exist"""
    print_header("Documentation")
    
    docs = [
        'QUICK_START.md',
        'SETUP_MODEL_INTEGRATION.md',
        'INTEGRATION_COMPLETE.md'
    ]
    
    all_ok = True
    for doc in docs:
        path = Path(doc)
        exists = path.exists()
        status = check_mark(exists)
        print(f"{status} {doc}")
        all_ok = all_ok and exists
    
    return all_ok

def print_summary(results):
    """Print summary of checks"""
    print_header("Summary")
    
    total = len(results)
    passed = sum(results.values())
    failed = total - passed
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"Checks passed: {passed}/{total} ({percentage:.0f}%)")
    
    if failed == 0:
        print(f"\n{check_mark(True)} All checks passed! You're ready to go!")
        print("\nNext steps:")
        print("1. Start backend:  cd backend && python app.py")
        print("2. Start frontend: npm run dev")
        print("3. Open: http://localhost:3001")
    else:
        print(f"\n{check_mark(False)} {failed} check(s) failed.")
        print("\nQuick fixes:")
        print("1. Copy model: cp model_5class.h5 backend/")
        print("2. Setup: setup.bat (Windows) or ./setup.sh (macOS/Linux)")
        print("3. Configure: cp .env.example .env && cp backend/.env.example backend/.env")
        print("\nFor help, check:")
        print("- QUICK_START.md (5-minute setup)")
        print("- SETUP_MODEL_INTEGRATION.md (detailed guide)")

def main():
    print("╔════════════════════════════════════════════════════════════╗")
    print("║   LungVision AI - Setup Verification Checklist             ║")
    print(f"║   Working from: {project_root}                ")
    print("╚════════════════════════════════════════════════════════════╝")
    
    results = {
        'Python Dependencies': check_python_dependencies(),
        'Model File': check_model_file(),
        'Model Loadable': check_model_loadable(),
        'Environment Files': check_environment_files(),
        'Frontend Files': check_frontend_files(),
        'Backend Files': check_backend_files(),
        'Documentation': check_documentation(),
    }
    
    print_summary(results)
    
    # Return success if all checks passed
    return 0 if all(results.values()) else 1

if __name__ == "__main__":
    sys.exit(main())
