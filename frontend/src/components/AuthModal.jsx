import { useState } from "react";
import { X } from "lucide-react";
import { registerUser, loginUser } from "../services/api";

export default function AuthModal({
  open,
  onClose,
  type = "login",
  setAuthUser,
}) {

  const [mode, setMode] = useState(type);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      if (mode === "register") {

        const res = await registerUser(formData);

        localStorage.setItem(
          "trevellyUser",
          JSON.stringify(res.user)
        );

        window.dispatchEvent(
          new Event("storage")
        );

        setAuthUser(res.user);

      } else {

        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem(
          "trevellyUser",
          JSON.stringify(res.user)
        );

        window.dispatchEvent(
          new Event("storage")
        );

        setAuthUser(res.user);
      }

      onClose();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(10px)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(8,13,28,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          padding: 28,
        }}
      >

        {/* Top */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >

          <div>
            <h2
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
              }}
            >
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                marginTop: 6,
              }}
            >
              Continue your AI travel journey
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(135deg,#00c8d4,#1a6fcc)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>

        </form>

        {/* Switch */}
        <p
          style={{
            marginTop: 18,
            textAlign: "center",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
          }}
        >
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
            style={{
              marginLeft: 6,
              background: "none",
              border: "none",
              color: "#00d4e0",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontSize: 14,
  marginBottom: 14,
  outline: "none",
  boxSizing: "border-box",
};