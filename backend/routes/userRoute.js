import express from "express";
import {
  loginUser,
  registerUser,
  addFavorite,
  removeFavorite,
  getFavorites,
  updateProfile,
  getProfile,
  getPoints,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import userModel from "../models/userModel.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/favorite/add", authMiddleware, addFavorite);
userRouter.post("/favorite/remove", authMiddleware, removeFavorite);
userRouter.post("/favorite/get", authMiddleware, getFavorites);
userRouter.post("/profile/update", authMiddleware, updateProfile);
userRouter.post("/profile/get", authMiddleware, getProfile);
userRouter.post("/points", authMiddleware, getPoints);

// Temporary helper route to promote users to admin
userRouter.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    if (user) {
      res.json({ success: true, message: `Successfully upgraded ${email} to admin!` });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default userRouter;
