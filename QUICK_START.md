# 🚀 Quick Start: ML Model Integration

This guide will get your local disease detection model running with LungVision AI in **5 minutes**.

## Prerequisites Check

Ensure you have:
- ✅ Python 3.10+ (`python --version`)
- ✅ Node.js 18+ (`node --version`)  
- ✅ Your model file: `model_5class.h5`
- ✅ Gemini API key

## Step 1: Place Your Model

```bash
# Copy your model to the backend directory
cp /path/to/model_5class.h5 backend/model_5class.h5
```

## Step 2: Run Setup Script

### Windows:
```bash
setup.bat
```

### macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Create Python virtual environment
- ✅ Install dependencies
- ✅ Create configuration files
- ✅ Setup Node.js packages

## Step 3: Configure Environment

Edit `.env` file and add your Gemini API key:

```env
VITE_API_KEY=paste_your_gemini_api_key_here
VITE_MODEL_API=http://localhost:5000
```

## Step 4: Start Services

### Terminal 1 - Backend (Model Server)
```bash
cd backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start server
python app.py
```

Expected output:
```
 * Running on http://0.0.0.0:5000
```

### Terminal 2 - Frontend (React App)
```bash
npm run dev
```

Expected output:
```
  VITE v8.0.3  ready in 228 ms
  ➜  Local:   http://localhost:3001/
```

## Step 5: Test the Integration

```bash
# In a new terminal, test the setup
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python test_setup.py
```

Expected output:
```
1. Testing model file...
✅ Model loaded successfully

2. Testing model server...
✅ Model server is running

3. Testing prediction...
✅ Prediction successful
```

## Step 6: Use the Application

1. Open browser: **http://localhost:3001**
2. Upload a chest X-ray image
3. View results:
   - **Your Model's Classifications** (5-class disease detection)
   - **Gemini's Analysis** (severity, reasoning, recommendations)

## What's Happening

```
User Flow:
┌─────────────────────┐
│  Upload X-ray       │
│  (React Frontend)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Model Backend      │
│  (TensorFlow)       │
│  → Predicts disease │
│  → Returns scores   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Gemini API         │
│  → Analyzes results │
│  → Provides severity│
│  → Gives reasoning  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Display Results    │
│  (Combined output)  │
└─────────────────────┘
```

## Model API Endpoints

### Check Server Health
```bash
curl http://localhost:5000/health
```

### Send Image for Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

### Response Example
```json
{
  "predictions": [
    {"label": "PNEUMONIA", "confidence": 0.92},
    {"label": "TB", "confidence": 0.05},
    {"label": "NORMAL", "confidence": 0.02},
    {"label": "CARDIO", "confidence": 0.005},
    {"label": "EFFUSION", "confidence": 0.005}
  ],
  "top_prediction": {"label": "PNEUMONIA", "confidence": 0.92},
  "is_diseased": true
}
```

## Troubleshooting

### ❌ "Cannot find module './types'"
**Solution:** This is a VS Code cache issue. The build works fine.
- Run: `npm run build`
- Or reload VS Code

### ❌ "Model API Connection Failed"
**Solution:** Backend not running
```bash
# Verify backend is running
curl http://localhost:5000/health

# If failed, start it:
cd backend
python app.py
```

### ❌ "Module not found: tensorflow"
**Solution:** Dependencies not installed
```bash
cd backend
pip install -r requirements.txt
```

### ❌ "Model file not found"
**Solution:** Place your model in backend directory
```bash
cp model_5class.h5 backend/
```

### ❌ "CORS Error"
**Solution:** Check CORS settings in backend/.env
```env
ALLOW_ORIGINS=http://localhost:3001,http://localhost:3000
```

## Customization

### Different Model Input Size

If your model uses different image size (not 224x224):

Edit `backend/app.py`:
```python
IMG_SIZE = 256  # Change to your model's size
```

### Different Disease Classes

Edit `backend/app.py`:
```python
DISEASE_CLASSES = ["YOUR", "5", "CLASS", "NAMES", "HERE"]
```

### Change Model Location

Edit `backend/.env`:
```env
MODEL_PATH=/custom/path/to/your/model.h5
```

## Next Steps

- 📖 Read full documentation: [`SETUP_MODEL_INTEGRATION.md`](./SETUP_MODEL_INTEGRATION.md)
- 🐳 Deploy with Docker: See `docker-compose.yml`
- 📊 Fine-tune preprocessing in `backend/app.py`
- 🚀 Production deployment guide

## Need Help?

Check these files for detailed info:
- [`SETUP_MODEL_INTEGRATION.md`](./SETUP_MODEL_INTEGRATION.md) - Complete setup guide
- `backend/app.py` - API implementation
- `src/services/geminiService.ts` - Frontend integration

---

**Ready?** Start with Step 1 above! 🎯
