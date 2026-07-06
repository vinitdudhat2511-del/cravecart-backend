import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import OrderTimeline from "../../components/OrderTimeline/OrderTimeline";
import ETATimer from "../../components/ETATimer/ETATimer";

const MyOrders = () => {
  const { url, token, food_list, addToCart, setCartItems } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [reordering, setReordering] = useState(null);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  const handleReorder = async (order) => {
    setReordering(order._id);
    let count = 0;
    for (const item of order.items) {
      const foodItem = food_list.find((f) => f.name === item.name);
      if (foodItem) {
        for (let i = 0; i < item.quantity; i++) {
          await addToCart(foodItem._id);
        }
        count++;
      }
    }
    setReordering(null);
    if (count > 0) {
      toast.success(`${count} item${count > 1 ? "s" : ""} added to cart!`);
    } else {
      toast.error("Some items are no longer available");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {data.length === 0 ? (
        <div className="no-orders">
          <p>🍽️ No orders yet. Time to order something delicious!</p>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order) => (
            <div key={order._id} className="order-card">
              {/* Header */}
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="order-date">{formatDate(order.date)}</span>
                </div>
                <div className="order-amount">
                  <span className="amount-label">Total</span>
                  <span className="amount-value">${order.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items */}
              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <span key={i} className="order-item-chip">
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>

              {/* Points badge */}
              {order.pointsEarned > 0 && (
                <div className="points-earned-badge">
                  🏆 +{order.pointsEarned} loyalty points earned
                </div>
              )}

              {/* Visual Order Timeline */}
              <OrderTimeline status={order.status} />

              {/* ETA Timer */}
              {order.payment && (
                <ETATimer orderedAt={order.date} status={order.status} />
              )}

              {/* Actions */}
              <div className="order-card-actions">
                <button
                  className="reorder-btn"
                  onClick={() => handleReorder(order)}
                  disabled={reordering === order._id}
                >
                  {reordering === order._id ? "Adding..." : "🔁 Order Again"}
                </button>
                <button className="track-btn" onClick={fetchOrders}>
                  Refresh Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
