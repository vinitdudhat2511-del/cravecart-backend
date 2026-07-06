import express from "express";
import { validatePromo, addPromo } from "../controllers/promoController.js";
import authMiddleware from "../middleware/auth.js";

const promoRouter = express.Router();

promoRouter.post("/validate", validatePromo);
// Admin-protected: only authenticated admins can create promo codes
promoRouter.post("/add", authMiddleware, addPromo);

export default promoRouter;
