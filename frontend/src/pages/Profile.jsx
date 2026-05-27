import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSavedTrips, deleteTrip } from "../services/api";
import Navbar from "../components/Navbar";

function useWindowWidth() {
  const [w, setW] = useState(
    typeof window !== "undefined"
      ? window.innerWidth
      : 1200
  );

  useEffect(() => {

    const h = () =>
      setW(window.innerWidth);

    window.addEventListener("resize", h);

    return () =>
      window.removeEventListener(
        "resize",
        h
      );

  }, []);

  return w;
}

const BADGES = [
  { label: "First Trip", icon: "🚀", earned: true },
  { label: "Budget Master", icon: "💰", earned: true },
  { label: "Explorer", icon: "🧭", earned: true },
  { label: "5 Trips", icon: "🗺️", earned: true },
  { label: "Mountain Lover", icon: "🏔️", earned: false },
  { label: "Beach Hopper", icon: "🏖️", earned: false },
];

const NAV_LINKS = [
  { n: "Home", p: "/" },
  { n: "About", p: "/about" },
  { n: "Help", p: "/contact" },
];

export default function Profile() {

  const w = useWindowWidth();

  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const px =
    isMobile
      ? "18px"
      : isTablet
        ? "32px"
        : "52px";

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [showLogoutConfirm,
    setShowLogoutConfirm] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("govibeUser")
  ) || {};

  const [savedTrips, setSavedTrips] =
    useState([]);

  useEffect(() => {

    const loadTrips = async () => {

      if (!user?.email) return;

      try {

        const data =
          await getSavedTrips(
            user.email
          );

        setSavedTrips(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {
        console.error(err);
      }
    };

    loadTrips();

  }, [user?.email]);

  const initial =
    user?.name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {

    localStorage.removeItem(
      "govibeUser"
    );

    window.dispatchEvent(
      new Event("storage")
    );

    setShowLogoutConfirm(false);

    window.location.href = "/";
  };

  const handleDeleteTrip = async (
    destination
  ) => {

    try {

      await deleteTrip({
        user_email: user.email,
        destination
      });

      setSavedTrips(prev =>
        prev.filter(
          item =>
            item.trip.destination !== destination
        )
      );

    } catch (err) {

      console.error(err);

    }

  };


  const handleViewTrip = trip => {

    localStorage.setItem(
      "selectedTrip",
      JSON.stringify(trip)
    );

    window.location.href =
      "/planner";

  };

  const RECENT_TRIPS =
    savedTrips.map(item => {

      const trip = item.trip;

      return {
        dest: trip.destination,

        days: trip.itinerary.length,

        budget: `₹${Object.values(
          trip.budget
        )
          .reduce((a, b) => a + b, 0)
          .toLocaleString()}`,

        date: "Recently Saved",

        status: "Saved",

        emoji: "✈️",

        color: "#00d4e0",
      };
    });


  const progress = Math.min(
    savedTrips.length * 20,
    100
  );

  const travelerLevel =
    savedTrips.length < 3
      ? "Explorer"

      : savedTrips.length < 8
        ? "Traveler"

        : "Globetrotter";

  const STATS = [
    {
      label: "Trips Planned",
      value: savedTrips.length,
      icon: "🗺️",
      color: "#00d4e0",
      sub: "Saved journeys",
    },

    {
      label: "Destinations",

      value: new Set(
        savedTrips.map(
          t => t.trip.destination
        )
      ).size,

      icon: "📍",
      color: "#6366f1",
      sub: "Unique places",
    },

    {
      label: "Budget Planned",

      value: `₹${savedTrips
        .reduce((acc, item) => {

          const total =
            Object.values(
              item.trip.budget
            ).reduce((a, b) => a + b, 0);

          return acc + total;

        }, 0)
        .toLocaleString()}`,

      icon: "💰",
      color: "#10b981",
      sub: "Total travel budget",
    },

    {
      label: "Days Planned",

      value: savedTrips.reduce(
        (acc, item) =>
          acc +
          item.trip.itinerary.length,
        0
      ),

      icon: "📅",
      color: "#f59e0b",
      sub: "Across all trips",
    },
  ];

  const TABS = [
    "overview",
    "trips",
    "badges",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060d18",
        color: "#fff",
        overflowX: "hidden",
      }}
    >

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: `36px ${px} 80px`,
        }}
      >

        {/* HERO */}
        <div
          style={{
            borderRadius: 28,
            background: ` linear-gradient(rgba(5,10,20,.72),rgba(5,10,20,.95)), url("https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg")center/cover`,

            border:
              "1px solid rgba(255,255,255,0.07)",

            padding:
              isMobile
                ? 24
                : 36,

            marginBottom: 28,

            overflow: "hidden"
          }}
        >

          <div
            style={{
              display: "flex",
              flexDirection:
                isMobile
                  ? "column"
                  : "row",

              justifyContent: "space-between",

              alignItems:
                isMobile
                  ? "center"
                  : "center",

              gap: isMobile ? 24 : 20
            }}
          >

            <div
              style={{
                display: "flex",

                flexDirection:
                  isMobile
                    ? "column"
                    : "row",

                alignItems: "center",

                textAlign:
                  isMobile
                    ? "center"
                    : "left",

                gap: 20,

                width: "100%"
              }}
            >

              {/* AVATAR */}
              <div
                style={{
                  position: "relative",

                  width:
                    isMobile ? 88 : 110,

                  height:
                    isMobile ? 88 : 110,

                  borderRadius: "50%",

                  padding: 4,

                  background:
                    "linear-gradient(135deg, #00d4e0, #2563eb, #8b5cf6)",
                  boxShadow:
                    "0 10px 40px rgba(0,212,224,.25)"
                }}
              >

                <div
                  style={{
                    width: "100%",
                    height: "100%",

                    borderRadius: "50%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background:
                      "rgba(8,15,28,.95)",

                    backdropFilter:
                      "blur(20px)",

                    fontSize:
                      isMobile ? 30 : 40,

                    fontWeight: 900,

                    color: "#fff",

                    overflow: "hidden"
                  }}
                >

                  {initial}

                </div>

              </div>

              {/* INFO */}
              <div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: 6,
                  }}
                >

                  <h1
                    style={{
                      margin: 0,
                      fontSize:
                        isMobile
                          ? 22
                          : 32,
                      fontWeight: 900,
                    }}
                  >
                    {user.name}
                  </h1>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding:
                        "4px 10px",
                      borderRadius: 999,
                      background:
                        "rgba(245,158,11,0.15)",
                      color: "#f59e0b",
                    }}
                  >
                    ✦ {
                      savedTrips.length > 3
                        ? "Premium"
                        : "Traveler"
                    }
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 14,
                    color:
                      "rgba(255,255,255,0.45)",
                    margin:
                      "0 0 6px",
                  }}
                >
                  {user.email}
                </p>

                <p
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.25)",
                    margin: 0,
                  }}
                >
                  Member since 2026
                </p>

                {/* PROGRESS */}
                <div
                  style={{
                    marginTop: 18,
                    width:
                      isMobile
                        ? "100%"
                        : "300px"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8
                    }}
                  >

                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,.45)"
                      }}
                    >

                      {travelerLevel}

                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        color: "#00d4e0"
                      }}
                    >

                      {progress}%

                    </span>

                  </div>

                  <div
                    style={{
                      height: 8,
                      background:
                        "rgba(255,255,255,.08)",
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >

                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",

                        background:
                          "linear-gradient(90deg,#00d4e0,#2563eb)"
                      }}
                    />

                  </div>

                </div>
              </div>
            </div>

            {/* LOGOUT */}
            <button
              onClick={() =>
                setShowLogoutConfirm(
                  true
                )
              }
              style={{

                width:
                  isMobile
                    ? "100%"
                    : "auto",

                maxWidth:
                  isMobile
                    ? 220
                    : "none",

                padding: "12px 18px",

                borderRadius: 14,

                border:
                  "1px solid rgba(239,68,68,0.3)",

                background:
                  "rgba(239,68,68,0.08)",

                color: "#f87171",

                fontWeight: 700,

                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr 1fr"
                : "repeat(4,1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >

          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                borderRadius: 20,
                background:
                  "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.07)",
                padding: 20,
              }}
            >

              <div
                style={{
                  fontSize: 24,
                  marginBottom: 10,
                }}
              >
                {s.icon}
              </div>

              <h2
                style={{
                  margin:
                    "0 0 4px",
                  fontSize:
                    isMobile
                      ? 22
                      : 28,
                }}
              >
                {s.value}
              </h2>

              <p
                style={{
                  margin:
                    "0 0 3px",
                  color:
                    "rgba(255,255,255,0.6)",
                  fontSize: 12,
                }}
              >
                {s.label}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  color: s.color,
                }}
              >
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {TABS.map(t => (
            <button
              key={t}
              onClick={() =>
                setActiveTab(t)
              }
              style={{
                padding:
                  "10px 18px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background:
                  activeTab === t
                    ? "linear-gradient(135deg,#00c8d4,#2563eb)"
                    : "rgba(255,255,255,0.04)",
                color:
                  activeTab === t
                    ? "#fff"
                    : "rgba(255,255,255,0.45)",
                fontWeight: 700,
                textTransform:
                  "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab ===
          "overview" && (

            <div
              style={{
                borderRadius: 24,
                background:
                  "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.07)",
                padding: 24,
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 20px",
                }}
              >
                Recent Trips
              </h3>

              {RECENT_TRIPS.length === 0 ? (

                <div
                  style={{
                    padding: 40,
                    textAlign:
                      "center",
                    color:
                      "rgba(255,255,255,0.4)",
                  }}
                >
                  No saved trips yet ✈️
                </div>

              ) : RECENT_TRIPS.map(
                (t, i) => (

                  <div
                    key={i}
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      background:
                        "rgba(255,255,255,0.03)",
                      border:
                        "1px solid rgba(255,255,255,0.05)",
                      marginBottom: 12,
                    }}
                  >

                    <h4
                      style={{
                        margin:
                          "0 0 6px",
                      }}
                    >
                      {t.dest}
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 12,
                        color:
                          "rgba(255,255,255,0.45)",
                      }}
                    >
                      {t.days} days • {t.budget}
                    </p>
                  </div>
                )
              )}
            </div>
          )}


        {/* SAVED TRIPS */}
        {activeTab === "trips" && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile
                  ? "1fr"
                  : "repeat(auto-fit,minmax(320px,1fr))",

              gap: 20
            }}
          >

            {savedTrips.length === 0 ? (

              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  borderRadius: 20,
                  background:
                    "rgba(255,255,255,.03)"
                }}
              >

                No saved trips yet ✈️

              </div>

            ) : (

              savedTrips.map((item, i) => {

                const trip = item.trip;

                const total =
                  Object.values(
                    trip.budget
                  )
                    .reduce((a, b) => a + b, 0);

                return (

                  <div
                    key={i}

                    style={{
                      padding: 22,

                      borderRadius: 24,

                      background:
                        "rgba(255,255,255,.03)",

                      border:
                        "1px solid rgba(255,255,255,.06)"
                    }}
                  >

                    <p
                      style={{
                        fontSize: 11,
                        color: "#00d4e0"
                      }}
                    >

                      Saved Journey

                    </p>

                    <h3
                      style={{
                        margin: "10px 0"
                      }}
                    >

                      🌍 {trip.destination}

                    </h3>

                    <p
                      style={{
                        fontSize: 13,
                        color:
                          "rgba(255,255,255,.45)"
                      }}
                    >

                      {trip.itinerary.length}
                      days •
                      ₹{total.toLocaleString()}

                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 20
                      }}
                    >

                      <button

                        onClick={() =>
                          handleViewTrip(trip)
                        }

                        style={{
                          flex: 1,
                          padding: 12,
                          border: "none",
                          borderRadius: 12,

                          background:
                            "linear-gradient(135deg,#00c8d4,#2563eb)",

                          color: "#fff",

                          fontWeight: 700,

                          cursor: "pointer"
                        }}
                      >

                        View

                      </button>

                      <button

                        onClick={() =>
                          handleDeleteTrip(
                            trip.destination
                          )
                        }

                        style={{
                          flex: 1,
                          padding: 12,

                          borderRadius: 12,

                          border:
                            "1px solid rgba(255, 80, 80, .2)",

                          background:
                            "rgba(255,80,80,.08)",

                          color: "#ff8080",

                          cursor: "pointer"
                        }}
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                )

              })

            )}

          </div>

        )}

        {/* BADGES */}
        {activeTab === "badges" && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile
                  ? "1fr 1fr"
                  : "repeat(3,1fr)",
              gap: 16
            }}
          >

            {BADGES.map((b, i) => (

              <div
                key={i}

                style={{
                  padding: 20,

                  borderRadius: 20,

                  background:
                    "rgba(255,255,255,.03)",

                  border:
                    "1px solid rgba(255,255,255,.06)",

                  opacity:
                    b.earned
                      ? 1
                      : .35
                }}
              >

                <div
                  style={{
                    fontSize: 34,
                    marginBottom: 10
                  }}
                >
                  {b.icon}
                </div>

                <h4
                  style={{
                    margin: "0 0 5px"
                  }}
                >
                  {b.label}
                </h4>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color:
                      b.earned
                        ? "#10b981"
                        : "rgba(255,255,255,.4)"
                  }}
                >

                  {b.earned
                    ? "Unlocked"
                    : "Locked"}

                </p>

              </div>

            ))}

          </div>

        )}
      </div>

      {/* LOGOUT MODAL */}
      {
        showLogoutConfirm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              zIndex: 100,
            }}
          >

            <div
              style={{
                width: 340,
                borderRadius: 24,
                background: "#0d1a2d",
                padding: 28,
                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 10px",
                }}
              >
                Logout?
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                You'll need to sign
                in again to access
                your trips.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                }}
              >

                <button
                  onClick={() =>
                    setShowLogoutConfirm(
                      false
                    )
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background:
                      "rgba(255,255,255,0.04)",
                    color:
                      "rgba(255,255,255,0.6)",
                    cursor:
                      "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleLogout
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    border: "none",
                    background:
                      "rgba(239,68,68,0.12)",
                    color: "#f87171",
                    fontWeight: 700,
                    cursor:
                      "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}