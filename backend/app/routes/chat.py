from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import (
    get_chat_response
)

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(data: ChatRequest):

    reply = get_chat_response(
        data.message
    )

    return {
        "reply": reply
    }