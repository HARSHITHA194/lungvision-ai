import os
import sys
import json
import base64
import requests
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    import tensorflow as tf
    from PIL import Image
    import numpy as np
except ImportError:
    print("❌ Required packages not installed")
    print("Run: pip install tensorflow pillow numpy requests")
    sys.exit(1)

MODEL_API_URL = "http://localhost:5000"
MODEL_PATH = "model_5class.h5"

def test_model_server():
    """Test if model server is running"""
    try:
        response = requests.get(f"{MODEL_API_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Model server is running")
            print(f"   Classes: {data['classes']}")
            print(f"   Model loaded: {data['model_loaded']}")
            return True
        else:
            print("❌ Model server returned error:", response.status_code)
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to model server at", MODEL_API_URL)
        print("   Make sure backend is running: python app.py")
        return False
    except Exception as e:
        print("❌ Error connecting to model server:", str(e))
        return False

def test_model_file():
    """Verify model file exists and can be loaded"""
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model file not found: {MODEL_PATH}")
        return False
    
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"✅ Model loaded successfully")
        print(f"   Input shape: {model.input_shape}")
        print(f"   Output shape: {model.output_shape}")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {str(e)}")
        return False

def test_prediction():
    """Test model prediction with a dummy image"""
    try:
        # Create a dummy chest X-ray image (224x224, grayscale)
        dummy_image = Image.new('RGB', (224, 224), color=128)
        
        # Convert to base64
        import io
        buffer = io.BytesIO()
        dummy_image.save(buffer, format='JPEG')
        buffer.seek(0)
        b64_image = base64.b64encode(buffer.getvalue()).decode()
        
        # Test prediction
        response = requests.post(
            f"{MODEL_API_URL}/predict",
            json={"image": f"data:image/jpeg;base64,{b64_image}"},
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prediction successful")
            print(f"   Top prediction: {result['top_prediction']['label']} ({result['top_prediction']['confidence']:.2%})")
            print(f"   Disease detected: {'YES' if result['is_diseased'] else 'NO'}")
            print(f"   All scores:")
            for label, score in result['all_scores'].items():
                print(f"     - {label}: {score:.2%}")
            return True
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        return False

def main():
    print("="*50)
    print("LungVision AI - Model Integration Tests")
    print("="*50)
    print()
    
    print("1. Testing model file...")
    model_ok = test_model_file()
    print()
    
    print("2. Testing model server...")
    server_ok = test_model_server()
    print()
    
    if server_ok:
        print("3. Testing prediction...")
        pred_ok = test_prediction()
        print()
        
        if pred_ok:
            print("="*50)
            print("✅ All tests passed!")
            print("="*50)
            return 0
    
    print("="*50)
    print("❌ Some tests failed")
    print("="*50)
    print("\nTroubleshooting:")
    print("1. Ensure backend is running: python app.py")
    print("2. Check model file exists: backend/model_5class.h5")
    print("3. Verify Python dependencies: pip install -r requirements.txt")
    return 1

if __name__ == "__main__":
    sys.exit(main())
