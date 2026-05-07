def calculate_budget(total_budget: int):
    return {
        "travel": int(total_budget * 0.4),
        "hotel": int(total_budget * 0.3),
        "food": int(total_budget * 0.2),
        "misc": int(total_budget * 0.1)
    }