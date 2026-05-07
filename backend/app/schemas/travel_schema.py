from pydantic import BaseModel, Field

class TravelRequest(BaseModel):
    destination: str
    budget: int = Field(gt=0, description="Budget must be greater than 0")
    days: int = Field(gt=0, description="Days must be greater than 0")