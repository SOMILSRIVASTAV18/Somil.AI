from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import requests

app = FastAPI()

# Load a free, open-source LLM from Hugging Face
chatbot = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.2")

# Allow requests from any frontend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def web_search(query):
    url = f"https://api.duckduckgo.com/?q={query}&format=json"
    r = requests.get(url)
    data = r.json()
    return data.get("AbstractText", "")

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    # If user wants a web search, do it
    if "search" in prompt.lower():
        search_result = web_search(prompt)
        prompt = f"User asked: {prompt}\nWeb search result: {search_result}\nAnswer:"
    response = chatbot(prompt, max_new_tokens=128)[0]['generated_text']
    return {"response": response}
