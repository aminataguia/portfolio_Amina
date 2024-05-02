import os
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import uvicorn

from openai import AzureOpenAI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("AZURE_OPENAI_KEY")
if not api_key:
    raise Exception("API key not found")

client = AzureOpenAI(
    azure_endpoint="https://openai-lok.openai.azure.com/",
    api_key=api_key,
    api_version="2024-02-15-preview"
)

class Message(BaseModel):
    sender: str
    message: str

class ChatRequest(BaseModel):
    system: str
    history: List[Message]
    temperature: float = 0.9
    max_tokens: int = 1000
    top_p: float = 0.95
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0

@app.get("/talk", response_model=dict)
async def talk(message: str = Query(..., description="Your message to the model")):
    message_text = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": message}
    ]

    try:
        completion = client.chat.completions.create(
            model="gpt35-latest",
            messages=message_text,
            temperature=0.9,
            max_tokens=1000,
            top_p=0.95,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        completion_dict = completion.model_dump()
        choices = completion_dict.get('choices', [])

        if choices:
            first_choice = choices[0]
            generated_text = first_choice.get('message', {}).get(
                'content', 'No content available')
            response_data = {
                "response": generated_text,
                "config": {
                    "temperature": 0.9,
                    "max_tokens": 1000,
                    "top_p": 0.95,
                    "frequency_penalty": 0.0,
                    "presence_penalty": 0.0
                }
            }
            return JSONResponse(content=response_data)
        else:
            return JSONResponse(content={"error": "No choices available"}, status_code=500)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002) # Keep the same port
