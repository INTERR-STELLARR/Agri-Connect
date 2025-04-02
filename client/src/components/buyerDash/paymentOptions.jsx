import React from "react";
import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PaymentOptions = () => {
  const paymentMethods = [
    { icon: <PaymentsIcon style={{ color: "#2E7D32" }} />, label: "Credit/Debit Card" },
    { icon: <AccountBalanceWalletIcon style={{ color: "#2E7D32" }} />, label: "UPI Payment" },
    { icon: <LocalAtmIcon style={{ color: "#2E7D32" }} />, label: "Cash on Delivery" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "380px",
        backgroundColor: "#E8F5E9", // Light green background
        boxShadow: "0px -3px 5px rgba(29, 36, 41, 0.23)",
        borderRadius: "16px 16px 0 0",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", color: "#1B5E20", marginBottom: 2 }}>
        Payment Method
      </Typography>

      {paymentMethods.map((method, index) => (
        <Card
          key={index}
          sx={{
            backgroundColor: "#F1F8E9", // Lighter green
            color: "#2E7D32",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {method.icon}
              <Typography variant="body1" sx={{ color: "#1B5E20" }}>
                {method.label}
              </Typography>
            </Box>
            <IconButton>
              <ChevronRightIcon sx={{ color: "#2E7D32" }} />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PaymentOptions;
