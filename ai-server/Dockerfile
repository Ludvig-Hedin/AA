FROM python:3.10-slim

WORKDIR /app

# Installera systempaket som behövs för PyTorch och CUDA
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Kopiera requirements.txt först för att utnyttja Docker-cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiera resten av applikationen
COPY . .

# Exponera port 8080
EXPOSE 8080

# Starta servern
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"] 