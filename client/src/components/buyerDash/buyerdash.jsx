import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Define categories
const categories = ["Vegetables", "Fruits", "Grains", "Pulses", "Others"];

const Buyerdash = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCrops, setLoadingCrops] = useState(false);

  const navigate = useNavigate(); // Enable navigation to profile page

  // ✅ Fetch crops by selected category
  const fetchCropsByCategory = async (selectedCategory) => {
    console.log(`📲 Fetching category: ${selectedCategory}`);

    setSelectedCategory(selectedCategory);
    setLoadingCrops(true);

    try {
      const response = await fetch(
        `http://localhost:5000/crops-by-category?category=${encodeURIComponent(selectedCategory)}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("🌟 Crops fetched:", data.crops);
        setCrops(data.crops);
      } else {
        console.warn("⚠️ No crops found:", data.message);
        setCrops([]);
      }
    } catch (error) {
      console.error("🚨 Error fetching crops:", error);
    } finally {
      setLoadingCrops(false);
    }
  };

  // 🛒 Add to Cart functionality placeholder
  const addToCart = (crop) => {
    console.log(`🛒 Added ${crop.crop_name} to cart`);
    // Actual cart logic will go here later
  };

  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", padding: "16px" }}>
      {/* 🌟 Header with 👤 Profile Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h1 style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: "bold", fontFamily: "Inter Tight" }}>
          🌾 Marketplace
        </h1>

        {/* ✅ Profile Icon - Redirect to buyerProfile */}
        <span
          style={{ color: "#6B7280", fontSize: "32px", cursor: "pointer" }}
          onClick={() => {
            console.log("Navigating to profile page...");
            navigate("/buyerProfile");
          }}
        >
          👤
        </span>
      </div>

      {/* 🌟 Category Section */}
      <h2 style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: "bold", fontFamily: "Inter Tight" }}>
        Select a Category:
      </h2>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              fontFamily: "Inter Tight",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
            onClick={() => fetchCropsByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 🌾 Crops Section */}
      {selectedCategory && (
        <>
          <h2 style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: "bold", fontFamily: "Inter Tight", marginTop: "20px" }}>
            Crops in {selectedCategory}:
          </h2>

          {loadingCrops ? (
            <p style={{ color: "#FFFFFF" }}>🔄 Loading crops...</p>
          ) : crops.length === 0 ? (
            <p style={{ color: "#FFFFFF" }}>⚠️ No crops available in this category.</p>
          ) : (
            crops.map((crop) => (
              <div
                key={crop.id}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "16px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img
                    src={crop.image_url ? `http://localhost:5000${crop.image_url}` : "https://via.placeholder.com/60"}
                    alt={crop.crop_name}
                    style={{ width: "80px", height: "80px", borderRadius: "12px" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: "#000000", fontSize: "20px", fontWeight: "bold", fontFamily: "Inter Tight" }}>
                      {crop.crop_name}
                    </h3>
                    <p style={{ color: "#6B7280", fontSize: "16px", fontFamily: "Inter" }}>Price: ₹{crop.price}/kg</p>
                    <p style={{ color: "#3B82F6", fontSize: "16px", fontWeight: "600", fontFamily: "Inter" }}>
                      In Stock: {crop.quantity} kg
                    </p>
                  </div>
                  <button
                    style={{
                      width: "100px",
                      height: "40px",
                      backgroundColor: crop.quantity > 0 ? "#000000" : "#9e9e9e",
                      borderRadius: "24px",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontFamily: "Inter",
                      cursor: crop.quantity > 0 ? "pointer" : "not-allowed",
                    }}
                    disabled={crop.quantity <= 0}
                    onClick={() => addToCart(crop)}
                  >
                    {crop.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Buyerdash;
