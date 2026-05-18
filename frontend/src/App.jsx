import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";

function App() {
  const [phase, setPhase] = useState("loading");
  // phases: "loading" → "flash" → "reveal" → "done"

  const handleLoaderDone = () => {
    setPhase("done"); // seedha done, koi flash nahi
  };

  return (
    <>
      {/* Loader */}
      {phase === "loading" && (
        <LoadingSpinner onDone={handleLoaderDone} />
      )}

      {/* Home - pre-rendered behind loader */}
      <div
        style={{
          opacity: phase === "done" ? 1 : phase === "reveal" ? 1 : 0,
          transition: "opacity 0s ease 0.1s",
          visibility: phase === "loading" ? "hidden" : "visible",
        }}
      >
        <BrowserRouter>
          <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/saved-trips" element={<SavedTrips />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;