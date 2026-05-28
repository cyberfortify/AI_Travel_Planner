import {
  RotateCcw
} from "lucide-react";

export default function TripActions({

  isMobile,

  buttonStyle,

  setResult,

  handleSaveTrip,

  handleExportPDF,

  handleShareTrip

}) {

  return (

    <div
      style={{

        display: "flex",

        flexDirection:
          isMobile
            ? "row"
            : "column",

        alignItems: "center",

        justifyContent:
          "center",

        gap: 12,

        width:
          isMobile
            ? "100%"
            : "220px",

        padding:
          isMobile
            ? "10px"
            : "0",

        background:
          isMobile
            ? "rgba(255,255,255,.03)"
            : "transparent",

        border:
          isMobile
            ? "1px solid rgba(255,255,255,.06)"
            : "none",

        borderRadius:
          isMobile
            ? 18
            : 0,

        backdropFilter:
          "blur(16px)"
      }}
    >

      {/* PLAN NEW */}
      <button
        onClick={() => setResult(null)}
        style={buttonStyle}
      >

        <RotateCcw size={16} />

        {!isMobile && "Plan New Trip"}

      </button>

      {/* SAVE */}
      <button
        onClick={handleSaveTrip}
        style={buttonStyle}
      >

        ❤️

        {!isMobile && "Save Trip"}

      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        style={buttonStyle}
      >

        📄

        {!isMobile && "Export PDF"}

      </button>

      {/* SHARE */}
      <button
        onClick={handleShareTrip}
        style={buttonStyle}
      >

        🔗

        {!isMobile && "Share Trip"}

      </button>

    </div>
  );
}