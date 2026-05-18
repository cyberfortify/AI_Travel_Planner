const BASE_URL = "http://127.0.0.1:8000";


// ===============================
// GENERATE PLAN
// ===============================
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

    return await response.json();

  } catch (error) {
    console.error("Generate Plan Error:", error);
    throw error;
  }
};


// ===============================
// REGISTER
// ===============================
export const registerUser = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Registration failed");
    }

    return result;

  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};


// ===============================
// LOGIN
// ===============================
export const loginUser = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Login failed");
    }

    return result;

  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};




export const saveTrip = async (data) => {

  try {

    const response = await fetch(
      `${BASE_URL}/save-trip`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail);
    }

    return result;

  } catch (error) {

    console.error(error);

    throw error;
  }
};



// =========================
// GET SAVED TRIPS
// =========================

export const getSavedTrips = async (email) => {

  const response = await fetch(
    `${BASE_URL}/saved-trips/${email}`
  );

  return await response.json();
};


// =========================
// DELETE TRIP
// =========================

export const deleteTrip = async (data) => {

  const response = await fetch(
    `${BASE_URL}/delete-trip`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return await response.json();
};