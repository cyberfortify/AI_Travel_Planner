const TRAVEL_STYLES = [
  {
    label: "Luxury",
    icon: "✨",
    color: "#f59e0b",
  },

  {
    label: "Adventure",
    icon: "⛰",
    color: "#10b981",
  },

  {
    label: "Relaxed",
    icon: "🌴",
    color: "#00d4e0",
  },

  {
    label: "Couple",
    icon: "❤️",
    color: "#ec4899",
  },

  {
    label: "Backpacker",
    icon: "🎒",
    color: "#8b5cf6",
  },

  {
    label: "Nightlife",
    icon: "🌃",
    color: "#6366f1",
  },
];

export default function TravelPersonality({
  travelStyle,
  setTravelStyle,
  isMobile,
}) {

  return (

    <div
      style={{
        marginBottom: 36,
      }}
    >

      {/* Heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
          gap: 12,
          flexWrap: "wrap",
        }}
      >

        <div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#00d4e0",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              margin: "0 0 6px",
            }}
          >
            AI PERSONALIZATION
          </p>

          <h2
            style={{
              color: "#fff",
              fontSize: isMobile ? 22 : 30,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Choose Your Vibe
          </h2>

        </div>

        <p
          style={{
            color: "rgba(255,255,255,.35)",
            fontSize: 13,
            maxWidth: 320,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Personalize hotels, pacing and
          itinerary experience instantly.
        </p>

      </div>

      {/* STYLE CHIPS */}
      <div
        style={{

          display: "grid",

          gridTemplateColumns:

            isMobile
              ? "1fr 1fr"
              : "repeat(auto-fit,minmax(180px,1fr))",

          gap:
            isMobile
              ? 10
              : 14,
        }}
      >

        {TRAVEL_STYLES.map((style) => {

          const active =
            travelStyle === style.label;

          return (

            <button
              key={style.label}

              onClick={() =>
                setTravelStyle(style.label)
              }

              style={{

                display: "flex",
                width: "100%",
                alignItems:

                  isMobile
                    ? "flex-start"
                    : "center",
                gap: 10,

                padding:

                  isMobile
                    ? "14px"
                    : "14px 18px",

                borderRadius: 18,

                border: active
                  ? `1px solid ${style.color}`
                  : "1px solid rgba(255,255,255,.06)",

                background: active
                  ? `${style.color}20`
                  : "rgba(255,255,255,.03)",

                color:
                  active
                    ? "#fff"
                    : "rgba(255,255,255,.65)",

                cursor: "pointer",

                transition: "all .25s ease",

                boxShadow: active
                  ? `0 0 25px ${style.color}30`
                  : "none",

                backdropFilter: "blur(14px)",
              }}
            >

              <span
                style={{
                  fontSize: 18,
                }}
              >
                {style.icon}
              </span>

              <div
                style={{
                  textAlign: "left",
                }}
              >

                <p
                  style={{
                    margin: 0,
                    fontSize:
                      isMobile
                        ? 13
                        : 14,
                    fontWeight: 700,
                  }}
                >
                  {style.label}
                </p>

                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 11,
                    color:
                      active
                        ? "rgba(255,255,255,.75)"
                        : "rgba(255,255,255,.3)",
                  }}
                >
                  AI optimized
                </p>

              </div>

            </button>
          );

        })}

      </div>
    </div>
  );
}