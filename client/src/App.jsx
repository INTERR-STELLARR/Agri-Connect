import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/auth/homepage";
import Login from "./components/auth/logincss/login";
import BuyerRegistration from "./components/auth/BuyerRegistration";
import Inventory from "./components/dashFarmer/inventory";
import Dash from "./components/buyerDash/buyerdash";
import CropHandling from "./components/dashFarmer/cropHandling";
import BuyerProfile from "./components/buyerDash/buyerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<BuyerRegistration />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/crophandling" element={<CropHandling />} />
        <Route path="/seller-dashboard" element={<Inventory />} />

        {/* ✅ Ensure this route exists */}
        <Route path="/buyerProfile" element={<BuyerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
