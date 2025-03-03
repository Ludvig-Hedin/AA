import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    HfArgumentParser,
    TrainingArguments,
    pipeline,
    logging,
)
from peft import (
    LoraConfig,
    PeftModel,
    PeftConfig,
    get_peft_model,
    prepare_model_for_kbit_training
)
from trl import SFTTrainer
from dotenv import load_dotenv

# Ladda miljövariabler från .env
load_dotenv()

# Konfigurera loggning
logging.set_verbosity_info()

# Hämta konfiguration från miljövariabler
MODEL_NAME = os.getenv("LORA_MODEL_PATH", "deepseek-ai/deepseek-coder-6.7b-base")
OUTPUT_DIR = os.getenv("LORA_OUTPUT_DIR", "./output")
NUM_EPOCHS = int(os.getenv("LORA_NUM_EPOCHS", "3"))
BATCH_SIZE = int(os.getenv("LORA_BATCH_SIZE", "4"))
LEARNING_RATE = float(os.getenv("LORA_LEARNING_RATE", "2e-4"))

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Skapa en enkel platshållardataset
def create_placeholder_dataset():
    data = {
        "instruction": [
            "Skriv en funktion för att beräkna Fibonacci-sekvensen.",
            "Förklara hur man implementerar en binär sökalgoritm.",
            "Visa mig hur man sorterar en lista med bubbelsortering."
        ],
        "input": [
            "",
            "",
            ""
        ],
        "output": [
            "Här är en funktion som beräknar Fibonacci-sekvensen:\n\n```python\ndef fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci(n-1) + fibonacci(n-2)\n```",
            "Binär sökning är en effektiv algoritm för att hitta ett element i en sorterad array. Här är hur du implementerar den:\n\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n```",
            "Här är en implementation av bubbelsortering i Python:\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n```"
        ]
    }
    return load_dataset("dict", data=data)

# Ladda och förbered modell
def load_model():
    # Kvantiseringskonfiguration för att använda mindre minne
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )
    
    # Ladda modell och tokenizer
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quantization_config,
        device_map="auto",
    )
    
    # Lägg till särskild hantering av padding-token
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Förbered modellen för kbit-träning
    model = prepare_model_for_kbit_training(model)
    
    return model, tokenizer

# Konfigurera LoRA
def setup_lora(model):
    lora_config = LoraConfig(
        r=16,  # rank
        lora_alpha=32,
        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    
    model = get_peft_model(model, lora_config)
    
    return model

# Konfigurera träningsargument
def setup_training_args():
    training_arguments = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=NUM_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        gradient_accumulation_steps=1,
        optim="paged_adamw_32bit",
        save_steps=25,
        logging_steps=25,
        learning_rate=LEARNING_RATE,
        weight_decay=0.001,
        fp16=False,
        bf16=False,
        max_grad_norm=0.3,
        warmup_ratio=0.03,
        group_by_length=True,
        lr_scheduler_type="constant",
        report_to="tensorboard",
    )
    
    return training_arguments

# Träna modellen
def train_model(model, tokenizer, dataset, training_args):
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset["train"],
        args=training_args,
        tokenizer=tokenizer,
        peft_config=lora_config,
        dataset_text_field="instruction",
        max_seq_length=1024,
    )
    
    trainer.train()
    
    # Spara den finjusterade modellen
    trainer.model.save_pretrained(f"{OUTPUT_DIR}/final_model")
    tokenizer.save_pretrained(f"{OUTPUT_DIR}/final_model")
    
    return trainer

# Huvudfunktion
def main():
    print("Skapar platshållardataset...")
    dataset = create_placeholder_dataset()
    
    print("Laddar modell och tokenizer...")
    model, tokenizer = load_model()
    
    print("Konfigurerar LoRA...")
    model = setup_lora(model)
    
    print("Konfigurerar träningsargument...")
    training_args = setup_training_args()
    
    print("Startar träning...")
    trainer = train_model(model, tokenizer, dataset, training_args)
    
    print("Träning slutförd! Modellen har sparats i:", f"{OUTPUT_DIR}/final_model")

if __name__ == "__main__":
    main() 