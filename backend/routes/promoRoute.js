import express from "express";
import { validatePromo, addPromo } from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/validate", validatePromo);
promoRouter.post("/add", addPromo); // In a real app, this would be admin protected

export default promoRouter;
