import { useState } from "react";
import {
  X, MapPin, Star, Wifi, Car, Coffee,
  Dumbbell, Waves, Heart, Share2,
  ChevronRight, ShieldCheck, Sparkles
} from "lucide-react";

const amenityIcons = {
  WiFi: { icon: <Wifi size={15} />, color: "#38bdf8" },
  Pool: { icon: <Waves size={15} />, color: "#34d399" },
  Gym: { icon: <Dumbbell size={15} />, color: "#f472b6" },
  Breakfast: { icon: <Coffee size={15} />, color: "#fb923c" },
  Parking: { icon: <Car size={15} />, color: "#a78bfa" },
};

const typeConfig = {
  Luxury: { dot: "#f59e0b", badge: "rgba(245,158,11,.18)", label: "✦ Luxury" },
  Budget: { dot: "#10b981", badge: "rgba(16,185,129,.18)", label: "✦ Budget" },
  default: { dot: "#6366f1", badge: "rgba(99,102,241,.18)", label: "✦ Recommended" },
};

export default function HotelModal({ hotel, onClose, isMobile, onLike, liked }) {
  const [tab, setTab] = useState("overview");
  if (!hotel) return null;

  const tc = typeConfig[hotel.type] ?? typeConfig.default;

  /* ── layout tokens ──────────────────────────────── */
  const heroH = isMobile ? 300 : 400;
  const radius = isMobile ? "28px 28px 0 0" : "32px";
  const bodyPad = isMobile ? "20px 18px 36px" : "30px 32px 40px";

  // SHARE HANDLER (uses Web Share API with clipboard fallback)
  const handleShareHotel = async () => {

    try {

      const shareText = `
          🏨 ${hotel.name}

          📍 ${hotel.location}

          ⭐ ${hotel.rating}/5

          ₹${hotel.price}/night

          Planned with GoVibe ✈️
          `;

      if (navigator.share) {

        await navigator.share({
          title: hotel.name,
          text: shareText,
        });

      } else {

        await navigator.clipboard.writeText(
          shareText
        );

        alert("Hotel details copied!");
      }

    } catch (err) {

      console.log(err);

    }
  };

  // VIEW MAP HANDLER (opens Google Maps search for hotel name + location)
  const handleViewMap = () => {

    const query = encodeURIComponent(
      `${hotel.name} ${hotel.location}`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };


  // RESERVE STAY HANDLER (opens Booking.com search for hotel name + location)
  const handleReserveStay = () => {

    const query = encodeURIComponent(
      `${hotel.name} ${hotel.location}`
    );

    window.open(
      `https://www.booking.com/searchresults.html?ss=${query}`,
      "_blank"
    );
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.78)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 20,
        animation: "fadeIn .2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideUp  { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        .hm-scroll::-webkit-scrollbar { display:none }
        .hm-btn-primary:hover  { filter:brightness(1.12); transform:translateY(-1px); }
        .hm-btn-secondary:hover{ background:rgba(255,255,255,.09)!important; transform:translateY(-1px); }
        .hm-amenity:hover  { background:rgba(255,255,255,.08)!important; border-color:rgba(255,255,255,.18)!important; }
        .hm-tab:hover      { color:#fff!important; }
        .hm-share:hover    { background:rgba(255,255,255,.14)!important; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        className="hm-scroll"
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 960,
          height: isMobile ? "95svh" : "auto",
          maxHeight: isMobile ? "95svh" : "92vh",
          overflowY: "auto",
          borderRadius: radius,
          background: "linear-gradient(170deg,#060e1c 0%,#0b1929 55%,#07111e 100%)",
          border: "1px solid rgba(255,255,255,.07)",
          boxShadow: "0 60px 140px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.04) inset",
          position: "relative",
          animation: "slideUp .32s cubic-bezier(.22,.68,0,1.2)",
        }}
      >
        {/* ── DRAG HANDLE (mobile) ─────────────────── */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
            <div style={{
              width: 48, height: 4, borderRadius: 99,
              background: "rgba(255,255,255,.2)",
            }} />
          </div>
        )}

        {/* ── HERO ─────────────────────────────────── */}
        <div style={{
          position: "relative", height: heroH, overflow: "hidden",
          borderRadius: isMobile ? "28px 28px 0 0" : "32px 32px 0 0"
        }}>
          <img
            src={hotel.image}
            alt={hotel.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: "scale(1.02)", transition: "transform 6s ease"
            }}
          />

          {/* layered gradients for legibility */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #060e1c 0%, rgba(6,14,28,.55) 45%, rgba(6,14,28,.10) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(120deg, rgba(0,212,224,.06) 0%, transparent 60%)",
          }} />

          {/* ── TOP ACTION BAR ── */}
          <div style={{
            position: "absolute", top: 18, left: 18, right: 18,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            {/* type badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 99,
              background: tc.badge,
              border: "1px solid rgba(255,255,255,.10)",
              backdropFilter: "blur(14px)",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: tc.dot, flexShrink: 0 }} />
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: .9, textTransform: "uppercase" }}>
                {tc.label}
              </span>
            </div>

            {/* icon actions */}
            <div style={{ display: "flex", gap: 9 }}>
              {[{
                icon: <Share2 size={16} />, cls: "hm-share",
                bg: "rgba(0,0,0,.38)", onClick: handleShareHotel
              }, {
                icon: <Heart size={16} fill={liked ? "#f43f5e" : "none"} color={liked ? "#f43f5e" : "#fff"} />,
                cls: "hm-share",
                bg: liked ? "rgba(244,63,94,.22)" : "rgba(0,0,0,.38)",
                onClick: onLike,
                style: liked ? { animation: "pulse .3s ease" } : {}
              }, {
                icon: <X size={18} />, cls: "hm-share",
                bg: "rgba(0,0,0,.38)", onClick: onClose
              }].map((b, i) => (
                <button key={i} className={b.cls} onClick={b.onClick}
                  style={{
                    width: 42, height: 42, borderRadius: "50%", border: "none",
                    background: b.bg,
                    backdropFilter: "blur(14px)",
                    color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .18s ease",
                    ...(b.style || {}),
                  }}>
                  {b.icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── HERO CONTENT ── */}
          <div style={{
            position: "absolute", bottom: 26, left: 24, right: 24,
          }}>
            {/* rating pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 11px", borderRadius: 99,
              background: "rgba(250,204,21,.15)",
              border: "1px solid rgba(250,204,21,.28)",
              marginBottom: 12,
            }}>
              <Star size={12} fill="#facc15" color="#facc15" />
              <span style={{ color: "#facc15", fontWeight: 800, fontSize: 12 }}>
                {hotel.rating ?? 4.5}
              </span>
              <span style={{ color: "rgba(250,204,21,.65)", fontSize: 11 }}>/ 5.0</span>
            </div>

            <h2 style={{
              fontSize: isMobile ? 30 : 50,
              fontWeight: 900, lineHeight: 1.05,
              color: "#fff", margin: "0 0 12px",
              textShadow: "0 2px 24px rgba(0,0,0,.5)",
              letterSpacing: "-0.5px",
            }}>
              {hotel.name}
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} color="#00d4e0" />
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>
                  {hotel.location}
                </span>
              </div>
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
              }} />
              <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>
                Free cancellation
              </span>
            </div>
          </div>
        </div>

        {/* ── PRICE + CTA STRIP ────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: "space-between",
          gap: 14,
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          background: "rgba(255,255,255,.022)",
        }}>
          <div>
            <span style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>Estimated price</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 }}>
              <span style={{
                fontSize: isMobile ? 34 : 42,
                fontWeight: 900, color: "#fff", letterSpacing: "-1px",
              }}>
                ₹{hotel.price?.toLocaleString()}
              </span>
              <span style={{ color: "rgba(255,255,255,.35)", fontSize: 13 }}>/night</span>
            </div>
          </div>

          <div style={{
            display: "flex", gap: 12,
            flexDirection: isMobile ? "column" : "row",
          }}>
            <button
              className="hm-btn-secondary"
              onClick={handleViewMap}
              style={{
                height: 50, padding: "0 26px", borderRadius: 14,
                border: "1px solid rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.04)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer", transition: "all .18s ease",
                display: "flex", alignItems: "center", gap: 8,
              }}>
              View on Map
            </button>

            <button className="hm-btn-primary"
              onClick={handleReserveStay}
              style={{
                height: 50, padding: "0 30px", borderRadius: 14, border: "none",
                background: "linear-gradient(130deg,#00d4e0,#2563eb)",
                color: "#fff", fontWeight: 800, fontSize: 14,
                cursor: "pointer", transition: "all .18s ease",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 8px 30px rgba(0,212,224,.28)",
              }}>
              Reserve Stay <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── TABS ─────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 0,
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}>
          {["overview", "amenities", "policies"].map(t => (
            <button key={t} className="hm-tab"
              onClick={() => setTab(t)}
              style={{
                padding: "16px 20px",
                border: "none", background: "transparent",
                color: tab === t ? "#00d4e0" : "rgba(255,255,255,.38)",
                fontWeight: tab === t ? 700 : 500,
                fontSize: 13, cursor: "pointer",
                borderBottom: tab === t ? "2px solid #00d4e0" : "2px solid transparent",
                marginBottom: "-1px",
                textTransform: "capitalize",
                transition: "all .15s ease",
                letterSpacing: ".3px",
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── BODY ─────────────────────────────────── */}
        <div style={{ padding: bodyPad }}>

          {tab === "overview" && (
            <>
              {/* AI PICK CARD */}
              <div style={{
                padding: "20px 22px",
                borderRadius: 20,
                background: "linear-gradient(120deg, rgba(0,212,224,.07), rgba(37,99,235,.07))",
                border: "1px solid rgba(0,212,224,.18)",
                marginBottom: 28,
                display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg,#00d4e0,#2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles size={17} color="#fff" />
                </div>
                <div>
                  <p style={{
                    color: "#00d4e0", fontWeight: 700, fontSize: 11,
                    letterSpacing: 1, textTransform: "uppercase", marginBottom: 6
                  }}>
                    Why GoVibe picked this
                  </p>
                  <p style={{
                    color: "rgba(255,255,255,.7)", fontSize: 14,
                    lineHeight: 1.75, margin: 0
                  }}>
                    {hotel.aiReason ?? "Ideal balance of comfort, accessibility and premium experience for your selected destination, travel duration and budget range."}
                  </p>
                </div>
              </div>

              {/* STATS ROW */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
                gap: 12, marginBottom: 28,
              }}>
                {[
                  { label: "Rating", value: `${hotel.rating ?? 4.5} ★`, accent: "#facc15" },
                  { label: "Reviews", value: `${hotel.reviews ?? "2.4k"}`, accent: "#34d399" },
                  { label: "Distance", value: hotel.distance ?? "1.2 km", accent: "#60a5fa" },
                  { label: "Check-in", value: hotel.checkIn ?? "12:00 PM", accent: "#c084fc" },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: "16px 18px", borderRadius: 18,
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(255,255,255,.06)",
                    textAlign: "center",
                  }}>
                    <p style={{
                      color: s.accent, fontWeight: 800, fontSize: isMobile ? 18 : 22,
                      margin: "0 0 4px"
                    }}>
                      {s.value}
                    </p>
                    <p style={{
                      color: "rgba(255,255,255,.38)", fontSize: 11,
                      textTransform: "uppercase", letterSpacing: .8, margin: 0
                    }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* NEARBY ATTRACTIONS */}
              <div style={{ marginBottom: 30 }}>

                <p
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 800,
                    marginBottom: 16,
                  }}
                >
                  Nearby Attractions
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >

                  {(hotel.nearby ?? [
                    "City Center",
                    "Beachfront",
                    "Metro Station",
                    "Night Market"
                  ]).map((place, i) => (

                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: 16,

                        background:
                          "rgba(255,255,255,.04)",

                        border:
                          "1px solid rgba(255,255,255,.06)",

                        color: "#fff",

                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      📍 {place}
                    </div>

                  ))}
                </div>
              </div>

              {/* WHY TRAVELERS LOVE IT */}
              <div>

                <p
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 800,
                    marginBottom: 16,
                  }}
                >
                  Why Travelers Love It
                </p>

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      isMobile
                        ? "1fr"
                        : "repeat(3,1fr)",

                    gap: 14,
                  }}
                >

                  {[
                    "Excellent location",
                    "Premium experience",
                    "Top-rated hospitality"
                  ].map((item, i) => (

                    <div
                      key={i}
                      style={{
                        padding: 18,
                        borderRadius: 18,

                        background:
                          "rgba(255,255,255,.03)",

                        border:
                          "1px solid rgba(255,255,255,.06)",
                      }}
                    >

                      <p
                        style={{
                          fontSize: 14,
                          color: "#fff",
                          fontWeight: 700,
                          margin: 0,
                        }}
                      >
                        ✦ {item}
                      </p>

                    </div>

                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "amenities" && (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
              gap: 12, marginBottom: 8,
            }}>
              {(hotel.amenities ?? ["WiFi", "Pool", "Gym", "Breakfast", "Parking"]).map((a, i) => {
                const cfg = amenityIcons[a] ?? { icon: <Wifi size={15} />, color: "#94a3b8" };
                return (
                  <div key={i} className="hm-amenity"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 18px", borderRadius: 18,
                      background: "rgba(255,255,255,.03)",
                      border: "1px solid rgba(255,255,255,.06)",
                      color: "rgba(255,255,255,.8)", fontSize: 14,
                      cursor: "default", transition: "all .15s ease",
                    }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: `${cfg.color}1a`,
                      border: `1px solid ${cfg.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: cfg.color, flexShrink: 0,
                    }}>
                      {cfg.icon}
                    </div>
                    <span style={{ fontWeight: 600 }}>{a}</span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "policies" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Free Cancellation", desc: "Cancel up to 24 hours before check-in for a full refund.", ok: true },
                { title: "No Prepayment", desc: "Pay at the property — no card charge until arrival.", ok: true },
                { title: "Pets Policy", desc: "Pets are not allowed on the premises.", ok: false },
                { title: "Smoking Policy", desc: "Smoking is strictly prohibited in all indoor areas.", ok: false },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "18px 20px", borderRadius: 18,
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: p.ok ? "rgba(52,211,153,.12)" : "rgba(251,113,133,.12)",
                    border: `1px solid ${p.ok ? "rgba(52,211,153,.25)" : "rgba(251,113,133,.25)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: p.ok ? "#34d399" : "#fb7185",
                  }}>
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
                      {p.title}
                    </p>
                    <p style={{ color: "rgba(255,255,255,.45)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}