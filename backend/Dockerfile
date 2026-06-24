FROM python:3.10-slim

WORKDIR /app

# Install dependencies first (layer-cached separately from app code)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model file
# IMPORTANT: model_5class.h5 must exist in backend/ before building
COPY app.py .
COPY model_5class.h5 .

# Health check using Python stdlib (no curl/requests required in slim image)
HEALTHCHECK --interval=30s --timeout=30s --start-period=90s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health')"

# HF Spaces requires port 7860; 1 worker prevents OOM on free-tier RAM limits
EXPOSE 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "--workers", "1", "app:app"]
