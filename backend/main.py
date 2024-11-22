from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

ai_employee_id = 42

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Configure OpenAI API key
# Here's my OpenAI api_key. Feel free to use it to look at the demo, then I'll delete it once we're through with the interview process :) 
import os

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# In-memory storage for messages
chat_history: Dict[int, Dict] = { 1: {
    'id': 1,
    'senderId': ai_employee_id,
    'text': 'How can I help you today?'
}} 
message_id_counter = 2


class ChatRequest(BaseModel):
    userId: int
    message: str
    context: str


class MessageUpdate(BaseModel):
    newMessage: str


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Chat endpoint for processing user messages.
    Accepts a JSON payload with 'message' and 'context'.
    """
    global message_id_counter

    try:
        # Use OpenAI's Chat API to generate a response
        # Pass the chat history to the bot:
        messages = [
            {"role": "system", "content": "You are a helpful assistant knowledgeable about sales, particularly {request.context}. Your name is Ava."},
        ]
        for message in chat_history.values():
            role = "user" if message["senderId"] == request.userId else "assistant"
            messages.append({"role": role, "content": message["text"]})
        # Pass the most recent user message to the bot:q
        messages.append({"role": "user", "content": request.message})


        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        # Extract and return the AI's response
        ai_response = response.choices[0].message.content.strip()

        # Save the message to the in-memory database

        # add message from User
        chat_history[message_id_counter] = {
            'id': message_id_counter,
            'senderId': request.userId,
            'text': request.message
        }
        message_id_counter += 1

        # add message from AI
        chat_history[message_id_counter] = {
            'id': message_id_counter,
            'senderId': ai_employee_id,
            'text': ai_response
        }
        message_id_counter += 1

        return {"id": message_id_counter - 1, "response": ai_response, "messages": list(chat_history.values())}

    except Exception as e:
        return {"error": str(e)}


@app.get("/chat")
async def get_messages():
    """
    Retrieve all chat messages.
    If chat history is empty, generate an introduction message from OpenAI.
    """

    return list(chat_history.values())


@app.put("/chat/{messageId}")
async def update_message(messageId: int, update: MessageUpdate):
    """
    Update a specific message by ID.
    """
    global chat_history
    global message_id_counter
    if messageId not in chat_history:
        raise HTTPException(status_code=404, detail="Message not found")

    # Update the message
    chat_history[messageId]["text"] = update.newMessage
    chat_history = {k: v for k, v in chat_history.items() if k <= messageId}

    pastMessages = [{"role": "user" if message["senderId"] == chat_history[messageId]["senderId"] else "assistant", "content": message["text"]} for message in chat_history.values()]
    response = client.chat.completions.create(
            model="gpt-4",
            messages=pastMessages,
            max_tokens=150,
            temperature=0.7
        )
    # Extract and return the AI's response
    ai_response = response.choices[0].message.content.strip()

    # add message from AI
    chat_history[message_id_counter] = {
        'id': message_id_counter,
        'senderId': ai_employee_id,
        'text': ai_response
    }
    message_id_counter += 1

    return {"id": messageId, "updatedMessages": list(chat_history.values())}


@app.delete("/chat/{messageId}")
async def delete_message(messageId: int):
    """
    Delete a specific message by ID.
    """
    if messageId not in chat_history:
        raise HTTPException(status_code=404, detail="Message not found")

    del chat_history[messageId]
    return {"id": messageId, "status": "deleted", "updatedMessages": list(chat_history.values())}
