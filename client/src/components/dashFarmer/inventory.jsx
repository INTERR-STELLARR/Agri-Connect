import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loadingImages, setLoadingImages] = useState({});

  const sellerId = localStorage.getItem("sellerId");

  // ✅ Redirect if no sellerId
  useEffect(() => {
    if (!sellerId) {
      console.error("❌ No sellerId found, redirecting to login...");
      navigate("/register");
    } else {
      fetchCrops();
    }
  }, [sellerId]);

  // ✅ Fetch crops
  const fetchCrops = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/crops?sellerId=${sellerId}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Crops fetched:", data.crops);
        setCrops(data.crops || []);
        preloadImages(data.crops || []);
      } else {
        console.error("❌ Failed to fetch crops:", data.message);
        setCrops([]);
      }
    } catch (error) {
      console.error("⚠️ Error fetching crops:", error);
      setCrops([]);
    }
  };

  // ✅ Preload images to avoid blinking
  const preloadImages = (crops) => {
    const newLoadingState = {};

    crops.forEach((crop) => {
      newLoadingState[crop.id] = true;
      const img = new Image();

      img.src = `http://localhost:5000${crop.image_url}`;
      img.onload = () => setLoadingImages((prev) => ({ ...prev, [crop.id]: false }));
      img.onerror = () => setLoadingImages((prev) => ({ ...prev, [crop.id]: false }));
    });

    setLoadingImages(newLoadingState);
  };

  // ✅ Update only crop quantity
  const updateCropQuantity = async (cropId, currentQuantity) => {
    const newQuantity = prompt("Enter new quantity:", currentQuantity);
  
    if (newQuantity === null || newQuantity === "") return;
  
    console.log("📌 Sending Crop ID:", cropId);
    console.log("📌 New Quantity:", newQuantity);
  
    try {
      const response = await fetch(`http://localhost:5000/crops/${cropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      const result = await response.json();
      console.log("🔍 Server response:", result);
  
      if (response.ok) {
        console.log("✅ Quantity updated:", result.crop);
  
        alert(result.message || "Quantity updated successfully!");
  
        // ✅ Update crop state directly with the fresh crop from the backend
        setCrops((prevCrops) =>
          prevCrops.map((crop) => (crop.id === cropId ? { ...crop, quantity: result.crop.quantity } : crop))
        );
      } else {
        console.error("⚠️ Update error:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("🔥 Update error:", error);
      alert("❗ Something went wrong.");
    }
  };
  
  
  
  
  

  // ✅ Delete crop
  const deleteCrop = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    try {
      const response = await fetch(`http://localhost:5000/crops/${cropId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Crop deleted:", result);
        alert("Crop deleted successfully!");
        fetchCrops(); // Refresh crop list after deleting
      } else {
        console.error("⚠️ Delete error:", result.message);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("🔥 Delete error:", error);
      alert("❗ Something went wrong.");
    }
  };

  // ✅ Render UI
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", padding: "16px" }}>
      <div
        style={{
          backgroundColor: "#000000",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: "bold", fontFamily: "Inter Tight" }}>
          Manage Inventory
        </h1>
        <button
          style={{ backgroundColor: "transparent", border: "none", color: "#57636C", cursor: "pointer" }}
          onClick={() => navigate("/crophandling")}
        >
          <span style={{ fontSize: "24px" }}>+</span>
        </button>
      </div>

      {crops.length === 0 ? (
        <div style={{ color: "#FFFFFF", textAlign: "center", marginTop: "20px" }}>
          No crops uploaded yet.
        </div>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.id}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {loadingImages[crop.id] ? (
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      backgroundColor: "#ddd",
                    }}
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${crop.image_url}`}
                    alt={crop.crop_name}
                    style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                )}

                <div>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#FFFFFF", fontFamily: "Inter" }}>
                    {crop.crop_name}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: "Inter" }}>Stock: {crop.quantity} kg</p>
                  <p style={{ fontSize: "14px", color: "#3B82F6", fontFamily: "Inter" }}>₹{crop.price}/kg</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {/* ✅ Corrected onClick */}
                <button
                  style={{
                    backgroundColor: "#E8F5E9",
                    borderRadius: "20px",
                    width: "40px",
                    height: "40px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => updateCropQuantity(crop.id, crop.quantity)}
                >
                  ✏️
                </button>

                <button
                  style={{
                    backgroundColor: "#FFEBEE",
                    borderRadius: "20px",
                    width: "40px",
                    height: "40px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteCrop(crop.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Inventory;
