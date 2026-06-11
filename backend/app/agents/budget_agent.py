from app.services.budget_service import calculate_budget


class BudgetAgent:

    def __init__(self):
        self.name = "Budget Agent"

    def run(
        self,
        destination,
        budget,
        travel_style="Relaxed"
    ):

        result = calculate_budget(
            budget
        )

        return {
            "agent": self.name,
            "status": "completed",
            "data": result
        }