# backend/Dockerfile
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install system deps (tesseract, ffmpeg, libs untuk opencv)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    tesseract-ocr \
    tesseract-ocr-ara \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python deps
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy app code
COPY backend /app

ENV PYTHONUNBUFFERED=1
# Cloud Run expects server listening on $PORT (set by platform). Use 8080.
ENV PORT=8080

EXPOSE 8080

# Use uvicorn; note: --port should match $PORT
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1"]
