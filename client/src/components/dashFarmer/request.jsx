import React, { useState } from 'react';
import './RequestPage.css'; // You'll need to create this CSS file

function RequestPage() {
  const [model, setModel] = useState({}); // Placeholder for your model logic

  const handleUnfocus = () => {
    // Equivalent to FocusScope.of(context).unfocus()
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="request-page" onClick={handleUnfocus}>
      <div className="app-bar">
        <h1 className="app-title">Seller Dashboard</h1>
        <div className="notification-icon">
          <button className="icon-button">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="tab-container">
        <div className="tab active">Incoming</div>
        <div className="tab">Outgoing</div>
        <div className="tab">Past</div>
      </div>

      <div className="divider"></div>

      <div className="request-list">
        {/* Request Item 1 */}
        <div className="request-card">
          <div className="item-image" style={{ backgroundImage: "url('https://via.placeholder.com/500x300?furniture')" }}></div>
          <div className="item-details">
            <div className="item-header">
              <h3>Vintage Oak Dining Table</h3>
              <span className="badge new">New</span>
            </div>
            <p className="requester">Request from: Sarah Johnson</p>
            <p className="request-time">Requested: 2 hours ago</p>
            <div className="action-buttons">
              <button className="decline-btn">Decline</button>
              <button className="accept-btn">Accept</button>
            </div>
          </div>
        </div>

        {/* Request Item 2 */}
        <div className="request-card">
          <div className="item-image" style={{ backgroundImage: "url('https://via.placeholder.com/500x300?antique')" }}></div>
          <div className="item-details">
            <div className="item-header">
              <h3>Antique Brass Lamp</h3>
              <span className="badge new">New</span>
            </div>
            <p className="requester">Request from: Michael Chen</p>
            <p className="request-time">Requested: 5 hours ago</p>
            <div className="action-buttons">
              <button className="decline-btn">Decline</button>
              <button className="accept-btn">Accept</button>
            </div>
          </div>
        </div>

        {/* Request Item 3 */}
        <div className="request-card">
          <div className="item-image" style={{ backgroundImage: "url('https://via.placeholder.com/500x300?bookshelf')" }}></div>
          <div className="item-details">
            <div className="item-header">
              <h3>Wooden Bookshelf</h3>
              <span className="badge new">New</span>
            </div>
            <p className="requester">Request from: Emily Rodriguez</p>
            <p className="request-time">Requested: Yesterday</p>
            <div className="action-buttons">
              <button className="decline-btn">Decline</button>
              <button className="accept-btn">Accept</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPage;