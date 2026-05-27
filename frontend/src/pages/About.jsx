import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function Badge({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 14px", borderRadius: 99,
      background: "rgba(0,212,224,0.07)", border: "1px solid rgba(0,212,224,0.2)",
      fontSize: 11, fontWeight: 700, color: "#00d4e0", letterSpacing: 1, textTransform: "uppercase",
    }}>{children}</span>
  );
}

function AnimatedNumber({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = null;
        const duration = 1600;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { icon: "⚡", color: "#00d4e0", glow: "rgba(0,212,224,0.12)", title: "Instant Planning", desc: "Generate a full day-wise itinerary in under 30 seconds — no research, no tabs, no stress." },
  { icon: "💰", color: "#10b981", glow: "rgba(16,185,129,0.12)", title: "Budget-Smart", desc: "Every rupee is distributed across stays, food, transport & activities. Stay on track, always." },
  { icon: "🏨", color: "#6366f1", glow: "rgba(99,102,241,0.12)", title: "Curated Hotels", desc: "Handpicked accommodations filtered by your budget and destination — no surprises on checkout." },
  { icon: "🌍", color: "#f59e0b", glow: "rgba(245,158,11,0.12)", title: "500+ Destinations", desc: "From Bali beaches to Himalayan peaks — GoVibe knows where you want to be." },
  { icon: "📱", color: "#ec4899", glow: "rgba(236,72,153,0.12)", title: "Beautifully Simple", desc: "Three fields. One click. A complete trip plan. No learning curve whatsoever." },
  { icon: "🔄", color: "#8b5cf6", glow: "rgba(139,92,246,0.12)", title: "Always Improving", desc: "Our AI and destination data is continuously updated so your plans stay fresh and accurate." },
];

const STATS = [
  { value: 10000, suffix: "+", label: "Trips Planned", icon: "🗺️" },
  { value: 500, suffix: "+", label: "Destinations", icon: "📍" },
  { value: 98, suffix: "%", label: "Happy Travelers", icon: "😊" },
  { value: 30, suffix: "s", label: "Avg Plan Time", icon: "⚡" },
];

const TEAM = [
  { name: "Ansh Sharma", role: "Founder & CEO", emoji: "👨‍💼", color: "#00d4e0" },
  { name: "Priya Mehta", role: "Head of AI", emoji: "👩‍💻", color: "#6366f1" },
  { name: "Rahul Verma", role: "Lead Designer", emoji: "🎨", color: "#f59e0b" },
  { name: "Sneha Pillai", role: "Travel Curator", emoji: "🌏", color: "#10b981" },
];

const TIMELINE = [
  { year: "2023", title: "The Idea", desc: "Born out of frustration with 10-tab travel planning. We knew there was a better way." },
  { year: "Q1 2024", title: "Beta Launch", desc: "First version shipped to 200 early users. 94% said they'd use it again." },
  { year: "Q3 2024", title: "500+ Destinations", desc: "Expanded our destination database and launched budget intelligence engine." },
  { year: "2025", title: "10K Trips Planned", desc: "Passed a major milestone. Travelers from 30+ countries had used GoVibe." },
  { year: "Today", title: "Growing Fast", desc: "Continuous AI improvements, new features, and a community of passionate travelers." },
];

export default function About() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const px = isMobile ? "20px" : isTablet ? "32px" : "48px";
  const location = useLocation();
  const navigate = useNavigate();

  const featureRef = useRef(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr";
  const statsCols = isMobile ? "1fr 1fr" : "repeat(4,1fr)";
  const teamCols = isMobile ? "1fr 1fr" : isTablet ? "repeat(4,1fr)" : "repeat(4,1fr)";

  const goToHomeSearch = () => {
    navigate("/", {
      state: {
        scrollToSearch: true
      }
    });
  };

  const goToFeatures = () => {
    featureRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const watchDemo = () => {
    alert("Demo video coming soon 🚀");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#07101f 0%,#0a1628 40%,#060e1c 100%)",
      fontFamily: "'Inter',system-ui,sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      {/* Ambient glows */}
      <div style={{ position: "fixed", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle,rgba(0,180,210,0.10),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-10%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAV ── */}
      <Navbar />

      <div style={{ position: "relative", zIndex: 5 }}>

        {/* ── HERO ── */}
        <section style={{ padding: `${isMobile ? "52px" : "80px"} ${px} ${isMobile ? "60px" : "90px"}`, textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <Badge>✨ Your AI Travel Companion</Badge>
          <h1 style={{ fontSize: `clamp(${isMobile ? "1.8rem" : "2.4rem"},6vw,4rem)`, fontWeight: 900, margin: "22px 0 18px", lineHeight: 1.08, letterSpacing: "-.02em" }}>
            We're Building the<br />
            <span style={{ background: "linear-gradient(135deg,#00d4e0,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Future of Travel Planning
            </span>
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 580, margin: "0 auto 32px" }}>
            GoVibe is an AI-powered travel planner that turns your destination dreams into
            detailed, budget-friendly itineraries — in seconds, not hours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={goToHomeSearch}
              style={{
                padding: isMobile ? "11px 22px" : "13px 28px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                color: "#fff",
                fontSize: isMobile ? 13 : 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(0,180,210,0.3)"
              }}
            >
              Start Planning Free →
            </button>
            <button
              disabled
              title="Coming Soon"
              style={{
                padding: isMobile ? "11px 22px" : "13px 28px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.35)",
                fontSize: isMobile ? 13 : 14,
                fontWeight: 600,
                cursor: "not-allowed",
                opacity: 0.6
              }}
            >
              Watch Demo (Coming Soon) ▶
            </button>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 12 : 20, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {["No credit card", "Free to use", "Instant results"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "#10b981" }}>✓</span>{t}
              </span>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "56px" : "80px"}` }}>
          <div style={{
            display: "grid", gridTemplateColumns: statsCols, gap: isMobile ? 14 : 20,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24, padding: isMobile ? "24px 20px" : "40px 32px",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: isMobile ? "8px 0" : "0" }}>
                <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: `clamp(1.6rem,${isMobile ? "5vw" : "4vw"},2.8rem)`, fontWeight: 900, background: "linear-gradient(135deg,#00d4e0,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: isMobile ? 11 : 13, color: "rgba(255,255,255,0.38)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MISSION ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "60px" : "90px"}` }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
            gap: isDesktop ? 48 : 36,
            alignItems: "center",
          }}>
            <div>
              <Badge>🎯 Our Purpose</Badge>
              <h2 style={{ fontSize: `clamp(${isMobile ? "1.5rem" : "1.8rem"},4vw,2.6rem)`, fontWeight: 900, margin: "20px 0 18px", lineHeight: 1.15 }}>
                Travel Should Be<br />Experienced, Not{" "}
                <span style={{ background: "linear-gradient(135deg,#00d4e0,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Spreadsheet-Managed</span>
              </h2>
              <p style={{ fontSize: isMobile ? 13 : 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 14 }}>
                We built GoVibe because planning a trip shouldn't feel like a second job.
                Hours of research, 20 open tabs, conflicting reviews — it's exhausting.
              </p>
              <p style={{ fontSize: isMobile ? 13 : 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.8 }}>
                Whether you're a solo backpacker, a family planner, or a spontaneous weekend-tripper —
                GoVibe gives you a smart, personalised itinerary in seconds.
              </p>
            </div>

            {/* Mock itinerary card */}
            <div style={{
              borderRadius: 24, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              padding: isMobile ? "22px 18px" : "28px",
              overflow: "hidden", position: "relative",
            }}>
              <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>📅 Your Goa Itinerary</span>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: 700 }}>7 Days</span>
              </div>
              {[
                { day: 1, title: "Arrival & Baga Beach", color: "#00d4e0" },
                { day: 2, title: "Fort Aguada & Old Goa", color: "#6366f1" },
                { day: 3, title: "Anjuna Market & Water Sports", color: "#f59e0b" },
                { day: 4, title: "Dudhsagar Waterfalls Trip", color: "#10b981" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "11px 13px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${item.color}22`, marginBottom: 8, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${item.color}18`, border: `1px solid ${item.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: item.color, flexShrink: 0 }}>{item.day}</div>
                  <span style={{ fontSize: isMobile ? 11 : 12, color: "rgba(255,255,255,0.6)" }}>{item.title}</span>
                </div>
              ))}
              <div style={{ textAlign: "center", padding: "8px 0 0", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>+ 3 more days planned</div>
              <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 200, height: 200, background: "radial-gradient(circle,rgba(0,212,224,0.07),transparent 70%)", pointerEvents: "none" }} />
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section ref={featureRef} style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "60px" : "90px"}` }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <Badge>⭐ Why Choose Us</Badge>
            <h2 style={{ fontSize: `clamp(${isMobile ? "1.5rem" : "1.8rem"},4vw,2.6rem)`, fontWeight: 900, margin: "20px 0 10px", lineHeight: 1.1 }}>
              Why Travelers Love GoVibe
            </h2>
            <p style={{ fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,0.35)", maxWidth: 460, margin: "0 auto" }}>
              Smart features designed to make your journey seamless from idea to departure.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: featureCols, gap: isMobile ? 14 : 18 }}>
            {FEATURES.map((f, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: isMobile ? "20px 18px" : "28px 26px",
                  borderRadius: 20, cursor: "default",
                  background: hoveredFeature === i ? f.glow : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hoveredFeature === i ? f.color + "44" : "rgba(255,255,255,0.06)"}`,
                  transform: hoveredFeature === i ? "translateY(-5px)" : "translateY(0)",
                  boxShadow: hoveredFeature === i ? `0 16px 40px ${f.glow}` : "none",
                  transition: "all .3s ease",
                }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: f.glow, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14, transition: "transform .3s", transform: hoveredFeature === i ? "scale(1.1)" : "scale(1)" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: "#fff", margin: "0 0 7px" }}>{f.title}</h3>
                <p style={{ fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "60px" : "90px"}` }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <Badge>📖 Our Story</Badge>
            <h2 style={{ fontSize: `clamp(${isMobile ? "1.5rem" : "1.8rem"},4vw,2.6rem)`, fontWeight: 900, margin: "20px 0 10px" }}>
              The GoVibe Journey
            </h2>
          </div>
          <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
            <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg,#00d4e0,#6366f1,rgba(255,255,255,0.04))", zIndex: 0 }} />
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 28 : 36, position: "relative", zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#00c8d4,#1a6fcc)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px rgba(0,200,212,0.12)" }}>
                  <span style={{ fontSize: 13 }}>✦</span>
                </div>
                <div style={{ paddingTop: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#00d4e0", letterSpacing: 1, textTransform: "uppercase" }}>{t.year}</span>
                  <h4 style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: "#fff", margin: "4px 0 5px" }}>{t.title}</h4>
                  <p style={{ fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "60px" : "90px"}` }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <Badge>👥 The Team</Badge>
            <h2 style={{ fontSize: `clamp(${isMobile ? "1.5rem" : "1.8rem"},4vw,2.6rem)`, fontWeight: 900, margin: "20px 0 10px" }}>
              People Behind GoVibe
            </h2>
            <p style={{ fontSize: isMobile ? 12 : 14, color: "rgba(255,255,255,0.35)", maxWidth: 420, margin: "0 auto" }}>
              A small, passionate team obsessed with making travel planning effortless.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: teamCols, gap: isMobile ? 12 : 18 }}>
            {TEAM.map((m, i) => (
              <div key={i}
                style={{
                  padding: isMobile ? "22px 14px" : "28px 20px",
                  borderRadius: 20, textAlign: "center",
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all .3s", cursor: "default",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + "44"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ width: isMobile ? 52 : 62, height: isMobile ? 52 : 62, borderRadius: 18, background: `linear-gradient(135deg,${m.color}22,${m.color}08)`, border: `1.5px solid ${m.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 22 : 26, margin: "0 auto 12px" }}>
                  {m.emoji}
                </div>
                <p style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{m.name}</p>
                <p style={{ fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: `0 ${px} ${isMobile ? "70px" : "100px"}` }}>
          <div style={{
            borderRadius: isMobile ? 20 : 28,
            background: "linear-gradient(135deg,rgba(0,180,210,0.1),rgba(99,102,241,0.08))",
            border: "1px solid rgba(0,212,224,0.15)",
            padding: isMobile ? "40px 24px" : isTablet ? "50px 40px" : "60px 48px",
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-40%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle,rgba(0,212,224,0.07),transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Badge>🚀 Get Started</Badge>
              <h2 style={{ fontSize: `clamp(${isMobile ? "1.5rem" : "1.8rem"},4vw,2.8rem)`, fontWeight: 900, margin: "20px 0 12px", lineHeight: 1.1 }}>
                Ready for a Stress-Free Trip?
              </h2>
              <p style={{ fontSize: isMobile ? 13 : 15, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>
                Join thousands of travelers who've already ditched the planning headache.
                Your next adventure is three fields away.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={goToHomeSearch}
                  style={{
                    padding: isMobile ? "12px 24px" : "14px 32px",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                    color: "#fff",
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(0,180,210,0.35)",
                    width: isMobile ? "100%" : "auto"
                  }}
                >
                  Start Planning Now →
                </button>
                <button
                  onClick={goToFeatures}
                  style={{
                    padding: isMobile ? "12px 24px" : "14px 32px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: isMobile ? 13 : 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    width: isMobile ? "100%" : "auto"
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}