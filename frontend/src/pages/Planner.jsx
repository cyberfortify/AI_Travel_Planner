import { useState, useEffect } from "react";
import { generatePlan } from "../services/api";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Wallet, Calendar,
  Sparkles, Hotel, UtensilsCrossed, Car, Compass,
  ChevronRight, RotateCcw, TrendingUp
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import { saveTrip } from "../services/api";

const BUDGET_META = {
  accommodation: { icon: Hotel, color: "#6366f1", dim: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.18)" },
  food: { icon: UtensilsCrossed, color: "#f59e0b", dim: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)" },
  transport: { icon: Car, color: "#10b981", dim: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)" },
  activities: { icon: Compass, color: "#00d4e0", dim: "rgba(0,212,224,0.08)", border: "rgba(0,212,224,0.18)" },
};

const DAY_ACCENT = ["#6366f1", "#00d4e0", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#f97316", "#06b6d4"];

const inputStyle = (err) => ({
  flex: 1, padding: "12px 14px", borderRadius: 12, fontSize: 13,
  background: err ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.05)",
  border: `1px solid ${err ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)"}`,
  color: "#fff", outline: "none", caretColor: "#00d4e0", transition: "border .15s",
  width: "100%", boxSizing: "border-box",
});

export default function Planner() {
  const location = useLocation();
  const initRes = location.state?.result || null;
  const initData = location.state?.formData || {};
  const [saveMessage, setSaveMessage] = useState("");

  const [result, setResult] = useState(initRes);
  const [formData, setFormData] = useState({ destination: initData.destination || "", budget: initData.budget || "", days: initData.days || "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [authUser, setAuthUser] = useState(() => {
    const stored = localStorage.getItem("govibeUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [pendingSave, setPendingSave] = useState(false);

  const [hotelLoading, setHotelLoading] = useState(true);

  const handleSaveTrip = async () => {

    console.log("SAVE CLICKED");

    // CHECK LOGIN
    const storedUser = localStorage.getItem(
      "govibeUser"
    );
    console.log(storedUser);

    // USER NOT LOGGED IN
    if (!storedUser) {
      console.log("OPENING AUTH MODAL");
      setPendingSave(true);
      setAuthType("login");
      setAuthOpen(true);
      return;
    }

    // USER EXISTS
    const user = JSON.parse(storedUser);

    try {

      await saveTrip({
        user_email: user.email,
        trip_data: result,
      });

      setSaveMessage("✅ Trip saved successfully!");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);

    } catch (err) {

      alert("Failed to save trip");
    }
  };

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "govibeUser"
      );

    if (
      pendingSave &&
      storedUser &&
      result
    ) {
      setPendingSave(false);
      handleSaveTrip();
    }
  }, [
    pendingSave,
    result
  ]);

  useEffect(() => {

    if (result) {

      setHotelLoading(true);

      const timer = setTimeout(() => {

        setHotelLoading(false);

      }, 800);

      return () => clearTimeout(timer);

    }

  }, [result]);

  const onChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const handleLogout = () => {
    localStorage.removeItem("govibeUser");
    setAuthUser(null);
  };

  const validate = () => {
    const e = {};
    if (!formData.destination.trim()) e.destination = "Required";
    if (!formData.budget || formData.budget <= 0) e.budget = "Enter valid budget";
    if (!formData.days || formData.days <= 0) e.days = "Enter valid days";
    if (formData.days > 30) {
      e.days =
        "Maximum 30 days";

    }
    if (formData.budget < 1000) {
      e.budget =
        "Minimum ₹1000";

    }
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setLoading(true);
      const r = await generatePlan(formData);
      setActiveDay(0);
      setResult(r.data);
    } catch { alert("Error generating plan"); }
    finally { setLoading(false); }
  };

  const totalBudget = result ? Object.values(result.budget).reduce((a, b) => a + b, 0) : 0;

  const destinationImage =
    result?.destination_image ||
    `https://placehold.co/1600x500/071422/ffffff?text=${encodeURIComponent(
      result?.destination || "Destination"
    )}`;

  const navigate = useNavigate();

  const goToHowItWorks = () => {
    navigate("/about");
  };

  const goToDestinations = () => {
    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const socialLinks = {
    x: "#",
    linkedin: "#",
    instagram: "#"
  };

  const openSocial = (url) => {

    if (url === "#") {
      alert("Coming soon 🚀");
      return;
    }

    window.open(url, "_blank");
  };

  const legalAction = (name) => {
    alert(`${name} page coming soon 🚀`);
  };


  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);


  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg,#081120 0%,#09182b 30%,#071422 60%,#030b15 100%)",
        fontFamily: "'Inter',sans-serif",
      }}
    >

      {/* Ambient glows */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "55vw", height: "55vw", background: "radial-gradient(circle,rgba(0,180,210,0.18) 0%,transparent 65%)", transform: "translate(-25%,-25%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 0, right: 0, width: "45vw", height: "45vw", background: "radial-gradient(circle,rgba(5,30,80,0.30) 0%,transparent 65%)", transform: "translate(25%,25%)", zIndex: 0, pointerEvents: "none" }} />

      {/* NAVIGATION */}
      <Navbar />

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ══════════════════════════════════
            HERO + FORM SECTION
        ══════════════════════════════════ */}
        <div style={{ padding: "52px 24px 0", maxWidth: 1200, margin: "0 auto" }}>

          {/* Title area */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: "rgba(0,212,224,0.07)", border: "1px solid rgba(0,212,224,0.18)", fontSize: 11, fontWeight: 600, color: "#00d4e0", letterSpacing: .8, textTransform: "uppercase", marginBottom: 16 }}>
              <Sparkles size={11} /> AI Trip Planner
            </span>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, margin: "0 0 10px" }}>
              Plan Your{" "}
              <span style={{ background: "linear-gradient(135deg,#00d4e0,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Perfect Trip
              </span>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", margin: 0 }}>
              Drop your destination, budget and days — get a full itinerary in seconds.
            </p>
          </div>

          {/* ── HORIZONTAL FORM CARD ── */}
          <form onSubmit={onSubmit}>
            <div style={{ background: "rgba(8,13,28,0.97)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", padding: isMobile ? "18px" : "20px 24px", maxWidth: 900, margin: "0 auto" }}>

              {/* Desktop: single row | Mobile: stacked */}
              <div style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "2fr 1fr 1fr auto",
                gap: 16,
                alignItems: "end"
              }}>

                {/* Destination */}
                <div style={{ flex: "2 1 200px", minWidth: 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: .9, textTransform: "uppercase", marginBottom: 7 }}>
                    <MapPin size={10} /> Destination
                  </label>
                  <input name="destination" value={formData.destination} onChange={onChange}
                    placeholder="Paris · Bali · Tokyo"
                    style={inputStyle(errors.destination)}
                    onFocus={e => e.target.style.border = "1px solid rgba(0,212,224,0.45)"}
                    onBlur={e => e.target.style.border = inputStyle(errors.destination).border}
                  />
                  {errors.destination && <p style={{ color: "#f87171", fontSize: 10, margin: "4px 0 0" }}>{errors.destination}</p>}
                </div>

                {/* Budget */}
                <div style={{ flex: "1 1 120px", minWidth: 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: .9, textTransform: "uppercase", marginBottom: 7 }}>
                    <Wallet size={10} /> Budget (₹)
                  </label>
                  <input type="number" name="budget" value={formData.budget} onChange={onChange}
                    placeholder="50,000"
                    style={inputStyle(errors.budget)}
                    onFocus={e => e.target.style.border = "1px solid rgba(0,212,224,0.45)"}
                    onBlur={e => e.target.style.border = inputStyle(errors.budget).border}
                  />
                  {errors.budget && <p style={{ color: "#f87171", fontSize: 10, margin: "4px 0 0" }}>{errors.budget}</p>}
                </div>

                {/* Days */}
                <div style={{ flex: "1 1 100px", minWidth: 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: .9, textTransform: "uppercase", marginBottom: 7 }}>
                    <Calendar size={10} /> Days
                  </label>
                  <input type="number" name="days" value={formData.days} onChange={onChange}
                    placeholder="7"
                    style={inputStyle(errors.days)}
                    onFocus={e => e.target.style.border = "1px solid rgba(0,212,224,0.45)"}
                    onBlur={e => e.target.style.border = inputStyle(errors.days).border}
                  />
                  {errors.days && <p style={{ color: "#f87171", fontSize: 10, margin: "4px 0 0" }}>{errors.days}</p>}
                </div>

                {/* Submit button */}
                <div style={{ flex: "0 0 auto" }}>
                  <button type="submit" disabled={loading}
                    style={{ padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#00c8d4,#1a6fcc)", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", boxShadow: "0 6px 24px rgba(0,180,210,0.25)", opacity: loading ? .6 : 1, transition: "transform .15s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {loading ? (
                      <svg style={{ animation: "spin 1s linear infinite" }} width={16} height={16} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="10" />
                      </svg>
                    ) : <Sparkles size={15} />}
                    {loading ? "Generating…" : "Generate"} <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </form>

          {!result && !loading && (

            <div
              style={{
                padding: "60px",
                textAlign: "center",
                color:
                  "rgba(255,255,255,.35)"
              }}
            >

              ✈️ Generate a trip to see itinerary

            </div>

          )}

          {/* Trust pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
            {["AI-powered", "Budget-smart", "Instant results"].map(t => (
              <span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,212,224,0.35)", display: "inline-block" }} />{t}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            LOADING STATE
        ══════════════════════════════════ */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "80px 24px" }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(0,200,212,0.08)", border: "1px solid rgba(0,200,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg style={{ animation: "spin 1s linear infinite" }} width={28} height={28} viewBox="0 0 24 24">
                <defs><linearGradient id="sg"><stop offset="0%" stopColor="#00d4e0" /><stop offset="100%" stopColor="#6366f1" /></linearGradient></defs>
                <circle cx="12" cy="12" r="10" stroke="url(#sg)" strokeWidth="2.5" fill="none" strokeDasharray="38" strokeDashoffset="10" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: "0 0 6px" }}>Crafting your itinerary</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>Our AI is planning every detail…</p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* ══════════════════════════════════
            RESULT SECTION
        ══════════════════════════════════ */}
        {result && !loading && (
          <div style={{
            maxWidth: 1100, margin: "3rem auto", padding: isMobile
              ? "32px 16px 60px"
              : "44px 24px 80px"
          }}>

            {saveMessage && (

              <div
                style={{
                  position: "fixed",
                  top: 90,
                  right: 20,
                  zIndex: 999,

                  padding: "14px 18px",
                  borderRadius: 16,

                  background:
                    "rgba(16,185,129,.1)",

                  border:
                    "1px solid rgba(16,185,129,.2)",

                  backdropFilter:
                    "blur(15px)",

                  color: "#6ee7b7",
                  fontWeight: 700
                }}
              >

                {saveMessage}

              </div>

            )}

            {/* ── Hero bar ── */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                justifyContent: "space-between",
                gap: isMobile ? 28 : 16,
                marginBottom: 40,
                paddingBottom: 28,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >

              {/* LEFT CONTENT */}
              <div style={{ width: "100%" }}>

                {/* Label */}
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

                <div
                  style={{
                    height: isMobile ? 220 : 300,
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "relative",
                    marginBottom: 28,
                    border: "1px solid rgba(255,255,255,.08)"
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

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(4, 8, 20, .95),rgba(4,8,20,.25))"
                    }} />
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
                        fontSize: isMobile ? 30 : 48,
                        fontWeight: 900,
                        color: "#fff",
                        margin: 0
                      }}
                    >
                      {result.destination}
                    </h1>

                    {/* Minimal Meta Info */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: isMobile ? 10 : 16,
                        marginTop: 6,
                      }}
                    >
                      {[
                        {
                          icon: <Calendar size={13} />,
                          label: `${formData.days} Days`,
                        },
                        {
                          icon: <Wallet size={13} />,
                          label: `₹${Number(formData.budget).toLocaleString()} Budget`,
                        },
                        {
                          icon: <TrendingUp size={13} />,
                          label: `AI Planned`,
                        },
                      ].map((m, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            color: "rgba(255,255,255,0.58)",
                            fontSize: isMobile ? 12 : 13,
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

                          <span>{m.label}</span>

                          {i !== 2 && (
                            <span
                              style={{
                                marginLeft: 8,
                                color: "rgba(255,255,255,0.16)",
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


              {/* RIGHT ACTIONS */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  width: isMobile ? "100%" : "220px",
                  flexDirection: "column",
                  alignSelf: isMobile ? "stretch" : "center"
                }}
              >

                {/* PLAN NEW TRIP */}
                <button
                  onClick={() => setResult(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding:
                      isMobile
                        ? "14px 18px"
                        : "12px 18px",
                    cursor: "pointer",
                    transition: "all .25s ease",
                    width: "100%",
                    minHeight: 48,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      "rgba(255,255,255,0.75)";
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)";
                  }}
                >
                  <RotateCcw size={14} />
                  Plan New Trip
                </button>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleSaveTrip}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding:
                      isMobile
                        ? "14px 18px"
                        : "12px 18px",
                    cursor: "pointer",
                    transition: "all .25s ease",
                    width: "100%",
                    minHeight: 48,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)";
                  }}
                >
                  ❤️ Save Trip
                </button>

              </div>
            </div>



            {/* SMART ITINERARY LAYOUT */}
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

              {/* MOBILE TOP NAV */}
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
                      setActiveDay((p) => Math.max(p - 1, 0))
                    }
                    disabled={activeDay === 0}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
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
                    {activeDay + 1}/{result.itinerary.length}
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
                      activeDay === result.itinerary.length - 1
                    }
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        activeDay === result.itinerary.length - 1
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.06)",
                      color:
                        activeDay === result.itinerary.length - 1
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


            <div
              className="itinerary-layout"
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "minmax(0,1fr) 280px",
                gap: 20,
                alignItems: "start",
              }}
            >


              {/* DETAILS PANEL */}
              <div
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 24,
                  padding: isMobile ? 18 : 24,

                  /* FIX */
                  minHeight: isMobile ? "auto" : 600,
                  maxHeight: isMobile ? "none" : 700,
                  overflowY: "auto",

                  transition: "all .25s ease",
                  scrollbarWidth: "thin",
                  backdropFilter: "blur(14px)",
                }}
              >

                {(() => {
                  const item = result.itinerary[activeDay];
                  const accent = DAY_ACCENT[activeDay % DAY_ACCENT.length];

                  return (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >

                      {/* Header */}
                      <div style={{ marginBottom: isMobile ? 18 : 24 }}>

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
                          {result.destination} • Day {item.day}
                        </p>

                        <h2
                          style={{
                            color: "#fff",
                            fontSize: isMobile ? 20 : 28,
                            lineHeight: 1.3,
                            fontWeight: 800,
                            margin: 0,
                          }}
                        >
                          {item.morning}
                        </h2>
                      </div>

                      {/* Morning */}
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 18,
                          padding: isMobile ? 14 : 18,
                          marginBottom: isMobile ? 12 : 16,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#facc15",
                            marginBottom: 10,
                          }}
                        >
                          🌅 Morning
                        </p>

                        <p
                          style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: isMobile ? 13 : 14,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {item.morning}
                        </p>
                      </div>

                      {/* Afternoon */}
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 18,
                          padding: isMobile ? 14 : 18,
                          marginBottom: isMobile ? 12 : 16,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#00d4e0",
                            marginBottom: 10,
                          }}
                        >
                          ☀ Afternoon
                        </p>

                        <p
                          style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: isMobile ? 13 : 14,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {item.afternoon}
                        </p>
                      </div>

                      {/* Night */}
                      <div
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 18,
                          padding: isMobile ? 14 : 18,
                          marginBottom: isMobile ? 12 : 16,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#8b5cf6",
                            marginBottom: 10,
                          }}
                        >
                          🌙 Night
                        </p>

                        <p
                          style={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: isMobile ? 13 : 14,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {item.night}
                        </p>
                      </div>

                      {/* Extra cards */}
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

                        {/* Restaurant */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 16,
                            padding: isMobile ? 12 : 16,
                          }}
                        >
                          <p
                            style={{
                              fontSize: isMobile ? 9 : 10,
                              color: "rgba(255,255,255,0.35)",
                              marginBottom: 6,
                            }}
                          >
                            🍴 Restaurant
                          </p>

                          <p
                            style={{
                              fontSize: isMobile ? 12 : 14,
                              color: "#fff",
                              margin: 0,
                            }}
                          >
                            {item.restaurant}
                          </p>
                        </div>

                        {/* Travel time */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 16,
                            padding: isMobile ? 12 : 16,
                          }}
                        >
                          <p
                            style={{
                              fontSize: isMobile ? 9 : 10,
                              color: "rgba(255,255,255,0.35)",
                              marginBottom: 6,
                            }}
                          >
                            🚗 Estimated Commute
                          </p>

                          <p
                            style={{
                              fontSize: isMobile ? 12 : 14,
                              color: "#fff",
                              margin: 0,
                            }}
                          >
                            {item.travel_time}
                          </p>
                        </div>

                        {/* Weather */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: 16,
                            padding: isMobile ? 12 : 16,
                          }}
                        >
                          <p
                            style={{
                              fontSize: isMobile ? 9 : 10,
                              color: "rgba(255,255,255,0.35)",
                              marginBottom: 6,
                            }}
                          >
                            🌦 Weather
                          </p>

                          <p
                            style={{
                              fontSize: isMobile ? 12 : 14,
                              color: "#fff",
                              margin: 0,
                            }}
                          >
                            {item.weather}
                          </p>
                        </div>

                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* RIGHT CALENDAR PANEL */}
              {!isMobile && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.05)",
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
                      color: "rgba(255,255,255,0.35)",
                      marginBottom: 18,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Trip Calendar
                  </p>



                  {/* DESKTOP CALENDAR GRID */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7,1fr)",
                      gap: 10,
                    }}
                  >

                    {result.itinerary.map((item, i) => {

                      const accent = DAY_ACCENT[i % DAY_ACCENT.length];
                      const active = activeDay === i;

                      return (
                        <div
                          key={i}
                          onClick={() => setActiveDay(i)}
                          style={{
                            aspectRatio: "1",
                            borderRadius: 14,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            color: active ? "#fff" : "rgba(255,255,255,0.7)",
                            background: active
                              ? accent
                              : "rgba(255,255,255,0.04)",
                            border: `1px solid ${active ? accent : "rgba(255,255,255,0.05)"
                              }`,
                            transition: "all .2s ease",
                            boxShadow: active
                              ? `0 0 20px ${accent}50`
                              : "none",
                          }}
                        >
                          {item.day}
                        </div>
                      );
                    })}
                  </div>


                  {/* Active day info */}
                  <div
                    style={{
                      marginTop: 15,
                      paddingTop: 0,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      display: isMobile ? "none" : "block",
                    }}
                  >
                    {/* BUDGET COMPACT PANEL */}
                    <div
                      style={{
                        marginTop: 0,
                        paddingTop: 15,

                      }}
                    >

                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.35)",
                          marginBottom: 14,
                          letterSpacing: 1,
                          textTransform: "uppercase"
                        }}
                      >
                        Budget Breakdown
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: 10
                        }}
                      >

                        {Object.entries(result.budget).map(
                          ([key, val]) => {

                            const m =
                              BUDGET_META[key] ||
                              BUDGET_META.activities;

                            const Icon = m.icon;

                            const pct = Math.round(
                              (val / totalBudget) * 100
                            );

                            return (

                              <div
                                key={key}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",

                                  padding: "12px",

                                  borderRadius: 14,

                                  background:
                                    "rgba(255,255,255,.03)",

                                  border:
                                    "1px solid rgba(255,255,255,.05)"
                                }}
                              >

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10
                                  }}
                                >

                                  <div
                                    style={{
                                      width: 34,
                                      height: 34,
                                      borderRadius: 10,

                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",

                                      background: m.dim
                                    }}
                                  >

                                    <Icon
                                      size={15}
                                      color={m.color}
                                    />

                                  </div>

                                  <div>

                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: 12,
                                        color:
                                          "rgba(255,255,255,.5)",
                                        textTransform:
                                          "capitalize"
                                      }}
                                    >
                                      {key}
                                    </p>

                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#fff"
                                      }}
                                    >
                                      ₹{val.toLocaleString()}
                                    </p>

                                  </div>

                                </div>

                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: m.color
                                  }}
                                >
                                  {pct}%
                                </span>
                              </div>
                            )

                          })}

                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 14,
                          borderTop:
                            "1px solid rgba(255,255,255,.05)",

                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >

                        <span
                          style={{
                            fontSize: 12,
                            color:
                              "rgba(255,255,255,.4)"
                          }}
                        >
                          Total
                        </span>

                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 16,
                            color: "#fff"
                          }}
                        >
                          ₹{totalBudget.toLocaleString()}
                        </span>

                      </div>

                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.35)",
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
                      Day {result.itinerary[activeDay]?.day}
                    </h3>

                    <p
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.6)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {result.itinerary[activeDay]?.morning}
                    </p>
                  </div>
                </div>
              )}
            </div>



            {/* ── Hotels — full width below ── */}
            <div style={{ marginTop: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Recommended stays</p>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{result.hotels?.length || 0} options</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    isMobile
                      ? "1fr"
                      : "repeat(auto-fit,minmax(300px,1fr))",
                  gap: 18
                }}
              >
                {hotelLoading ? (

                  [1, 2, 3].map(i => (

                    <div
                      key={i}
                      style={{
                        height: 320,
                        borderRadius: 18,
                        background:
                          "rgba(255,255,255,.03)",
                        animation:
                          "pulse 1.5s infinite"
                      }}
                    />

                  ))

                ) : (

                  result.hotels?.map((hotel, i) => (
                    <div key={i}
                      style={{ borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "all .25s", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    >
                      {/* Image */}
                      {hotel.image && (
                        <div style={{ height: isMobile ? 200 : 160, overflow: "hidden", position: "relative" }}>
                          <img
                            loading="lazy"
                            src={hotel.image}
                            alt={hotel.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/600x400?text=Hotel";
                            }}
                          />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,13,24,0.75), transparent)" }} />
                          {hotel.type && (
                            <span style={{
                              position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700,
                              padding: "3px 10px", borderRadius: 99, color: "#fff",
                              background: hotel.type === "Luxury" ? "rgba(245,158,11,0.92)" : hotel.type === "Budget" ? "rgba(16,185,129,0.92)" : "rgba(99,102,241,0.92)"
                            }}>{hotel.type}</span>
                          )}
                        </div>
                      )}

                      {/* Info */}
                      <div style={{ padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hotel.name}</p>
                            {hotel.location && (
                              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.36)", margin: 0 }}>📍 {hotel.location}</p>
                            )}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 2px" }}>₹{(hotel.price || 0).toLocaleString()}</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", margin: 0 }}>/night</p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 12 }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} style={{ fontSize: 12, color: s <= Math.round(hotel.rating || 4) ? "#facc15" : "rgba(255,255,255,0.12)" }}>★</span>
                          ))}
                          {hotel.rating && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>{hotel.rating}</span>}
                        </div>

                        {/* Amenities */}
                        {hotel.amenities?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {hotel.amenities.slice(0, 4).map((a, j) => (
                              <span key={j} style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "3px 8px" }}>{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )))}
              </div>
            </div>




            <style>{`
      @media(max-width:768px){
        .result-grid { grid-template-columns: 1fr !important; }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media(max-width:900px){
        .itinerary-layout{
          grid-template-columns:1fr !important;
        }
      }
        @keyframes pulse{
          0%{
          opacity:.4;
          }

          50%{
          opacity:1;
          }

          100%{
          opacity:.4;
          }

          }
    `}</style>

          </div>
        )}

        {/* ── FOOTER ── */}

        <footer
          style={{ background: "#04070f", marginTop: "4rem" }}
          className="relative overflow-hidden"
        >

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 md:px-14 pt-12 pb-6">

            <div
              className="flex flex-col lg:flex-row justify-between gap-10 pb-10"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)"
              }}
            >

              {/* Brand */}

              <div className="max-w-xs">

                <div className="flex items-center gap-2.5 mb-3">

                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{
                      background:
                        "linear-gradient(135deg,#00c8d4,#2563eb)"
                    }}
                  >
                    ✈️
                  </div>

                  <span
                    className="text-white font-black text-xl tracking-wide"
                  >
                    GoVibe
                  </span>

                </div>

                <p
                  className="text-white/35 text-sm leading-relaxed"
                >
                  AI-powered travel planning that turns your dream destination into a detailed, budget-friendly itinerary in minutes.
                </p>

                <div className="flex items-center gap-3 mt-5">

                  {[
                    { icon: "𝕏", url: socialLinks.x },
                    { icon: "in", url: socialLinks.linkedin },
                    { icon: "ig", url: socialLinks.instagram }

                  ].map((s, i) => (

                    <button
                      key={i}
                      onClick={() => openSocial(s.url)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all text-sm font-bold hover:scale-110"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}
                    >

                      {s.icon}

                    </button>

                  ))}

                </div>

              </div>

              {/* Links */}

              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-8"
              >

                {[

                  {
                    heading: "Product",

                    links: [

                      {
                        name: "How It Works",
                        action: goToHowItWorks
                      },

                      {
                        name: "Destinations",
                        action: goToDestinations
                      }

                    ]

                  },

                  {

                    heading: "Company",

                    links: [

                      {
                        name: "About Us",
                        path: "/about"
                      },

                      {
                        name: "Contact",
                        path: "/contact"
                      }

                    ]

                  },

                  {

                    heading: "Legal",

                    links: [

                      {
                        name: "Privacy Policy",
                        action: () => legalAction(
                          "Privacy Policy"
                        )
                      },

                      {
                        name: "Terms of Use",
                        action: () => legalAction(
                          "Terms of Use"
                        )
                      },

                      {
                        name: "Cookie Policy",
                        action: () => legalAction(
                          "Cookie Policy"
                        )
                      }

                    ]

                  }

                ].map((col) => (

                  <div key={col.heading}>

                    <p
                      className="
text-white/60
text-xs
font-semibold
uppercase
tracking-widest
mb-3"
                    >
                      {col.heading}
                    </p>

                    <ul className="space-y-2.5">

                      {col.links.map((l) => (

                        <li key={l.name}>

                          {l.path ? (

                            <Link
                              to={l.path}
                              className="
text-white/35
text-sm
hover:text-white
transition-colors
duration-200"
                            >
                              {l.name}
                            </Link>

                          ) : (

                            <button
                              onClick={l.action}
                              className="
text-white/35
text-sm
hover:text-white
transition-colors
duration-200"
                            >

                              {l.name}

                            </button>

                          )}

                        </li>

                      ))}

                    </ul>

                  </div>

                ))}

              </div>

            </div>

            <div
              className="
flex
flex-col
md:flex-row
items-center
justify-between
gap-3
pt-6"
            >

              <p className="text-white/25 text-xs">
                © 2026 GoVibe. All rights reserved.
              </p>

              <p className="text-white/20 text-xs">
                Made with ❤️ for travelers worldwide
              </p>

              <div className="flex items-center gap-1.5">

                <span
                  className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-400"
                />

                <span className="text-white/25 text-xs">
                  All systems operational
                </span>

              </div>

            </div>

          </div>

        </footer>


        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          type={authType}
          setAuthUser={setAuthUser}
        />


      </div>
    </div >


  );
}