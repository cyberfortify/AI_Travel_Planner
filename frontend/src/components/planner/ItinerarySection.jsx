import BudgetPanel from "./BudgetPanel";
import { motion } from "framer-motion";

const DAY_ACCENT = [
  "#6366f1",
  "#00d4e0",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

export default function ItinerarySection({

  result,

  activeDay,

  setActiveDay,

  isMobile,

}) {

  return (

    <>

      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          gap: 12,
        }}
      >

        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Day-by-day plan
        </p>

        {/* MOBILE NAV */}
        {isMobile && (

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >

            {/* PREV */}
            <button
              onClick={() =>
                setActiveDay((p) =>
                  Math.max(p - 1, 0)
                )
              }

              disabled={activeDay === 0}

              style={{
                width: 34,
                height: 34,

                borderRadius: 10,

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  activeDay === 0
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.06)",

                color:
                  activeDay === 0
                    ? "rgba(255,255,255,0.2)"
                    : "#fff",

                cursor: "pointer",
              }}
            >
              {"<"}
            </button>

            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                minWidth: 58,
                textAlign: "center",
              }}
            >
              {activeDay + 1}/
              {result.itinerary.length}
            </span>

            {/* NEXT */}
            <button
              onClick={() =>
                setActiveDay((p) =>
                  Math.min(
                    p + 1,
                    result.itinerary.length - 1
                  )
                )
              }

              disabled={
                activeDay ===
                result.itinerary.length - 1
              }

              style={{
                width: 34,
                height: 34,

                borderRadius: 10,

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  activeDay ===
                    result.itinerary.length - 1
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.06)",

                color:
                  activeDay ===
                    result.itinerary.length - 1
                    ? "rgba(255,255,255,0.2)"
                    : "#fff",

                cursor: "pointer",
              }}
            >
              {">"}
            </button>

          </div>
        )}

      </div>

      {/* MAIN LAYOUT */}
      <div
        className="itinerary-layout"

        style={{
          display: "grid",

          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "minmax(0,1fr) 360px",

          gap: 20,

          alignItems: "start",
        }}
      >

        {/* DETAILS PANEL */}
        <div
          style={{
            background:
              "rgba(255,255,255,0.025)",

            border:
              "1px solid rgba(255,255,255,0.05)",

            borderRadius: 24,

            padding:
              isMobile
                ? 18
                : 24,

            minHeight:
              isMobile
                ? "auto"
                : 600,

            maxHeight:
              isMobile
                ? "none"
                : 700,

            overflowY: "auto",

            transition:
              "all .25s ease",

            scrollbarWidth: "thin",

            backdropFilter:
              "blur(14px)",
          }}
        >

          {(() => {

            const item =
              result.itinerary[activeDay];

            const accent =
              DAY_ACCENT[
              activeDay %
              DAY_ACCENT.length
              ];

            return (

              <div
                style={{
                  height: "100%",

                  display: "flex",

                  flexDirection: "column",
                }}
              >

                {/* HEADER */}
                <div
                  style={{
                    marginBottom:
                      isMobile
                        ? 18
                        : 24
                  }}
                >

                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: accent,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      margin: "0 0 8px",
                    }}
                  >
                    {result.destination}
                    {" • "}
                    Day {item.day}
                  </p>

                  <h2
                    style={{
                      color: "#fff",

                      fontSize:
                        isMobile
                          ? 22
                          : 30,

                      lineHeight: 1.2,

                      fontWeight: 800,

                      margin: 0,
                    }}
                  >
                    Day {item.day} Journey
                  </h2>

                </div>

                {item.aiNote && (

                  <div
                    style={{
                      marginBottom: 18,

                      padding: "14px 16px",

                      borderRadius: 16,

                      background:
                        "rgba(0,212,224,0.08)",

                      border:
                        "1px solid rgba(0,212,224,0.18)",

                      color: "#b6f7fb",

                      fontSize: 13,

                      lineHeight: 1.6,

                      fontWeight: 500,
                    }}
                  >
                    {item.aiNote}
                  </div>
                )}

                {/* MORNING */}
                <TimelineCard
                  title="🌅 Morning"
                  color="#facc15"
                  content={item.morning}
                  isMobile={isMobile}
                />

                {/* AFTERNOON */}
                <TimelineCard
                  title="☀ Afternoon"
                  color="#00d4e0"
                  content={item.afternoon}
                  isMobile={isMobile}
                />

                {/* NIGHT */}
                <TimelineCard
                  title="🌙 Night"
                  color="#8b5cf6"
                  content={item.night}
                  isMobile={isMobile}
                />

                {/* EXTRA INFO */}
                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      isMobile
                        ? "repeat(3,1fr)"
                        : "repeat(auto-fit, minmax(180px,1fr))",

                    gap: 16,
                  }}
                >

                  <InfoCard
                    label="🍴 Restaurant"
                    value={item.restaurant}
                    isMobile={isMobile}
                  />

                  <InfoCard
                    label="🚗 Estimated Commute"
                    value={item.travel_time}
                    isMobile={isMobile}
                  />

                  <InfoCard
                    label="🌦 Weather"
                    value={item.weather}
                    isMobile={isMobile}
                  />

                </div>

              </div>
            );
          })()}
        </div>

        {/* RIGHT SIDEBAR */}
        {!isMobile && (

          <div
            style={{
              background:
                "rgba(255,255,255,0.025)",

              border:
                "1px solid rgba(255,255,255,0.05)",

              borderRadius: 24,

              padding: 18,

              height: "fit-content",

              position: "sticky",

              top: 100,
            }}
          >

            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                  "rgba(255,255,255,0.35)",

                marginBottom: 18,

                letterSpacing: 1,

                textTransform: "uppercase",
              }}
            >
              Trip Calendar
            </p>

            {/* CALENDAR */}
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(7,1fr)",

                gap: 10,
              }}
            >

              {result.itinerary.map((item, i) => {

                const accent =
                  DAY_ACCENT[
                  i %
                  DAY_ACCENT.length
                  ];

                const active =
                  activeDay === i;

                return (

                  <div
                    key={i}

                    onClick={() =>
                      setActiveDay(i)
                    }

                    style={{
                      aspectRatio: "1",

                      borderRadius: 14,

                      cursor: "pointer",

                      display: "flex",

                      alignItems: "center",

                      justifyContent:
                        "center",

                      fontWeight: 800,

                      fontSize: 14,

                      color:
                        active
                          ? "#fff"
                          : "rgba(255,255,255,0.7)",

                      background:
                        active
                          ? accent
                          : "rgba(255,255,255,0.04)",

                      border:
                        `1px solid ${active
                          ? accent
                          : "rgba(255,255,255,0.05)"
                        }`,

                      transition:
                        "all .2s ease",

                      boxShadow:
                        active
                          ? `0 0 20px ${accent}50`
                          : "none",
                    }}
                  >
                    {item.day}
                  </div>
                );
              })}

            </div>

            {/* BUDGET */}
            <div
              style={{
                marginTop: 15,
              }}
            >

              <BudgetPanel
                result={result}
                isMobile={isMobile}
                compact
              />

            </div>

            {/* ACTIVE INFO */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 18,

                borderTop:
                  "1px solid rgba(255,255,255,0.05)",
              }}
            >

              <p
                style={{
                  fontSize: 12,
                  color:
                    "rgba(255,255,255,0.35)",

                  marginBottom: 8,
                }}
              >
                Selected Day
              </p>

              <h3
                style={{
                  fontSize: 20,
                  color: "#fff",
                  margin: "0 0 8px",
                }}
              >
                Day {
                  result.itinerary[activeDay]?.day
                }
              </h3>

              <p
                style={{
                  fontSize: 13,

                  color:
                    "rgba(255,255,255,0.6)",

                  lineHeight: 1.6,

                  margin: 0,
                }}
              >
                {
                  result.itinerary[activeDay]
                    ?.morning
                }
              </p>

            </div>

          </div>
        )}

      </div>
    </>
  );
}


/* TIMELINE CARD */

function TimelineCard({

  title,

  color,

  content,

  isMobile,

}) {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.5,
      }}

      viewport={{
        once: true,
      }}

      style={{
        position: "relative",

        paddingLeft: 42,

        paddingBottom: 30,

        marginBottom: 8,
      }}
    >

      {/* VERTICAL LINE */}
      <div
        style={{
          position: "absolute",

          left: 11,

          top: 0,

          bottom: 0,

          width: 2,

          background:
            "linear-gradient(to bottom, rgba(255,255,255,.12), transparent)",
        }}
      />

      {/* GLOWING DOT */}
      <div
        style={{
          position: "absolute",

          left: 4,

          top: 4,

          width: 16,

          height: 16,

          borderRadius: "50%",

          background: color,

          boxShadow: `0 0 20px ${color}`,
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",

          border: "1px solid rgba(255,255,255,0.05)",

          borderRadius: 18,

          padding: isMobile ? 14 : 18,

          backdropFilter: "blur(10px)",
        }}
      >

        {/* TITLE */}
        <p
          style={{
            fontSize: 12,

            fontWeight: 700,

            color,

            marginBottom: 10,

            letterSpacing: 0.5,
          }}
        >
          {title}
        </p>

        {/* TEXT */}
        <p
          style={{
            color: "rgba(255,255,255,0.72)",

            fontSize: isMobile ? 13 : 14,

            lineHeight: 1.8,

            margin: 0,
          }}
        >
          {content}
        </p>

      </div>

    </motion.div>
  );
}

/* INFO CARD */
function InfoCard({

  label,

  value,

  isMobile,

}) {

  return (

    <div
      style={{
        background:
          "rgba(255,255,255,0.025)",

        border:
          "1px solid rgba(255,255,255,0.05)",

        borderRadius: 16,

        padding:
          isMobile
            ? 12
            : 16,
      }}
    >

      <p
        style={{
          fontSize:
            isMobile
              ? 9
              : 10,

          color:
            "rgba(255,255,255,0.35)",

          marginBottom: 6,
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontSize:
            isMobile
              ? 12
              : 14,

          color: "#fff",

          margin: 0,
        }}
      >
        {value}
      </p>

    </div>
  );
}