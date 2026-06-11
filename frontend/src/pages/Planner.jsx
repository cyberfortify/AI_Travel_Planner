import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { generatePlan } from "../services/api";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Wallet,
  Calendar,
  Sparkles,
  Hotel,
  UtensilsCrossed,
  Car,
  Compass,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Plane,
  CheckCircle,
  Globe,
  Briefcase,
  Camera,
  Heart
} from "lucide-react";
import PlannerHero from "../components/planner/PlannerHero";
import ItinerarySection from "../components/planner/ItinerarySection";
import TravelPersonality from "../components/planner/TravelPersonality";
import TripActions from "../components/planner/TripActions";
import BudgetPanel from "../components/planner/BudgetPanel";
import HotelSection from "../components/planner/HotelSection";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import { saveTrip } from "../services/api";
import logo from "../assets/logo.png";
import HotelCard from "../components/HotelCard";
import HotelModal from "../components/HotelModal";
import {
  personalizeHotels,
  personalizeItinerary,
} from "../utils/travelPersonalization";
import TripMapSection
  from "../components/planner/TripMapSection";
import AgentTimeline from "../components/planner/AgentTimeline";
import AgentLoading from "../components/planner/AgentLoading";


const BUDGET_META = {
  accommodation: {
    icon: Hotel,
    color: "#6366f1",
    dim: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.18)",
  },
  food: {
    icon: UtensilsCrossed,
    color: "#f59e0b",
    dim: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.18)",
  },
  transport: {
    icon: Car,
    color: "#10b981",
    dim: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.18)",
  },
  activities: {
    icon: Compass,
    color: "#00d4e0",
    dim: "rgba(0,212,224,0.08)",
    border: "rgba(0,212,224,0.18)",
  },
};

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

const inputStyle = (err) => ({
  flex: 1,
  padding: "12px 14px",
  borderRadius: 12,
  fontSize: 13,
  background: err ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.05)",
  border: `1px solid ${err ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)"}`,
  color: "#fff",
  outline: "none",
  caretColor: "#00d4e0",
  transition: "border .15s",
  width: "100%",
  boxSizing: "border-box",
});

export default function Planner() {
  const location = useLocation();
  const initRes = location.state?.result || null;
  const initData = location.state?.formData || {};
  const initialFormData = location.state?.formData;
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [pendingHotelLike, setPendingHotelLike] = useState(null);

  const [result, setResult] = useState(initRes);
  const [formData, setFormData] = useState({
    destination: initData.destination || "",
    budget: initData.budget || "",
    days: initData.days || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeDay, setActiveDay] = useState(0);

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [authUser, setAuthUser] = useState(() => {
    const stored = localStorage.getItem("govibeUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [pendingSave, setPendingSave] = useState(false);

  const [hotelLoading, setHotelLoading] = useState(true);
  const [likedHotels, setLikedHotels] = useState([]);
  const [travelStyle, setTravelStyle] = useState("Luxury");

  const generateTripAutomatically =
    async () => {

      setLoading(true);

      try {

        const startTime =
          Date.now();

        const r =
          await generatePlan(
            initialFormData
          );

        const elapsed =
          Date.now() - startTime;

        const MIN_LOADING_TIME =
          4500;

        if (
          elapsed < MIN_LOADING_TIME
        ) {

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                MIN_LOADING_TIME - elapsed
              )
          );

        }

        setResult(r.data);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    if (!initialFormData) return;

    generateTripAutomatically();

  }, []);

  // SAVE TRIP FUNCTION
  const handleSaveTrip = async () => {
    console.log("SAVE CLICKED");

    // CHECK LOGIN
    const storedUser = localStorage.getItem("govibeUser");
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

      setSaveMessage(" Trip saved successfully!");

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (err) {
      alert("Failed to save trip");
    }
  };

  // EXPORT PDF FUNCTION
  const handleExportPDF = () => {
    if (!result) return;

    const pdf = new jsPDF();

    pdf.setFontSize(22);

    pdf.text("GoVibe Travel Plan", 20, 20);

    pdf.setFontSize(13);

    pdf.text(`Destination: ${result.destination}`, 20, 40);

    pdf.text(`Budget: ₹${totalBudget}`, 20, 50);

    pdf.text(`Days: ${result.itinerary.length}`, 20, 60);

    let y = 80;

    result.itinerary.forEach((day) => {
      pdf.setFontSize(14);

      pdf.text(`Day ${day.day}`, 20, y);

      y += 10;

      pdf.setFontSize(11);

      pdf.text(`Morning: ${day.morning}`, 20, y);

      y += 10;

      pdf.text(`Afternoon: ${day.afternoon}`, 20, y);

      y += 10;

      pdf.text(`Night: ${day.night}`, 20, y);

      y += 18;

      if (y > 260) {
        pdf.addPage();

        y = 20;
      }
    });

    pdf.save(`${result.destination}-trip.pdf`);
  };

  // SHARE FUNCTION
  const handleShareTrip = async () => {
    try {
      const shareText = `

        Destination: ${result.destination}

        ${result.itinerary.length} Days

        Budget:
        ₹${totalBudget}

        Planned with GoVibe AI

        `;

      if (navigator.share) {
        await navigator.share({
          title: `${result.destination} Trip`,

          text: shareText,
        });
      } else {
        navigator.clipboard.writeText(shareText);

        alert("Trip details copied!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("govibeUser");

    // SAVE TRIP FLOW
    if (pendingSave && storedUser && result) {
      setPendingSave(false);

      handleSaveTrip();
    }

    // HOTEL LIKE FLOW
    if (pendingHotelLike && storedUser) {
      // REOPEN HOTEL
      setSelectedHotel(pendingHotelLike);

      // AUTO LIKE
      setLikedHotels((prev) => {
        const exists = prev.some((h) => h.name === pendingHotelLike.name);

        if (exists) return prev;

        const updated = [...prev, pendingHotelLike];

        localStorage.setItem("govibeLikedHotels", JSON.stringify(updated));

        return updated;
      });

      // CLEAR PENDING
      setPendingHotelLike(null);
    }
  }, [pendingSave, pendingHotelLike, result]);

  useEffect(() => {
    if (result) {
      setHotelLoading(true);

      const timer = setTimeout(() => {
        setHotelLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    const trip = JSON.parse(localStorage.getItem("selectedTrip"));

    if (trip) {
      setResult(trip);

      localStorage.removeItem("selectedTrip");
    }
  }, []);

  const onChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleLogout = () => {
    localStorage.removeItem("govibeUser");
    setAuthUser(null);
  };

  const validate = () => {
    const e = {};
    if (!formData.destination.trim()) e.destination = "Required";
    if (!formData.budget || formData.budget <= 0)
      e.budget = "Enter valid budget";
    if (!formData.days || formData.days <= 0) e.days = "Enter valid days";
    if (formData.days > 30) {
      e.days = "Maximum 30 days";
    }
    if (formData.budget < 1000) {
      e.budget = "Minimum ₹1000";
    }
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {

      setLoading(true);

      const startTime = Date.now();

      const r = await generatePlan(formData);

      const elapsed =
        Date.now() - startTime;

      const MIN_LOADING_TIME = 4500;

      if (
        elapsed < MIN_LOADING_TIME
      ) {

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              MIN_LOADING_TIME - elapsed
            )
        );

      }

      setActiveDay(0);

      setResult(r.data);

    } catch {

      alert("Error generating plan");

    } finally {

      setLoading(false);

    }
  };

  const totalBudget = result
    ? Object.values(result.budget).reduce((a, b) => a + b, 0)
    : 0;

  const destinationImage =
    result?.destination_image ||
    `https://placehold.co/1600x500/071422/ffffff?text=${encodeURIComponent(
      result?.destination || "Destination",
    )}`;

  const navigate = useNavigate();

  const goToHowItWorks = () => {
    navigate("/about");
  };

  const goToDestinations = () => {
    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = {
    x: "#",
    linkedin: "#",
    instagram: "#",
  };

  const openSocial = (url) => {
    if (url === "#") {
      alert("Coming soon ");
      return;
    }

    window.open(url, "_blank");
  };

  const legalAction = (name) => {
    alert(`${name} page coming soon`);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    width: isMobile ? 48 : "100%",

    height: isMobile ? 48 : "auto",

    padding: isMobile ? 0 : "12px 18px",

    borderRadius: isMobile ? "50%" : 14,

    border: "1px solid rgba(255,255,255,.08)",

    background: "rgba(255,255,255,.05)",

    color: "#fff",

    cursor: "pointer",

    fontWeight: 700,
  };

  const handleLikeHotel = () => {
    const storedUser = localStorage.getItem("govibeUser");

    if (!storedUser) {
      // REMEMBER HOTEL
      setPendingHotelLike(selectedHotel);

      // CLOSE HOTEL MODAL
      setSelectedHotel(null);

      // OPEN LOGIN
      setAuthType("login");
      setAuthOpen(true);

      return;
    }

    // NO HOTEL SELECTED
    if (!selectedHotel) return;

    const exists = likedHotels.some((h) => h.name === selectedHotel.name);

    let updated;

    if (exists) {
      updated = likedHotels.filter((h) => h.name !== selectedHotel.name);
    } else {
      updated = [...likedHotels, selectedHotel];
    }

    setLikedHotels(updated);

    localStorage.setItem("govibeLikedHotels", JSON.stringify(updated));
  };

  useEffect(() => {
    const stored = localStorage.getItem("govibeLikedHotels");

    if (stored) {
      setLikedHotels(JSON.parse(stored));
    }
  }, []);

  // PERSONALIZATION
  const personalizedHotels =
    personalizeHotels(
      result?.hotels,
      travelStyle
    );

  const personalizedItinerary =
    personalizeItinerary(
      result?.itinerary,
      travelStyle
    );

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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle,rgba(0,180,210,0.18) 0%,transparent 65%)",
          transform: "translate(-25%,-25%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "45vw",
          height: "45vw",
          background:
            "radial-gradient(circle,rgba(5,30,80,0.30) 0%,transparent 65%)",
          transform: "translate(25%,25%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* NAVIGATION */}
      <Navbar />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* ══════════════════════════════════
            HERO + FORM SECTION
        ══════════════════════════════════ */}
        <div
          style={{ padding: "52px 24px 0", maxWidth: 1200, margin: "0 auto" }}
        >
          {/* Title area */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 14px",
                borderRadius: 99,
                background: "rgba(0,212,224,0.07)",
                border: "1px solid rgba(0,212,224,0.18)",
                fontSize: 11,
                fontWeight: 600,
                color: "#00d4e0",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              <Sparkles size={11} /> AI Trip Planner
            </span>
            <h1
              style={{
                fontSize: "clamp(2rem,5vw,3rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.08,
                margin: "0 0 10px",
              }}
            >
              Plan Your{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#00d4e0,#6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Perfect Trip
              </span>
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.38)",
                margin: 0,
              }}
            >
              Drop your destination, budget and days — get a full itinerary in
              seconds.
            </p>
          </div>

          {/* ── HORIZONTAL FORM CARD ── */}
          <form onSubmit={onSubmit}>
            <div
              style={{
                background: "rgba(8,13,28,0.97)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                backdropFilter: "blur(20px)",
                padding: isMobile ? "18px" : "20px 24px",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {/* Desktop: single row | Mobile: stacked */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr auto",
                  gap: 16,
                  alignItems: "end",
                }}
              >
                {/* Destination */}
                <div style={{ flex: "2 1 200px", minWidth: 0 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    <MapPin size={10} /> Destination
                  </label>
                  <input
                    name="destination"
                    value={formData.destination}
                    onChange={onChange}
                    placeholder="Paris · Bali · Tokyo"
                    style={inputStyle(errors.destination)}
                    onFocus={(e) =>
                      (e.target.style.border = "1px solid rgba(0,212,224,0.45)")
                    }
                    onBlur={(e) =>
                    (e.target.style.border = inputStyle(
                      errors.destination,
                    ).border)
                    }
                  />
                  {errors.destination && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div style={{ flex: "1 1 120px", minWidth: 0 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    <Wallet size={10} /> Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={onChange}
                    placeholder="50,000"
                    style={inputStyle(errors.budget)}
                    onFocus={(e) =>
                      (e.target.style.border = "1px solid rgba(0,212,224,0.45)")
                    }
                    onBlur={(e) =>
                      (e.target.style.border = inputStyle(errors.budget).border)
                    }
                  />
                  {errors.budget && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.budget}
                    </p>
                  )}
                </div>

                {/* Days */}
                <div style={{ flex: "1 1 100px", minWidth: 0 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                      marginBottom: 7,
                    }}
                  >
                    <Calendar size={10} /> Days
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={onChange}
                    placeholder="7"
                    style={inputStyle(errors.days)}
                    onFocus={(e) =>
                      (e.target.style.border = "1px solid rgba(0,212,224,0.45)")
                    }
                    onBlur={(e) =>
                      (e.target.style.border = inputStyle(errors.days).border)
                    }
                  />
                  {errors.days && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 10,
                        margin: "4px 0 0",
                      }}
                    >
                      {errors.days}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div style={{ flex: "0 0 auto" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "12px 24px",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      whiteSpace: "nowrap",
                      boxShadow: "0 6px 24px rgba(0,180,210,0.25)",
                      opacity: loading ? 0.6 : 1,
                      transition: "transform .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {loading ? (
                      <svg
                        style={{ animation: "spin 1s linear infinite" }}
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#fff"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="30"
                          strokeDashoffset="10"
                        />
                      </svg>
                    ) : (
                      <Sparkles size={15} />
                    )}
                    {loading ? "Generating…" : "Generate"}{" "}
                    <ChevronRight size={15} />
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
                color: "rgba(255,255,255,.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "60px",
                  textAlign: "center",
                  color: "rgba(255,255,255,.35)",
                }}
              >
                <Plane size={32} color="#00d4e0" />
                <span>Generate a trip to see itinerary</span>
              </div>
            </div>
          )}

          {/* Trust pills */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            {["AI-powered", "Budget-smart", "Instant results"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(0,212,224,0.35)",
                    display: "inline-block",
                  }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            LOADING STATE
        ══════════════════════════════════ */}
        {loading && (
          <AgentLoading />
        )}

        {/* ══════════════════════════════════
            RESULT SECTION
        ══════════════════════════════════ */}
        {result && !loading && (
          <div
            style={{
              maxWidth: 1100,
              margin: "3rem auto",
              padding: isMobile ? "32px 16px 60px" : "44px 24px 80px",
            }}
          >
            {saveMessage && (
              <div
                style={{
                  position: "fixed",
                  top: 90,
                  right: 20,
                  zIndex: 999,

                  padding: "14px 18px",
                  borderRadius: 16,

                  background: "rgba(16,185,129,.1)",

                  border: "1px solid rgba(16,185,129,.2)",

                  backdropFilter: "blur(15px)",

                  color: "#6ee7b7",
                  fontWeight: 700,
                }}
              >
                <CheckCircle size={18} />
                {saveMessage}
              </div>
            )}


            {/* ── Hero bar ── */}
            <PlannerHero
              result={{
                ...result,
                itinerary:
                  personalizedItinerary,
              }}
              formData={formData}
              destinationImage={destinationImage}
              isMobile={isMobile}
              buttonStyle={buttonStyle}
              setResult={setResult}
              handleSaveTrip={handleSaveTrip}
              handleExportPDF={handleExportPDF}
              handleShareTrip={handleShareTrip}
            />



            <TravelPersonality
              travelStyle={travelStyle}
              setTravelStyle={setTravelStyle}
              isMobile={isMobile}
            />


            {/* SMART ITINERARY LAYOUT */}
            <ItinerarySection
              result={{
                ...result,
                itinerary:
                  personalizedItinerary,
              }}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              isMobile={isMobile}
            />

            {/* Hotels */}
            <HotelSection
              result={{
                ...result,
                hotels:
                  personalizedHotels,
              }}
              isMobile={isMobile}
              hotelLoading={hotelLoading}
              selectedHotel={selectedHotel}
              setSelectedHotel={setSelectedHotel}
              handleLikeHotel={handleLikeHotel}
              likedHotels={likedHotels}
            />

            <HotelModal
              hotel={selectedHotel}
              onClose={() => setSelectedHotel(null)}
              isMobile={isMobile}
              onLike={handleLikeHotel}
              liked={likedHotels.some((h) => h.name === selectedHotel?.name)}
            />

            <TripMapSection
              result={{
                ...result,
                hotels:
                  personalizedHotels,
              }}
              isMobile={isMobile}
            />

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
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 md:px-14 pt-12 pb-6">
            <div
              className="flex flex-col lg:flex-row justify-between gap-10 pb-10"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Brand */}

              <div className="max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      width: 48,
                      height: 48,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={logo}
                      alt="GoVibe Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 800,

                      background: "linear-gradient(90deg,#ffffff,#b9c7ff)",

                      WebkitBackgroundClip: "text",

                      WebkitTextFillColor: "transparent",

                      letterSpacing: "-.5px",
                    }}
                  >
                    GoVibe
                  </span>
                </div>

                <p className="text-white/35 text-sm leading-relaxed">
                  AI-powered travel planning that turns your dream destination
                  into a detailed, budget-friendly itinerary in minutes.
                </p>

                <div className="flex items-center gap-3 mt-5">
                  {[
                    {
                      icon: Globe,
                      url: socialLinks.x
                    },
                    {
                      icon: Briefcase,
                      url: socialLinks.linkedin
                    },
                    {
                      icon: Camera,
                      url: socialLinks.instagram
                    }
                  ].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => openSocial(s.url)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all text-sm font-bold hover:scale-110"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <s.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Links */}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  {
                    heading: "Product",

                    links: [
                      {
                        name: "How It Works",
                        action: goToHowItWorks,
                      },

                      {
                        name: "Destinations",
                        action: goToDestinations,
                      },
                    ],
                  },

                  {
                    heading: "Company",

                    links: [
                      {
                        name: "About Us",
                        path: "/about",
                      },

                      {
                        name: "Contact",
                        path: "/contact",
                      },
                    ],
                  },

                  {
                    heading: "Legal",

                    links: [
                      {
                        name: "Privacy Policy",
                        action: () => legalAction("Privacy Policy"),
                      },

                      {
                        name: "Terms of Use",
                        action: () => legalAction("Terms of Use"),
                      },

                      {
                        name: "Cookie Policy",
                        action: () => legalAction("Cookie Policy"),
                      },
                    ],
                  },
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

              <div
                className="text-white/20 text-xs"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>Made with</span>
                <Heart size={12} />
                <span>for travelers worldwide</span>
              </div>

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
    </div>
  );
}
