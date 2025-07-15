[15-07-2025 11:51 AM] Vanshaj Saini Classmate: from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Literal

from gpt2_local import generate_response

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str


@app.post("/chat/")
async def chat_endpoint(data: ChatRequest):
    response = generate_response(prompt=data.message)
    return JSONResponse(status_code=200, content={"response": response})
[15-07-2025 11:51 AM] Vanshaj Saini Classmate: from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load model and tokenizer from Hugging Face (GPT-2 is open)
model_id = "gpt2"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

# Create a text generation pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Run inference
# prompt = "What is Python?"
# output = generator(prompt, max_new_tokens=100)
# print(output)


def generate_response(prompt):
    # prompt = "What is Python?"
    output = generator(prompt, max_new_tokens=1000)
    return output[0]