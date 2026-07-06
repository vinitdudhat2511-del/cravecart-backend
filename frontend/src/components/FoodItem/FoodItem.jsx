import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const TAG_STYLES = {
  "Vegan":       { emoji: "🌱", color: "#4caf50", bg: "#e8f5e9" },
  "Spicy":       { emoji: "🌶️", color: "#e53935", bg: "#ffebee" },
  "Gluten-Free": { emoji: "🌾", color: "#8d6e63", bg: "#efebe9" },
  "Best Seller": { emoji: "⭐", color: "#f9a825", bg: "#fffde7" },
  "New":         { emoji: "🆕", color: "#1e88e5", bg: "#e3f2fd" },
};

const FoodItem = ({ id, name, price, description, image, tags = [] }) => {
  const { cartItems, addToCart, removeFromCart, url, favorites, addFavorite, removeFavorite } =
    useContext(StoreContext);
  const isFavorite = favorites && favorites.includes(id);
  const navigate = useNavigate();

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          onClick={() => navigate(`/food/${id}`)}
          style={{ cursor: "pointer" }}
          src={url + "/images/" + image}
          alt={name}
          className="food-item-image"
        />
        <div
          className="favorite-icon"
          onClick={() => (isFavorite ? removeFavorite(id) : addFavorite(id))}
        >
          {isFavorite ? "❤️" : "🤍"}
        </div>

        {/* Dietary tag badges */}
        {tags.length > 0 && (
          <div className="food-tags">
            {tags.slice(0, 2).map((tag) => {
              const style = TAG_STYLES[tag] || { emoji: "🏷️", color: "#888", bg: "#f5f5f5" };
              return (
                <span
                  key={tag}
                  className="food-tag-badge"
                  style={{ color: style.color, background: style.bg }}
                >
                  {style.emoji} {tag}
                </span>
              );
            })}
          </div>
        )}

        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>

      <div
        className="food-item-info"
        onClick={() => navigate(`/food/${id}`)}
        style={{ cursor: "pointer" }}
      >
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
