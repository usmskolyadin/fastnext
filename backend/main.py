from datetime import datetime
from src.messages.schemas import Message
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:3000/",
    "http://localhost:3000",
    "http://127.0.0.1:3000",  # Замените на ваш фактический источник запросов (домен или порт)
    "http://127.0.0.1:8000",  # Еще один источник запросов, если есть
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Модель данных для сообщения
messages: List[Message] = []

next_id = 1

@app.get("/")
async def read_root():
    return {"message": "Welcome to the chat API!"}

@app.get("/messages")
async def get_messages():
    return messages

@app.post("/messages")
async def create_message(message: Message):
    global next_id
    message.id = next_id
    next_id += 1  # Увеличиваем next_id на 1 перед следующим сообщением
    message.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    messages.append(message)
    
    dummy_message = Message(
        id=next_id,
        text="заглушка",
        likes=0,
        dislikes=0,
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    next_id += 1  # Увеличиваем next_id еще на 1 для заглушки
    messages.append(dummy_message)

    return {"message": "Message created"}

    
@app.put("/messages/{message_id}/like")
async def toggle_like(message_id: int):
    message_id -= 1
    if message_id < len(messages):
        message = messages[message_id]
        if message.id != 1:
            if message.dislikes == 1:
                message.dislikes = 0
                message.likes = 1
            elif message.likes == 1:
                message.likes = 0
            else:
                message.likes = 1
            
            messages[message_id] = message
            return {"message": "Like toggled"}
        else:
            return {"message": "Cannot toggle likes for the first message"}
    else:
        return {"message": "Message not found"}

@app.put("/messages/{message_id}/dislike")
async def toggle_dislike(message_id: int):
    message_id -= 1
    if message_id < len(messages):
        message = messages[message_id]

        if message.id != 1:
            if message.likes == 1:
                message.likes = 0
                message.dislikes = 1
            elif message.dislikes == 1:
                message.dislikes = 0
            else:
                message.dislikes = 1
            
            messages[message_id] = message
            return {"message": "Dislike toggled"}
        else:
            return {"message": "Cannot toggle dislikes for the first message"}
    else:
        return {"message": "Message not found"}