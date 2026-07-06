import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/auth.js";

const analyticsRouter = express.Router();

// POST so authMiddleware can inject userId from req.body
analyticsRouter.post("/", authMiddleware, getAnalytics);

export default analyticsRouter;
