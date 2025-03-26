import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = () => console.log("Forgot Password pressed...");
  const handleGoogleLogin = () => console.log("Continue with Google pressed...");
  const handleSignUp = () => navigate("/register");

  // ✅ Updated Login Handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", data);

      if (response.ok) {
        console.log("✅ Login successful:", data.user);

        // ✅ Save buyer/seller data to localStorage properly
        if (data.role === "seller" && data.sellerId) {
          localStorage.setItem("sellerId", data.sellerId);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("🚜 Welcome, Seller!");
          window.location.href = "/inventory";
        } else if (data.role === "buyer") {
          localStorage.setItem("buyerId", data.user.id);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("🛒 Welcome, Buyer!");
          window.location.href = "/dash";
        } else {
          alert("⚠️ Unknown role! Please try again.");
        }
      } else {
        console.error("❌ Login failed:", data.message);
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("❌ Error during login:", error);
      alert("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <Box className="login-page">
      {/* Header */}
      <Box className="login-header">
        <Box className="login-header-gradient">
          <Box className="login-header-content">
            <Box className="logo-container">
              <img
                src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/agri-connect-8mhlfj/assets/fiyflvqkjlgb/new_logo.jpg"
                alt="Logo"
                className="logo-image"
              />
            </Box>
            <Typography variant="h4" className="login-title">
              Sign In
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
              Use the account below to sign in.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Login Form */}
      <Paper className="login-form-container" elevation={3}>
        <form className="login-form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setPasswordVisible((prev) => !prev)}>
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className="button-group">
            <Button type="submit" variant="contained" color="primary" className="btn btn-primary" fullWidth>
              Login
            </Button>
          </Box>

          <Box className="button-group">
            <Button
              variant="outlined"
              color="primary"
              className="btn btn-secondary"
              fullWidth
              onClick={handleForgotPassword}
            >
              Forgot Password
            </Button>
          </Box>

          <Typography align="center" className="separator">
            Or sign up with
          </Typography>

          <Box className="button-group">
            <Button
              variant="outlined"
              className="btn btn-outline"
              fullWidth
              onClick={handleGoogleLogin}
              startIcon={<Google />}
            >
              Continue with Google
            </Button>
          </Box>

          <Typography align="center" className="signup-link">
            Don't have an account?{" "}
            <Button className="link-button" onClick={handleSignUp}>
              Sign Up
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;


