import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const role = user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const addFavorite = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let favorites = userData.favorites || [];
    if (!favorites.includes(req.body.itemId)) {
      favorites.push(req.body.itemId);
    }
    await userModel.findByIdAndUpdate(req.body.userId, { favorites });
    res.json({ success: true, message: "Added to favorites" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let favorites = userData.favorites || [];
    favorites = favorites.filter((id) => id !== req.body.itemId);
    await userModel.findByIdAndUpdate(req.body.userId, { favorites });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const getFavorites = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let favorites = userData.favorites || [];
    res.json({ success: true, favorites });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await userModel.findByIdAndUpdate(req.body.userId, { name, phone, address });
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.body.userId)
      .select("-password -cartData -favorites");
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// Get loyalty points balance
const getPoints = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("loyaltyPoints name");
    res.json({ success: true, loyaltyPoints: user.loyaltyPoints || 0 });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching points" });
  }
};

export {
  loginUser,
  registerUser,
  addFavorite,
  removeFavorite,
  getFavorites,
  updateProfile,
  getProfile,
  getPoints,
};
