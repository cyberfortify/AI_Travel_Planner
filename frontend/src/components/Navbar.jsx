import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Plane,
  Info,
  HelpCircle,
  User,
  Menu,
  X,
} from "lucide-react";

import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";


const menuBtn = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  background: "transparent",
  color: "#fff",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 4,
};


export default function Navbar() {

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [authUser, setAuthUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const checkUser = () => {

      const stored = localStorage.getItem(
        "trevellyUser"
      );

      if (stored) {
        setAuthUser(JSON.parse(stored));
      } else {
        setAuthUser(null);
      }
    };

    checkUser();

    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkUser
      );
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("trevellyUser");
    setAuthUser(null);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Plane },
    { name: "About", path: "/about", icon: Info },
    { name: "Help", path: "/contact", icon: HelpCircle },
  ];

  return (
    <>
      <nav
        className="relative top-0 left-0 w-full z-50"
        style={{
          padding:
            window.innerWidth < 768
              ? "14px 16px"
              : "18px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding:
              window.innerWidth < 768
                ? "0 16px"
                : "0 24px",
            borderRadius: 24,
            background: "rgba(10,15,30,0.72)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.28)",
          }}
        >
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg,#00c8d4,#2563eb)",
                boxShadow:
                  "0 10px 30px rgba(0,200,212,0.35)",
              }}
            >
              <Plane size={18} color="white" />
            </div>

            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.4px",
              }}
            >
              Trevelly
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => {

              const active =
                location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium transition-all duration-200"
                  style={{
                    color: active
                      ? "#fff"
                      : "rgba(255,255,255,0.55)",

                    background: active
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",

                    padding: "10px 16px",

                    borderRadius: 14,

                    transition: "all .25s ease",

                    border: active
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid transparent",
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-3">

            {authUser ? (

              <div
                style={{
                  position: "relative",
                }}
              >

                {/* USER CARD */}
                <div
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    borderRadius: 14,
                    background:
                      "linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer",
                    minWidth: 190,
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.18)",
                  }}
                >

                  {/* AVATAR */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#00c8d4,#2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {authUser.name?.charAt(0)}
                  </div>

                  {/* INFO */}
                  <div style={{ flex: 1 }}>

                    <p
                      style={{
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      {authUser.name}
                    </p>

                    <p
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 11,
                        margin: 0,
                      }}
                    >
                      Traveler
                    </p>
                  </div>

                  {/* ARROW */}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                    }}
                  >
                    ▼
                  </span>
                </div>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      paddingTop: 10,
                      right: 0,
                      width: 220,
                      borderRadius: 20,
                      overflow: "hidden",
                      background:
                        "linear-gradient(180deg,rgba(14,20,38,0.98),rgba(8,13,28,0.98))",
                      backdropFilter: "blur(30px)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.45)",
                      zIndex: 999,
                      pointerEvents: "auto",
                    }}
                  >

                    {/* TOP */}
                    <div
                      style={{
                        padding: 18,
                        borderBottom:
                          "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          margin: "0 0 4px",
                          fontSize: 14,
                        }}
                      >
                        {authUser.name}
                      </p>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          margin: 0,
                          fontSize: 12,
                        }}
                      >
                        {authUser.email}
                      </p>
                    </div>

                    {/* MENU ITEMS */}
                    <div style={{ padding: 8 }}>

                      <button
                        onClick={() => navigate("/profile")}
                        style={menuBtn}
                      >
                        👤 Profile
                      </button>


                      <button
                        onClick={() => navigate("/saved-trips")}
                        style={menuBtn}
                      >
                        ❤️ Saved Trips
                      </button>

                      <button
                        onClick={handleLogout}
                        style={{
                          ...menuBtn,
                          color: "#ff6b6b",
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (

              <>
                <button
                  onClick={() => {
                    setAuthType("login");
                    setAuthOpen(true);
                  }}
                  className="text-sm font-semibold text-white px-4 py-2 rounded-lg"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    setAuthType("register");
                    setAuthOpen(true);
                  }}
                  className="text-sm font-semibold px-4 py-2 rounded-lg border"
                  style={{
                    color: "#00d4e0",
                    borderColor: "#00d4e0",
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

      </nav >

      {/* MOBILE MENU */}
      {
        mobileMenuOpen && (
          <div
            className="md:hidden mx-4 mt-2 p-4 rounded-2xl"
            style={{
              background:
                "linear-gradient(180deg,rgba(15,22,40,0.98),rgba(8,13,28,0.98))",
              border:
                "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >

            {navLinks.map((link) => {

              const active =
                location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  style={{
                    display: "block",
                    padding: "12px 14px",
                    borderRadius: 12,
                    marginBottom: 6,
                    textDecoration: "none",
                    color: active
                      ? "#fff"
                      : "rgba(255,255,255,0.55)",
                    background: active
                      ? "rgba(0,212,224,0.1)"
                      : "transparent",
                  }}
                >
                  {link.name}
                </Link>
              );
            })}

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                paddingTop: 12,
                borderTop:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >

              {authUser ? (

                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,

                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 12px",
                      borderRadius: 14,
                      background:
                        "rgba(255,255,255,0.04)",
                      border:
                        "1px solid rgba(255,255,255,0.06)",
                    }}
                  >

                    {/* AVATAR */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg,#00c8d4,#2563eb)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {authUser.name?.charAt(0)}
                    </div>

                    {/* NAME */}
                    <div>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          margin: 0,
                        }}
                      >
                        {authUser.name}
                      </p>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: 11,
                          margin: 0,
                        }}
                      >
                        Logged in
                      </p>
                    </div>
                  </div>
                </div>

              ) : (

                <>
                  <button
                    onClick={() => {
                      setAuthType("login");
                      setAuthOpen(true);
                    }}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "none",
                      background:
                        "rgba(255,255,255,0.06)",
                      color: "#fff",
                    }}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => {
                      setAuthType("register");
                      setAuthOpen(true);
                    }}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border:
                        "1px solid #00d4e0",
                      background: "transparent",
                      color: "#00d4e0",
                    }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )
      }

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        type={authType}
        setAuthUser={setAuthUser}
      />
    </>
  );
}