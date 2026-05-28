import {
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";

import TripActions from "./TripActions";

export default function PlannerHero({

  result,

  formData,

  destinationImage,

  isMobile,

  buttonStyle,

  setResult,

  handleSaveTrip,

  handleExportPDF,

  handleShareTrip,

}) {

  return (

    <div
      style={{
        display: "flex",
        flexDirection:
          isMobile
            ? "column"
            : "row",

        justifyContent:
          "space-between",

        gap:
          isMobile
            ? 2
            : 15,

        marginBottom: 40,

        paddingBottom: 28,

        borderBottom:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >

      {/* LEFT CONTENT */}
      <div
        style={{
          width: "100%",
        }}
      >

        {/* LABEL */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(0,212,224,0.7)",
            letterSpacing: 1.6,
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          Your itinerary is ready ✦
        </p>

        {/* IMAGE */}
        <div
          style={{
            height:
              isMobile
                ? 220
                : 300,

            borderRadius: 24,

            overflow: "hidden",

            position: "relative",

            marginBottom: 28,

            border:
              "1px solid rgba(255,255,255,.08)"
          }}
        >

          <img
            loading="lazy"
            src={destinationImage}
            alt={result.destination}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />

          {/* OVERLAY */}
          <div
            style={{
              position: "absolute",
              inset: 0,

              background:
                "linear-gradient(to top,rgba(4,8,20,.95),rgba(4,8,20,.25))"
            }}
          />

          {/* CONTENT */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24
            }}
          >

            <p
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: "#00d4e0",
                marginBottom: 0,
                fontWeight: 700
              }}
            >
              AI GENERATED TRIP
            </p>

            <h1
              style={{
                fontSize:
                  isMobile
                    ? 30
                    : 48,

                fontWeight: 900,

                color: "#fff",

                margin: 0
              }}
            >
              {result.destination}
            </h1>

            {/* META */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap:
                  isMobile
                    ? 10
                    : 16,

                marginTop: 6,
              }}
            >

              {[
                {
                  icon:
                    <Calendar size={13} />,

                  label:
                    `${formData.days} Days`,
                },

                {
                  icon:
                    <Wallet size={13} />,

                  label:
                    `₹${Number(formData.budget).toLocaleString()} Budget`,
                },

                {
                  icon:
                    <TrendingUp size={13} />,

                  label:
                    "AI Planned",
                },

              ].map((m, i) => (

                <div
                  key={i}

                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,

                    color:
                      "rgba(255,255,255,0.58)",

                    fontSize:
                      isMobile
                        ? 12
                        : 13,

                    fontWeight: 500,
                  }}
                >

                  <span
                    style={{
                      color: "#00d4e0",

                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {m.icon}
                  </span>

                  <span>
                    {m.label}
                  </span>

                  {i !== 2 && (

                    <span
                      style={{
                        marginLeft: 8,
                        color:
                          "rgba(255,255,255,0.16)",
                      }}
                    >
                      •
                    </span>

                  )}

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {/* ACTIONS */}
      <TripActions
        isMobile={isMobile}
        buttonStyle={buttonStyle}
        setResult={setResult}
        handleSaveTrip={handleSaveTrip}
        handleExportPDF={handleExportPDF}
        handleShareTrip={handleShareTrip}
      />

    </div>
  );
}