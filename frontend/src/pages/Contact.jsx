import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import emailjs from "@emailjs/browser";
import {
  Bot,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Tag,
  Shield,
  Globe,
  Camera,
  Briefcase,
  Play,
  Send,
  HelpCircle,
  Radio,
  CheckCircle,
  ArrowRight,
  Plane
} from "lucide-react";

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const FAQS = [
  { q: "How fast will you respond?", a: "We typically respond within a few hours — never more than 24. For urgent issues, try our live chat." },
  { q: "Is GoVibe free to use?", a: "Yes. Core trip planning is completely free. No credit card, no hidden fees." },
  { q: "Can I request a custom destination?", a: "Absolutely — just mention it in your message and our team will manually build your plan." },
  { q: "Do you have a mobile app?", a: "A dedicated mobile app is in the works. For now, our web experience works great on all devices." },
];

function FloatingOrb({ style }) {
  return <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, ...style }} />;
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>{icon}</span>{label}
      </label>
      {children}
      {error && <p style={{ color: "#f87171", fontSize: 10, margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4 }}><span>⚠</span>{error}</p>}
    </div>
  );
}

export default function Contact() {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;
  const px = isMobile ? "20px" : isTablet ? "36px" : "56px";

  const [form, setForm] = useState({ name: "", email: "", type: "General", message: "" });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("idle"); // idle | sending | done
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [activeField, setActiveField] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initial bot message
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi 👋 I'm GoVibe AI. Ask me anything about destinations, budgets, hotels, or travel planning."
    }
  ]);

  // Simulate bot "typing" by showing a typing indicator for 1.5s before displaying the bot's response
  const sendMessage = async () => {

    if (!chatInput.trim()) return;

    const userText = chatInput;

    setMessages(prev => [
      ...prev,
      {
        type: "user",
        text: userText
      }
    ]);

    setChatInput("");

    setIsTyping(true);

    try {

      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: userText,
          }),
        }
      );

      const data =
        await response.json();

      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          type: "bot",
          text: data.reply,
        }
      ]);

    } catch {

      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          type: "bot",
          text:
            "Sorry, I couldn't connect right now.",
        }
      ]);

    }

  };

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === "message") setCharCount(value.length);
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const onSubmit = async () => {

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {

      setStep("sending");

      await emailjs.send(

        import.meta.env.VITE_EMAIL_SERVICE_ID,

        import.meta.env.VITE_EMAIL_TEMPLATE_ID,

        {
          name: form.name,
          email: form.email,
          type: form.type,
          message: form.message,
        },

        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );

      setStep("done");

      setForm({
        name: "",
        email: "",
        type: "General",
        message: ""
      });

      setCharCount(0);

      setTimeout(() => {
        setStep("idle");
      }, 6000);

    } catch (error) {

      console.log(error);

      alert("Failed to send message");

      setStep("idle");

    }
  };

  const types = ["General", "Support", "Partnership", "Feedback"];

  const handleEmail = () => {
    window.location.href = "mailto:support@govibe.com";
  };

  const handlePhone = () => {
    window.location.href = "tel:+919876543210";
  };

  const handleMap = () => {
    window.open(
      "https://maps.google.com/?q=Bangalore,India",
      "_blank"
    );
  };

  const socialLinks = {
    Twitter: "#",
    Instagram: "#",
    LinkedIn: "#",
    YouTube: "#",
  };

  const openSocial = (platform) => {
    const link = socialLinks[platform];

    if (link === "#") {
      alert(`${platform} profile coming soon 🚀`);
    } else {
      window.open(link, "_blank");
    }
  };

  const inputStyle = (name) => ({
    width: "100%", boxSizing: "border-box",
    padding: "13px 16px",
    borderRadius: 14, fontSize: 13,
    background: activeField === name
      ? "rgba(0,212,224,0.04)"
      : errors[name]
        ? "rgba(239,68,68,0.05)"
        : "rgba(255,255,255,0.03)",
    border: `1.5px solid ${activeField === name
      ? "rgba(0,212,224,0.5)"
      : errors[name]
        ? "rgba(239,68,68,0.5)"
        : "rgba(255,255,255,0.07)"
      }`,
    color: "#fff", outline: "none",
    caretColor: "#00d4e0",
    transition: "all .2s",
    fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#060d18", fontFamily: "'Inter',system-ui,sans-serif", color: "#fff", overflowX: "hidden" }}>

      {/* Orbs */}
      <FloatingOrb style={{ top: "-15%", left: "-10%", width: "55vw", height: "55vw", background: "radial-gradient(circle,rgba(0,180,210,0.09),transparent 65%)" }} />
      <FloatingOrb style={{ top: "40%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)" }} />
      <FloatingOrb style={{ bottom: "-10%", left: "30%", width: "35vw", height: "35vw", background: "radial-gradient(circle,rgba(245,158,11,0.04),transparent 65%)" }} />

      {/* ── NAV ── */}
      <Navbar />

      {/* Success Toast */}

      {step === "done" && (

        <div
          style={{
            position: "fixed",
            top: 30,
            right: 20,
            zIndex: 9999,

            padding: "14px 18px",
            minWidth: "300px",

            borderRadius: 16,

            background:
              "rgba(10,20,35,0.92)",

            backdropFilter:
              "blur(18px)",

            border:
              "1px solid rgba(16,185,129,.3)",

            boxShadow:
              "0 10px 35px rgba(16,185,129,.15)",

            display: "flex",
            alignItems: "center",
            gap: 12,

            animation:
              "slideToast .4s ease"
          }}
        >

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",

              background:
                "rgba(16,185,129,.15)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: 20
            }}
          >
            <CheckCircle
              size={20}
              color="#10b981"
            />
          </div>

          <div>

            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 14,
                color: "#10b981"
              }}
            >
              Message sent successfully
            </p>

            <p
              style={{
                margin: "3px 0 0",
                fontSize: 12,
                color: "rgba(255,255,255,.55)"
              }}
            >
              We'll get back to you soon
            </p>

          </div>

        </div>

      )}

      <div style={{ position: "relative", zIndex: 5 }}>

        {/* ── SPLIT HERO ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: `${isMobile ? "52px" : "72px"} ${px} ${isMobile ? "48px" : "60px"}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isDesktop ? 60 : 0, alignItems: "center" }}>

            {/* Left headline */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 99, background: "rgba(0,212,224,0.06)", border: "1px solid rgba(0,212,224,0.18)", fontSize: 11, fontWeight: 700, color: "#00d4e0", letterSpacing: 1.1, textTransform: "uppercase", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4e0", display: "inline-block", animation: "pulse 2s infinite" }} />
                We're here to help
              </div>
              <h1 style={{ fontSize: `clamp(${isMobile ? "2rem" : "2.6rem"},5.5vw,4.2rem)`, fontWeight: 900, lineHeight: 1.06, letterSpacing: "-.025em", margin: "0 0 20px" }}>
                Let's Start<br />a{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ background: "linear-gradient(135deg,#00d4e0,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Conversation</span>
                  <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", overflow: "visible" }} height="6" viewBox="0 0 200 6">
                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#00d4e0" strokeWidth="1.5" fill="none" opacity=".5" />
                  </svg>
                </span>
              </h1>
              <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.85, maxWidth: 420, margin: "0 0 32px" }}>
                Whether it's a question, idea, or just a hello — we read every message and reply thoughtfully, not with templates.
              </p>

              {/* stat row */}
              <div style={{ display: "flex", gap: isMobile ? 20 : 32, flexWrap: "wrap" }}>
                {[{ v: "< 24h", l: "Response time" }, { v: "98%", l: "Satisfaction" }, { v: "Real", l: "Human support" }].map((s, i) => (
                  <div
                    key={i}
                    onClick={() => openSocial(s.platform)}
                  >
                    <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 900, margin: "0 0 2px", background: "linear-gradient(135deg,#fff,rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0, fontWeight: 500 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* contact chips — desktop only */}
              {!isMobile && (
                <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
                  {[
                    { icon: "📧", label: "support@GoVibe.com", color: "#00d4e0" },
                    { icon: "📞", label: "+91 98765 43210", color: "#6366f1" },
                  ].map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 99, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "44"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
                      <span><c.icon
                        size={14}
                        color={c.color}
                      /></span><span>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — decorative card on desktop */}
            {isDesktop && (
              <div style={{ position: "relative" }}>
                <div style={{ borderRadius: 28, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", padding: "28px 28px 24px", backdropFilter: "blur(20px)" }}>
                  {/* "typing" animation header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#00c8d4,#1a6fcc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}><Plane size={18} color="#fff" /></div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 1px" }}>GoVibe AI Travel Assistant</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Online now</span>
                      </div>
                    </div>
                  </div>


                  {/* ── Chatbot Messages ── */}
                  <div style={{ marginTop: 0, paddingTop: 0 }}>

                    {/* Chat window */}
                    <div
                      ref={chatContainerRef}
                      style={{
                        height: 250,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 14,
                        paddingRight: 4,
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(0,212,224,0.2) transparent",
                      }}
                    >
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 7,
                            flexDirection: msg.type === "user" ? "row-reverse" : "row",
                            animation: "fadeSlideIn 0.3s ease forwards",
                          }}
                        >
                          {/* Avatar */}
                          {msg.type === "bot" && (
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                flexShrink: 0,
                                boxShadow: "0 0 10px rgba(0,200,212,0.35)",
                              }}
                            >
                              <Bot size={14} color="#fff" />
                            </div>
                          )}
                          {msg.type === "user" && (
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "rgba(99,102,241,0.3)",
                                border: "1.5px solid rgba(99,102,241,0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                flexShrink: 0,
                              }}
                            >
                              <Field
                                label="Email Address"
                                icon={<Mail size={12} />}
                              />
                            </div>
                          )}

                          {/* Bubble */}
                          <div
                            style={{
                              maxWidth: "75%",
                              padding: "10px 14px",
                              borderRadius:
                                msg.type === "user"
                                  ? "16px 4px 16px 16px"
                                  : "4px 16px 16px 16px",
                              background:
                                msg.type === "user"
                                  ? "linear-gradient(135deg,#00c8d4,#1a6fcc)"
                                  : "rgba(255,255,255,0.06)",
                              border:
                                msg.type === "user"
                                  ? "none"
                                  : "1px solid rgba(255,255,255,0.08)",
                              fontSize: 12,
                              color: "#fff",
                              lineHeight: 1.6,
                              boxShadow:
                                msg.type === "user"
                                  ? "0 4px 14px rgba(0,180,210,0.25)"
                                  : "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              flexShrink: 0,
                            }}
                          >
                            <Bot size={14} color="#fff" />
                          </div>

                          <div
                            style={{
                              padding: "10px 14px",
                              borderRadius: "4px 16px 16px 16px",
                              background: "rgba(255,255,255,0.06)",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 4,
                              }}
                            >
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick suggestion chips */}
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 12,
                      }}
                    >
                      {[
                        "🏖️ Goa budget",
                        "👨‍👩‍👧 Family trip",
                        "💑 Couple getaway",
                        "🏨 Best hotels",
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => {

                            const text =
                              chip.split(" ")
                                .slice(1)
                                .join(" ");

                            setChatInput("");

                            setTimeout(async () => {

                              setMessages(prev => [
                                ...prev,
                                {
                                  type: "user",
                                  text,
                                }
                              ]);

                              setIsTyping(true);

                              try {

                                const response =
                                  await fetch(
                                    "http://localhost:8000/chat",
                                    {
                                      method: "POST",
                                      headers: {
                                        "Content-Type":
                                          "application/json",
                                      },
                                      body: JSON.stringify({
                                        message: text,
                                      }),
                                    }
                                  );

                                const data =
                                  await response.json();

                                setMessages(prev => [
                                  ...prev,
                                  {
                                    type: "bot",
                                    text: data.reply,
                                  }
                                ]);

                              } finally {

                                setIsTyping(false);

                              }

                            }, 100);

                          }}
                          style={{
                            padding: "5px 11px",
                            borderRadius: 99,
                            fontSize: 10,
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "1px solid rgba(0,212,224,0.25)",
                            background: "rgba(0,212,224,0.06)",
                            color: "rgba(255,255,255,0.55)",
                            transition: "all .2s",
                            letterSpacing: 0.3,
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(0,212,224,0.14)";
                            e.currentTarget.style.color = "#00d4e0";
                            e.currentTarget.style.borderColor = "rgba(0,212,224,0.5)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(0,212,224,0.06)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                            e.currentTarget.style.borderColor = "rgba(0,212,224,0.25)";
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Input row */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        padding: "8px 10px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        transition: "border-color .2s",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,224,0.4)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                    >
                      <span style={{ fontSize: 14, opacity: 0.4 }}><MessageCircle
                        size={14}
                        color="rgba(255,255,255,.4)"
                      /></span>
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about travel…"
                        style={{
                          flex: 1,
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          outline: "none",
                          fontSize: 12,
                          caretColor: "#00d4e0",
                          fontFamily: "inherit",
                        }}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isTyping}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          border: "none",

                          cursor:
                            isTyping
                              ? "not-allowed"
                              : "pointer",

                          opacity:
                            isTyping
                              ? 0.6
                              : 1,

                          background: chatInput.trim()
                            ? "linear-gradient(135deg,#00c8d4,#1a6fcc)"
                            : "rgba(255,255,255,0.07)",

                          color: "#fff",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          fontSize: 13,

                          transition: "all .2s",

                          flexShrink: 0,

                          boxShadow: chatInput.trim()
                            ? "0 4px 12px rgba(0,180,210,0.3)"
                            : "none",
                        }}
                      >
                        {isTyping ? "..." : <Send size={14} />}
                      </button>
                    </div>

                    {/* Powered-by line */}
                    <p
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.18)",
                        textAlign: "center",
                        margin: "10px 0 0",
                        letterSpacing: 0.4,
                      }}
                    >
                      ⚡ Powered by GoVibe AI
                    </p>
                  </div>

                </div>
                {/* decorative glow behind card */}
                <div style={{ position: "absolute", inset: "-20px", borderRadius: 40, background: "radial-gradient(circle,rgba(0,212,224,0.06),transparent 70%)", zIndex: -1, pointerEvents: "none" }} />
              </div>


            )}
          </div>
        </section>

        {/* ── FORM + SIDEBAR ── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: `0 ${px} ${isMobile ? "72px" : "100px"}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1.5fr 1fr" : "1fr", gap: isDesktop ? 28 : 24, alignItems: "start" }}>

            {/* ── FORM CARD ── */}
            <div style={{ borderRadius: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>

              {/* card top strip */}
              <div style={{ height: 3, background: "linear-gradient(90deg,#00c8d4,#6366f1,#ec4899)" }} />

              <div style={{ padding: isMobile ? "24px 20px 28px" : "32px 32px 36px" }}>
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, margin: "0 0 6px" }}>Send a message</h2>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>No bots. No templates. Just real humans who care.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                    <Field label="Full Name" icon={<User size={14} color="rgba(255,255,255,0.4)" />} error={errors.name}>
                      <input name="name" value={form.name} onChange={onChange} placeholder="Arjun Sharma"
                        style={inputStyle("name")}
                        onFocus={() => setActiveField("name")}
                        onBlur={() => setActiveField(null)} />
                    </Field>
                    <Field label="Email Address" icon={<Mail size={14} color="rgba(255,255,255,0.4)" />} error={errors.email}>
                      <input name="email" value={form.email} onChange={onChange} placeholder="you@example.com"
                        style={inputStyle("email")}
                        onFocus={() => setActiveField("email")}
                        onBlur={() => setActiveField(null)} />
                    </Field>
                  </div>

                  {/* Type selector */}
                  <Field label="Message Type" icon={<Field
                    label="Message Type"
                    icon={<Tag size={12} />}
                  />}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {types.map(t => (
                        <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                          style={{
                            padding: "8px 18px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                            background: form.type === t ? "linear-gradient(135deg,rgba(0,200,212,0.2),rgba(99,102,241,0.15))" : "rgba(255,255,255,0.03)",
                            borderColor: form.type === t ? "rgba(0,212,224,0.55)" : "rgba(255,255,255,0.08)",
                            color: form.type === t ? "#00d4e0" : "rgba(255,255,255,0.4)",
                            transition: "all .2s",
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* Message */}
                  <Field label="Your Message" icon={<MessageCircle size={14} color="rgba(255,255,255,0.4)" />} error={errors.message}>
                    <div style={{ position: "relative" }}>
                      <textarea name="message" value={form.message} onChange={onChange} rows={5}
                        placeholder="Tell us what's on your mind…"
                        style={{ ...inputStyle("message"), paddingTop: 14, resize: "vertical", lineHeight: 1.65 }}
                        onFocus={() => setActiveField("message")}
                        onBlur={() => setActiveField(null)} />
                      <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 10, color: "rgba(255,255,255,0.2)", pointerEvents: "none" }}>{charCount}/500</span>
                    </div>
                  </Field>

                  {/* Submit */}
                  <button onClick={onSubmit} disabled={step === "sending"}
                    style={{
                      width: "100%", padding: "15px", borderRadius: 14, border: "none",
                      background: step === "sending" ? "rgba(0,180,210,0.25)" : "linear-gradient(135deg,#00c8d4,#1a6fcc)",
                      color: "#fff", fontSize: 14, fontWeight: 700, cursor: step === "sending" ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                      boxShadow: step === "sending" ? "none" : "0 8px 28px rgba(0,180,210,0.28)",
                      transition: "transform .15s, box-shadow .15s",
                    }}
                    onMouseEnter={e => { if (step !== "sending") { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,180,210,0.38)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,180,210,0.28)"; }}>
                    {step === "sending" ? (
                      <><svg style={{ animation: "spin 1s linear infinite" }} width={15} height={15} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="10" /></svg>Sending…</>
                    ) : <>Send Message <span style={{ fontSize: 16 }}>→</span></>}
                  </button>

                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", textAlign: "center", margin: 0 }}>
                    <Shield size={12} /> Your data is private and never shared with third parties.
                  </p>
                </div>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Availability */}
              <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", padding: "22px 22px", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", top: "-40%", right: "-30%", width: 180, height: 180, background: "radial-gradient(circle,rgba(0,212,224,0.07),transparent 70%)", pointerEvents: "none" }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 16px" }}><Radio size={12} />
                  Reach Us</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "support@GoVibe.com",
                      color: "#00d4e0",
                      action: handleEmail
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: "+91 98765 43210",
                      color: "#6366f1",
                      action: handlePhone
                    },
                    {
                      icon: MapPin,
                      label: "Office",
                      value: "Bangalore, India",
                      color: "#f59e0b",
                      action: handleMap
                    }
                  ].map((c, i) => (
                    <div key={i} onClick={c.action} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 13, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "all .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "44"; e.currentTarget.style.background = `${c.color}08`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: `${c.color}15`, border: `1px solid ${c.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}><c.icon
                        size={14}
                        color={c.color}
                      /></div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: c.color, letterSpacing: .8, textTransform: "uppercase", margin: "0 0 2px" }}>{c.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0 }}>{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", padding: "22px 22px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 14px" }}><Globe size={12} /> Social</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                  {[
                    { platform: "Twitter", handle: "@GoVibe_ai", emoji: "𝕏", color: "#00d4e0" },
                    { platform: "Instagram", handle: "@GoVibe", emoji: <Instagram size={14} color="#ec4899" />, color: "#ec4899" },
                    { platform: "LinkedIn", handle: "GoVibe", emoji: <Linkedin size={18} />, color: "#6366f1" },
                    { platform: "YouTube", handle: "GoVibe AI", emoji: <Youtube size={18} />, color: "#f59e0b" },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid rgba(255,255,255,0.06)`, cursor: "pointer", transition: "all .2s", textAlign: "center" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "44"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = `${s.color}0a`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}>
                      <div style={{ fontSize: 20, marginBottom: 5 }}>{s.emoji}</div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>{s.platform}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", margin: 0 }}>{s.handle}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* FAQ */}
          <div
            style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "22px",
              marginTop: "28px"
            }}
          >

            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.2,
                marginBottom: 14,
                color: "rgba(255,255,255,0.3)"
              }}
            >
              <HelpCircle size={12} />
              FAQ
            </p>

            {FAQS.map((f, i) => (

              <div
                key={i}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)"
                }}
              >

                <div
                  onClick={() =>
                    setOpenFaq(
                      openFaq === i ? null : i
                    )
                  }
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer"
                  }}
                >

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {f.q}
                  </span>

                  <span>
                    {openFaq === i ? "−" : "+"}
                  </span>

                </div>

                {openFaq === i && (

                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.45)",
                      marginTop: 10,
                      lineHeight: 1.7
                    }}
                  >
                    {f.a}
                  </p>

                )}

              </div>

            ))}

          </div>
        </section>
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }


        @keyframes slideToast{
          from{
          opacity:0;
          transform:
          translateX(100px);
          }

          to{
          opacity:1;
          transform:
          translateX(0);
          }

          }

          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .typing-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#00d4e0;
  animation:typingBounce 1.2s infinite;
}

.typing-dot:nth-child(2){
  animation-delay:.2s;
}

.typing-dot:nth-child(3){
  animation-delay:.4s;
}

@keyframes typingBounce{
  0%,80%,100%{
    transform:translateY(0);
    opacity:.4;
  }

  40%{
    transform:translateY(-4px);
    opacity:1;
  }
}
      `}</style>
    </div>
  );
}