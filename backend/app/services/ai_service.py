from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)
def generate_itinerary(destination: str, days: int):

    activities = [
        "Visit famous landmarks",
        "Explore local markets",
        "Try local food",
        "Visit beaches or parks",
        "Enjoy nightlife",
        "Take sightseeing tour"
    ]

    plan = ""

    for i in range(days):
        activity = activities[i % len(activities)]
        plan += f"Day {i+1}: {activity} in {destination}\n"

    return plan