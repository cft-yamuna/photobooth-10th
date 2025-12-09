import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CharacterSelectionScreen = () => {
  const navigate = useNavigate();
  const { gender, setSelectedCharacter, setCharacterImageUrl } =
    useAppContext();
  const [characters, setCharacters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacterLocal] = useState(null);

  // Hardcoded URLs as requested
  const BASE_URL =
    "https://ozkbnimjuhaweigscdby.supabase.co/storage/v1/object/public/phonepe_character_images";

  useEffect(() => {
    if (!gender) {
      navigate("/gender-selection");
      return;
    }

    loadCharacters();
  }, [gender, navigate]);

  const loadCharacters = () => {
    const chars = [];
    const genderPath = gender.toLowerCase();

    for (let i = 1; i <= 5; i++) {
      const num = i.toString().padStart(2, "0");
      const filename = `${genderPath}${num}.png`;

      // Local path for UI display
      const localPath = `/images/${filename}`;

      // Remote URL for processing
      const remoteUrl = `${BASE_URL}/${genderPath}/${filename}`;

      chars.push({
        id: i,
        displayUrl: localPath,
        remoteUrl: remoteUrl,
        name: `Character ${i}`,
      });
    }

    setCharacters(chars);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  const handleCharacterSelect = () => {
    const character = characters[currentIndex];
    setSelectedCharacterLocal(character);
    setSelectedCharacter(character);
    setCharacterImageUrl(character.remoteUrl);
  };

  const handleContinue = () => {
    navigate("/face-capture");
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
          SELECT YOUR STYLE
        </h2>

        {characters.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              marginTop: "60px",
            }}
          >
            {/* Left Arrow Button */}
            <button
              onClick={handlePrevious}
              style={{
                backgroundColor: "transparent",
                border: "none",
                width: "80px",
                height: "80px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              <img
                src="/images/back.png"
                alt="Previous"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </button>

            {/* Character Image */}
            <div
              onClick={handleCharacterSelect}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease",
                border: selectedCharacter?.id === characters[currentIndex]?.id
                  ? ""
                  : "4px solid transparent",
                borderRadius: "8px",
                padding: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img
                src={characters[currentIndex].displayUrl}
                alt={characters[currentIndex].name}
                style={{
                  width: "600px",
                  height: "950px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              style={{
                backgroundColor: "transparent",
                border: "none",
                width: "80px",
                height: "80px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              <img
                src="/images/front.png"
                alt="Next"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </button>
          </div>
        )}

        {/* Continue Button - Shows after character selection */}
        {selectedCharacter && (
          <button
            onClick={handleContinue}
            style={{
              position: "absolute",
              bottom: "-200px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "411.58px",
              height: "157.88px",
              fontSize: "75px",
              fontWeight: "600",
              backgroundImage: "url(/images/next.png)",
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

export default CharacterSelectionScreen;
