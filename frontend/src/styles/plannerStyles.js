export const colors = {

  background:
    "#07111f",

  card:
    "rgba(255,255,255,0.03)",

  border:
    "rgba(255,255,255,0.06)",

  text:
    "#ffffff",

  muted:
    "rgba(255,255,255,0.55)",

  softMuted:
    "rgba(255,255,255,0.35)",

  cyan:
    "#00d4e0",

  purple:
    "#8b5cf6",

  orange:
    "#f59e0b",

  green:
    "#10b981",

  pink:
    "#ec4899",
};


/* GLASS CARD */

export const glassCard = {

  background:
    "rgba(255,255,255,0.03)",

  border:
    "1px solid rgba(255,255,255,0.06)",

  backdropFilter:
    "blur(18px)",

  WebkitBackdropFilter:
    "blur(18px)",

  borderRadius: 24,
};


/* SECTION LABEL */

export const sectionLabel = {

  fontSize: 11,

  fontWeight: 700,

  color: colors.cyan,

  letterSpacing: 1.2,

  textTransform: "uppercase",

  margin: "0 0 6px",
};


/* SECTION TITLE */

export const sectionTitle = (
  isMobile = false
) => ({

  color: "#fff",

  fontSize:
    isMobile
      ? 24
      : 34,

  fontWeight: 800,

  margin: 0,
});


/* MUTED TEXT */

export const mutedText = {

  color:
    "rgba(255,255,255,0.45)",

  lineHeight: 1.6,
};


/* BUTTON */

export const glassButton = {

  border:
    "1px solid rgba(255,255,255,.08)",

  background:
    "rgba(255,255,255,.04)",

  color: "#fff",

  backdropFilter:
    "blur(16px)",

  borderRadius: 16,

  cursor: "pointer",

  transition:
    "all .25s ease",
};


/* CARD PADDING */

export const cardPadding = (
  isMobile = false
) => (

  isMobile
    ? 18
    : 24
);


/* GRID GAP */

export const sectionGap = (
  isMobile = false
) => (

  isMobile
    ? 16
    : 22
);