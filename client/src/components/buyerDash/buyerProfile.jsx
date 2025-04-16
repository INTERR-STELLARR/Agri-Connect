import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Slide,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import IosShareIcon from "@mui/icons-material/IosShare";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PaymentOptions from "./PaymentOptions";
import { useNavigate } from "react-router-dom";

// Styled Components for consistency
const StyledAppBar = styled(AppBar)({
  backgroundColor: "#2E7D32", // Updated to match farming theme (Green)
});

const StyledCard = styled(Card)({
  borderRadius: "8px",
  backgroundColor: "#F1F8E9", // Light greenish background
  marginBottom: "8px",
  boxShadow: "none",
  cursor: "pointer",
});

const ProfilePage = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const navigate = useNavigate(); // Added navigation for better back handling

  const handlePaymentClick = () => setPaymentOpen(!paymentOpen);

  // ✅ Fetch user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#E8F5E9", minHeight: "100vh" }}>
      {/* Top App Bar */}
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)} // Back functionality
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Toolbar>
      </StyledAppBar>

      {/* Main Profile Section */}
      <Container>
        <Box sx={{ marginTop: 2 }}>
          <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
            <Avatar
              sx={{ width: 90, height: 90, border: "2px solid #388E3C" }}
              src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/agri-connect-8mhlfj/assets/0nigfaege5fe/WhatsApp_Image_2025-02-13_at_11.36.31_AM.jpeg"
            />
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1B5E20" }}>
                {userData?.full_name || "Guest User"}
              </Typography>
              <Typography variant="body2" color="#4CAF50">
                {userData?.email || "No Email Found"}
              </Typography>
            </Box>
          </Box>

          {/* Account Section */}
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: 1, color: "#388E3C" }}
          >
            Account
          </Typography>

          {/* Cards */}
          {[
            {
              icon: <AttachMoneyIcon style={{ color: "#2E7D32" }} />,
              text: "Payment Options",
              onClick: handlePaymentClick,
            },
            {
              icon: <LanguageIcon style={{ color: "#2E7D32" }} />,
              text: "Order History",
              onClick: () => navigate("/buyer/order-history"), // ✅ Redirect added
            },
            {
              icon: <NotificationsNoneIcon style={{ color: "#2E7D32" }} />,
              text: "Notification Settings",
            },
            {
              icon: <AccountCircleOutlinedIcon style={{ color: "#2E7D32" }} />,
              text: "Edit Profile",
            },
          ].map((item, index) => (
            <StyledCard key={index} onClick={item.onClick || null}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  {item.icon}
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 2, flexGrow: 1, color: "#2E7D32" }}
                  >
                    {item.text}
                  </Typography>
                  <ArrowForwardIosIcon style={{ color: "#2E7D32" }} />
                </Box>
              </CardContent>
            </StyledCard>
          ))}

          {/* General Section */}
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 2, marginBottom: 1, color: "#388E3C" }}
          >
            General
          </Typography>

          {/* Logout Button */}
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{ color: "#D32F2F", marginTop: "10px" }}
          >
            🚪 Logout
          </Button>

          {/* General Options */}
          {[
            { icon: <HelpOutlineIcon style={{ color: "#2E7D32" }} />, text: "Support" },
            { icon: <PrivacyTipIcon style={{ color: "#2E7D32" }} />, text: "Terms of Service" },
          ].map((item, index) => (
            <StyledCard key={index}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  {item.icon}
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 2, flexGrow: 1, color: "#2E7D32" }}
                  >
                    {item.text}
                  </Typography>
                  <ArrowForwardIosIcon style={{ color: "#2E7D32" }} />
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Box>
      </Container>

      {/* Payment Options Slide-in from Bottom */}
      <Slide direction="up" in={paymentOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <PaymentOptions />
        </Box>
      </Slide>
    </Box>
  );
};

export default ProfilePage;
