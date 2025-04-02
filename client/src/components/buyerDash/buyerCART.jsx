import React, { useEffect, useState } from "react";

const BuyerCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const buyerId = localStorage.getItem("buyerId"); // Retrieve buyer ID

  useEffect(() => {
    if (buyerId) {
      fetchCartItems(buyerId); // Fetch cart items from backend
    }
  }, [buyerId]);

  const fetchCartItems = async (buyerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${buyerId}`);
      const data = await response.json();
      console.log("🛒 Cart Data:", data);
      
      if (data.success) {
        setCart(data.cart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("🚨 Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cropId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent invalid quantity updates

    try {
      const response = await fetch("http://localhost:5000/api/cart/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId,
          cropId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the cart state
        setCart((prevCart) =>
          prevCart.map((crop) =>
            crop.crop_id === cropId ? { ...crop, quantity: newQuantity } : crop
          )
        );
      } else {
        console.error("🚨 Error updating quantity:", data.error);
      }
    } catch (error) {
      console.error("🚨 Error:", error);
    }
  };

  const handleIncreaseQuantity = (crop) => {
    if (crop.quantity < crop.available_stock) {
      handleUpdateQuantity(crop.crop_id, crop.quantity + 1);
    } else {
      alert("Cannot exceed available stock.");
    }
  };

  const handleDecreaseQuantity = (crop) => {
    if (crop.quantity > 1) {
      handleUpdateQuantity(crop.crop_id, crop.quantity - 1);
    } else {
      handleRemoveFromCart(crop);
    }
  };

  const handleRemoveFromCart = async (cropToRemove) => {
    try {
        const response = await fetch("http://localhost:5000/api/cart/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                buyer_id: Number(localStorage.getItem("buyerId")), // Ensure buyer_id is a number
                crop_id: cropToRemove.crop_id 
            }),
        });

        if (!response.ok) {
            console.error("🚨 API Error:", response.status);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            setCart((prevCart) => prevCart.filter((crop) => crop.crop_id !== cropToRemove.crop_id));
        } else {
            alert("🚨 Failed to remove crop from cart.");
        }
    } catch (error) {
        console.error("🚨 Error removing from cart:", error);
    }
};



  return (
    <div style={{ padding: "16px", backgroundColor: "#F8FFF0", minHeight: "100vh" }}>
      <h2 style={{ color: "#1B5E20", fontSize: "24px", fontWeight: "bold" }}>Your Cart</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>🛒 No items in the cart</p>
      ) : (
        cart.map((crop) => (
          <div
            key={crop.crop_id}
            style={{
              backgroundColor: "#E8F5E9",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={crop.image_url ? crop.image_url : "/default-placeholder.png"}
                onError={(e) => { e.target.src = "/default-placeholder.png"; }}
                alt={crop.crop_name}
                style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover" }}
              />

              <div>
                <h3 style={{ color: "#000000", fontSize: "20px", fontWeight: "bold" }}>{crop.crop_name}</h3>
                <p style={{ color: "#388E3C", fontSize: "16px" }}>Price: ₹{crop.price}/kg</p>
                <p style={{ color: "#1B5E20", fontSize: "16px", fontWeight: "600" }}>
                  In Stock: {crop.available_stock} kg
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                  <button
                    onClick={() => handleDecreaseQuantity(crop)}
                    style={{
                      backgroundColor: "#FF7043",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "50%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#1B5E20" }}>{crop.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(crop)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "50%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveFromCart(crop)}
              style={{
                backgroundColor: "#E57373",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BuyerCart;
