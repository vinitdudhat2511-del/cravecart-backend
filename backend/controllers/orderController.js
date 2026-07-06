import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const POINTS_PER_DOLLAR = 1;       // 1 point per $1 spent
const POINTS_FOR_DISCOUNT = 100;   // 100 points = $5 off
const DISCOUNT_VALUE = 5;          // $ value of 100 points

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const { items, address, amount, redeemPoints } = req.body;
    const userId = req.body.userId;

    let finalAmount = amount;
    let pointsRedeemed = 0;

    // Handle loyalty points redemption
    if (redeemPoints) {
      const user = await userModel.findById(userId);
      if (user && user.loyaltyPoints >= POINTS_FOR_DISCOUNT) {
        finalAmount = Math.max(0, amount - DISCOUNT_VALUE);
        pointsRedeemed = POINTS_FOR_DISCOUNT;
      }
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount: finalAmount,
      address,
      pointsRedeemed,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Deduct redeemed points immediately
    if (pointsRedeemed > 0) {
      await userModel.findByIdAndUpdate(userId, {
        $inc: { loyaltyPoints: -pointsRedeemed },
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery fee line item
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Add loyalty discount line item if applicable
    if (pointsRedeemed > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Loyalty Points Discount (-${pointsRedeemed} pts)` },
          unit_amount: -DISCOUNT_VALUE * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      // Award loyalty points: 1 point per $1 spent
      if (order) {
        const pointsEarned = Math.floor(order.amount * POINTS_PER_DOLLAR);
        await orderModel.findByIdAndUpdate(orderId, { pointsEarned });
        await userModel.findByIdAndUpdate(order.userId, {
          $inc: { loyaltyPoints: pointsEarned },
        });
      }

      res.json({ success: true, message: "Paid" });
    } else {
      // Restore redeemed points if payment was cancelled
      const order = await orderModel.findById(orderId);
      if (order && order.pointsRedeemed > 0) {
        await userModel.findByIdAndUpdate(order.userId, {
          $inc: { loyaltyPoints: order.pointsRedeemed },
        });
      }
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({}).sort({ date: -1 });
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
