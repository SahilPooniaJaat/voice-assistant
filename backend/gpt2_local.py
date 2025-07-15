from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load model and tokenizer from Hugging Face (GPT-2 is open)
model_id = "gpt2"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

# Create a text generation pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

def generate_response(prompt):
    # prompt = "What is Python?"
    output = generator(prompt, max_new_tokens=1000)
    return output[0]