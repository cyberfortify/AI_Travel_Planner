import {
  Hotel,
  UtensilsCrossed,
  Car,
  Compass,
} from "lucide-react";

export default function BudgetPanel({
  result,
  isMobile,
  compact = false,
}) {

  if (!result?.budget) return null;

  const budget = result?.budget || {};

  const budgetItems = [
    {
      label: "Hotels",
      value: result.budget.hotel || 0,
      icon: Hotel,
      color: "#00d4e0",
    },
    {
      label: "Food",
      value: result.budget.food || 0,
      icon: UtensilsCrossed,
      color: "#f59e0b",
    },
    {
      label: "Transport",
      value: result.budget.travel || 0,
      icon: Car,
      color: "#8b5cf6",
    },
    {
      label: "Activities",
      value: result.budget.misc || 0,
      icon: Compass,
      color: "#10b981",
    },
  ];

  return (

    <div
      style={{
        width: "100%",
      }}
    >

      {/* HEADING */}
      <div
        style={{
          marginBottom: 20,
        }}
      >

        <p
          style={{
            color: "#00d4e0",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}
        >
          BUDGET BREAKDOWN
        </p>

        <h2
          style={{
            color: "#fff",
            fontSize:
              isMobile ? 24 : 32,

            fontWeight: 800,
            margin: 0,
          }}
        >
          Smart Expense Planning
        </h2>

      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:

            compact
              ? "repeat(2,minmax(0,1fr))"

              : isMobile
                ? "1fr 1fr"

                : "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >

        {budgetItems.map((item) => (

          <div
            key={item.label}

            style={{
              position: "relative",

              overflow: "hidden",

              borderRadius: 24,

              padding:

                compact
                  ? 14

                  : isMobile
                    ? 18
                    : 22,

              background:
                "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",

              border:
                "1px solid rgba(255,255,255,.06)",

              backdropFilter:
                "blur(18px)",
            }}
          >

            {/* GLOW */}
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,

                width: 100,
                height: 100,

                borderRadius: "50%",

                background:
                  `${item.color}20`,

                filter:
                  "blur(40px)",
              }}
            />

            {/* ICON */}
            <div
              style={{
                width: compact ? 42 : 52,
                height: compact ? 42 : 52,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${item.color}18`,
                border: `1px solid ${item.color}30`,
                marginBottom: 18,
              }}
            >
              <item.icon
                size={compact ? 18 : 22}
                color={item.color}
                strokeWidth={2.2}
              />
            </div>

            {/* VALUE */}
            <h3
              style={{
                color: "#fff",

                fontSize:

                  compact
                    ? 18

                    : isMobile
                      ? 22
                      : 28,

                fontWeight: 900,

                margin: "0 0 6px",
              }}
            >
              ₹{item.value?.toLocaleString()}
            </h3>

            {/* LABEL */}
            <p
              style={{
                color:
                  "rgba(255,255,255,.45)",

                fontSize: 13,

                margin: 0,
              }}
            >
              {item.label}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}