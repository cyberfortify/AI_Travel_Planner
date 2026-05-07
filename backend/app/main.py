from fastapi import FastAPI
from app.routes.travel import router as travel_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(travel_router)

@app.get("/")
def root():
    return {"message": "AI Travel Planner Running"}