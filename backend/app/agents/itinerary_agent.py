
from app.services.itinerary_service import (
    generate_itinerary,
)


class ItineraryAgent:

    def __init__(self):
        self.name = "Itinerary Agent"

    def run(
        self,
        destination,
        days,
        travel_style="Relaxed"
    ):

        itinerary = generate_itinerary(
            destination,
            days,
        )

        return {
            "agent": self.name,
            "status": "completed",
            "days": days,
            "data": itinerary,
        }