import random


HOTEL_NAME_MAP = {

    "goa": [
        "Azure Bay Resort",
        "Casa Del Mar Goa",
        "Sunset Palm Retreat",
        "Velvet Coast Suites",
        "Coconut Lagoon Resort"
    ],

    "manali": [
        "Snowcrest Retreat",
        "The Cedar Heights",
        "Alpine Valley Lodge",
        "Himalayan Crown Resort",
        "Pinewood Escape"
    ],

    "jaipur": [
        "Raj Mahal Palace",
        "Amber Fort Residency",
        "Pink City Haveli",
        "The Royal Courtyard",
        "Heritage Crown Jaipur"
    ],

    "mumbai": [
        "The Metropolitan Residency",
        "Marine Drive Suites",
        "Skyline Grand Mumbai",
        "Harbor Crown Hotel",
        "The Bombay Royale"
    ],

    "delhi": [
        "Imperial Horizon Delhi",
        "The Capital Crown",
        "Urban Luxe Residency",
        "Royal Heritage Delhi",
        "Skyline Palace Delhi"
    ],

    "kerala": [
        "Emerald Backwater Resort",
        "Coconut Grove Retreat",
        "Munnar Valley Escape",
        "The Spice Route Resort",
        "Lakeview Kerala Suites"
    ],

    "shimla": [
        "Whispering Pines Resort",
        "The Snow Valley Retreat",
        "Cedar Peak Lodge",
        "Himalayan Breeze Hotel",
        "The Ridge Crown"
    ],

    "udaipur": [
        "Lake Palace Udaipur",
        "Royal Rajputana Retreat",
        "The Lakeview Haveli",
        "Heritage Crown Udaipur",
        "The Royal Courtyard"
    ],

    "dubai": [
        "Royal Mirage Dubai",
        "Skyline Palace Dubai",
        "Golden Dunes Resort",
        "Palm Crescent Hotel",
        "Burj View Suites"
    ],

    "bali": [
        "Ubud Serenity Resort",
        "Tropical Lagoon Villas",
        "Bali Sunset Retreat",
        "Palm Haven Bali",
        "Ocean Breeze Ubud"
    ],

    "kashmir": [
        "The Gulmarg Palace",
        "Snow Valley Kashmir",
        "Dal Lake Residency",
        "Kashmir Horizon Retreat",
        "The Himalayan Willow"
    ],

    "thailand": [
        "Bangkok Skyline Resort",
        "Phuket Ocean Retreat",
        "Golden Orchid Suites",
        "Island Breeze Thailand",
        "Royal Siam Escape"
    ],

    "paris": [
        "Eiffel Royale Paris",
        "The Seine Palace",
        "Parisian Crown Suites",
        "Louvre Grand Residency",
        "Maison Lumière"
    ],

    "switzerland": [
        "Alpine Crown Resort",
        "Swiss Glacier Retreat",
        "The Zurich Grand",
        "Matterhorn Valley Lodge",
        "Snowpeak Switzerland"
    ],

    "ladakh": [
        "Leh Mountain Escape",
        "Pangong Horizon Camp",
        "The Himalayan Nomad",
        "Ladakh Valley Retreat",
        "Snow Desert Residency"
    ],

    "rishikesh": [
        "Ganga Soul Retreat",
        "The Yoga Valley",
        "Riverside Serenity Resort",
        "Himalayan Peace Ashram",
        "Sacred Flow Residency"
    ]
}


DESTINATION_DATA = {

    "goa": {
        "nearby": [
            "Baga Beach",
            "Fort Aguada",
            "Anjuna Market",
            "Calangute Beach"
        ],

        "vibes": [
            "Beachfront",
            "Nightlife",
            "Luxury Escape",
            "Sunset Views"
        ],

        "distances": [
            "500m from beach",
            "1.2 km from Baga Beach",
            "2 km from city center"
        ],

        "reasons": [
            "Perfect for beach lovers and nightlife experiences.",
            "Recommended for premium coastal stays with ocean views.",
            "Ideal for relaxing beach vacations within your budget."
        ],

        "amenities": [
            "Beach Access",
            "Pool",
            "Ocean View",
            "Spa",
            "Free WiFi",
            "Fine Dining",
            "Breakfast"
        ]
    },

    "manali": {
        "nearby": [
            "Solang Valley",
            "Mall Road",
            "Rohtang Pass",
            "Hadimba Temple"
        ],

        "vibes": [
            "Mountain Escape",
            "Adventure",
            "Snow Views",
            "Bonfire Nights"
        ],

        "distances": [
            "800m from Mall Road",
            "2 km from Solang Valley",
            "1.5 km from town center"
        ],

        "reasons": [
            "Ideal for mountain adventures and scenic stays.",
            "Perfect for travelers seeking snow views and comfort.",
            "Recommended for peaceful Himalayan experiences."
        ],

        "amenities": [
            "Mountain View",
            "Bonfire",
            "Spa",
            "Breakfast",
            "Free WiFi",
            "Garden View",
            "Restaurant"
        ]
    },

    "dubai": {
        "nearby": [
            "Burj Khalifa",
            "Dubai Mall",
            "Palm Jumeirah",
            "Marina Walk"
        ],

        "vibes": [
            "Luxury",
            "Skyline Views",
            "Fine Dining",
            "Premium Stay"
        ],

        "distances": [
            "1 km from Downtown Dubai",
            "500m from Marina Walk",
            "2 km from Burj Khalifa"
        ],

        "reasons": [
            "Luxury stay with premium city experiences.",
            "Perfect for skyline views and fine dining.",
            "Recommended for modern luxury travelers."
        ],

        "amenities": [
            "Rooftop Pool",
            "Skyline View",
            "Luxury Spa",
            "Fine Dining",
            "Free WiFi",
            "Valet Parking"
        ]
    },

    "shimla": {
        "nearby": [
            "Mall Road",
            "Jakhoo Temple",
            "The Ridge",
            "Kufri"
        ],

        "vibes": [
            "Mountain View",
            "Cold Weather",
            "Nature Escape",
            "Bonfire"
        ],

        "distances": [
            "1 km from Mall Road",
            "2 km from Kufri",
            "700m from city center"
        ],

        "reasons": [
            "Perfect for peaceful mountain retreats.",
            "Recommended for scenic Himalayan stays.",
            "Ideal for travelers seeking cold weather escapes."
        ],

        "amenities": [
            "Mountain View",
            "Bonfire",
            "Fireplace",
            "Breakfast",
            "Spa",
            "Free WiFi"
        ]
    },

    "kerala": {
        "nearby": [
            "Alleppey Backwaters",
            "Munnar Hills",
            "Kovalam Beach",
            "Tea Gardens"
        ],

        "vibes": [
            "Nature Retreat",
            "Backwaters",
            "Ayurvedic Spa",
            "Luxury Escape"
        ],

        "distances": [
            "900m from backwaters",
            "2 km from tea gardens",
            "1.5 km from beach"
        ],

        "reasons": [
            "Perfect for peaceful nature escapes.",
            "Recommended for relaxing Ayurvedic retreats.",
            "Ideal for backwater and luxury experiences."
        ],

        "amenities": [
            "Backwater View",
            "Ayurvedic Spa",
            "Pool",
            "Breakfast",
            "Free WiFi",
            "Restaurant"
        ]
    }
}


DEFAULT_CONFIG = {
    "nearby": [
        "City Center",
        "Tourist Attraction",
        "Shopping District"
    ],

    "vibes": [
        "Recommended Stay",
        "Comfort",
        "Popular Choice"
    ],

    "distances": [
        "1 km from city center"
    ],

    "reasons": [
        "Recommended stay for your travel preferences."
    ],

    "amenities": [
        "Free WiFi",
        "Breakfast",
        "Restaurant",
        "Parking"
    ]
}


def enrich_hotels(hotels, destination):

    destination = destination.lower()

    config = DESTINATION_DATA.get(
        destination,
        DEFAULT_CONFIG
    )

    name_pool = HOTEL_NAME_MAP.get(
        destination,
        []
    )

    used_names = set()

    for hotel in hotels:

        # UNIQUE HOTEL NAMES
        available_names = [
            n for n in name_pool
            if n not in used_names
        ]

        if available_names:

            selected_name = random.choice(
                available_names
            )

            hotel["name"] = selected_name

            used_names.add(selected_name)

        # REVIEWS
        hotel["reviews"] = random.choice([
            "1.2k",
            "2.4k",
            "3.1k",
            "4.8k",
            "5.6k"
        ])

        # DISTANCE
        hotel["distance"] = random.choice(
            config["distances"]
        )

        # CHECK IN
        hotel["checkIn"] = random.choice([
            "12:00 PM",
            "1:00 PM",
            "2:00 PM"
        ])

        # NEARBY PLACES
        hotel["nearby"] = random.sample(
            config["nearby"],
            min(3, len(config["nearby"]))
        )

        # VIBE TAGS
        hotel["vibeTags"] = random.sample(
            config["vibes"],
            min(3, len(config["vibes"]))
        )

        # AI REASON
        hotel["aiReason"] = random.choice(
            config["reasons"]
        )

        # REALISTIC AMENITIES
        hotel["amenities"] = random.sample(
            config["amenities"],
            min(4, len(config["amenities"]))
        )

        # COORDINATES
        hotel["coordinates"] = {
            "lat": round(
                random.uniform(-90, 90),
                6
            ),

            "lng": round(
                random.uniform(-180, 180),
                6
            )
        }

    return hotels