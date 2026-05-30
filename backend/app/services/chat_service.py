from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def get_chat_response(user_message: str):

    prompt = f"""
    You are GoVibe AI Travel Assistant.

    Help users with:
    - travel planning
    - destinations
    - budgets
    - hotels
    - itineraries
    - travel tips

    Be friendly and concise.

    User:
    {user_message}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text