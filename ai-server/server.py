import os
import torch
from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, TextGenerationPipeline

# Konfigurera FastAPI-app
app = FastAPI(title="DeepSeek LoRA API", description="API för att använda DeepSeek-modell med LoRA-adapters")

# Aktivera CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # I produktion, begränsa till specifika domäner
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Konfigurationsvariabler
BASE_MODEL_PATH = os.environ.get("BASE_MODEL_PATH", "deepseek-ai/deepseek-coder-6.7b-base")
LORA_PATH = os.environ.get("LORA_PATH", "./output/final_model")
API_KEY = os.environ.get("API_KEY", "din-api-nyckel-här")  # Ersätt med din egen API-nyckel

# Pydantic-modeller för API-requests och responses
class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: Optional[int] = 150
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.95

class GenerateResponse(BaseModel):
    response: str

# Funktion för API-nyckelautentisering
def verify_api_key(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="API-nyckel saknas")
    
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Ogiltig autentiseringsmetod")
    
    if token != API_KEY:
        raise HTTPException(status_code=403, detail="Ogiltig API-nyckel")
    
    return token

# Ladda modell och tokenizer
print(f"Laddar basmodell: {BASE_MODEL_PATH}")
tokenizer = None
model = None
pipeline = None

try:
    # Försök ladda modellen
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_PATH)
    
    # Konfigurera för 4-bit kvantisering för minnesbesparing
    if torch.cuda.is_available():
        from transformers import BitsAndBytesConfig
        
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )
        
        model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_PATH,
            quantization_config=bnb_config,
            device_map="auto"
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL_PATH, 
            device_map="auto",
            torch_dtype=torch.float16
        )
    
    # Ladda LoRA-adapter om specificerad
    if os.path.exists(LORA_PATH):
        print(f"Laddar LoRA-adapter från: {LORA_PATH}")
        model = PeftModel.from_pretrained(model, LORA_PATH)
    else:
        print(f"VARNING: LoRA-adapter hittades inte på {LORA_PATH}. Använder endast basmodellen.")
    
    # Skapa pipeline för textgenerering
    pipeline = TextGenerationPipeline(model=model, tokenizer=tokenizer)
    print("Modell och tokenizer har laddats framgångsrikt!")

except Exception as e:
    print(f"Fel vid laddning av modell: {str(e)}")
    raise e

# Inferens-funktion
def run_inference(prompt: str, max_tokens: int = 150, temperature: float = 0.7, top_p: float = 0.95) -> str:
    """Generera text baserat på en prompt."""
    if not model or not tokenizer or not pipeline:
        raise HTTPException(status_code=500, detail="Modellen har inte laddats korrekt")
    
    try:
        # Generera svar
        input_ids = tokenizer.encode(prompt, return_tensors="pt").to(model.device)
        gen_tokens = model.generate(
            input_ids,
            max_new_tokens=max_tokens,
            do_sample=True,
            temperature=temperature,
            top_p=top_p,
            pad_token_id=tokenizer.eos_token_id
        )
        
        # Dekodera och returnera svaret (utan prompten)
        prompt_length = input_ids.shape[1]
        generated_text = tokenizer.decode(gen_tokens[0][prompt_length:], skip_special_tokens=True)
        
        return generated_text
    
    except Exception as e:
        print(f"Fel vid inferens: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Inferensfel: {str(e)}")

# API-endpoint för textgenerering
@app.post("/api/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest, api_key: str = Depends(verify_api_key)):
    """Generera text baserat på en prompt."""
    response_text = run_inference(
        request.prompt, 
        max_tokens=request.max_tokens,
        temperature=request.temperature,
        top_p=request.top_p
    )
    
    return GenerateResponse(response=response_text)

# Enkel hälsokontroll
@app.get("/health")
async def health_check():
    """Kontrollera om API:et är igång och fungerande."""
    return {"status": "healthy", "model_loaded": model is not None and tokenizer is not None}

# Om du kör denna fil direkt
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080) 