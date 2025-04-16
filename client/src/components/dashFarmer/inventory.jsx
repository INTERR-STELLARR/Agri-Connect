import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inventory = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [showUpdateBox, setShowUpdateBox] = useState(null);
  const [showDeleteBox, setShowDeleteBox] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");

  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    if (!sellerId) {
      navigate("/register");
    } else {
      fetchCrops();
    }
  }, [sellerId]);

  const fetchCrops = async () => {
    try {
      const response = await fetch(`http://localhost:5000/crops?sellerId=${sellerId}`);
      const data = await response.json();

      if (response.ok) {
        setCrops(data.crops || []);
      } else {
        setCrops([]);
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
      setCrops([]);
    }
  };

  const openUpdateBox = (crop) => {
    setShowUpdateBox(crop.id);
    setShowDeleteBox(null);
    setNewQuantity(crop.quantity);
  };

  const openDeleteBox = (crop) => {
    setShowDeleteBox(crop.id);
    setShowUpdateBox(null);
  };

  const closeModals = () => {
    setShowUpdateBox(null);
    setShowDeleteBox(null);
  };

  const handleUpdateQuantity = async (cropId) => {
    if (!newQuantity || newQuantity < 1) {
      toast.error("Please enter a valid quantity!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/crops/${cropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Quantity updated successfully!");
        setCrops((prevCrops) =>
          prevCrops.map((crop) =>
            crop.id === cropId ? { ...crop, quantity: result.crop.quantity } : crop
          )
        );
        closeModals();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      const response = await fetch(`http://localhost:5000/crops/${cropId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Crop deleted successfully!");
        fetchCrops();
        closeModals();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FFF1", minHeight: "100vh", padding: "16px", position: "relative" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header with Plus Button */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#2E7D32", fontSize: "24px", fontWeight: "bold" }}>
          Manage Inventory
        </h1>
        <button
          onClick={() => navigate("/crophandling")}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontSize: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          +
        </button>
      </div>

      {/* ✅ Active Listings Count Section */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "#E8F5E9",
          padding: "12px 20px",
          borderRadius: "12px",
          color: "#2E7D32",
          fontWeight: "600",
          fontSize: "16px",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        Active Listings: {crops.length}
      </div>

      {crops.length === 0 ? (
        <div style={{ color: "#2E7D32", textAlign: "center", marginTop: "20px" }}>
          No crops uploaded yet.
        </div>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              position: "relative",
              zIndex: showUpdateBox === crop.id || showDeleteBox === crop.id ? "10" : "1",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={crop.image_url}
                  alt={crop.crop_name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>{crop.crop_name}</p>
                  <p style={{ fontSize: "14px", color: "#757575" }}>Stock: {crop.quantity} kg</p>
                  <p style={{ fontSize: "14px", color: "#388E3C" }}>₹{crop.price}/kg</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => openUpdateBox(crop)} style={{ backgroundColor: "#E8F5E9", borderRadius: "20px", width: "40px", height: "40px", border: "none", cursor: "pointer" }}>
                  ✏️
                </button>
                <button onClick={() => openDeleteBox(crop)} style={{ backgroundColor: "#FFEBEE", borderRadius: "20px", width: "40px", height: "40px", border: "none", cursor: "pointer" }}>
                  🗑️
                </button>
              </div>
            </div>

            {/* Update Box */}
            {showUpdateBox === crop.id && (
              <div style={{ position: "absolute", top: "70px", left: "50%", transform: "translateX(-50%)", background: "#E8F5E9", padding: "16px", borderRadius: "12px", boxShadow: "0px 3px 10px rgba(0,0,0,0.2)", width: "260px", textAlign: "center" }}>
                <p style={{ fontWeight: "600", color: "#2E7D32" }}>Update Quantity</p>
                <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} style={{ padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #A5D6A7" }} autoFocus />
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-around" }}>
                  <button onClick={() => handleUpdateQuantity(crop.id)} style={{ backgroundColor: "#4CAF50", color: "white", padding: "8px 16px", border: "none", borderRadius: "20px", cursor: "pointer" }}>Update</button>
                  <button onClick={closeModals} style={{ backgroundColor: "#E53935", color: "white", padding: "8px 16px", border: "none", borderRadius: "20px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Delete Confirmation Box */}
            {showDeleteBox === crop.id && (
              <div style={{ position: "absolute", top: "70px", left: "50%", transform: "translateX(-50%)", background: "#E8F5E9", padding: "16px", borderRadius: "12px", boxShadow: "0px 3px 10px rgba(0,0,0,0.2)", width: "260px", textAlign: "center" }}>
                <p style={{ fontWeight: "600", color: "#D32F2F" }}>Confirm Deletion</p>
                <p style={{ fontSize: "14px", color: "#757575" }}>Are you sure you want to delete this crop?</p>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-around" }}>
                  <button onClick={() => handleDeleteCrop(crop.id)} style={{ backgroundColor: "#D32F2F", color: "white", padding: "8px 16px", border: "none", borderRadius: "20px", cursor: "pointer" }}>Delete</button>
                  <button onClick={closeModals} style={{ backgroundColor: "#4CAF50", color: "white", padding: "8px 16px", border: "none", borderRadius: "20px", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Inventory;
