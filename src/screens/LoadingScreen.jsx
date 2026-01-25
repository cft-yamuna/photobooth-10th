import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SupabaseService from "../services/supabaseService";
import FaceSwapService from "../services/faceswapService";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const { uniqueId, userImageUrl, characterImageUrl, setOutputImageUrl } =
    useAppContext();

  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [hasError, setHasError] = useState(false);

  // Function to add frame to output image
  const addFrameToImage = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const outputImg = new Image();
      const frameImg = new Image();

      outputImg.crossOrigin = "anonymous";
      frameImg.crossOrigin = "anonymous";

      let imagesLoaded = 0;

      const onImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === 2) {
          // Set canvas size to frame size
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;

          // Fixed size for inside image to fill frame
          const scaledWidth = 1150;
          const scaledHeight = 1650;

          // Calculate position to center horizontally and vertically
          const x = (frameImg.width - scaledWidth) / 2;
          const y = (frameImg.height - scaledHeight) / 2;

          // Draw output image with border radius on left side only
          const radius = 120;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + scaledWidth, y);
          ctx.lineTo(x + scaledWidth, y + scaledHeight);
          ctx.lineTo(x + radius, y + scaledHeight);
          ctx.arcTo(x, y + scaledHeight, x, y + scaledHeight - radius, radius);
          ctx.lineTo(x, y + radius);
          ctx.arcTo(x, y, x + radius, y, radius);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(outputImg, x, y, scaledWidth, scaledHeight);
          ctx.restore();

          // Draw frame on top
          ctx.drawImage(frameImg, 0, 0);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/png",
            1.0
          );
        }
      };

      outputImg.onload = onImageLoad;
      frameImg.onload = onImageLoad;

      outputImg.onerror = () => reject(new Error("Failed to load output image"));
      frameImg.onerror = () => reject(new Error("Failed to load frame image"));

      outputImg.src = imageUrl;
      frameImg.src = "/images/outputframe.png";
    });
  };

  useEffect(() => {
    if (!uniqueId || !userImageUrl || !characterImageUrl) {
      navigate("/");
      return;
    }

    processImage();
  }, []);

  const processImage = async () => {
    try {
      setStatusMessage("Preparing your transformation...");
      const supabaseService = new SupabaseService();

      // We don't strictly need to update character image here as it's done in FaceCaptureScreen
      // but it doesn't hurt to be safe.
      // await supabaseService.updateCharacterImage(uniqueId, characterImageUrl);

      setStatusMessage("Sending to AI processor...");
      const faceswapService = new FaceSwapService();

      const success = await faceswapService.sendFaceSwapRequest({
        sourceImageUrl: userImageUrl,
        targetImageUrl: characterImageUrl,
        uniqueId: uniqueId,
      });

      if (!success) {
        throw new Error("Failed to start face swap processing");
      }

      setStatusMessage(
        "Transforming your image...\nThis may take a few minutes. Please wait."
      );

      const outputUrl = await supabaseService.pollForOutput(uniqueId);

      if (!outputUrl) {
        throw new Error("Processing timeout or failed");
      }

      setStatusMessage("Finalizing your image...");

      // Add frame to the output image
      const framedImageBlob = await addFrameToImage(outputUrl);

      // Upload framed image to Supabase
      const framedImageUrl = await supabaseService.uploadImageBytes(
        framedImageBlob,
        uniqueId,
        { prefix: "framed_", extension: ".png" }
      );

      if (!framedImageUrl) {
        throw new Error("Failed to upload framed image");
      }

      // Update the output URL in database with framed version
      await supabaseService.updateOutputImage(uniqueId, framedImageUrl);

      setOutputImageUrl(framedImageUrl);

      setStatusMessage("Complete! Redirecting...");
      setTimeout(() => {
        navigate("/output");
      }, 1000);
    } catch (error) {
      console.error("Processing error:", error);
      setHasError(true);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  const handleTryAgain = () => {
    navigate("/");
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
        <div className="flex flex-col items-center gap-xl">
          {!hasError ? (
            <>
              {/* Enhanced Loader */}
              <style>
                {`
                  .loader-wrapper {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 50px;
                  }

                  .loader-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 4px solid transparent;
                  }

                  .loader-ring-1 {
                    width: 180px;
                    height: 180px;
                    border-top-color: #47BAFF;
                    border-right-color: #47BAFF;
                    animation: spin 1.5s linear infinite;
                  }

                  .loader-ring-2 {
                    width: 150px;
                    height: 150px;
                    border-bottom-color: #78A5D7;
                    border-left-color: #78A5D7;
                    animation: spin 2s linear infinite reverse;
                  }

                  .loader-ring-3 {
                    width: 120px;
                    height: 120px;
                    border-top-color: #47BAFF;
                    border-right-color: #78A5D7;
                    animation: spin 1s linear infinite;
                  }

                  .loader-core {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #47BAFF 0%, #78A5D7 100%);
                    border-radius: 50%;
                    animation: pulse 2s ease-in-out infinite;
                    box-shadow: 0 0 40px rgba(71, 186, 255, 0.5),
                                0 0 80px rgba(120, 165, 215, 0.3);
                  }

                  .loader-dots {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    animation: rotate-dots 6s linear infinite;
                  }

                  .loader-dot {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: #47BAFF;
                    border-radius: 50%;
                    animation: dot-pulse 1.5s ease-in-out infinite;
                  }

                  .loader-dot:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
                  .loader-dot:nth-child(2) { top: 50%; right: 0; transform: translateY(-50%); animation-delay: 0.3s; background: #78A5D7; }
                  .loader-dot:nth-child(3) { bottom: 0; left: 50%; transform: translateX(-50%); animation-delay: 0.6s; background: #47BAFF; }
                  .loader-dot:nth-child(4) { top: 50%; left: 0; transform: translateY(-50%); animation-delay: 0.9s; background: #78A5D7; }

                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }

                  @keyframes pulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                  }

                  @keyframes rotate-dots {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }

                  @keyframes dot-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.5); opacity: 1; }
                  }

                  @keyframes fadeInOut {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                  }

                  @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                  }

                  .shimmer-text {
                    background: linear-gradient(90deg, #fff 0%, #47BAFF 25%, #fff 50%, #78A5D7 75%, #fff 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 3s linear infinite;
                  }
                `}
              </style>

              <div className="loader-wrapper">
                <div className="loader-ring loader-ring-1"></div>
                <div className="loader-ring loader-ring-2"></div>
                <div className="loader-ring loader-ring-3"></div>
                <div className="loader-core"></div>
                <div className="loader-dots">
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                </div>
              </div>

              <div className="text-center">
                <h2
                  className="h2 shimmer-text"
                  style={{
                    marginBottom: "1rem",
                    fontFamily: "var(--font-family)",
                    fontSize: "48px",
                    textTransform: "uppercase",
                    fontWeight: "800",
                    letterSpacing: "3px",
                  }}
                >
                  Magic happening...
                </h2>
                <p
                  className="p"
                  style={{
                    whiteSpace: "pre-line",
                    maxWidth: "600px",
                    fontSize: "24px",
                    color: "rgba(255, 255, 255, 0.9)",
                    animation: "fadeInOut 2s ease-in-out infinite",
                  }}
                >
                  {statusMessage}
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "5rem", color: "var(--color-error)" }}>
                ⚠️
              </div>
              <div className="text-center">
                <h2
                  className="h2"
                  style={{ color: "var(--color-error)", marginBottom: "1rem" }}
                >
                  Oops! Something Went Wrong
                </h2>
                <p
                  className="p"
                  style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
                >
                  {statusMessage}
                </p>
              </div>

              <button
                onClick={handleTryAgain}
                className="btn btn-primary btn-large mt-lg"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
