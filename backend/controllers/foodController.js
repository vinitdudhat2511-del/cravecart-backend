import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// add food items
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      // Parse tags from comma-separated string or JSON array
      let tags = [];
      if (req.body.tags) {
        try {
          tags = JSON.parse(req.body.tags);
        } catch {
          tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
        }
      }

      const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        tags,
      });
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      // Clean up the uploaded file if user is not an admin
      fs.unlink(`uploads/${image_filename}`, () => {});
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    fs.unlink(`uploads/${image_filename}`, () => {});
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`, () => {});
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
