from fastapi import APIRouter
from pydantic import BaseModel
import json
import os

router = APIRouter()

FILE_PATH = "saved_trips.json"


# =========================
# GET SAVED TRIPS
# =========================

@router.get("/saved-trips/{email}")
def get_saved_trips(email: str):

    if not os.path.exists(FILE_PATH):
        return []

    with open(FILE_PATH, "r") as f:
        trips = json.load(f)

    user_trips = [
        trip for trip in trips
        if trip["user_email"] == email
    ]

    return user_trips


# =========================
# DELETE TRIP
# =========================

class DeleteTripRequest(BaseModel):
    user_email: str
    destination: str


@router.delete("/delete-trip")
def delete_trip(data: DeleteTripRequest):

    if not os.path.exists(FILE_PATH):
        return {
            "message": "No trips found"
        }

    with open(FILE_PATH, "r") as f:
        trips = json.load(f)

    updated = [
        trip for trip in trips
        if not (
            trip["user_email"] == data.user_email
            and trip["trip"]["destination"] == data.destination
        )
    ]

    with open(FILE_PATH, "w") as f:
        json.dump(updated, f, indent=2)

    return {
        "message": "Trip deleted successfully"
    }