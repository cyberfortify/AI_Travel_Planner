import { useEffect, useState } from "react";
import {
  Bot,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function AgentLoading() {

  const steps = [
    "Destination analyzed",
    "Budget optimized",
    "Hotels shortlisted",
    "Personalized itinerary generated",
    "Travel plan assembled",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentStep((prev) => {

        if (prev >= steps.length) {
          return prev;
        }

        return prev + 1;

      });

    }, 900);

    return () => clearInterval(interval);

  }, []);

  return (

    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",

        padding: 28,

        borderRadius: 24,

        background:
          "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",

        border:
          "1px solid rgba(255,255,255,.06)",

        backdropFilter:
          "blur(18px)",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,

          marginBottom: 24,
        }}
      >

        <Bot
          size={22}
          color="#00d4e0"
        />

        <h3
          style={{
            color: "#fff",
            margin: 0,
            fontWeight: 800,
          }}
        >
          GoVibe Multi-Agent Planning
        </h3>

      </div>

      {steps.map((step, index) => {

        const completed =
          index < currentStep;

        const active =
          index === currentStep;

        return (

          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,

              padding: "12px 0",
            }}
          >

            {completed ? (

              <CheckCircle2
                size={18}
                color="#10b981"
              />

            ) : active ? (

              <Loader2
                size={18}
                color="#00d4e0"
                className="animate-spin"
              />

            ) : (

              <div
                style={{
                  width: 18,
                  height: 18,

                  borderRadius: "50%",

                  border:
                    "1px solid rgba(255,255,255,.2)",
                }}
              />

            )}

            <span
              style={{
                color:
                  completed || active
                    ? "#fff"
                    : "rgba(255,255,255,.35)",

                fontSize: 14,
              }}
            >
              {step}
            </span>

          </div>

        );

      })}

      <p
        style={{
          marginTop: 20,
          color: "rgba(255,255,255,.4)",
          fontSize: 13,
        }}
      >
        Coordinating specialized AI agents to build your travel plan...
      </p>

    </div>

  );

}