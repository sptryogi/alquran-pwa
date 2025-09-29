# backend/Dockerfile
FROM python:3.11-slim

# set noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# install system deps (tesseract, ffmpeg, build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    tesseract-ocr \
    libtesseract-dev \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy requirements and install
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy app source
COPY backend/app /app/app

# copy targets.xlsx if exists
COPY backend/app/core/targets.xlsx /app/app/core/targets.xlsx

# set env vars defaults (override saat deploy)
ENV PORT=8080
ENV DEEPSEEK_API_KEY=""
ENV ALLOWED_ORIGINS="*"

# Expose port
EXPOSE 8080

# Run uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
