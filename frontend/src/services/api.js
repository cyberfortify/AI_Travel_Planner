const BASE_URL = "http://127.0.0.1:8000"; // FastAPI URL

export const generatePlan = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to generate plan");
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};