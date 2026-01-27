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
      width: 300,
      margin: 2,
      color: {
        dark: "#ffffff",
        light: "#00000000",
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Photo</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            @page {
              size: 4in 6in;
              margin: 0;
            }
            html, body {
              width: 4in;
              height: 6in;
              overflow: hidden;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              background: white;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            @media print {
              html, body {
                width: 4in;
                height: 6in;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              img {
                width: 4in;
                height: 6in;
                object-fit: contain;
              }
            }
          </style>
        </head>
        <body>
          <img src="${outputImageUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="screen-container"
      style={{
        backgroundImage: "url(/images/output_bg.png)",
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
          }}
        >

          {/* Output Image */}
          <img
            src={outputImageUrl}
            alt="Transformed"
            style={{
              width: "800px",
              height: "1244px",
              display: "block",
              objectFit: "cover",
            }}
          />

          {/* QR Code and Restart Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "30px",
              marginTop: "43px",
              marginBottom: "80px",
              backgroundColor: "transparent",
              padding: "30px 40px",
              // borderRadius: "15px",
            }}
          >
            {/* QR Code on the left */}
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{
                  width: "270px",
                  height: "270px",
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

              {/* Print Button */}
              <button
                onClick={handlePrint}
                style={{
                  width: "450px",
                  height: "100px",
                  backgroundColor: "#00AEEF",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "700",
                  fontFamily: "var(--font-family)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                Print
              </button>

              {/* Restart Button */}
              <button
                onClick={handleStartOver}
                style={{
                  width: "450px",
                  height: "100px",
                  backgroundImage: "url(/images/restart.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputScreen;
