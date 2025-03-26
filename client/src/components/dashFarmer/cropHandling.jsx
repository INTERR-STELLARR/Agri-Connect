import React, { useState } from "react";
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

  // ✅ Trigger file selection
  const handleUploadClick = () => {
    document.getElementById("crop-image-upload").click();
  };

  // ✅ Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // ✅ Handle form submission
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
      console.log("📤 Sending crop data:", formData);

      const response = await fetch("http://localhost:5000/crops", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("✅ Crop upload response:", data);

      if (response.ok) {
        alert("✅ Crop added successfully!");
        setCropName("");
        setDescription("");
        setQuantity("");
        setPrice("");
        setCropType("");
        setImageFile(null);
        navigate("/inventory"); // Redirect to inventory after adding crop
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
    <Box sx={{ bgcolor: "#34210B", minHeight: "100vh", color: "white" }}>
      <AppBar position="static" sx={{ bgcolor: "#34210B" }}>
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
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Paper sx={{ bgcolor: "#4E161A", p: 3, borderRadius: 2, color: "white" }}>
          <Typography variant="h5">Welcome Back, Farmer</Typography>
          <Typography variant="subtitle1">Add a new crop to your inventory</Typography>
        </Paper>

        {/* ✅ Add Crop Section */}
        <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
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
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
            Add Listing
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CropHandling;
