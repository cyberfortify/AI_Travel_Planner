import {
    useEffect,
    useState,
} from "react";

import {
    Navigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getSavedTrips,
    deleteTrip,
} from "../services/api";

export default function SavedTrips() {

    const user = JSON.parse(
        localStorage.getItem("govibeUser")
    );

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!user) {
        return <Navigate to="/" />;
    }

    const loadTrips = async () => {

        try {

            const data = await getSavedTrips(
                user.email
            );

            setTrips(Array.isArray(data) ? data : []);
            setLoading(false);

        } catch (err) {
            console.error(err);
            setTrips([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrips();
    }, []);

    const handleDelete = async (destination) => {

        try {

            await deleteTrip({
                user_email: user.email,
                destination,
            });

            loadTrips();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg,#07111f,#0b1220)",
                padding: 24,
            }}
        >

            <Navbar />

            <div
                style={{
                    maxWidth: 1300,
                    margin: "120px auto 0",
                }}
            >

                {/* TOP */}
                <div
                    style={{
                        marginBottom: 40,
                    }}
                >

                    <p
                        style={{
                            color: "rgba(0,212,224,0.7)",
                            letterSpacing: 1,
                            textTransform: "uppercase",
                            fontSize: 12,
                            fontWeight: 700,
                            marginBottom: 8,
                        }}
                    >
                        Your Collection
                    </p>

                    <h1
                        style={{
                            color: "#fff",
                            fontSize: "clamp(2.5rem,5vw,4rem)",
                            margin: 0,
                            fontWeight: 900,
                        }}
                    >
                        Saved Trips
                    </h1>
                </div>

                {loading ? (
                    <div
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            padding: 80,
                            fontSize: 18,
                        }}
                    >
                        Loading trips...
                    </div>
                ) : trips.length === 0 ? (
                    <div
                        style={{
                            background:
                                "rgba(255,255,255,0.04)",
                            border:
                                "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 28,
                            padding: 50,
                            textAlign: "center",
                        }}
                    >
                        <h2
                            style={{
                                color: "#fff",
                            }}
                        >
                            No saved trips yet
                        </h2>

                        <p
                            style={{
                                color: "rgba(255,255,255,0.45)",
                            }}
                        >
                            Start planning and save your journeys.
                        </p>
                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(320px,1fr))",
                            gap: 24,
                        }}
                    >

                        {trips.map((item, i) => {

                            const trip = item.trip;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.04)",
                                        border:
                                            "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: 28,
                                        padding: 28,
                                        backdropFilter: "blur(18px)",
                                    }}
                                >

                                    <p
                                        style={{
                                            color:
                                                "rgba(0,212,224,0.75)",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: 1,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Saved Journey
                                    </p>

                                    <h2
                                        style={{
                                            color: "#fff",
                                            margin: "8px 0 16px",
                                            fontSize: 30,
                                            fontWeight: 800,
                                        }}
                                    >
                                        {trip.destination}
                                    </h2>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 14,
                                            flexWrap: "wrap",
                                            marginBottom: 24,
                                        }}
                                    >

                                        <div style={pill}>
                                            {trip.itinerary.length} Days
                                        </div>

                                        <div style={pill}>
                                            ₹{Object.values(trip.budget)
                                                .reduce((a, b) => a + b, 0)
                                                .toLocaleString()}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                trip.destination
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            padding: 14,
                                            borderRadius: 16,
                                            border:
                                                "1px solid rgba(255,255,255,0.08)",
                                            background:
                                                "rgba(255,80,80,0.08)",
                                            color: "#ff7f7f",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete Trip
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

const pill = {
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
};