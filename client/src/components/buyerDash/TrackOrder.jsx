import React, { useEffect, useState } from "react";
import "./TrackOrder.css";

const steps = ["Order Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const TrackOrder = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 25;
        setCurrentStep(nextProgress / 25);
        if (nextProgress >= 100) clearInterval(interval);
        return nextProgress;
      });
    }, 2500); // 10 seconds total => 2500ms * 4 steps = 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="track-wrapper">
      <div className="track-container">
        <h1>🚚 Track Your Order</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="steps">
          {steps.map((step, index) => (
            <div key={index} className={`step ${index < currentStep ? "completed" : ""}`}>
              <span>{step}</span>
              {index < steps.length - 1 && <div className="divider" />}
            </div>
          ))}
        </div>
        <p className="status-text">
          Current Status: <strong>{steps[currentStep - 1] || "Processing..."}</strong>
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;
