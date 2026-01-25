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

          // Scale down the output image (60% of original size)
          const scale = 0.6;
          const scaledWidth = outputImg.width * scale;
          const scaledHeight = outputImg.height * scale;

          // Calculate position to center horizontally, move down vertically
          const x = (frameImg.width - scaledWidth) / 2;
          const y = (frameImg.height - scaledHeight) / 2 + 150;

          // Draw output image first (behind) with scaled dimensions
          ctx.drawImage(outputImg, x, y, scaledWidth, scaledHeight);

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

      setStatusMessage("Adding frame to your image...");

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
              {/* Custom Loader */}
              <div
                className="loader-container"
                style={{ marginBottom: "40px" }}
              >
                <style>
                  {`
                    .loader {
                      border: 16px solid rgba(255, 255, 255, 0.1);
                      border-top: 16px solid #0EC8F0;
                      border-radius: 50%;
                      width: 120px;
                      height: 120px;
                      animation: spin 2s linear infinite;
                    }
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
                <div className="loader"></div>
              </div>

              <div className="text-center">
                <style>
                  {`
                    @keyframes fadeInOut {
                      0%, 100% { opacity: 0.3; }
                      50% { opacity: 1; }
                    }
                  `}
                </style>
                <h2
                  className="h2"
                  style={{
                    marginBottom: "1rem",
                    fontFamily: "var(--font-family)",
                    fontSize: "40px",
                    textTransform: "uppercase",
                    animation: "fadeInOut 2s ease-in-out infinite",
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
                    color: "white",
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
