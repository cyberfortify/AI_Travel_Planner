from fastapi import APIRouter, HTTPException
from app.schemas.travel_schema import TravelRequest
from app.services.itinerary_service import generate_itinerary
from app.services.budget_service import calculate_budget
from app.services.hotel_service import filter_hotels_by_budget, get_hotels
from app.utils.logger import logger
from app.data.destination_images import DESTINATION_IMAGES
from app.services.hotel_enrichment import enrich_hotels

router = APIRouter()

@router.post("/generate-plan")
def generate_plan(data: TravelRequest):
    try:
        itinerary = generate_itinerary(data.destination, data.days)
        budget = calculate_budget(data.budget)

        hotels = get_hotels()
        filtered_hotels = filter_hotels_by_budget(
            hotels,
            budget["hotel"],
            data.destination
        )

        filtered_hotels = enrich_hotels(
            filtered_hotels,
            data.destination
        )
        destination_image = DESTINATION_IMAGES.get(
            data.destination.lower(),
            "https://placehold.co/1600x500?text=Travel"
        )
        logger.info("Travel plan generated successfully for destination: %s", data.destination)

        return {
            "status": "success",
            "message": "Travel plan generated successfully",
            "data": {
                "destination": data.destination,
                "itinerary": itinerary,
                "budget": budget,
                "hotels": filtered_hotels,
                "destination_image": destination_image
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))