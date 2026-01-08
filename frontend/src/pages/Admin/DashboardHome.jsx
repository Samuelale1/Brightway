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
    <div className="space-y-8 animate-fade-in-up">
      {/* ✅ Top Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<ShoppingCart className="text-white" size={24} />}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<Clock className="text-white" size={24} />}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-gradient-to-r from-amber-400 to-orange-500"
        />
        <StatCard
          icon={<CheckCircle className="text-white" size={24} />}
          label="Completed Orders"
          value={stats.completedOrders}
          color="bg-gradient-to-r from-emerald-500 to-teal-400"
        />
        <StatCard
          icon={<Package className="text-white" size={24} />}
          label="Products"
          value={stats.totalProducts}
          color="bg-gradient-to-r from-purple-500 to-indigo-500"
        />
        <StatCard
          icon={<Users className="text-white" size={24} />}
          label="Users"
          value={stats.totalUsers}
          color="bg-gradient-to-r from-pink-500 to-rose-500"
        />
        <StatCard
          icon={<TrendingUp className="text-white" size={24} />}
          label="Sales Growth"
          value="↑ 14%"
          color="bg-gradient-to-r from-cyan-500 to-blue-500"
        />
      </div>

      {/* ✅ Top Selling Products */}
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🏆 Top Selling Products
        </h3>
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 text-left uppercase text-xs tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold text-right">Units Sold</th>
                <th className="p-4 font-semibold text-right">Performance</th>
                </tr>
            </thead>
            <tbody>
                {stats.topProducts.map((product, idx) => (
                <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-amber-50/30 transition duration-200 group"
                >
                    <td className="p-4 font-bold text-slate-700 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                        </div>
                        {product.name}
                    </td>
                    <td className="p-4 font-medium text-slate-600 text-right">
                        {product.sold}
                    </td>
                    <td className="p-4 text-right">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-[100px] ml-auto">
                            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(product.sold, 100)}%` }}></div>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl shadow-gray-100 border border-gray-100 hover:-translate-y-1 transition duration-300">
    <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl shadow-lg shadow-gray-200/50 ${color}`}>
            {icon}
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+2.5%</span>
    </div>
    
    <div>
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default DashboardHome;
