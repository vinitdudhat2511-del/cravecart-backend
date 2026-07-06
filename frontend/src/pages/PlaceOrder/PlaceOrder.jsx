import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const POINTS_FOR_DISCOUNT = 100;
const DISCOUNT_VALUE = 5;

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discountPercent,
    loyaltyPoints,
    setLoyaltyPoints,
  } = useContext(StoreContext);

  const [redeemPoints, setRedeemPoints] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const canRedeem = loyaltyPoints >= POINTS_FOR_DISCOUNT;

  const subtotal = getTotalCartAmount();
  const promoDiscount = subtotal * (discountPercent / 100);
  const pointsDiscount = redeemPoints && canRedeem ? DISCOUNT_VALUE : 0;
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = Math.max(0, subtotal - promoDiscount - pointsDiscount + deliveryFee);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: total,
      redeemPoints: redeemPoints && canRedeem,
    };

    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      toast.error("Something went wrong placing your order");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login first");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Please Add Items to Cart");
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      {/* Left — Delivery Info */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" />
          <input required name="lastName"  value={data.lastName}  onChange={onChangeHandler} type="text" placeholder="Last name" />
        </div>
        <input required name="email"   value={data.email}   onChange={onChangeHandler} type="email" placeholder="Email Address" />
        <input required name="street"  value={data.street}  onChange={onChangeHandler} type="text"  placeholder="Street" />
        <div className="multi-fields">
          <input required name="city"  value={data.city}  onChange={onChangeHandler} type="text" placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip Code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" />
        </div>
        <input required name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Phone" />
      </div>

      {/* Right — Cart Totals */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>

            {discountPercent > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Promo Discount ({discountPercent}%)</p>
                  <p>-${promoDiscount.toFixed(2)}</p>
                </div>
              </>
            )}

            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>

            {/* Loyalty Points Section */}
            <hr />
            <div className="loyalty-section">
              <div className="loyalty-header">
                <span className="loyalty-icon">🏆</span>
                <span className="loyalty-balance">
                  {loyaltyPoints} points available
                </span>
              </div>
              {canRedeem ? (
                <label className="redeem-toggle">
                  <input
                    type="checkbox"
                    checked={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.checked)}
                  />
                  <span>
                    Redeem {POINTS_FOR_DISCOUNT} points for <strong>${DISCOUNT_VALUE} off</strong>
                  </span>
                </label>
              ) : (
                <p className="loyalty-hint">
                  Earn {POINTS_FOR_DISCOUNT - loyaltyPoints} more points to redeem $5 off
                </p>
              )}
              {redeemPoints && canRedeem && (
                <div className="cart-total-details loyalty-applied">
                  <p>Points Discount</p>
                  <p>-${DISCOUNT_VALUE}.00</p>
                </div>
              )}
            </div>

            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
          </div>

          <div className="points-earn-note">
            🏆 You'll earn ~{Math.floor(total)} points on this order
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
