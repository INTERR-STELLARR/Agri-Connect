import React, { useEffect, useState } from 'react';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const buyerId = localStorage.getItem('buyerId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/buyer/order-history/${buyerId}`);
        const result = await res.json();

        if (result.success) {
          const grouped = groupOrders(result.orders);
          setOrders(grouped);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, [buyerId]);

  const groupOrders = (data) => {
    const grouped = {};

    data.forEach(item => {
      if (!grouped[item.orderId]) {
        grouped[item.orderId] = {
          id: item.orderId,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt,
          deliveryDate: item.deliveryDate,
          items: []
        };
      }

      grouped[item.orderId].items.push({
        cropName: item.cropName,
        image: item.image,
        quantity: item.quantity,
        price: item.price
      });
    });

    return Object.values(grouped);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getDeliveryStatus = (deliveryDate) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    return today > delivery ? 'Shipped Successfully' : 'In Progress';
  };

  return (
    <div className="notification-container">
      <h2 className="notification-heading">Order History</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="notification-card" key={order.id}>
            <div className="notification-summary" onClick={() => toggleOrderDetails(order.id)}>
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {getDeliveryStatus(order.deliveryDate)}</p>
            </div>

            {expandedOrderId === order.id && (
              <div className="notification-details">
                {order.items.map((item, index) => (
                  <div className="crop-card" key={index}>
                    <img
                      src={item.image || "/images/default-crop.jpg"}
                      alt={item.cropName}
                      className="crop-img"
                    />
                    <div className="crop-info">
                      <p><strong>Crop:</strong> {item.cropName}</p>
                      <p><strong>Quantity:</strong> {item.quantity} kg</p>
                      <p><strong>Total Price:</strong> ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
