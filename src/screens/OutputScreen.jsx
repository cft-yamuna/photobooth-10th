import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import QRCode from "qrcode";

const OutputScreen = () => {
  const navigate = useNavigate();
  const { outputImageUrl, resetState } = useAppContext();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    if (!outputImageUrl) {
      navigate("/");
      return;
    }

    // Generate QR code for the output image URL
    QRCode.toDataURL(outputImageUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
      });
  }, [outputImageUrl, navigate]);

  const handleStartOver = () => {
    resetState();
    navigate("/");
  };

  return (
    <div
      className="screen-container"
      style={{
        backgroundImage: "url(/images/bg.png)",
        backgroundColor: "#0f172a",
      }}
    >
      <div className="screen-content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            width: "100%",
            height: "100%",
            paddingTop: "123px",
            marginTop: "230px",
          }}
        >

          {/* Output Image with Background */}
          <div
            style={{
              width: "750px",
              height: "1130px",
              backgroundImage: "url(/images/output_bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={outputImageUrl}
              alt="Transformed"
              style={{
                width: "662px",
                height: "1029px",
                display: "block",
                objectFit: "cover",
                borderRadius:"113px"
              }}
            />
          </div>

          {/* QR Code and Restart Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "30px",
              marginTop: "43px",
              marginBottom: "80px",
            }}
          >
            {/* QR Code on the left */}
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{
                  width: "180px",
                  height: "180px",
                  backgroundColor: "white",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              />
            )}

            {/* Text and Button on the right */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "15px",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "36px",
                  fontWeight: "700",
                  fontFamily: "var(--font-family)",
                  textTransform: "uppercase",
                  margin: 0,
                  letterSpacing: "2px",
                }}
              >
                Scan to Download
              </p>

              {/* Restart Button */}
              <button
                onClick={handleStartOver}
                style={{
                  width: "280px",
                  height: "70px",
                  fontSize: "32px",
                  fontWeight: "700",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputScreen;
