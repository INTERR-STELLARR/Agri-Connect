import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const HomePage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div>
      {/* App Bar */}
      <AppBar position="static" style={{ backgroundColor: "#C2E0E3E7" }}>
        <Toolbar>
          {/* Drawer Menu */}
          <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box width={250} role="presentation" onClick={toggleDrawer(false)}>
              <List>
                <ListItem>
                  <ContactMailIcon style={{ fontSize: 50, marginRight: 10 }} />
                </ListItem>
                <ListItem button onClick={() => navigate("/")}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="About Agri-Connect" />
                </ListItem>
                <ListItem button onClick={() => navigate("/terms")}>
                  <ListItemText primary="Terms & Conditions" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Contact Us" />
                </ListItem>
                <ListItem button onClick={() => navigate("/login")}>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </List>
            </Box>
          </Drawer>

          {/* Logo */}
          <img
            src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/agri-connect-8mhlfj/assets/2hofom4jdvhh/logo.png"
            alt="Agri-Connect Logo"
            style={{ width: 150, marginLeft: "auto" }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={3}>
        <Typography variant="h4">Welcome to Agri-Connect </Typography>
        <img
          src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/agri-connect-8mhlfj/assets/1svgnql6cczo/farming.jpeg"
          alt="Farming"
          style={{ width: "%", maxHeight: "", marginTop: 20, borderRadius: 8 }}
        />
      </Box>
    </div>
  );
};

export default HomePage;
