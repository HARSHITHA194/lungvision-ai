# Setup Guide: Integrating ML Model with LungVision AI

## Overview
This setup integrates your 5-class disease detection model (`model_5class.h5`) with the LungVision AI application.

**Architecture:**
- **Frontend** (React/Vite): Image upload and UI
- **Backend** (Python/Flask): ML model inference
- **Gemini API**: Enhanced analysis, severity assessment, and clinical reasoning

## Project Structure
```
lungvision-ai/
├── src/
│   └── services/
│       └── geminiService.ts (Updated to use model API)
├── backend/
│   ├── app.py (Flask server)
│   ├── requirements.txt
│   ├── .env.example
│   └── model_5class.h5 (Add your model here)
└── .env (Add VITE_MODEL_API for frontend)
```

## Installation & Setup

### 1. Place Your Model
```bash
cp /path/to/your/model_5class.h5 backend/model_5class.h5
```

### 2. Backend Setup (Python)

#### Prerequisites
- Python 3.10 or higher
- pip

#### Install Dependencies
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### Configure Environment
```bash
cp .env.example .env
# Edit .env if needed (MODEL_PATH, ports, CORS settings)
```

#### Run Backend Server
```bash
python app.py
```
Backend will run on `http://localhost:5000`

Check health: `curl http://localhost:5000/health`

### 3. Frontend Setup

#### Add Environment Variables
Create `.env` file in project root:
```env
# Vite Config
VITE_API_KEY=your_gemini_api_key_here
VITE_MODEL_API=http://localhost:5000
```

#### Run Frontend
```bash
npm install
npm run dev
```
Frontend will run on `http://localhost:3001` or next available port

### 4. Docker Deployment (Optional)

#### Create Docker Setup
```bash
# For production, create docker-compose.yml
docker-compose up
```

## API Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```
Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes": ["NORMAL", "PNEUMONIA", "TB", "CARDIO", "EFFUSION"]
}
```

### Single Prediction
```bash
POST http://localhost:5000/predict
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```
Response:
```json
{
  "predictions": [
    {"label": "PNEUMONIA", "confidence": 0.92},
    {"label": "TB", "confidence": 0.05},
    ...
  ],
  "top_prediction": {"label": "PNEUMONIA", "confidence": 0.92},
  "is_diseased": true,
  "all_scores": {"NORMAL": 0.01, "PNEUMONIA": 0.92, ...}
}
```

### Batch Predictions
```bash
POST http://localhost:5000/predict-batch
Content-Type: application/json

{
  "images": ["data:image/jpeg;base64,...", ...]
}
```

## Model Requirements

Your `model_5class.h5` should:
- Accept input images of size: 224x224x3 (adjust IMG_SIZE in app.py if different)
- Output 5 predictions for: NORMAL, PNEUMONIA, TB, CARDIO, EFFUSION
- Return confidence scores (0-1) for each class
- Be in Keras/TensorFlow format (.h5)

If your model uses different input size, update in `backend/app.py`:
```python
IMG_SIZE = 224  # Change this to match your model
```

## Workflow

1. **User uploads chest X-ray** in frontend
2. **Image sent to model backend** via `/predict` endpoint
3. **Backend returns disease predictions** with confidence scores
4. **Predictions sent to Gemini API** for enhanced analysis
5. **Gemini provides:**
   - Severity assessment (MILD/MODERATE/SEVERE)
   - Clinical reasoning
   - Risk probability
   - Recommendations
6. **Combined results displayed** to user

## Troubleshooting

### Model Not Loading
```
Error: Failed to load model
```
- Verify `model_5class.h5` is in backend directory
- Check model file is not corrupted: `python -c "import tensorflow as tf; tf.keras.models.load_model('model_5class.h5')"`

### CORS Errors
- Update `ALLOW_ORIGINS` in backend/.env
- Ensure Flask server is running

### Gemini API Errors
- Verify `VITE_API_KEY` is set correctly
- Check API key has permission for gemini-3-flash-preview model

### Model API Connection Failed
- Verify backend is running: `curl http://localhost:5000/health`
- Check `VITE_MODEL_API` matches backend URL
- On Windows, may need firewall exception

## Model Input/Output

If your model expects different preprocessing:
1. Modify `preprocess_image()` in `backend/app.py`
2. Update normalization, resizing, or other transformations
3. Restart backend server

Example modifications:
```python
# For grayscale images
image = Image.open(io.BytesIO(image_bytes)).convert('L')

# For different normalization
img_array = np.array(image) / 255.0  # Change scaling factor

# For augmentation
from tensorflow.keras.preprocessing.image import random_shift
img_array = random_shift(img_array, ...)
```

## Performance Optimization

### For Production
- Enable TensorFlow GPU support (if available)
- Use model quantization
- Implement caching for similar images
- Add request queuing for concurrent predictions

### Sample Requirements for GPU
```
tensorflow-gpu==2.14.0
cuda-toolkit==12.2
cudnn==8.8
```

## Next Steps

1. ✅ Backend running with model
2. ✅ Frontend configured with API URL
3. ⚠️ Test with sample X-ray images
4. ⚠️ Verify predictions match your expectations
5. ⚠️ Tune model preprocessing if needed
6. 🚀 Deploy to production

---

**Support:** For issues, check logs in both frontend (browser console) and backend (terminal output).
