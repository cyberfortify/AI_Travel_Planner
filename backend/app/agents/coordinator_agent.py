from app.agents.budget_agent import BudgetAgent
from app.agents.hotel_agent import HotelAgent
from app.agents.itinerary_agent import ItineraryAgent


class CoordinatorAgent:

    def __init__(self):

        self.name = "Coordinator Agent"

        self.budget_agent = BudgetAgent()

        self.hotel_agent = HotelAgent()

        self.itinerary_agent = ItineraryAgent()

    def run(
        self,
        destination,
        days,
        budget,
        travel_style="Relaxed"
    ):

        logs = []

        # Budget Agent
        budget_result = self.budget_agent.run(
            destination,
            budget,
            travel_style
        )

        logs.append(
            "Budget Agent analyzed budget allocation"
        )

        logs.append(
            "Hotel Agent evaluated matching hotels"
        )

        logs.append(
            "Itinerary Agent generated day-wise journey"
        )

        # Hotel Agent
        hotel_result = self.hotel_agent.run(
            destination,
            budget_result["data"]["hotel"],
            travel_style
        )

        # Itinerary Agent
        itinerary_result = self.itinerary_agent.run(
            destination,
            days,
            travel_style
        )

        return {
            "agent": self.name,

            "status": "completed",

            "logs": logs,

            "budget": budget_result["data"],

            "hotels": hotel_result["data"],

            "itinerary": itinerary_result["data"],
        }