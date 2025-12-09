import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const GenderSelectionScreen = () => {
  const navigate = useNavigate();
  const { setGender } = useAppContext();
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelect = (genderValue) => {
    setSelectedGender(genderValue);
    setGender(genderValue);
  };

  const handleContinue = () => {
    navigate("/character-selection");
  };

  return (
    <div
      className="screen-container"
      style={{
        backgroundImage: "url(/images/common_bg.png)",
        backgroundColor: "#0f172a",
      }}
    >
      <div className="screen-content">
        <h2
          style={{
            fontFamily: "var(--font-family)",
            fontSize: "80px",
            fontWeight: "700",
            color: "white",
            marginBottom: "40px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          SELECT GENDER
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Male Option */}
          <div
            onClick={() => handleGenderSelect("male")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/images/male_image.png"
              alt="Male"
              style={{
                width: "360px",
                height: "auto",
                marginBottom: "12px",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "64px",
                fontWeight: "600",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              MALE
            </span>
          </div>

          {/* Female Option */}
          <div
            onClick={() => handleGenderSelect("female")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src="/images/female_image.png"
              alt="Female"
              style={{
                width: "360px",
                height: "auto",
                marginBottom: "12px",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-family)",
                fontSize: "64px",
                fontWeight: "600",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              FEMALE
            </span>
          </div>
        </div>

        {/* Continue Button - Shows after gender selection */}
        {selectedGender && (
          <button
            onClick={handleContinue}
            style={{
              position: "absolute",
              bottom: "-70%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "941px",
              height: "482px",
              fontSize: "75px",
              fontWeight: "600",
              backgroundImage: "url(/images/continuebg.png)",
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
        )}
      </div>
    </div>
  );
};

export default GenderSelectionScreen;
