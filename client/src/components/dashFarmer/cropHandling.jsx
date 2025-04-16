import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  MenuItem,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const CropHandling = () => {
  const navigate = useNavigate();

  const [cropName, setCropName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [cropType, setCropType] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    const sellerId = localStorage.getItem("sellerId");
    if (sellerId) {
      fetchSellerDetails(sellerId);
    }
  }, []);

  const fetchSellerDetails = async (sellerId) => {
    try {
      const response = await fetch(`http://localhost:5000/sellers/${sellerId}`);
      const data = await response.json();
      if (response.ok && data.success && data.seller?.name) {
        setSellerName(data.seller.name);
      }
    } catch (error) {
      console.error("Error fetching seller details:", error);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("crop-image-upload").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const sellerId = localStorage.getItem("sellerId");

    if (!sellerId) {
      alert("Seller ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    if (!cropName || !description || !quantity || !price || !cropType) {
      alert("⚠️ Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("cropName", cropName);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("cropType", cropType);
    formData.append("sellerId", sellerId);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:5000/crops", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Crop added successfully!");
        setCropName("");
        setDescription("");
        setQuantity("");
        setPrice("");
        setCropType("");
        setImageFile(null);
        navigate("/inventory");
      } else {
        console.error("❌ Failed to add crop:", data.message);
        alert(`⚠️ Failed to add crop: ${data.message}`);
      }
    } catch (error) {
      console.error("🔥 Error:", error);
      alert("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fff5", minHeight: "100vh", color: "#333" }}>
      <AppBar position="static" sx={{ bgcolor: "#4caf50" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Farmer Dashboard
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/notifications")}>
            <NotificationsIcon />
          </IconButton>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("sellerId");
              navigate("/login");
            }}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Paper sx={{ bgcolor: "#e8f5e9", p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: "#2e7d32" }}>
            Welcome Back, {sellerName ? sellerName : "Farmer"}
          </Typography>
          <Typography variant="subtitle1">Add a new crop to your inventory</Typography>
        </Paper>

        <Paper sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "#ffffff" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#4caf50" }}>
            Add New Crop
          </Typography>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <IconButton color="primary" onClick={handleUploadClick}>
              <AddAPhotoIcon fontSize="large" />
            </IconButton>
            <Typography>Upload Crop Image</Typography>
            <input
              id="crop-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Box>

          <TextField
            fullWidth
            label="Crop Name"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity Available (kg)"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price per kg (₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Crop Type"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="Vegetables">Vegetables</MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Grains">Grains</MenuItem>
            <MenuItem value="Pulses">Pulses</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Add Listing
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CropHandling;
