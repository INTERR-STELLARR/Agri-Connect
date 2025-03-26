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
  backgroundColor: "#333", // Dark background to match screenshot
});

const StyledCard = styled(Card)({
  borderRadius: "8px",
  backgroundColor: "#e5e5e5",
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
    <Box sx={{ flexGrow: 1 }}>
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
              sx={{ width: 90, height: 90, border: "2px solid #ccc" }}
              src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/agri-connect-8mhlfj/assets/0nigfaege5fe/WhatsApp_Image_2025-02-13_at_11.36.31_AM.jpeg"
            />
            <Box sx={{ marginLeft: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {userData?.full_name || "Guest User"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userData?.email || "No Email Found"}
              </Typography>
            </Box>
          </Box>

          {/* Account Section */}
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: 1, color: "#777" }}
          >
            Account
          </Typography>

          {/* Cards */}
          {[
            {
              icon: <AttachMoneyIcon />,
              text: "Payment Options",
              onClick: handlePaymentClick,
            },
            { icon: <LanguageIcon />, text: "Order History" },
            { icon: <NotificationsNoneIcon />, text: "Notification Settings" },
            { icon: <AccountCircleOutlinedIcon />, text: "Edit Profile" },
          ].map((item, index) => (
            <StyledCard key={index} onClick={item.onClick || null}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  {item.icon}
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 2, flexGrow: 1 }}
                  >
                    {item.text}
                  </Typography>
                  <ArrowForwardIosIcon />
                </Box>
              </CardContent>
            </StyledCard>
          ))}

          {/* General Section */}
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 2, marginBottom: 1, color: "#777" }}
          >
            General
          </Typography>

          {/* Logout Button */}
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{ color: "#d32f2f", marginTop: "10px" }}
          >
            🚪 Logout
          </Button>

          {/* General Options */}
          {[
            { icon: <HelpOutlineIcon />, text: "Support" },
            { icon: <PrivacyTipIcon />, text: "Terms of Service" },
            { icon: <IosShareIcon />, text: "Invite Friends" },
          ].map((item, index) => (
            <StyledCard key={index}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  {item.icon}
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: 2, flexGrow: 1 }}
                  >
                    {item.text}
                  </Typography>
                  <ArrowForwardIosIcon />
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
