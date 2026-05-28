export default function HotelCard({
  hotel,
  isMobile,
  onClick
}) {
  return (
    <div
      onClick={() => onClick(hotel)}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "all .25s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          "rgba(255,255,255,0.14)";

        e.currentTarget.style.transform =
          "translateY(-4px)";

        e.currentTarget.style.background =
          "rgba(255,255,255,0.035)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "rgba(255,255,255,0.06)";

        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.background =
          "rgba(255,255,255,0.02)";
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          height: isMobile ? 220 : 180,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={hotel.image}
          alt={hotel.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(6,13,24,0.8), transparent)",
          }}
        />

        {hotel.type && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              background:
                hotel.type === "Luxury"
                  ? "rgba(245,158,11,.95)"
                  : hotel.type === "Budget"
                  ? "rgba(16,185,129,.95)"
                  : "rgba(99,102,241,.95)",
            }}
          >
            {hotel.type}
          </span>
        )}
      </div>

      {/* INFO */}
      <div style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: 16,
                margin: "0 0 4px",
              }}
            >
              {hotel.name}
            </h3>

            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.4)",
                margin: 0,
              }}
            >
              📍 {hotel.location}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                margin: 0,
              }}
            >
              ₹{hotel.price?.toLocaleString()}
            </p>

            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,.3)",
              }}
            >
              /night
            </span>
          </div>
        </div>

        {/* RATING */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 14,
          }}
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              style={{
                color:
                  s <= Math.round(hotel.rating || 4)
                    ? "#facc15"
                    : "rgba(255,255,255,.15)",
              }}
            >
              ★
            </span>
          ))}

          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,.4)",
              marginLeft: 6,
            }}
          >
            {hotel.rating}
          </span>
        </div>

        {/* AMENITIES */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {hotel.amenities?.slice(0, 4).map((a, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 8,
                color: "rgba(255,255,255,.5)",
                background: "rgba(255,255,255,.05)",
                border:
                  "1px solid rgba(255,255,255,.06)",
              }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}