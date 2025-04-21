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
        alert("Seller Registration Successful! Please login.");
        navigate("/login");
      } else {
        console.error("❌ Registration failed:", data.message);
        if (data.message === "Email already registered") {
          alert("⚠️ Email is already registered as a Buyer.");
        } else {
          alert(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("❌ Error during registration:", error);
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

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Buyer registered successfully:", data);
        alert("Buyer Registration Successful! Please login.");
        navigate("/login");
      } else {
        console.error("❌ Registration failed:", data.message);
        if (data.message === "Email already registered") {
          alert("⚠️ Email is already registered as a Seller.");
        } else {
          alert(data.message || "Registration failed");
        }
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
