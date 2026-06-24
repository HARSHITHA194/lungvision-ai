# 🎯 START HERE - LungVision AI with Your ML Model

Welcome! Your disease detection model has been integrated. Follow these steps:

## 3-Step Quick Start

### Step 1️⃣ - Place Your Model
```bash
cp model_5class.h5 backend/model_5class.h5
```

### Step 2️⃣ - Run Setup
**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 3️⃣ - Start Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate    # or venv\Scripts\activate on Windows
python app.py
```
✅ See: `Running on http://0.0.0.0:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ See: `VITE v8.0.3 ready in XXX ms`

**Open Browser:**
http://localhost:3001

---

## What Was Created

```
✅ backend/app.py              - Flask server for your model
✅ backend/requirements.txt     - Python dependencies
✅ setup.bat / setup.sh         - Automated setup
✅ docker-compose.yml           - Docker deployment
✅ QUICK_START.md               - 5-minute guide
✅ SETUP_MODEL_INTEGRATION.md   - Full docs
```

---

## Architecture

```
X-ray Upload
    ↓
Your Model (5-class detection)
    ↓
Gemini API (analysis & severity)
    ↓
Display Results
```

---

## Before Starting

Add to `.env`:
```env
VITE_API_KEY=your_gemini_key_here
VITE_MODEL_API=http://localhost:5000
```

---

## Verify Setup

```bash
cd backend
python verify_setup.py
```

---

## Documentation

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup guide |
| `SETUP_MODEL_INTEGRATION.md` | Detailed documentation |
| `INTEGRATION_COMPLETE.md` | Summary of changes |

---

**→ Go to QUICK_START.md for step-by-step instructions!**
