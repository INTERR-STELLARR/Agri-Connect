import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/auth/homepage";
import Login from "./components/auth/logincss/login";
import BuyerRegistration from "./components/auth/BuyerRegistration";
import Inventory from "./components/dashFarmer/inventory";
import Dash from "./components/buyerDash/buyerdash";
import CropHandling from "./components/dashFarmer/cropHandling";
import BuyerProfile from "./components/buyerDash/buyerProfile";
import BuyerCart  from "./components/buyerDash/buyerCART";
import UpiPayment from "./components/payment/UpiPayment";
import Invoice from "./components/buyerDash/Invoice";
import SellerNotifications from "./components/dashFarmer/SellerNotifications";
import OrderHistory from "./components/buyerDash/OrderHistory";
import TrackOrder from "./components/buyerDash/TrackOrder";


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
        <Route path="/buyerCart" element={<BuyerCart />} />
        <Route path="/payment" element={<UpiPayment />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/notifications" element={<SellerNotifications />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/buyer/order-history" element={<OrderHistory />} />
        <Route path="/track-order" element={<TrackOrder />} />

        {/* ✅ Ensure this route exists */}
        <Route path="/buyerProfile" element={<BuyerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
