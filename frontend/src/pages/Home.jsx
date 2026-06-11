import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Plane, Info, HelpCircle, User, Menu, X, Camera } from "lucide-react";
import { Globe, Wallet, Sparkles, Briefcase, Bookmark, Heart, ArrowRight } from "lucide-react";
import { generatePlan } from "../services/api";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import logo from "../assets/logo.png";

const steps = [
  {
    number: "01", icon: Globe, title: "Pick Your Destination",
    desc: "Tell us where you want to go — any city, country, or region. Our AI knows thousands of destinations worldwide.",
    color: "#00d4e0", glow: "rgba(0,212,224,0.12)",
  },
  {
    number: "02", icon: Wallet, title: "Set Your Budget & Days",
    desc: "Enter your total budget and trip duration. We'll make sure every rupee is planned wisely across stays, food & activities.",
    color: "#6366f1", glow: "rgba(99,102,241,0.12)",
  },
  {
    number: "03", icon: Sparkles, title: "AI Generates Your Plan",
    desc: "In under 2 minutes, get a complete day-wise itinerary with hotels, restaurants, and must-see spots — all within budget.",
    color: "#f59e0b", glow: "rgba(245,158,11,0.12)",
  },
  {
    number: "04", icon: Briefcase, title: "Pack & Go",
    desc: "Your personalized travel plan is ready. Download it, share it, and head off on your dream trip with zero stress.",
    color: "#10b981", glow: "rgba(16,185,129,0.12)",
  },
];

const destinations = [
  {
    country: "INDONESIA",
    background: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80",
    description: "As the largest archipelago country in the world, Indonesia is blessed with so many different people, cultures, customs, traditions, artworks, food, animals, plants, landscapes.",
    card: { title: "Bali, Indonesia", stars: 5, image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80" },
  },
  {
    country: "THAILAND",
    background: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1600&q=80",
    description: "Thailand is known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples. A land where tradition meets modern charm beautifully.",
    card: { title: "Bangkok, Thailand", stars: 4, image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80" },
  },
  {
    country: "MALDIVES",
    background: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=80",
    description: "Escape to paradise. Crystal-clear lagoons, overwater bungalows, and coral reefs teeming with vibrant marine life await you in the Maldives.",
    card: { title: "Male, Maldives", stars: 5, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80" },
  },
];

const N = destinations.length;
const CARD_W = 220;
const CARD_GAP = 16;
const STEP = CARD_W + CARD_GAP;
const TEXT_H = 130;
const DESC_H = 90;

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= count ? "#facc15" : "rgba(255,255,255,0.3)", fontSize: 10 }}>★</span>
      ))}
    </div>
  );
}

function MarqueeRow({ items, direction, speed }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%", marginBottom: 0 }}>
      <div style={{
        display: "flex", gap: 16, width: "max-content",
        animation: `marquee${direction > 0 ? "Fwd" : "Rev"} ${speed}s linear infinite`,
      }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex-shrink-0 font-semibold text-xs px-4 py-2 rounded-full"
            style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeFwd { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marqueeRev { from{transform:translateX(-50%)} to{transform:translateX(0)} }
      `}</style>
    </div>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const [formData, setFormData] = useState({ destination: "", budget: "", days: "" });
  const [errors, setErrors] = useState({});

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [authUser, setAuthUser] = useState(() => {
    const stored = localStorage.getItem("govibeUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (authUser) {
      navigate("/planner");
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("govibeUser");
    setAuthUser(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.budget || formData.budget <= 0) newErrors.budget = "Enter a valid budget";
    if (!formData.days || formData.days <= 0) newErrors.days = "Enter valid number of days";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    try {
      setLoading(true);
      navigate("/planner", {
        state: {
          formData
        }
      });
    } catch (error) {
      alert("Error generating plan");
    } finally {
      setLoading(false);
    }
  };

  const sectionRef = useRef(null);
  const progress = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const clamped = v < 0.15 ? 0 : (v - 0.15) / 0.85;
      animate(progress, clamped, { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] });
    });
  }, [scrollYProgress]);

  const floatIdx = useTransform(progress, [0, 1], [0, N - 0.0001]);
  const cardX = useTransform(floatIdx, v => -v * STEP);
  const headingY = useTransform(floatIdx, v => -v * TEXT_H);
  const descY = useTransform(floatIdx, v => -v * DESC_H);

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    return floatIdx.on("change", v => setActiveIdx(Math.min(Math.floor(v + 0.15), N - 1)));
  }, [floatIdx]);

  const bgOpacity = (i) =>
    useTransform(floatIdx, [i - 0.5, i, i + 0.5, i + 1], [0, 1, 1, 0]);


  const handleExplorePlanner = () => {
    const user = localStorage.getItem("govibeUser");

    if (user) {
      navigate("/planner");
    } else {
      setAuthType("login");
      setAuthOpen(true);
    }
  };

  const goToHowItWorks = () => {
    window.scrollTo({
      top: document.querySelector("section")?.offsetTop - 80,
      behavior: "smooth"
    });
  };

  const goToDestinations = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const socialLinks = {
    x: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com"
  };

  const openSocial = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="text-gray-900 font-sans antialiased">

      {/* ── HERO ── */}
      <div
        className="relative min-h-screen overflow-hidden rounded-b-[40px] md:rounded-b-[55px]"
        style={{ background: "linear-gradient(160deg, #0d2137 0%, #0a1a2e 30%, #071422 60%, #040d18 100%)" }}
      >
        {/* Glows */}
        <div className="absolute top-0 left-0 pointer-events-none z-0"
          style={{ width: "55vw", height: "55vw", background: "radial-gradient(circle, rgba(0,180,210,0.30) 0%, rgba(0,120,160,0.15) 35%, transparent 65%)", transform: "translate(-25%, -25%)" }} />
        <div className="absolute bottom-0 right-0 pointer-events-none z-0"
          style={{ width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(5,30,80,0.40) 0%, transparent 65%)", transform: "translate(25%, 25%)" }} />

        {/* ---------- NAVBAR ---------- */}
        <Navbar />

        {/* ── HERO CONTENT ── */}
        <div className="relative z-10 px-5 sm:px-10 md:px-16 pt-6 md:pt-10">

          {/* Headline + subtitle */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 md:mb-20">
            <div className="flex-none">
              <h1 className="font-black text-white leading-none uppercase"
                style={{ fontSize: "clamp(2.2rem, 8vw, 4.8rem)", letterSpacing: "0.02em" }}>
                A JOURNEY OF<br />DISCOVERY
              </h1>
            </div>
            <div className="flex-none max-w-lg md:pt-7">
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Journey of discovery through travel allows you to explore new places,
                immerse yourself in different cultures, and learn about the world and its people.
              </p>
              <button
                onClick={() => window.scrollTo({ top: searchRef.current.offsetTop - 80, behavior: "smooth" })}
                className="mt-4 flex items-center gap-2 text-base font-semibold group transition-all"
                style={{ color: "#00d4e0" }}>
                <span className="border-b border-[#00d4e0] pb-0.5">Explore Our Journey</span>
                <span className="text-xl leading-none transition-transform group-hover:translate-x-1"><ArrowRight size={20} /></span>
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden"
            style={{ height: "clamp(200px, 45vw, 460px)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
            <div className="absolute inset-0 z-10"
              style={{ background: "linear-gradient(180deg, rgba(0,60,100,0.2) 0%, rgba(0,20,50,0.5) 100%)" }} />
            <img src="images/image1.jpg" alt="Airplane over ocean"
              className="w-full h-full object-cover" style={{ filter: "saturate(1.3) brightness(0.8)" }} />
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div ref={searchRef} className="relative z-20 px-5 sm:px-8 md:px-16 mt-4 md:-mt-16 pb-10 md:pb-20">
          <div className="rounded-2xl overflow-hidden w-full mx-auto"
            style={{
              maxWidth: "980px",
              background: "rgba(8,13,28,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              borderRadius: "1rem",   // rounded-2xl equivalent
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Mobile: stacked, Desktop: row */}
              <div className="flex flex-col md:flex-row items-stretch p-5 md:p-8 gap-4 md:gap-0">

                {/* Destination */}
                <div
                  data-dest-wrapper=""
                  className="flex-1 px-3 py-2 flex flex-col justify-center"
                  style={{ position: "relative", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Destination
                    </span>
                  </div>

                  <input
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Where are you going?"
                    className="bg-transparent text-white caret-white text-sm placeholder-gray-500 outline-none w-full"
                  />

                  {errors.destination && (
                    <span className="text-red-400 text-xs mt-1">{errors.destination}</span>
                  )}

                </div>

                {/* Budget */}
                <div className="flex-1 px-3 py-2 flex flex-col justify-center"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Budget (₹)</span>
                  </div>
                  <input type="text" name="budget" value={formData.budget} onChange={handleChange}
                    placeholder="Total budget"
                    className="bg-transparent text-white caret-white text-sm placeholder-gray-500 outline-none w-full" />
                  {errors.budget && <span className="text-red-400 text-xs mt-1">{errors.budget}</span>}
                </div>

                {/* Days */}
                <div className="flex-1 px-3 py-2 flex flex-col justify-center"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Days</span>
                  </div>
                  <input type="text" name="days" value={formData.days} onChange={handleChange}
                    placeholder="Number of days"
                    className="bg-transparent text-white caret-white text-sm placeholder-gray-500 outline-none w-full" />
                  {errors.days && <span className="text-red-400 text-xs mt-1">{errors.days}</span>}
                </div>

                {/* Button */}
                <div className="px-3 md:px-5 py-2 flex items-center">
                  <button type="submit" disabled={loading}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #00c8d4, #1a6fcc)", boxShadow: "0 4px 20px rgba(0,200,212,0.3)", minWidth: "120px" }}>
                    {loading ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" strokeDasharray="30" strokeDashoffset="10" />
                      </svg>
                    ) : <>Generate <span><ArrowRight size={20} /></span></>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1520 60%, #080c18 100%)", paddingTop: 70, paddingBottom: 80, marginTop: -2 }}>
        <div className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ height: 80, background: "linear-gradient(180deg, #060d1a 0%, transparent 100%)" }} />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position: "absolute", top: "10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,224,0.06), transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-14">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(0,212,224,0.08)", border: "1px solid rgba(0,212,224,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#00d4e0" }}>How It Works</span>
            </div>
            <h2 className="font-black text-white mb-3" style={{ fontSize: "clamp(1.6rem, 5vw, 3.2rem)", lineHeight: 1.1 }}>
              Plan Your Trip in{" "}
              <span style={{ background: "linear-gradient(135deg, #00d4e0, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                4 Simple Steps
              </span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
              From idea to itinerary — GoVibe makes trip planning feel effortless, fast, and fun.
            </p>
          </div>

          {/* Steps grid — 1 col mobile, 2 col tablet, 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i}
                className="group relative flex flex-col items-center text-center rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-2"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.background = s.glow; e.currentTarget.style.borderColor = s.color + "44"; e.currentTarget.style.boxShadow = `0 20px 60px ${s.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black"
                  style={{ background: "#0a0f1e", border: `1px solid ${s.color}55`, color: s.color, letterSpacing: "0.1em" }}>
                  {s.number}
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 mt-2 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${s.glow}, rgba(255,255,255,0.04))`, border: `1px solid ${s.color}30`, boxShadow: `0 8px 24px ${s.glow}` }}>
                  <s.icon
                    size={28}
                    color={s.color}
                  />
                </div>
                <h3 className="text-white font-bold text-base mb-2 leading-snug">{s.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-16 z-10 text-white/20 text-lg">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section ref={sectionRef} className="relative bg-black" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {destinations.map((dest, i) => (
            <motion.div key={dest.country} className="absolute inset-0"
              style={{ backgroundImage: `url(${dest.background})`, backgroundSize: "cover", backgroundPosition: "center", opacity: bgOpacity(i), zIndex: 1 }} />
          ))}
          <div className="absolute inset-0 bg-black/55" style={{ zIndex: 2 }} />

          <div className="relative h-full flex flex-col md:flex-row items-center justify-center md:justify-start" style={{ zIndex: 4 }}>

            {/* LEFT — text, full width on mobile */}
            <div className="w-full md:w-1/2 px-6 md:pl-14 md:pr-6 flex flex-col items-center md:items-start text-center md:text-left">
              <p style={{ letterSpacing: "0.3em", fontSize: 10 }} className="uppercase text-white/60 mb-3">Explore Destination</p>

              <div style={{ height: TEXT_H, overflow: "hidden", width: "100%" }}>
                <motion.div style={{ y: headingY }}>
                  {destinations.map((dest, i) => (
                    <div key={i} style={{ height: TEXT_H, display: "flex", alignItems: "center", justifyContent: "inherit" }}>
                      <h2 className="font-black uppercase text-white"
                        style={{ fontSize: "clamp(2.2rem, 8vw, 6rem)", lineHeight: 1 }}>
                        {dest.country}
                      </h2>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div style={{ height: DESC_H, overflow: "hidden", marginTop: 12, width: "100%" }}>
                <motion.div style={{ y: descY }}>
                  {destinations.map((dest, i) => (
                    <div key={i} style={{ height: DESC_H, display: "flex", alignItems: "flex-start", paddingTop: 4 }}>
                      <p className="text-white/70 leading-relaxed" style={{ fontSize: 12 }}>{dest.description}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Dots — horizontal on mobile */}
              <div className="flex md:hidden items-center gap-3 mt-4">
                {destinations.map((_, i) => (
                  <motion.div key={i}
                    animate={{ scale: activeIdx === i ? 1.4 : 1, backgroundColor: activeIdx === i ? "#00d4e0" : "rgba(255,255,255,0.35)" }}
                    transition={{ duration: 0.3 }}
                    style={{ width: 10, height: 10, borderRadius: "50%" }} />
                ))}
              </div>

              <button
                onClick={handleExplorePlanner}
                className="flex items-center gap-2 font-semibold text-white rounded-xl hover:scale-105 transition-transform mt-5"
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg,#2563eb,#38bdf8)",
                  boxShadow: "0 8px 28px rgba(37,99,235,0.4)",
                  fontSize: 14
                }}
              >
                Explore <ArrowRight size={16} />
              </button>
            </div>

            {/* RIGHT cards — hidden on small mobile, visible from md */}
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden" style={{ width: "48%" }}>
              <div style={{ position: "relative", width: N * STEP + 60, height: 420, flexShrink: 0 }}>
                <motion.div style={{
                  x: cardX, display: "flex", alignItems: "center", gap: CARD_GAP,
                  position: "absolute", right: -200, top: "50%", translateY: "-50%",
                }}>
                  {destinations.map((dest, i) => {
                    const isActive = i === activeIdx;
                    return (
                      <div key={dest.country}
                        className="relative flex-shrink-0 rounded-3xl overflow-hidden group"
                        style={{
                          width: isActive ? 250 : 190,
                          height: isActive ? 400 : 320,
                          transition: "width 0.4s ease, height 0.4s ease",
                          boxShadow: isActive ? "0 20px 50px rgba(0,0,0,0.6)" : "0 10px 30px rgba(0,0,0,0.4)",
                          border: isActive ? "1.5px solid rgba(0,212,224,0.55)" : "1.5px solid rgba(0,212,224,0.12)",
                        }}>
                        <img src={dest.card.image} alt={dest.card.title}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute top-4 left-4 right-10">
                          <p className="text-white font-semibold" style={{ fontSize: isActive ? 13 : 11 }}>{dest.card.title}</p>
                          <StarRating count={dest.card.stars} />
                        </div>
                        <button className="absolute rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                          style={{ top: 14, right: 14, width: 30, height: 30, fontSize: 12 }}><Bookmark size={14} /></button>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 right-6 md:right-14 flex items-center gap-2" style={{ zIndex: 4 }}>
            <span className="text-white font-bold" style={{ fontSize: 12 }}>0{activeIdx + 1}</span>
            <span className="text-white/30" style={{ fontSize: 12 }}>/</span>
            <span className="text-white/30" style={{ fontSize: 12 }}>0{N}</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE CTA ── */}
      <section className="relative overflow-hidden py-14 md:py-20" style={{ background: "#060a12" }}>
        <div className="absolute top-0 left-0 w-full h-16 pointer-events-none"
          style={{ background: "linear-gradient(180deg, #080c18 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 left-0 w-20 md:w-32 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #060a12, transparent)", zIndex: 10 }} />
        <div className="absolute inset-y-0 right-0 w-20 md:w-32 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #060a12, transparent)", zIndex: 10 }} />

        <MarqueeRow
          items={["Bali", "Paris", "Kyoto", "Santorini", "Dubai", "Maldives", "New York", "Bangkok"]}
          direction={1} speed={30} />

        <div className="relative z-10 text-center py-8 px-5">
          <p className="text-white/20 uppercase tracking-[0.3em] text-xs mb-3">Where do you want to go?</p>
          <h2 className="font-black text-white mb-5" style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", lineHeight: 1.1 }}>
            The World Is{" "}
            <span style={{ background: "linear-gradient(135deg, #00d4e0, #6366f1, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Waiting For You
            </span>
          </h2>
          <button
            onClick={() => {
              searchRef.current?.scrollIntoView({
                behavior: "smooth"
              })
            }}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-base hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg,#00c8d4,#2563eb)",
              boxShadow: "0 12px 40px rgba(0,200,212,0.25)"
            }}
          >
            Plan My Trip <ArrowRight size={20} />
          </button>
        </div>

        <MarqueeRow
          items={["Rome", "Cape Town", "Queenstown", "Phuket", "Amsterdam", "Istanbul", "Petra", "Machu Picchu"]}
          direction={-1} speed={30} />

        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#04070f" }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-14 pt-12 pb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-10 pb-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Brand */}
            <div className="max-w-xs">
              <div
                className="flex items-center gap-3 mb-3"
              >

                <div
                  style={{
                    width: 48,
                    height: 48,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0
                  }}
                >

                  <img
                    src={logo}
                    alt="GoVibe Logo"

                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block"
                    }}
                  />

                </div>

                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,

                    background:
                      "linear-gradient(90deg,#ffffff,#b9c7ff)",

                    WebkitBackgroundClip: "text",

                    WebkitTextFillColor:
                      "transparent",

                    letterSpacing: "-.5px"
                  }}
                >

                  GoVibe

                </span>

              </div>
              <p className="text-white/35 text-sm leading-relaxed">
                AI-powered travel planning that turns your dream destination into a detailed, budget-friendly itinerary in minutes.
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
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >

                    <s.icon
                      size={28}
                      color={s.color}
                    />

                  </button>

                ))}

              </div>
            </div>

            {/* Links — 2 col on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
                      path: "/about"
                    },

                    {
                      name: "Terms of Use",
                      path: "/about"
                    },

                    {
                      name: "Cookie Policy",
                      path: "/about"
                    }
                  ]
                }

              ].map(col => (
                <div key={col.heading}>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">{col.heading}</p>
                  <ul className="space-y-2.5">

                    {col.links.map((l) => (

                      <li key={l.name}>

                        {l.path ? (

                          <Link
                            to={l.path}
                            className="text-white/35 text-sm hover:text-white transition-colors duration-200"
                          >
                            {l.name}
                          </Link>

                        ) : (

                          <button
                            onClick={l.action}
                            className="text-white/35 text-sm hover:text-white transition-colors duration-200"
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6">
            <p className="text-white/25 text-xs">© 2026 GoVibe. All rights reserved.</p>

            <div
              className="text-white/20 text-xs"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <span>Made with</span>
              <Heart size={14} />
              <span>for travelers worldwide</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/25 text-xs">All systems operational</span>
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
  );
};

export default Home;