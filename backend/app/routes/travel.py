from fastapi import APIRouter, HTTPException
from app.schemas.travel_schema import TravelRequest
from app.utils.logger import logger
from app.data.destination_images import DESTINATION_IMAGES
from app.agents.coordinator_agent import CoordinatorAgent

coordinator_agent = CoordinatorAgent()
router = APIRouter()

@router.post("/generate-plan")
def generate_plan(data: TravelRequest):
    try:
        agent_result = CoordinatorAgent().run(
            destination=data.destination,
            days=data.days,
            budget=data.budget,

            travel_style=getattr(
                data,
                "travel_style",
                "Relaxed"
            )
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

                "itinerary":
                    agent_result["itinerary"],

                "budget":
                    agent_result["budget"],

                "hotels":
                    agent_result["hotels"],

                "destination_image":
                    destination_image,

                "agent_logs":
                    agent_result["logs"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))