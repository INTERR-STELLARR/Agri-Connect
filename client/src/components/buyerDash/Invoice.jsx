import React, { useEffect, useState } from "react";
import "./Invoice.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("invoiceData");
    if (storedData) {
      setInvoiceData(JSON.parse(storedData));
    }
  }, []);

  const handleDownload = () => {
    if (!invoiceData) {
      console.error("Invoice data is not available.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🌱 AGRI-CONNECT INVOICE", 14, 22);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceData?.orderId || "N/A"}`, 14, 30);
    doc.text(`Estimated Delivery: ${invoiceData.deliveryDate}`, 14, 38);

    const tableData = invoiceData.items.map((item, index) => [
      index + 1,
      item.crop_name,
      item.quantity,
      `₹${item.price}`,
      `₹${(item.price * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 46,
      head: [["#", "Crop", "Qty (kg)", "Price/kg", "Total"]],
      body: tableData,
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 70;
    doc.text(`Subtotal: ₹${invoiceData.subtotal.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Delivery Fee: ₹${invoiceData.deliveryFee}`, 14, finalY + 18);
    doc.text(`Platform Fee (5%): ₹${invoiceData.platformFee.toFixed(2)}`, 14, finalY + 26);
    doc.text(`Total: ₹${invoiceData.total.toFixed(2)}`, 14, finalY + 36);

    doc.save("invoice.pdf");
  };

  const handleTrackOrder = () => {
    window.location.href = `/track-order?orderId=${invoiceData?.orderId || ""}`;
  };

  if (!invoiceData) {
    return <p>Loading invoice...</p>;
  }

  return (
    <div className="invoice-wrapper">
      <div className="invoice-container">
        <div className="invoice-card">
          <h1>🌱 AGRI-CONNECT INVOICE</h1>
          <p><strong>Invoice ID:</strong> {invoiceData.orderId || "N/A"}</p>
          <p className="delivery-date">
            <strong>Estimated Delivery:</strong> {invoiceData.deliveryDate}
          </p>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Crop</th>
                <th>Qty (kg)</th>
                <th>Price/kg</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.crop_name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-summary">
            <p><strong>Subtotal:</strong> ₹{invoiceData.subtotal.toFixed(2)}</p>
            <p><strong>Delivery Fee:</strong> ₹{invoiceData.deliveryFee}</p>
            <p><strong>Platform Fee (5%):</strong> ₹{invoiceData.platformFee.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹{invoiceData.total.toFixed(2)}</p>
          </div>

          <div className="invoice-actions">
            <button className="track-btn" onClick={handleTrackOrder}>
              🚚 Track Order
            </button>
            <button className="download-btn" onClick={handleDownload}>
              📥 Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
