import {
  Bot,
  CheckCircle2,
} from "lucide-react";

export default function AgentTimeline({
  logs = [],
}) {

  if (!logs.length) return null;

  return (

    <div
      style={{
        marginBottom: 30,

        borderRadius: 24,

        padding: 20,

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
          gap: 8,

          marginBottom: 16,
        }}
      >

        <Bot
          size={18}
          color="#00d4e0"
        />

        <span
          style={{
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Multi-Agent Execution
        </span>

      </div>

      {logs.map((log, index) => (

        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,

            padding: "10px 0",

            borderBottom:
              index !== logs.length - 1
                ? "1px solid rgba(255,255,255,.05)"
                : "none",
          }}
        >

          <CheckCircle2
            size={16}
            color="#10b981"
          />

          <span
            style={{
              color:
                "rgba(255,255,255,.75)",
              fontSize: 14,
            }}
          >
            {log}
          </span>

        </div>

      ))}

    </div>
  );
}