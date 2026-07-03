import promoModel from "../models/promoModel.js";

const validatePromo = async (req, res) => {
  const { code } = req.body;
  try {
    const promo = await promoModel.findOne({ code, isActive: true });
    if (promo) {
      res.json({ success: true, discountPercent: promo.discountPercent });
    } else {
      res.json({ success: false, message: "Invalid or inactive promo code" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error validating promo code" });
  }
};

// Also adding a helper to create one for testing
const addPromo = async (req, res) => {
  try {
    const newPromo = new promoModel(req.body);
    await newPromo.save();
    res.json({ success: true, message: "Promo added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { validatePromo, addPromo };
