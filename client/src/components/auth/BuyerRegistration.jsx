import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerRegistration.css";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";

const BuyerRegistration = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [sellerForm, setSellerForm] = useState({
    fullName: "",
    phoneNo: "",
    city: "",
    pincode: "",
    email: "",
    fullAddress: "",
    password: "",
  });
  const [buyerForm, setBuyerForm] = useState({
    fullName: "",
    phoneNo: "",
    city: "",
    pincode: "",
    email: "",
    fullAddress: "",
    password: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSellerInputChange = (e) => {
    const { name, value } = e.target;
    setSellerForm({ ...sellerForm, [name]: value });
  };

  const handleBuyerInputChange = (e) => {
    const { name, value } = e.target;
    setBuyerForm({ ...buyerForm, [name]: value });
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellerForm),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Seller registered successfully:", data);
        localStorage.setItem("sellerId", data.sellerId);
        alert("Seller Registration Successful!");
        navigate('/inventory');
      } else {
        console.error("❌ Registration failed:", data.message);
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
      alert("⚠️ An error occurred. Please try again.");
    }
  };
  
  // Login Seller Logic
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Login successful:", data);
  
        // Save Seller ID if role is seller
        if (data.role === "seller") {
          console.log("Saving SellerId:", data.user.id);
          localStorage.setItem("sellerId", data.user.id);
          navigate('/inventory');
        } else {
          navigate('/buyer-dashboard'); // Buyer ke liye alag redirect
        }
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      alert("⚠️ An error occurred. Please try again.");
    }
  };
  
  

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/register/buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buyerForm),
      });
  
      const text = await response.text(); // Log raw response
      console.log("Raw response:", text);
  
      try {
        const data = JSON.parse(text); // Parse response
        console.log("Parsed data:", data);
  
        if (response.ok) {
          console.log("✅ Buyer registered successfully:", data.message);
          alert("Buyer Registration Successful!");
          navigate("/dash");
        } else {
          console.error("❌ Registration failed:", data.message);
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error("⚠️ JSON parse error:", error);
        alert("⚠️ An unexpected error occurred.");
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
      alert("⚠️ An error occurred. Please try again.");
    }
  };
  
  
  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#34210B" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": {
              color: "#E0E3E7",
              fontSize: "1rem",
              fontWeight: "bold",
            },
            "& .Mui-selected": {
              color: "#4B2010",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#4B2010",
            },
          }}
        >
          <Tab label="Seller Registration" />
          <Tab label="Buyer Registration" />
        </Tabs>
      </AppBar>

      {/* Seller Registration Form */}
      {tabValue === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
          <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Seller Registration
            </Typography>
            <form onSubmit={handleSellerSubmit}>
              {Object.keys(sellerForm).map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  name={field}
                  value={sellerForm[field]}
                  onChange={handleSellerInputChange}
                  margin="normal"
                  required
                />
              ))}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Submit as Seller
              </Button>
            </form>
          </Paper>
        </Box>
      )}

      {/* Buyer Registration Form */}
      {tabValue === 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
          <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Buyer Registration
            </Typography>
            <form onSubmit={handleBuyerSubmit}>
              {Object.keys(buyerForm).map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  name={field}
                  value={buyerForm[field]}
                  onChange={handleBuyerInputChange}
                  margin="normal"
                  required
                />
              ))}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Submit as Buyer
              </Button>
            </form>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default BuyerRegistration;