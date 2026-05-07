from fastapi import APIRouter, HTTPException
from app.schemas.travel_schema import TravelRequest
from app.services.itinerary_service import generate_itinerary
from app.services.budget_service import calculate_budget
from app.services.hotel_service import filter_hotels_by_budget, get_hotels
from app.utils.logger import logger


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
        logger.info("Travel plan generated successfully for destination: %s", data.destination)

        return {
            "status": "success",
            "message": "Travel plan generated successfully",
            "data": {
                "destination": data.destination,
                "itinerary": itinerary,
                "budget": budget,
                "hotels": filtered_hotels
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))