import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure this file is in the same directory

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      // Reset enhanced image when a new file is chosen
      setEnhancedImage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "https://delicate-desired-phoenix.ngrok-free.app/enhance", // ✅ Your ngrok domain
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setEnhancedImage(imageUrl);
    } catch (error) {
      console.error("❌ Error enhancing image:", error);
      alert("❌ Failed to enhance the image.");
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
    }
  };

  return (
    <div className="container">
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
              <img
                src={previewImage}
                alt="Selected"
                className="image-preview"
              />
            </div>
          )}

          {enhancedImage && (
            <div className="enhanced-container">
              <h2>Enhanced Image</h2>
              <img
                src={enhancedImage}
                alt="Enhanced"
                className="image-preview"
              />
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

