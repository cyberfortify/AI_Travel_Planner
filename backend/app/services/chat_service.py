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

    You help users with:

    - destinations
    - budgets
    - itineraries
    - hotels
    - travel planning
    - trip duration
    - packing tips
    - honeymoon trips
    - family trips
    - luxury travel
    - backpacking

    Rules:

    1. Always stay focused on travel.

    2. If user provides:
    destination + budget + duration

    then provide specific recommendations.

    3. Use bullet points whenever useful.

    4. Keep responses concise.

    5. Sound like a premium travel consultant.

    6. If question is unrelated to travel,
    politely redirect the conversation.

    User:
    {user_message}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text