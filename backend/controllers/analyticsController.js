import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const getAnalytics = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (!userData || userData.role !== "admin") {
      return res.json({ success: false, message: "Not authorized" });
    }

    // ── Revenue & orders for the last 7 days ──────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueByDay = await orderModel.aggregate([
      { $match: { payment: true, date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Top 5 best-selling food items ─────────────────────────────────
    const topItems = await orderModel.aggregate([
      { $match: { payment: true } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // ── Order status breakdown ────────────────────────────────────────
    const statusBreakdown = await orderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // ── Summary stats ─────────────────────────────────────────────────
    const totalOrders = await orderModel.countDocuments({ payment: true });
    const pendingOrders = await orderModel.countDocuments({ payment: false });
    const totalRevenueResult = await orderModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const totalUsers = await userModel.countDocuments({ role: "user" });

    res.json({
      success: true,
      data: {
        revenueByDay,
        topItems,
        statusBreakdown,
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalUsers,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching analytics" });
  }
};

export { getAnalytics };
