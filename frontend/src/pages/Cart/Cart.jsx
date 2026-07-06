import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    discountPercent,
    applyPromo,
    loyaltyPoints,
  } = useContext(StoreContext);

  const subtotal = getTotalCartAmount();
  const promoDiscount = subtotal * (discountPercent / 100);
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal === 0 ? 0 : (subtotal * (1 - discountPercent / 100) + 2);
  const pointsToEarn = Math.floor(total);

  const [promoInput, setPromoInput] = useState("");

  const navigate=useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            {discountPercent > 0 && (
              <>
                <hr />
                <div className="cart-total-details">
                  <p>Discount ({discountPercent}%)</p>
                  <p>-${promoDiscount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
            {subtotal > 0 && (
              <div className="cart-points-preview">
                🏆 You&apos;ll earn <strong>~{pointsToEarn} loyalty points</strong> on this order
                {loyaltyPoints >= 100 && " · Redeem 100 pts for $5 off at checkout"}
              </div>
            )}
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" value={promoInput} onChange={(e)=>setPromoInput(e.target.value)} />
              <button onClick={()=>applyPromo(promoInput)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
