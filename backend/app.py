from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64
from PIL import Image
import io
import tensorflow as tf
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Model configuration
MODEL_PATH = os.getenv("MODEL_PATH", "model_5class.h5")
DISEASE_CLASSES = ["NORMAL", "PNEUMONIA", "TB", "CARDIO", "EFFUSION"]
IMG_SIZE = 224  # Adjust based on your model's input size

# Load model at startup
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None


def preprocess_image(image_data):
    """Convert base64 image to preprocessed array for model"""
    try:
        # Decode base64
        if "," in image_data:
            image_data = image_data.split(",")[1]
        
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Resize to model input size
        image = image.resize((IMG_SIZE, IMG_SIZE))
        
        # Convert to array and normalize
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": DISEASE_CLASSES
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict disease from chest X-ray image
    Expected JSON: {
        "image": "base64_encoded_image_data"
    }
    """
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.get_json()
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400
        
        # Preprocess image
        processed_image = preprocess_image(image_data)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        confidence_scores = predictions[0]
        
        # Format predictions
        formatted_predictions = [
            {
                "label": DISEASE_CLASSES[i],
                "confidence": float(confidence_scores[i])
            }
            for i in range(len(DISEASE_CLASSES))
        ]
        
        # Sort by confidence
        formatted_predictions.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Get top prediction
        top_prediction = formatted_predictions[0]
        
        # Determine if disease is detected
        is_diseased = top_prediction["label"] != "NORMAL"
        
        return jsonify({
            "predictions": formatted_predictions,
            "top_prediction": top_prediction,
            "is_diseased": is_diseased,
            "all_scores": {label: float(score) for label, score in zip(DISEASE_CLASSES, confidence_scores)}
        })
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    """Predict multiple images at once"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.get_json()
        images = data.get('images', [])
        
        if not images:
            return jsonify({"error": "No images provided"}), 400
        
        results = []
        for image_data in images:
            try:
                processed_image = preprocess_image(image_data)
                predictions = model.predict(processed_image, verbose=0)
                confidence_scores = predictions[0]
                
                formatted_predictions = [
                    {
                        "label": DISEASE_CLASSES[i],
                        "confidence": float(confidence_scores[i])
                    }
                    for i in range(len(DISEASE_CLASSES))
                ]
                
                formatted_predictions.sort(key=lambda x: x["confidence"], reverse=True)
                
                results.append({
                    "predictions": formatted_predictions,
                    "top_prediction": formatted_predictions[0],
                    "is_diseased": formatted_predictions[0]["label"] != "NORMAL"
                })
            except Exception as e:
                results.append({"error": str(e)})
        
        return jsonify({"results": results})
    
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
