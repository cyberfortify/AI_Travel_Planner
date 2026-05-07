import random

DESTINATION_PLANS = {

    "goa": [
        {
            "morning": "Enjoy breakfast at a beach cafe near Baga Beach",
            "afternoon": "Relax at Baga Beach and enjoy water sports",
            "night": "Experience Goa nightlife at Tito’s Lane",
            "restaurant": "Britto’s Goa",
            "travel_time": "20 mins",
            "weather": "Sunny"
        },
        {
            "morning": "Visit Fort Aguada and explore the lighthouse",
            "afternoon": "Relax at Candolim Beach",
            "night": "Dinner cruise on Mandovi River",
            "restaurant": "Fisherman’s Wharf",
            "travel_time": "35 mins",
            "weather": "Pleasant"
        },
        {
            "morning": "Shopping at Anjuna Flea Market",
            "afternoon": "Cafe hopping and beach photography",
            "night": "Seafood dinner with live music",
            "restaurant": "Curlies Beach Shack",
            "travel_time": "25 mins",
            "weather": "Cloudy"
        },
        {
            "morning": "Visit Old Goa churches",
            "afternoon": "Explore Panjim streets and cafes",
            "night": "Beachside dinner and live music",
            "restaurant": "Thalassa Goa",
            "travel_time": "30 mins",
            "weather": "Warm"
        }
    ],

    "manali": [
        {
            "morning": "Visit Solang Valley for mountain activities",
            "afternoon": "Adventure sports and cable car ride",
            "night": "Bonfire dinner at mountain resort",
            "restaurant": "Johnson’s Cafe",
            "travel_time": "40 mins",
            "weather": "Cold"
        },
        {
            "morning": "Explore Rohtang Pass snow area",
            "afternoon": "Photography and sightseeing",
            "night": "Relax at riverside cafe",
            "restaurant": "Cafe 1947",
            "travel_time": "1 hour",
            "weather": "Snowy"
        },
        {
            "morning": "Visit Hidimba Temple",
            "afternoon": "Shopping at Mall Road",
            "night": "Cafe hopping in Old Manali",
            "restaurant": "The Lazy Dog",
            "travel_time": "20 mins",
            "weather": "Cool"
        }
    ],

    "kashmir": [
        {
            "morning": "Enjoy Shikara ride on Dal Lake",
            "afternoon": "Explore Mughal Gardens and Srinagar markets",
            "night": "Traditional Kashmiri Wazwan dinner",
            "restaurant": "Ahdoos Restaurant",
            "travel_time": "25 mins",
            "weather": "Cool"
        },
        {
            "morning": "Visit Gulmarg and enjoy gondola ride",
            "afternoon": "Snow activities and mountain photography",
            "night": "Relax at luxury mountain resort",
            "restaurant": "The Khyber Himalayan Resort",
            "travel_time": "2 hours",
            "weather": "Snowy"
        },
        {
            "morning": "Explore Pahalgam valleys",
            "afternoon": "River rafting and sightseeing",
            "night": "Campfire and local dinner",
            "restaurant": "Dana Pani Restaurant",
            "travel_time": "1.5 hours",
            "weather": "Cold"
        },
        {
            "morning": "Visit Sonamarg glacier points",
            "afternoon": "Horse riding and valley exploration",
            "night": "Relax near riverside cottages",
            "restaurant": "Hotel Snowland",
            "travel_time": "2.5 hours",
            "weather": "Chilly"
        }
    ],

    "jaipur": [
        {
            "morning": "Explore Amber Fort and palace",
            "afternoon": "Visit City Palace and Hawa Mahal",
            "night": "Traditional Rajasthani dinner",
            "restaurant": "Chokhi Dhani",
            "travel_time": "30 mins",
            "weather": "Hot"
        },
        {
            "morning": "Shopping at Johari Bazaar",
            "afternoon": "Explore Jal Mahal surroundings",
            "night": "Sunset at Nahargarh Fort",
            "restaurant": "Bar Palladio",
            "travel_time": "25 mins",
            "weather": "Sunny"
        },
        {
            "morning": "Visit Albert Hall Museum",
            "afternoon": "Street food tasting tour",
            "night": "Light show at Amer Fort",
            "restaurant": "Spice Court",
            "travel_time": "35 mins",
            "weather": "Warm"
        }
    ],

    "kerala": [
        {
            "morning": "Enjoy Alleppey backwater boat ride",
            "afternoon": "Relax at houseboat stay",
            "night": "Authentic Kerala seafood dinner",
            "restaurant": "Grand Pavilion",
            "travel_time": "45 mins",
            "weather": "Humid"
        },
        {
            "morning": "Explore Munnar tea gardens",
            "afternoon": "Visit waterfalls and valleys",
            "night": "Campfire in hill resort",
            "restaurant": "Rapsy Restaurant",
            "travel_time": "1 hour",
            "weather": "Cool"
        },
        {
            "morning": "Relax at Kovalam Beach",
            "afternoon": "Ayurvedic spa therapy",
            "night": "Beachside candlelight dinner",
            "restaurant": "The Terrace",
            "travel_time": "30 mins",
            "weather": "Pleasant"
        }
    ],

    "mumbai": [
        {
            "morning": "Visit Gateway of India and Taj Hotel",
            "afternoon": "Explore Colaba Causeway shopping",
            "night": "Marine Drive night walk",
            "restaurant": "Leopold Cafe",
            "travel_time": "25 mins",
            "weather": "Humid"
        },
        {
            "morning": "Street food tour at Juhu Beach",
            "afternoon": "Explore Bandra cafes and streets",
            "night": "Mumbai nightlife experience",
            "restaurant": "Bastian Mumbai",
            "travel_time": "40 mins",
            "weather": "Warm"
        },
        {
            "morning": "Visit Siddhivinayak Temple",
            "afternoon": "Explore Phoenix Mall",
            "night": "Dinner with skyline views",
            "restaurant": "Aer Rooftop",
            "travel_time": "35 mins",
            "weather": "Cloudy"
        }
    ],

    "delhi": [
        {
            "morning": "Visit India Gate and Rashtrapati Bhavan",
            "afternoon": "Explore Connaught Place",
            "night": "Street food at Chandni Chowk",
            "restaurant": "Karim's",
            "travel_time": "30 mins",
            "weather": "Warm"
        },
        {
            "morning": "Visit Qutub Minar",
            "afternoon": "Cafe hopping at Hauz Khas",
            "night": "Nightlife at Cyber Hub",
            "restaurant": "Social Hauz Khas",
            "travel_time": "45 mins",
            "weather": "Sunny"
        },
        {
            "morning": "Explore Red Fort",
            "afternoon": "Visit Akshardham Temple",
            "night": "Dinner in Connaught Place",
            "restaurant": "Tamasha CP",
            "travel_time": "35 mins",
            "weather": "Pleasant"
        }
    ],

    "dubai": [
        {
            "morning": "Visit Burj Khalifa observation deck",
            "afternoon": "Dubai Mall shopping experience",
            "night": "Dubai Fountain show and dinner",
            "restaurant": "At.mosphere Dubai",
            "travel_time": "20 mins",
            "weather": "Hot"
        },
        {
            "morning": "Desert safari adventure",
            "afternoon": "Camel riding and dune bashing",
            "night": "Traditional Arabian dinner",
            "restaurant": "Al Hadheerah",
            "travel_time": "1 hour",
            "weather": "Dry"
        },
        {
            "morning": "Relax at Palm Jumeirah",
            "afternoon": "Explore Atlantis Aquaventure",
            "night": "Luxury yacht dinner cruise",
            "restaurant": "Nobu Dubai",
            "travel_time": "35 mins",
            "weather": "Sunny"
        }
    ],

    "bali": [
        {
            "morning": "Visit Ubud Monkey Forest",
            "afternoon": "Explore Bali rice terraces",
            "night": "Beach club dinner at Seminyak",
            "restaurant": "Potato Head Beach Club",
            "travel_time": "45 mins",
            "weather": "Tropical"
        },
        {
            "morning": "Relax at Nusa Dua Beach",
            "afternoon": "Water sports and parasailing",
            "night": "Sunset dinner by the beach",
            "restaurant": "Sundara Bali",
            "travel_time": "30 mins",
            "weather": "Sunny"
        },
        {
            "morning": "Visit Tanah Lot Temple",
            "afternoon": "Cafe hopping in Canggu",
            "night": "Live music and nightlife",
            "restaurant": "La Brisa Bali",
            "travel_time": "40 mins",
            "weather": "Pleasant"
        }
    ],

    "switzerland": [
        {
            "morning": "Train journey through Swiss Alps",
            "afternoon": "Explore Interlaken valleys",
            "night": "Dinner with mountain views",
            "restaurant": "Harder Kulm Restaurant",
            "travel_time": "2 hours",
            "weather": "Cold"
        },
        {
            "morning": "Visit Jungfraujoch Top of Europe",
            "afternoon": "Snow activities and sightseeing",
            "night": "Relax at alpine resort",
            "restaurant": "Restaurant Aletsch",
            "travel_time": "3 hours",
            "weather": "Snowy"
        },
        {
            "morning": "Explore Zurich old town",
            "afternoon": "Shopping and lake walk",
            "night": "Swiss chocolate tasting dinner",
            "restaurant": "Swiss Chuchi",
            "travel_time": "35 mins",
            "weather": "Cool"
        }
    ],
    "thailand": [
    {
        "morning": "Relax at Phuket beaches and island views",
        "afternoon": "Enjoy water sports and parasailing",
        "night": "Experience Bangkok nightlife and street markets",
        "restaurant": "Baan Rim Pa Phuket",
        "travel_time": "45 mins",
        "weather": "Tropical"
    },
    {
        "morning": "Visit Phi Phi Islands by speedboat",
        "afternoon": "Snorkeling and beach photography",
        "night": "Seafood dinner by the beach",
        "restaurant": "Kan Eang Seafood",
        "travel_time": "2 hours",
        "weather": "Sunny"
    },
    {
        "morning": "Explore Grand Palace Bangkok",
        "afternoon": "Shopping at floating markets",
        "night": "Dinner cruise on Chao Phraya River",
        "restaurant": "Sirocco Bangkok",
        "travel_time": "35 mins",
        "weather": "Warm"
    }
],
"paris": [
    {
        "morning": "Visit Eiffel Tower and Seine River",
        "afternoon": "Explore Louvre Museum",
        "night": "Dinner near Champs-Élysées",
        "restaurant": "Le Jules Verne",
        "travel_time": "30 mins",
        "weather": "Cool"
    },
    {
        "morning": "Walk through Montmartre streets",
        "afternoon": "Shopping at Galeries Lafayette",
        "night": "Paris night cruise experience",
        "restaurant": "Café de Flore",
        "travel_time": "25 mins",
        "weather": "Pleasant"
    },
    {
        "morning": "Visit Notre-Dame Cathedral",
        "afternoon": "Relax at Luxembourg Gardens",
        "night": "French cuisine tasting dinner",
        "restaurant": "Le Relais de l’Entrecôte",
        "travel_time": "20 mins",
        "weather": "Sunny"
    }
],
"ladakh": [
    {
        "morning": "Visit Pangong Lake and mountain views",
        "afternoon": "Photography and lakeside exploration",
        "night": "Campfire dinner under stars",
        "restaurant": "The Tibetan Kitchen",
        "travel_time": "3 hours",
        "weather": "Cold"
    },
    {
        "morning": "Explore Nubra Valley dunes",
        "afternoon": "Camel safari and sightseeing",
        "night": "Stay at mountain campsite",
        "restaurant": "Bon Appetit Leh",
        "travel_time": "2.5 hours",
        "weather": "Windy"
    },
    {
        "morning": "Visit Magnetic Hill",
        "afternoon": "Explore Leh Palace and monasteries",
        "night": "Traditional Ladakhi dinner",
        "restaurant": "Gesmo Restaurant",
        "travel_time": "1 hour",
        "weather": "Cool"
    }
],
"shimla": [
    {
        "morning": "Walk through Mall Road Shimla",
        "afternoon": "Visit Kufri adventure park",
        "night": "Dinner with mountain views",
        "restaurant": "Cafe Simla Times",
        "travel_time": "40 mins",
        "weather": "Cold"
    },
    {
        "morning": "Explore Jakhoo Temple",
        "afternoon": "Photography and sightseeing",
        "night": "Bonfire at hillside resort",
        "restaurant": "Wake & Bake Cafe",
        "travel_time": "30 mins",
        "weather": "Cool"
    },
    {
        "morning": "Toy train experience",
        "afternoon": "Shopping at Lakkar Bazaar",
        "night": "Relax at luxury mountain stay",
        "restaurant": "Eighteen71 Cookhouse",
        "travel_time": "35 mins",
        "weather": "Pleasant"
    }
],
"udaipur": [
    {
        "morning": "Visit City Palace Udaipur",
        "afternoon": "Boat ride on Lake Pichola",
        "night": "Dinner with lake view",
        "restaurant": "Ambrai Restaurant",
        "travel_time": "25 mins",
        "weather": "Warm"
    },
    {
        "morning": "Explore Sajjangarh Monsoon Palace",
        "afternoon": "Photography and sightseeing",
        "night": "Cultural dance evening",
        "restaurant": "Upre by 1559 AD",
        "travel_time": "40 mins",
        "weather": "Sunny"
    },
    {
        "morning": "Shopping for handicrafts and textiles",
        "afternoon": "Visit Jag Mandir",
        "night": "Luxury rooftop dinner",
        "restaurant": "Tribute Restaurant",
        "travel_time": "20 mins",
        "weather": "Pleasant"
    }
],
"rishikesh": [
    {
        "morning": "Attend yoga session near Ganga River",
        "afternoon": "River rafting adventure",
        "night": "Ganga Aarti at Triveni Ghat",
        "restaurant": "The Sitting Elephant",
        "travel_time": "25 mins",
        "weather": "Pleasant"
    },
    {
        "morning": "Visit Lakshman Jhula",
        "afternoon": "Cafe hopping and shopping",
        "night": "Relax at riverside camp",
        "restaurant": "Little Buddha Cafe",
        "travel_time": "20 mins",
        "weather": "Cool"
    },
    {
        "morning": "Explore Beatles Ashram",
        "afternoon": "Meditation and nature walk",
        "night": "Bonfire dinner at camp",
        "restaurant": "Bistro Nirvana",
        "travel_time": "35 mins",
        "weather": "Warm"
    }
],


}


def generate_itinerary(destination: str, days: int):

    destination = destination.lower()

    plans = DESTINATION_PLANS.get(destination)

    if not plans:
        plans = [
            {
                "morning": "Explore famous attractions",
                "afternoon": "Try local food and shopping",
                "night": "Relax and enjoy nightlife",
                "restaurant": "Popular Local Restaurant",
                "travel_time": "20 mins",
                "weather": "Pleasant"
            }
        ]

    itinerary = []

    used_combinations = set()

    for i in range(days):

        attempts = 0

        while attempts < 10:

            selected = random.choice(plans)

            combo = (
                selected["morning"],
                selected["afternoon"],
                selected["night"]
            )

            if combo not in used_combinations:
                used_combinations.add(combo)
                break

            attempts += 1

        itinerary.append({
            "day": i + 1,
            "morning": selected["morning"],
            "afternoon": selected["afternoon"],
            "night": selected["night"],
            "restaurant": selected["restaurant"],
            "travel_time": selected["travel_time"],
            "weather": selected["weather"]
        })

    return itinerary