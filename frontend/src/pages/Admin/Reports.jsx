import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [overview, setOverview] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:8000/api/reports";

  const fetchAllReports = async () => {
    try {
      const [overviewRes, dailyRes, productsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE}/overview`),
        fetch(`${API_BASE}/daily-revenue?days=7`),
        fetch(`${API_BASE}/top-products`),
        fetch(`${API_BASE}/staff-performance`),
      ]);

      const [overviewData, dailyData, productsData, staffData] =
        await Promise.all([
          overviewRes.json(),
          dailyRes.json(),
          productsRes.json(),
          staffRes.json(),
        ]);

      setOverview(overviewData.data);
      setDailyData(dailyData.daily || []);
      setTopProducts(productsData.products || []);
      setStaffPerformance(staffData.staff_sales || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Reports...
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">
        📊 Business Reports & Analytics
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-semibold text-gray-700">
            {overview?.total_orders ?? 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold text-green-700">
            ₦{overview?.total_revenue?.toLocaleString() ?? 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-semibold text-yellow-700">
            {overview?.total_pending ?? 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-indigo-500">
          <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
          <p className="text-2xl font-semibold text-indigo-700">
            {overview?.total_delivered ?? 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Today's Sales</h3>
          <p className="text-2xl font-semibold text-red-700">
            ₦{overview?.today_revenue?.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      {/* DAILY REVENUE CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          📈 Daily Revenue (Last 7 Days)
        </h2>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No recent data available.
          </p>
        )}
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          🥇 Top Selling Products
        </h2>
        {topProducts.length > 0 ? (
          <table className="w-full text-sm text-gray-600 border-t">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-right">Sold</th>
                <th className="py-3 px-4 text-right">Revenue (₦)</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((item) => (
                <tr key={item.product_id} className="border-b">
                  <td className="py-2 px-4">{item.product?.name}</td>
                  <td className="py-2 px-4 text-right">
                    {item.total_sold?.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right">
                    ₦{item.total_revenue?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No product sales data found.
          </p>
        )}
      </div>

      {/* STAFF PERFORMANCE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          💼 Staff Performance
        </h2>
        {staffPerformance.length > 0 ? (
          <table className="w-full text-sm text-gray-600 border-t">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Salesperson</th>
                <th className="py-3 px-4 text-right">Orders Handled</th>
                <th className="py-3 px-4 text-right">Total Sales (₦)</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map((s) => (
                <tr key={s.salesperson_id} className="border-b">
                  <td className="py-2 px-4">{s.salesperson?.name}</td>
                  <td className="py-2 px-4 text-right">
                    {s.orders_handled}
                  </td>
                  <td className="py-2 px-4 text-right">
                    ₦{s.total_sales?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No staff performance data found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;
