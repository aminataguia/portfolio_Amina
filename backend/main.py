import json
import requests
import time
import fastapi
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI, Request
import uvicorn
import requests
import json

headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWI0MDFiNTQtNDA3ZS00YjliLWE2ZjQtODdhYzE2M2U0YTY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.E4p5OS5QLYy2Tj7GTm-t9sWVsDA8UXUyKbHX1dUHE7U"
}
app = fastapi.FastAPI()

# Configuration CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Utilisez `["*"]` pour autoriser toutes les origines ou spécifiez une liste d'origines
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)
url = "https://api.edenai.run/v2/text/chat"
provider = "meta"

time.sleep(1)
@app.post("/chatbot")
async def chatbot(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    
    payload = {
        "providers": provider,
        "text": prompt,
        "chatbot_global_action": f"Act like an assistant and answer this: {prompt}",
        "previous_history": [],
        "temperature": 0.5,
        "max_tokens": 50,
        "fallback_providers": ""
    }
    
    response = requests.post(url, json=payload, headers=headers)
    result = json.loads(response.text)
    rp = result[provider]
    return {"generated_text": rp['generated_text']}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
