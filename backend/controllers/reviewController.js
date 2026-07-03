import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const addReview = async (req, res) => {
  try {
    const { foodId, rating, comment, userId } = req.body;
    const newReview = new reviewModel({ userId, foodId, rating, comment });
    await newReview.save();
    res.json({ success: true, message: "Review added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding review" });
  }
};

const getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.query; // get from query params
    const reviews = await reviewModel.find({ foodId }).populate("userId", "name").sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching reviews" });
  }
};

export { addReview, getFoodReviews };
