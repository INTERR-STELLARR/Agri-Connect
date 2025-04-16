import React, { useEffect, useState } from 'react';
import './SellerNotifications.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/${sellerId}`);
        const data = await response.json();
        if (data.success) {
          const sortedNotifications = data.notifications.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setNotifications(sortedNotifications);
        }
      } catch (error) {
        console.error("🚨 Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchNotifications();
    }
  }, [sellerId]);

  const getDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="notif-container">
      <div className="notif-header">
        <NotificationsNoneIcon style={{ fontSize: "30px", marginRight: "10px", color: "#4CAF50" }} />
        <h2>Seller Notifications</h2>
      </div>

      <div className="notif-list">
        {loading ? (
          <p className="notif-loading">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div key={index} className="notif-card">
              <p className="notif-message">
                <strong>{notif.buyer_name}</strong> purchased <strong>{notif.quantity} kg</strong> of <strong>{notif.crop_name}</strong> for ₹<strong>{notif.total_price}</strong>
              </p>
              <p className="notif-time">
                Purchased on: {new Date(notif.created_at).toLocaleString()} <br />
                Estimated delivery: <strong>{getDeliveryDate(notif.created_at)}</strong>
              </p>
            </div>
          ))
        ) : (
          <p className="no-notif">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerNotifications;
