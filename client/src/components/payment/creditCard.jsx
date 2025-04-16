import React, { useState } from "react";
import { useRouter } from "next/router";

const MainCard = () => {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  // Format card number into groups of four (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  // Validate expiry date format (MM/YY)
  const handleExpiryDate = (value) => {
    value = value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiryDate(value);
  };

  // Validate CVV (3 or 4 digits)
  const handleCvvChange = (value) => {
    setCvv(value.replace(/\D/g, "").slice(0, 4));
  };

  return (
    <div
      onClick={() => document.activeElement?.blur()} // Blur active elements
      style={{
        backgroundColor: "#1a1f24",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            margin: "16px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
              <button
                onClick={() => router.push("/cart")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  marginLeft: "20px",
                }}
              >
                <span style={{ color: "#1a1f24", fontSize: "24px" }}>←</span>
              </button>
            </div>

            <h2 style={{ fontFamily: "Inter Tight, sans-serif", color: "#1a1f24", fontSize: "24px", marginBottom: "16px" }}>
              Card Details
            </h2>

            {/* Credit Card Preview */}
            <div
              style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #1a1f24 0%, #57636c 100%)",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ color: "white", fontSize: "28px", margin: "0" }}>
                {cardNumber ? cardNumber : "•••• •••• •••• 4589"}
              </h3>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#e0e0e0", fontSize: "12px", marginBottom: "4px" }}>Card Holder</p>
                  <p style={{ color: "white", fontSize: "16px", margin: "0" }}>
                    {cardHolderName || "JOHN DOE"}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#e0e0e0", fontSize: "12px", marginBottom: "4px" }}>Expires</p>
                  <p style={{ color: "white", fontSize: "16px", margin: "0" }}>
                    {expiryDate || "05/25"}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: "48%" }}>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => handleExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  maxLength="5"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ width: "48%" }}>
                <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  placeholder="CVV"
                  maxLength="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>Card Holder Name</label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />
            </div>

            <button
              onClick={() => router.push("/payment-success")}
              style={{
                width: "100%",
                height: "56px",
                backgroundColor: "#1a1f24",
                color: "white",
                fontSize: "16px",
                fontWeight: "500",
                border: "none",
                borderRadius: "28px",
                cursor: "pointer",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
