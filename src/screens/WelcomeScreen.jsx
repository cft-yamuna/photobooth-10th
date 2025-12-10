import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/gender-selection");
  };

  return (
    <div
      className="screen-container"
      style={{
        backgroundImage: "url(/images/welcome_screen_bg.png)",
        backgroundColor: "#0f172a",
      }}
    >
      <div className="screen-content">
        <button
          onClick={handleStart}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "730px",
            height: "208px",
            fontSize: "75px",
            fontWeight: "600",
            backgroundImage: "url(/images/startbg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            color: "black",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-family)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateX(-50%) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateX(-50%) scale(1)";
          }}
        >
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
