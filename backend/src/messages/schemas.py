from datetime import datetime
from pydantic import BaseModel


class Message(BaseModel):
    id: int
    text: str
    likes: int
    dislikes: int
    timestamp: str
