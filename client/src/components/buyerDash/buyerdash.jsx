import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["Vegetables", "Fruits", "Grains", "Pulses", "Others"];

const Buyerdash = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      const buyerId = localStorage.getItem("buyerId");
      if (!buyerId) return;

      try {
        const response = await fetch(`http://localhost:5000/api/cart/count?buyerId=${buyerId}`);
        const result = await response.json();
        if (response.ok && typeof result.count === "number") {
          setCartCount(result.count);
        }
      } catch (error) {
        console.error("🚨 Failed to fetch cart count", error);
      }
    };

    fetchCartCount();
  }, []);

  const fetchCropsByCategory = async (category) => {
    setSelectedCategory(category);
    setLoadingCrops(true);
    const buyerCity = localStorage.getItem("city")?.toLowerCase();
    try {
      const response = await fetch(
        `http://localhost:5000/crops-by-category?category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      if (!data.crops || !Array.isArray(data.crops)) {
        throw new Error("Invalid crops data from API");
      }

      const sortedCrops = data.crops.sort((a, b) => {
        const cityA = a.city?.toLowerCase() === buyerCity ? 0 : 1;
        const cityB = b.city?.toLowerCase() === buyerCity ? 0 : 1;
        return cityA - cityB;
      });

      setCrops(sortedCrops);
      setFilteredCrops(sortedCrops);
    } catch (error) {
      console.error("🚨 Error fetching crops:", error);
      setCrops([]);
      setFilteredCrops([]);
    } finally {
      setLoadingCrops(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCrops(crops);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const matched = crops.filter((crop) =>
        crop.crop_name.toLowerCase().includes(lowerTerm)
      );
      setFilteredCrops(matched);
    }
  }, [searchTerm, crops]);

  const handleOpenQuantityModal = (crop) => {
    setSelectedCrop(crop);
    setQuantity("");
    setShowQuantityModal(true);
  };

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

    if (numericQuantity > selectedCrop.quantity) {
      alert(`❌ Only ${selectedCrop.quantity} kg available in stock.`);
      return;
    }

    const requestBody = {
      buyer_id: Number(buyerId),
      crop_id: Number(selectedCrop.crop_id),
      quantity: numericQuantity,
      price: parseFloat(selectedCrop.price),
    };

    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${numericQuantity} kg of ${selectedCrop.crop_name} added to cart!`);
        setCartCount((prev) => prev + 1);
      } else {
        alert(`❌ Error: ${result.error || "Failed to add to cart"}`);
      }
    } catch (error) {
      alert("🚨 Network error: Failed to add to cart");
      console.error("🚨 Error:", error);
    }

    setShowQuantityModal(false);
    setQuantity("");
  };

  const handleCropClick = (crop, event) => {
    if (event.target.tagName.toLowerCase() === "button") return;
    setSelectedCrop(crop);
    setShowCropDetails(true);
  };

  return (
    <div style={{ backgroundColor: "#F8FFF0", minHeight: "100vh", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h1 style={{ color: "#1B5E20", fontSize: "24px", fontWeight: "bold" }}>🌾 Marketplace</h1>
        <div style={{ display: "flex", gap: "16px", position: "relative" }}>
          <span
            style={{ color: "#4CAF50", fontSize: "32px", cursor: "pointer", position: "relative" }}
            onClick={() => navigate("/buyerCart")}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-8px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px"
                }}
              >
                {cartCount}
              </span>
            )}
          </span>
          <span style={{ color: "#388E3C", fontSize: "32px", cursor: "pointer" }} onClick={() => navigate("/buyerProfile")}>
            👤
          </span>
        </div>
      </div>

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

      {/* ✅ Updated Search Bar */}
      {selectedCategory && (
        <>
          <div style={{
            position: "relative",
            width: "100%",
            marginBottom: "20px"
          }}>
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
                color: "#388E3C",
                pointerEvents: "none"
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search for crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                borderRadius: "12px",
                border: "2px solid #4CAF50",
                fontSize: "16px",
                backgroundColor: "#E8F5E9",
                color: "#1B5E20",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            />
          </div>

          <h2 style={{ color: "#1B5E20", fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
            Crops in {selectedCategory}:
          </h2>

          {loadingCrops ? (
            <p>🔄 Loading crops...</p>
          ) : filteredCrops.length === 0 ? (
            <p>No crops found.</p>
          ) : (
            filteredCrops.map((crop) => (
              <div
                key={crop.crop_id}
                onClick={(e) => handleCropClick(crop, e)}
                style={{
                  backgroundColor: "#E8F5E9",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "16px",
                  cursor: "pointer"
                }}
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
                    disabled={crop.quantity === 0}
                    style={{
                      backgroundColor: crop.quantity === 0 ? "#BDBDBD" : "#4CAF50",
                      color: "white",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      cursor: crop.quantity === 0 ? "not-allowed" : "pointer",
                      border: "none"
                    }}
                  >
                    🛒 {crop.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Quantity Modal */}
      {showQuantityModal && selectedCrop && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", backgroundColor: "#FFF",
          padding: "20px", borderRadius: "12px", zIndex: 1000,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{ marginBottom: "10px" }}>Enter Quantity for {selectedCrop.crop_name}</h3>
          <input
            type="number"
            placeholder="e.g. 100"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ padding: "8px", fontSize: "16px", borderRadius: "8px", width: "120px", marginBottom: "16px" }}
          />
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={handleAddToCart} style={{ backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
              Add to Cart
            </button>
            <button onClick={() => setShowQuantityModal(false)} style={{ backgroundColor: "#E53935", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Crop Details Bottom Sheet */}
      {selectedCrop && (
        <div
          className={`popup-container ${showCropDetails ? "show" : "hide"}`}
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "#FFF",
            padding: "20px",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            zIndex: 999,
            boxShadow: "0 -4px 10px rgba(0,0,0,0.1)",
            transition: "transform 0.4s ease-in-out",
            transform: showCropDetails ? "translateY(0%)" : "translateY(100%)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>{selectedCrop.crop_name}</h3>
            <button
              onClick={() => setShowCropDetails(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              ❌
            </button>
          </div>
          <img
            src={selectedCrop.image_url}
            alt={selectedCrop.crop_name}
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
          <p style={{ marginTop: "10px", color: "#388E3C" }}>
            <strong>Description:</strong> {selectedCrop.description || "No description provided."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Buyerdash;
