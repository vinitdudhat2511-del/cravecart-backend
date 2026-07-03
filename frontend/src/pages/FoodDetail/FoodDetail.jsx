import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./FoodDetail.css";
import { assets } from "../../assets/frontend_assets/assets";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, url, token, cartItems, addToCart, removeFromCart, favorites, addFavorite, removeFavorite } = useContext(StoreContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const foodItem = food_list.find((item) => item._id === id);

  useEffect(() => {
    if (foodItem) {
      fetchReviews();
    }
  }, [foodItem]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}/api/review/list?foodId=${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to leave a review.");
      return;
    }
    try {
      const response = await axios.post(`${url}/api/review/add`, { foodId: id, rating, comment }, { headers: { token } });
      if (response.data.success) {
        toast.success("Review submitted!");
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  if (!foodItem) return <div className="food-detail-loading">Loading...</div>;

  const isFavorite = favorites && favorites.includes(id);

  return (
    <div className="food-detail">
      <div className="food-detail-container">
        <div className="food-detail-image-section">
          <img src={url + "/images/" + foodItem.image} alt={foodItem.name} />
          <div className="food-detail-actions">
            {!cartItems[id] ? (
              <button className="add-to-cart-btn" onClick={() => addToCart(id)}>Add to Cart</button>
            ) : (
              <div className="food-item-counter-detail">
                <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                <p>{cartItems[id]}</p>
                <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
              </div>
            )}
            <button className="favorite-btn" onClick={() => isFavorite ? removeFavorite(id) : addFavorite(id)}>
              {isFavorite ? '❤️ Loved' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>
        <div className="food-detail-info-section">
          <h2>{foodItem.name}</h2>
          <p className="food-detail-price">${foodItem.price}</p>
          <p className="food-detail-desc">{foodItem.description}</p>
          
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <div className="reviews-list">
              {reviews.length === 0 ? <p>No reviews yet. Be the first to review!</p> : (
                reviews.map((rev, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <strong>{rev.userId?.name || "Anonymous"}</strong>
                      <span className="review-rating">{'⭐'.repeat(rev.rating)}</span>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form className="add-review-form" onSubmit={submitReview}>
              <h4>Leave a Review</h4>
              <div className="rating-select">
                <label>Rating:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <textarea 
                placeholder="Write your review here..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
