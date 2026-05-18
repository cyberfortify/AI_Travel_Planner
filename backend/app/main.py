from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.travel import router as travel_router
from app.routes.auth import router as auth_router
from app.routes.trip import router as trip_router

# DATABASE IMPORTS
from app.database.database import engine
from app.models.user_model import Base
from app.routes.saved_trips import router as saved_trip_router

# CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(travel_router)
app.include_router(auth_router)
app.include_router(trip_router)
app.include_router(saved_trip_router)

@app.get("/")
def root():
    return {
        "message": "AI Travel Planner Running"
    }