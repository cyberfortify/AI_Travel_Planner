from app.services.hotel_service import (
    get_hotels,
    filter_hotels_by_budget,
)

from app.services.hotel_enrichment import (
    enrich_hotels,
)


class HotelAgent:

    def __init__(self):
        self.name = "Hotel Agent"

    def run(
        self,
        destination,
        hotel_budget,
        travel_style="Relaxed"
    ):

        hotels = get_hotels()

        filtered_hotels = (
            filter_hotels_by_budget(
                hotels,
                hotel_budget,
                destination,
            )
        )

        enriched_hotels = (
            enrich_hotels(
                filtered_hotels,
                destination,
            )
        )

        return {
            "agent": self.name,
            "status": "completed",
            "count": len(enriched_hotels),
            "data": enriched_hotels,
        }