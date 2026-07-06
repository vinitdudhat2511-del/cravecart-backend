import React, { useEffect, useState } from "react";
import "./ETATimer.css";

// ETA in minutes from order creation based on status
const ETA_MINUTES = {
  "Food Processing": 30,
  "Out for delivery": 12,
  "Delivered": 0,
};

const formatTime = (seconds) => {
  if (seconds <= 0) return "Arriving soon...";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
};

const ETATimer = ({ orderedAt, status }) => {
  const etaMinutes = ETA_MINUTES[status] ?? 30;
  const orderTime = new Date(orderedAt).getTime();
  const etaMs = etaMinutes * 60 * 1000;

  const [remaining, setRemaining] = useState(() => {
    const elapsed = Date.now() - orderTime;
    return Math.max(0, Math.floor((etaMs - elapsed) / 1000));
  });

  useEffect(() => {
    if (status === "Delivered") return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - orderTime;
      const rem = Math.max(0, Math.floor((etaMs - elapsed) / 1000));
      setRemaining(rem);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, orderTime, etaMs]);

  if (status === "Delivered") {
    return (
      <div className="eta-timer eta-delivered">
        <span className="eta-icon">🎉</span>
        <span>Your order has been delivered!</span>
      </div>
    );
  }

  const progress = Math.max(0, Math.min(100, ((etaMs / 1000 - remaining) / (etaMs / 1000)) * 100));

  return (
    <div className="eta-timer">
      <div className="eta-header">
        <span className="eta-icon">⏱️</span>
        <span className="eta-label">Estimated arrival</span>
        <span className="eta-countdown">{formatTime(remaining)}</span>
      </div>
      <div className="eta-bar-bg">
        <div className="eta-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ETATimer;
