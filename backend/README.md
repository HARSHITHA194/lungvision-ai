---
title: LungVision AI Backend
emoji: 🫁
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# LungVision AI — Backend API

Flask + TensorFlow DenseNet121 chest X-ray classifier with 5-class disease detection.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check — returns model load status |
| POST | `/predict` | Single image prediction (base64 JSON body) |
| POST | `/predict-batch` | Batch prediction for multiple images |

## Request Format

```json
POST /predict
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

## Response Format

```json
{
  "predictions": [
    {"label": "NORMAL", "confidence": 0.92},
    {"label": "PNEUMONIA", "confidence": 0.05},
    ...
  ],
  "top_prediction": {"label": "NORMAL", "confidence": 0.92},
  "is_diseased": false,
  "all_scores": {"NORMAL": 0.92, "PNEUMONIA": 0.05, ...}
}
```

## Disease Classes

`NORMAL` · `PNEUMONIA` · `TB` · `CARDIO` · `EFFUSION`
