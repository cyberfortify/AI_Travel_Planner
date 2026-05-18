from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

# ----------------------------
# REQUEST MODEL
# ----------------------------

class SaveTripRequest(BaseModel):

    user_email: str
    trip_data: dict


# ----------------------------
# SAVE TRIP
# ----------------------------

@router.post("/save-trip")

def save_trip(data: SaveTripRequest):

    file_path = "saved_trips.json"

    trips = []

    # LOAD EXISTING
    if os.path.exists(file_path):

        with open(file_path, "r") as f:
            trips = json.load(f)

    # ADD NEW TRIP
    trips.append({
        "user_email": data.user_email,
        "trip": data.trip_data
    })

    # SAVE
    with open(file_path, "w") as f:
        json.dump(trips, f, indent=2)

    return {
        "message": "Trip saved successfully"
    }