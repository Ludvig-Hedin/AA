# Changelog

## [Unreleased]

### Added
- Skapade Dockerfile för containerisering av AI-servern med Python 3.10
- Lade till requirements.txt med alla nödvändiga beroenden (fastapi, uvicorn, torch, transformers, peft, accelerate)
- Implementerade server.py med FastAPI som exponerar /api/generate-endpoint
- Lade till stöd för att ladda in LoRA-adaptrar på basmodeller
- Konfigurerade servern för att köra på port 8080 med uvicorn
- Implementerade API-nyckelautentisering för förbättrad säkerhet
- Lade till stöd för 4-bit kvantisering för att minska minnesanvändningen 