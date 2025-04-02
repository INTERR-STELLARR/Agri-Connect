import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["Vegetables", "Fruits", "Grains", "Pulses", "Others"];

const Buyerdash = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  /** Fetch crops by category */
  const fetchCropsByCategory = async (category) => {
    setSelectedCategory(category);
    setLoadingCrops(true);
    try {
      const response = await fetch(
        `http://localhost:5000/crops-by-category?category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      console.log("🌾 Fetched Crops:", data.crops);

      if (!data.crops || !Array.isArray(data.crops)) {
        throw new Error("Invalid crops data from API");
      }

      setCrops(data.crops);
    } catch (error) {
      console.error("🚨 Error fetching crops:", error);
      setCrops([]);
    } finally {
      setLoadingCrops(false);
    }
  };

  /** Open quantity modal */
  const handleOpenQuantityModal = (crop) => {
    setSelectedCrop(crop);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  /** Add crop to cart */
  const handleAddToCart = async () => {
    if (!selectedCrop || !selectedCrop.crop_id) {
      alert("❌ Error: Crop details are missing.");
      return;
    }
  
    const buyerId = localStorage.getItem("buyerId");
    if (!buyerId) {
      alert("❌ Buyer not logged in");
      return;
    }
  
    const numericQuantity = parseInt(quantity, 10);
    if (isNaN(numericQuantity) || numericQuantity < 100) {
      alert("❌ Minimum 100kg is required to add to cart.");
      return;
    }
  
    const requestBody = {
      buyer_id: Number(buyerId), // Match DB field name
      crop_id: Number(selectedCrop.crop_id),
      quantity: numericQuantity, // Ensure it's an integer
      price: parseFloat(selectedCrop.price), // Ensure it's a decimal
    };
  
    console.log("🛒 Sending to backend:", requestBody);
  
    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${numericQuantity} kg of ${selectedCrop.crop_name} added to cart!`);
      } else {
        alert(`❌ Error: ${result.error || "Failed to add to cart"}`);
      }
    } catch (error) {
      alert("🚨 Network error: Failed to add to cart");
      console.error("🚨 Error:", error);
    }
  
    setShowQuantityModal(false);
    setQuantity(100); // Set default to 100kg after adding
  };
  
  
  

  return (
    <div style={{ backgroundColor: "#F8FFF0", minHeight: "100vh", padding: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h1 style={{ color: "#1B5E20", fontSize: "24px", fontWeight: "bold" }}>🌾 Marketplace</h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ color: "#4CAF50", fontSize: "32px", cursor: "pointer" }} onClick={() => navigate("/buyerCart")}>🛒</span>
          <span style={{ color: "#388E3C", fontSize: "32px", cursor: "pointer" }} onClick={() => navigate("/buyerProfile")}>👤</span>
        </div>
      </div>

      {/* Category Selection */}
      <h2 style={{ color: "#1B5E20", fontSize: "20px", fontWeight: "bold" }}>Select a Category:</h2>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
        {categories.map((category) => (
          <button
            key={category}
            style={{
              backgroundColor: selectedCategory === category ? "#4CAF50" : "#A5D6A7",
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              color: "white",
              border: "none"
            }}
            onClick={() => fetchCropsByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Crop Listings */}
      {selectedCategory && (
        <>
          <h2 style={{ color: "#1B5E20", fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>
            Crops in {selectedCategory}:
          </h2>
          {loadingCrops ? (
            <p>🔄 Loading crops...</p>
          ) : (
            crops.length === 0 ? (
              <p>No crops available.</p>
            ) : (
              crops.map((crop) => (
                <div 
                  key={crop.crop_id} 
                  style={{ backgroundColor: "#E8F5E9", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <img 
                      src={crop.image_url || "/default-placeholder.png"} 
                      alt={crop.crop_name} 
                      style={{ width: "80px", height: "80px", borderRadius: "12px" }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: "#000000", fontSize: "20px", fontWeight: "bold" }}>{crop.crop_name}</h3>
                      <p style={{ color: "#388E3C" }}>Price: ₹{crop.price}/kg</p>
                      <p style={{ color: "#1B5E20", fontWeight: "600" }}>In Stock: {crop.quantity} kg</p>
                    </div>
                    <button 
                      onClick={() => handleOpenQuantityModal(crop)} 
                      style={{ backgroundColor: "#4CAF50", color: "white", borderRadius: "20px", padding: "8px 16px", cursor: "pointer" }}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </>
      )}

      {/* Quantity Input Modal */}
      {showQuantityModal && selectedCrop && (
        <div 
          style={{ 
            position: "fixed", top: "50%", left: "50%", 
            transform: "translate(-50%, -50%)", backgroundColor: "#FFF", 
            padding: "20px", borderRadius: "12px", zIndex: 1000, 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" 
          }}
        >
          <h3>Enter Quantity for {selectedCrop.crop_name}</h3>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, Math.min(selectedCrop.quantity, parseInt(e.target.value, 10) || 1)))}
            min="1" 
            max={selectedCrop.quantity} 
            style={{ padding: "8px", fontSize: "16px", borderRadius: "8px", width: "80px" }} 
          />
          <button onClick={handleAddToCart} style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", borderRadius: "8px", marginTop: "10px" }}>
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Buyerdash;
