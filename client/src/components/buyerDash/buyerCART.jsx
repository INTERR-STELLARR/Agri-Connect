import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyerCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const buyerId = localStorage.getItem("buyerId");
  const navigate = useNavigate();

  useEffect(() => {
    if (buyerId) {
      fetchCartItems(buyerId);
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
    if (newQuantity < 1) return;

    try {
      const response = await fetch("http://localhost:5000/api/cart/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, cropId, quantity: newQuantity }),
      });

      const data = await response.json();
      if (data.success) {
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
          buyer_id: Number(localStorage.getItem("buyerId")),
          crop_id: cropToRemove.crop_id,
        }),
      });

      if (!response.ok) {
        console.error("🚨 API Error:", response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCart((prevCart) =>
          prevCart.filter((crop) => crop.crop_id !== cropToRemove.crop_id)
        );
      } else {
        alert("🚨 Failed to remove crop from cart.");
      }
    } catch (error) {
      console.error("🚨 Error removing from cart:", error);
    }
  };

  const subtotal = cart.reduce(
    (sum, crop) => sum + parseFloat(crop.price) * crop.quantity,
    0
  );
  const deliveryFee = 40;
  const platformFee = +(0.05 * subtotal).toFixed(2);
  const total = subtotal + deliveryFee + platformFee;

  return (
    <div style={{ padding: "16px", backgroundColor: "#F8FFF0", minHeight: "100vh" }}>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#C8E6C9",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ color: "#1B5E20", fontSize: "28px", fontWeight: "bold", margin: 0 }}>
          Your Cart
        </h2>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : cart.length === 0 ? (
        <p>🛒 No items in the cart</p>
      ) : (
        <>
          {cart.map((crop) => (
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
                  src={
                    crop.image_url
                      ? crop.image_url.startsWith("http")
                        ? crop.image_url
                        : `http://localhost:5000/${crop.image_url.replace(/^\/+/, "")}`
                      : "/default-placeholder.png"
                  }
                  onError={(e) => {
                    e.target.src = "/default-placeholder.png";
                  }}
                  alt={crop.crop_name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <h3 style={{ color: "#000000", fontSize: "20px", fontWeight: "bold" }}>
                    {crop.crop_name}
                  </h3>
                  <p style={{ color: "#388E3C", fontSize: "16px" }}>
                    Price: ₹{parseFloat(crop.price).toFixed(2)}/kg
                  </p>
                  <p style={{ color: "#1B5E20", fontSize: "16px", fontWeight: "600" }}>
                    In Stock: {crop.available_stock} kg
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
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
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1B5E20",
                      }}
                    >
                      {crop.quantity}
                    </span>
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
          ))}

          {/* 🧾 Billing Summary */}
          <div
            style={{
              backgroundColor: "#E8F5E9",
              padding: "20px",
              borderRadius: "16px",
              marginTop: "24px",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                color: "#1B5E20",
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "16px",
              }}
            >
              Bill Summary
            </h3>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>
              Subtotal: ₹{subtotal.toFixed(2)}
            </p>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>
              Delivery Fee: ₹{deliveryFee}
            </p>
            <p style={{ fontSize: "16px", marginBottom: "16px" }}>
              Platform Fee (5%): ₹{platformFee}
            </p>
            <hr style={{ borderTop: "1px solid #C8E6C9", marginBottom: "16px" }} />
            <h4
              style={{
                fontSize: "18px",
                color: "#1B5E20",
                fontWeight: "bold",
              }}
            >
              Total: ₹{total.toFixed(2)}
            </h4>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => navigate("/payment")}
                style={{
                  backgroundColor: "#2E7D32",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerCart;
