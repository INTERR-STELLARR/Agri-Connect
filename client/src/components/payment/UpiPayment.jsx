import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpiPayment.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const UpiPayment = () => {
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const buyerId = localStorage.getItem("buyerId");
  const buyerName = localStorage.getItem("buyerName") || "A Buyer"; // fallback

  useEffect(() => {
    if (buyerId) {
      fetchCartTotal(buyerId);
    }
  }, [buyerId]);

  const fetchCartTotal = async (buyerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${buyerId}`);
      const data = await response.json();
  
      if (data.success) {
        const cart = data.cart;
        setCartItems(cart);
  
        // Calculate subtotal using price × quantity
        const subtotal = cart.reduce(
          (sum, item) => sum + (parseFloat(item.price) * item.quantity),
          0
        );
  
        const deliveryFee = 40;
        const platformFee = +(0.05 * subtotal).toFixed(2);
        const total = subtotal + deliveryFee + platformFee;
  
        setTotalAmount(total.toFixed(2));
      }
    } catch (error) {
      console.error("🚨 Error fetching cart total:", error);
    }
  };
  

  const handlePayment = async () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);

    const invoiceId = `INV-${Date.now()}`;

    const cleanedCart = cartItems.map(item => ({
      crop_name: item.crop_name || item.crop?.crop_name || "Unnamed Crop",
      crop_id: item.crop_id || item.cropId || item.crop?.crop_id || null,  // 👈 Add this
      price: parseFloat(item.price),
      quantity: parseFloat(item.quantity),
      seller_id: item.seller_id || item.crop?.seller_id || null
    }));

    const subtotal = cleanedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 40;
    const platformFee = +(subtotal * 0.05);
    const total = subtotal + deliveryFee + platformFee;

    const invoiceData = {
      invoiceId,
      items: cleanedCart,
      subtotal,
      deliveryFee,
      platformFee,
      total,
      deliveryDate: deliveryDate.toDateString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          buyerId,
          invoiceId,
          deliveryDate: deliveryDate.toISOString().split("T")[0],
          subtotal,
          deliveryFee,
          platformFee,
          total,
          crops: cleanedCart
        })
      });

      const result = await response.json();
      if (result.success) {
        // ✅ Save invoice locally
        localStorage.setItem('invoiceData', JSON.stringify(invoiceData));

        // ✅ Notify each seller
        for (const item of cleanedCart) {
          await fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cropId: item.crop_id,              // ✅ Include this line
              sellerId: item.seller_id,
              cropName: item.crop_name,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
              buyerName: buyerName
            })
          });
        }

        // ✅ Clear cart
        await fetch(`http://localhost:5000/api/cart/clear/${buyerId}`, {
          method: "DELETE"
        });

        navigate('/invoice');
      } else {
        console.error("❌ Error saving order:", result.error);
        alert("Failed to save order in database.");
      }
    } catch (err) {
      console.error("🚨 Order API Error:", err);
      alert("Something went wrong during payment.");
    }
  };

  const handleCreditCardRedirect = () => {
    navigate('/credit-card');
  };

  return (
    <div className="upi-payment-container" onClick={() => document.activeElement.blur()}>
      <div style={{
        backgroundColor: "#4CAF50",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{
          color: "#FFFFFF",
          fontSize: "24px",
          fontWeight: "bold",
          margin: 0
        }}>UPI Payment</h1>
      </div>

      <div className="content-container">
        <div className="payment-card">
          <div className="card-content">
            <h2 className="section-title" style={{ color: '#1D2429' }}>Payment Details</h2>
            <div className="amount-row">
              <p className="amount-label" style={{ color: '#57636C' }}>Amount to Pay:</p>
              <p className="amount-value" style={{ color: '#4B39EF' }}>₹{totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="payment-methods-card">
          <div className="card-content">
            <h2 className="section-title" style={{ color: '#1D2429' }}>Choose Payment Method</h2>

            <div className="payment-option">
              <div className="option-content">
                <img src="/images/gpay.webp" alt="Google Pay" className="payment-icon" />
                <p className="option-name">Google Pay</p>
              </div>
              <ChevronRightIcon style={{ color: '#57636C' }} />
            </div>

            <div className="payment-option">
              <div className="option-content">
                <img src="/images/phonepe.webp" alt="PhonePe" className="payment-icon" />
                <p className="option-name">PhonePe</p>
              </div>
              <ChevronRightIcon style={{ color: '#57636C' }} />
            </div>

            <div className="payment-option">
              <div className="option-content">
                <img src="/images/razorpay.webp" alt="RazorPay" className="payment-icon" />
                <p className="option-name">RazorPay</p>
              </div>
              <ChevronRightIcon style={{ color: '#57636C' }} />
            </div>

            <div className="payment-option" onClick={handleCreditCardRedirect} style={{ cursor: "pointer" }}>
              <div className="option-content">
                <img src="/images/card.webp" alt="Card Payment" className="payment-icon" />
                <p className="option-name">Credit / Debit Card</p>
              </div>
              <ChevronRightIcon style={{ color: '#57636C' }} />
            </div>
          </div>
        </div>

        <div className="upi-id-card">
          <div className="card-content">
            <h2 className="section-title" style={{ color: '#1D2429' }}>Pay with UPI ID</h2>
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="upi-input"
            />
            <p className="example-text" style={{ color: '#57636C' }}>Example: mobilenumber@upi</p>
          </div>
        </div>

        <div className="qr-code-card">
          <div className="card-content">
            <h2 className="section-title" style={{ color: '#1D2429' }}>Scan QR Code</h2>
            <div className="qr-code-container">
              <img
                src="/images/qr.webp"
                alt="UPI QR Code"
                className="qr-code-image"
              />
              <p className="scan-text" style={{ color: '#57636C' }}>Scan with any UPI app</p>
            </div>
          </div>
        </div>

        <button className="proceed-button" onClick={handlePayment}>
          confirm payment
        </button>
      </div>
    </div>
  );
};

export default UpiPayment;
