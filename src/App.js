import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css"; // Ensure this file is in the same directory

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const alertRef = useRef(null);
  let hideTimeout = useRef(null);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    if (alertRef.current) {
      alertRef.current.classList.add("show");

      // Clear existing timeout
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      // Auto-hide after 3 seconds unless hovered
      hideTimeout.current = setTimeout(() => {
        if (!alertRef.current.matches(":hover")) {
          hideAlert();
        }
      }, 3000);
    }
  };

  const hideAlert = () => {
    if (alertRef.current) {
      alertRef.current.classList.remove("show");
      setTimeout(() => setAlertMessage(""), 300); // Delay clearing message to allow animation
    }
  };

  useEffect(() => {
    // Add hover listener to keep alert visible
    const alertBox = alertRef.current;
    if (alertBox) {
      alertBox.addEventListener("mouseenter", () => clearTimeout(hideTimeout.current));
      alertBox.addEventListener("mouseleave", () => {
        hideTimeout.current = setTimeout(() => hideAlert(), 2000);
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setEnhancedImage(""); // Reset enhanced image when a new file is chosen
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showAlert("⚠️ Please select an image first!", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://delicate-desired-phoenix.ngrok-free.app/enhance",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setEnhancedImage(imageUrl);
      showAlert("✅ Image enhanced successfully!", "success");
    } catch (error) {
      console.error("❌ Error enhancing image:", error);
      showAlert("Failed to enhance the image.", "error");
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement("a");
      link.href = enhancedImage;
      link.download = "enhanced_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert("Image downloaded successfully!", "success");
    }
  };

  return (
    <div className="container">
      {/* Alert Message */}
      <div ref={alertRef} id="alert-box" className={`alert ${alertType}`}>
        {alertMessage}
      </div>

      <h1 className="title">Upload an Image for Enhancement</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />

      <button onClick={handleUpload} className="upload-btn">
        Enhance
      </button>

      {(previewImage || enhancedImage) && (
        <div className="images-wrapper">
          {previewImage && (
            <div className="preview-container">
              <h2>Image Preview</h2>
              <img src={previewImage} alt="Selected" className="image-preview" />
            </div>
          )}

          {enhancedImage && (
            <div className="enhanced-container">
              <h2>Enhanced Image</h2>
              <img src={enhancedImage} alt="Enhanced" className="image-preview" />
              <button onClick={handleDownload} className="download-btn">
                Download Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
