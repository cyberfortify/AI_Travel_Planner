import json

def get_hotels():
    try:
        with open("app/data/hotels.json", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def filter_hotels_by_budget(hotels, max_price, destination):

    destination = destination.lower()

    # destination-based hotels
    destination_hotels = [
        hotel for hotel in hotels
        if hotel["location"].lower() == destination
    ]

    # budget filter
    filtered = [
        hotel for hotel in destination_hotels
        if hotel["price"] <= max_price
    ]

    # fallback
    if not filtered:
        filtered = sorted(
            destination_hotels,
            key=lambda x: x["price"]
        )[:3]

    return filtered