import React from "react";
import "./OrderTimeline.css";

const STEPS = [
  { key: "placed",      label: "Order Placed",     icon: "✅" },
  { key: "processing",  label: "Preparing",         icon: "👨‍🍳" },
  { key: "delivery",    label: "Out for Delivery",  icon: "🛵" },
  { key: "delivered",   label: "Delivered",         icon: "🏠" },
];

const statusToStep = (status) => {
  switch (status) {
    case "Food Processing": return 1;
    case "Out for delivery": return 2;
    case "Delivered":       return 3;
    default:                return 0;
  }
};

const OrderTimeline = ({ status }) => {
  const activeStep = statusToStep(status);

  return (
    <div className="order-timeline">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive    = index === activeStep;
        return (
          <React.Fragment key={step.key}>
            <div className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}>
              <div className="step-icon-wrap">
                <span className="step-icon">{step.icon}</span>
                {isCompleted && <span className="step-check">✓</span>}
              </div>
              <p className="step-label">{step.label}</p>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`timeline-connector ${index < activeStep ? "filled" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
