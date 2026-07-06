import React, { useEffect, useState, useContext } from "react";
import "./Analytics.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const STATUS_COLORS = {
  "Food Processing": "#ff9800",
  "Out for delivery": "#2196f3",
  "Delivered": "#4caf50",
};

const Analytics = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.post(
          `${url}/api/analytics`,
          {},
          { headers: { token } }
        );
        if (res.data.success) {
          setData(res.data.data);
        } else {
          toast.error("Failed to load analytics");
        }
      } catch {
        toast.error("Error fetching analytics");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (!data)   return <div className="analytics-loading">No data available.</div>;

  // ── Revenue chart ─────────────────────────────────────────────
  const revenueLabels = data.revenueByDay.map((d) => {
    const date = new Date(d._id);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
  const revenueChart = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue ($)",
        data: data.revenueByDay.map((d) => d.revenue),
        backgroundColor: "rgba(255, 107, 53, 0.7)",
        borderColor: "#ff6b35",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Orders",
        data: data.revenueByDay.map((d) => d.orders),
        backgroundColor: "rgba(33, 150, 243, 0.6)",
        borderColor: "#2196f3",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  // ── Top items chart ───────────────────────────────────────────
  const topItemsChart = {
    labels: data.topItems.map((i) => i._id),
    datasets: [
      {
        label: "Units Sold",
        data: data.topItems.map((i) => i.totalSold),
        backgroundColor: [
          "rgba(255, 107, 53, 0.8)",
          "rgba(255, 167, 38, 0.8)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(33, 150, 243, 0.8)",
          "rgba(156, 39, 176, 0.8)",
        ],
        borderRadius: 6,
      },
    ],
  };

  // ── Status doughnut ───────────────────────────────────────────
  const statusChart = {
    labels: data.statusBreakdown.map((s) => s._id),
    datasets: [
      {
        data: data.statusBreakdown.map((s) => s.count),
        backgroundColor: data.statusBreakdown.map(
          (s) => STATUS_COLORS[s._id] || "#9e9e9e"
        ),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const chartOpts = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title, font: { size: 14, weight: "600" } },
    },
  });

  return (
    <div className="analytics">
      <h2>📊 Analytics Dashboard</h2>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="stat-card orange">
          <p className="stat-value">${data.totalRevenue.toFixed(2)}</p>
          <p className="stat-label">Total Revenue</p>
        </div>
        <div className="stat-card blue">
          <p className="stat-value">{data.totalOrders}</p>
          <p className="stat-label">Paid Orders</p>
        </div>
        <div className="stat-card yellow">
          <p className="stat-value">{data.pendingOrders}</p>
          <p className="stat-label">Pending Payment</p>
        </div>
        <div className="stat-card green">
          <p className="stat-value">{data.totalUsers}</p>
          <p className="stat-label">Registered Users</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card wide">
          <Bar data={revenueChart} options={chartOpts("Revenue & Orders — Last 7 Days")} />
        </div>
        <div className="chart-card">
          <Bar
            data={topItemsChart}
            options={{
              ...chartOpts("Top 5 Best Sellers"),
              indexAxis: "y",
            }}
          />
        </div>
        <div className="chart-card">
          <Doughnut
            data={statusChart}
            options={chartOpts("Order Status Breakdown")}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
