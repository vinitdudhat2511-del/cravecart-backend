import express from "express";
import { loginUser, registerUser, addFavorite, removeFavorite, getFavorites, updateProfile, getProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/favorite/add", authMiddleware, addFavorite);
userRouter.post("/favorite/remove", authMiddleware, removeFavorite);
userRouter.post("/favorite/get", authMiddleware, getFavorites);
userRouter.post("/profile/update", authMiddleware, updateProfile);
userRouter.post("/profile/get", authMiddleware, getProfile);

export default userRouter;
