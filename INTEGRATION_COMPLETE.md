# Integration Summary: ML Model + Gemini API

## ✅ What Was Done

Your `model_5class.h5` has been integrated into LungVision AI with a hybrid architecture:

### 1. **Backend (Python Flask Server)**
- **File:** `backend/app.py`
- **Purpose:** Serves your TensorFlow model for disease classification
- **Endpoints:**
  - `GET /health` - Server health check
  - `POST /predict` - Single image prediction
  - `POST /predict-batch` - Multiple image predictions
- **Features:**
  - Handles image preprocessing (resize, normalize)
  - Returns predictions with confidence scores
  - Disease detection (is_diseased: true/false)

### 2. **Frontend Integration (Updated)**
- **File:** `src/services/geminiService.ts`
- **New Function:** `predictWithModel()`
- **Updated Function:** `analyzeXray()`
- **Flow:**
  1. Send image to model backend
  2. Get disease predictions (NORMAL, PNEUMONIA, TB, CARDIO, EFFUSION)
  3. Send to Gemini API for enhanced analysis
  4. Gemini provides severity, reasoning, recommendations
  5. Return combined results

### 3. **Configuration Files**
- `backend/requirements.txt` - Python dependencies
- `backend/.env.example` - Backend config template
- `.env.example` - Frontend config template
- `backend/Dockerfile` - Docker support
- `frontend.Dockerfile` - Frontend containerization
- `docker-compose.yml` - Full stack deployment

### 4. **Setup & Testing**
- `setup.sh` / `setup.bat` - Automated setup scripts
- `backend/test_setup.py` - Test model integration
- `QUICK_START.md` - 5-minute quick start guide
- `SETUP_MODEL_INTEGRATION.md` - Comprehensive documentation

## 📁 File Structure

```
lungvision-ai/
├── backend/
│   ├── app.py                    (NEW) Flask server
│   ├── requirements.txt          (NEW) Python dependencies
│   ├── .env.example              (NEW) Config template
│   ├── Dockerfile                (NEW) Container config
│   ├── test_setup.py             (NEW) Testing utility
│   └── model_5class.h5           (ADD YOUR MODEL HERE)
├── src/
│   └── services/
│       └── geminiService.ts      (UPDATED) Model + Gemini integration
├── .env.example                  (UPDATED) Added VITE_MODEL_API
├── docker-compose.yml            (NEW) Full stack deployment
├── frontend.Dockerfile           (NEW) Frontend container
├── nginx.conf                    (NEW) Web server config
├── setup.sh                      (NEW) macOS/Linux setup
├── setup.bat                     (NEW) Windows setup
├── QUICK_START.md                (NEW) 5-minute guide
├── SETUP_MODEL_INTEGRATION.md    (NEW) Full documentation
└── package.json                  (UPDATED) Added backend scripts
```

## 🚀 Getting Started

### Minimal Setup (5 minutes)
```bash
# 1. Place your model
cp model_5class.h5 backend/

# 2. Run setup (Windows or macOS/Linux)
setup.bat    # or ./setup.sh

# 3. Add Gemini API key to .env
VITE_API_KEY=your_key_here

# 4. Terminal 1 - Backend
cd backend && python app.py

# 5. Terminal 2 - Frontend  
npm run dev

# Open http://localhost:3001
```

## 🔄 How It Works

### User Uploads X-Ray
```
Browser → Image to Base64
```

### Backend Prediction
```
1. Receives base64 image
2. Decodes & preprocesses
3. Runs model inference
4. Returns confidence scores for 5 classes
```

### Gemini Analysis
```
1. Receives model predictions
2. Analyzes with patient data
3. Returns severity & reasoning
4. Provides recommendations
```

### Result Display
```
Frontend shows:
- Disease detected: YES/NO
- Top prediction with confidence
- Severity (MILD/MODERATE/SEVERE)
- Clinical reasoning
- Risk probability
```

## 🎯 Model Requirements

Your `model_5class.h5` should:
- ✅ Accept 224x224x3 images (configurable in app.py)
- ✅ Output 5 softmax predictions
- ✅ Map to: NORMAL, PNEUMONIA, TB, CARDIO, EFFUSION
- ✅ Be trained on chest X-rays
- ✅ Be in Keras/TensorFlow format

## 📊 Disease Classes Mapping

| Class | Detected As | Severity Ready |
|-------|------------|-----------------|
| NORMAL | No | - |
| PNEUMONIA | Yes | From Gemini |
| TB | Yes | From Gemini |
| CARDIO | Yes | From Gemini |
| EFFUSION | Yes | From Gemini |

## 🔐 API Security

For production, add:
- API key authentication
- Rate limiting
- HTTPS/TLS
- CORS restrictions
- Input validation

See `SETUP_MODEL_INTEGRATION.md` for security best practices.

## 💻 Environment Variables

### Backend (`backend/.env`)
```env
MODEL_PATH=model_5class.h5
FLASK_ENV=production
ALLOW_ORIGINS=http://localhost:3001
```

### Frontend (`.env`)
```env
VITE_API_KEY=your_gemini_key
VITE_MODEL_API=http://localhost:5000
```

## 🧪 Testing

### Quick Test
```bash
npm run backend:test
```

### Manual Test
```bash
# Check server
curl http://localhost:5000/health

# Send test image
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

## 📦 Package Scripts

Added to `package.json`:
```json
{
  "backend:install": "pip install -r requirements.txt",
  "backend:test": "python test_setup.py",
  "backend:start": "python app.py"
}
```

Usage:
```bash
npm run backend:install  # Install dependencies
npm run backend:test     # Test setup
npm run backend:start    # Start server
```

## 🐳 Docker Deployment

For production containerization:
```bash
# Single command deployment
docker-compose up

# Builds and runs both frontend and backend
```

## ⚠️ Important Notes

1. **Model File:** Place `model_5class.h5` in `backend/` directory
2. **API Key:** Add Gemini API key to `.env` before running
3. **Ports:** Backend uses 5000, Frontend uses 3001
4. **Dependencies:** Python 3.10+ and Node.js 18+ required
5. **Memory:** Model loading requires 2GB+ RAM for inference

## 📚 Documentation

- **Quick Start:** [`QUICK_START.md`](./QUICK_START.md) - 5 minute setup
- **Full Setup:** [`SETUP_MODEL_INTEGRATION.md`](./SETUP_MODEL_INTEGRATION.md) - Detailed guide
- **Code:** See inline comments in `backend/app.py` and `src/services/geminiService.ts`

## 🔧 Customization

### Change Input Size
Edit `backend/app.py` line ~18:
```python
IMG_SIZE = 224  # Change to your model's input size
```

### Change Classes
Edit `backend/app.py` line ~15:
```python
DISEASE_CLASSES = ["CLASS1", "CLASS2", "CLASS3", "CLASS4", "CLASS5"]
```

### Different Preprocessing
Modify `preprocess_image()` function in `backend/app.py`

## 🚀 Next Steps

1. ✅ Copy model to `backend/model_5class.h5`
2. ✅ Run `setup.bat` (Windows) or `./setup.sh` (macOS/Linux)
3. ✅ Add Gemini API key to `.env`
4. ✅ Start backend and frontend
5. ✅ Test with `npm run backend:test`
6. ✅ Open http://localhost:3001

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not loading | Check file exists at `backend/model_5class.h5` |
| API connection fails | Ensure backend running: `python app.py` |
| CORS errors | Update ALLOW_ORIGINS in `backend/.env` |
| Dependencies missing | Run `pip install -r backend/requirements.txt` |
| Port already in use | Change port in app.py or kill process |

## 📞 Support

For issues:
1. Check `QUICK_START.md` troubleshooting section
2. Review `SETUP_MODEL_INTEGRATION.md` for detailed guidance
3. Run `npm run backend:test` to diagnose problems
4. Check logs in browser console and terminal

---

**Your ML model is now integrated! 🎉**

Start with `QUICK_START.md` and you'll be running in 5 minutes.
