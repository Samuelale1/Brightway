import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    topProducts: [],
  });

  // ✅ Simulate API Fetch
  useEffect(() => {
    // In real app, call: fetch("http://127.0.0.1:8000/api/admin/dashboard")
    const mockData = {
      totalOrders: 245,
      pendingOrders: 23,
      completedOrders: 180,
      totalProducts: 58,
      totalUsers: 340,
      topProducts: [
        { name: "Jollof Rice", sold: 120 },
        { name: "Grilled Chicken", sold: 95 },
        { name: "Shawarma", sold: 70 },
      ],
    };
    setStats(mockData);
  }, []);

  return (
    <div className="space-y-8">
      {/* ✅ Top Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<ShoppingCart className="text-blue-600" size={26} />}
          label="Total Orders"
          value={stats.totalOrders}
        />
        <StatCard
          icon={<Clock className="text-yellow-500" size={26} />}
          label="Pending Orders"
          value={stats.pendingOrders}
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" size={26} />}
          label="Completed Orders"
          value={stats.completedOrders}
        />
        <StatCard
          icon={<Package className="text-purple-600" size={26} />}
          label="Products"
          value={stats.totalProducts}
        />
        <StatCard
          icon={<Users className="text-orange-500" size={26} />}
          label="Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<TrendingUp className="text-pink-600" size={26} />}
          label="Sales Growth"
          value="↑ 14%"
        />
      </div>

      {/* ✅ Top Selling Products */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          🏆 Top Selling Products
        </h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts.map((product, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3 font-medium text-blue-700">
                  {product.sold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Reusable Card Component
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default DashboardHome;
