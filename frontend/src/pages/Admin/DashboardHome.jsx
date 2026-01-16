import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Clock, // Added back missing import
} from "lucide-react";
import { API_BASE_URL } from "../../api"; // ✅ Import API config

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    topProducts: [],
    revenueChange: "+0%",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
         headers: {
           "Authorization": `Bearer ${token}`,
           "Accept": "application/json"
         }
      });
      const data = await res.json();
      if (res.ok) {
         setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

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

      {/* ✅ Charts & Tables Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
          
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
                    <th className="p-4 font-semibold text-right">Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.topProducts && stats.topProducts.slice(0, 5).map((product, idx) => (
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
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>

        {/* ✅ Recent Orders Mini-Table */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    📦 Recent Orders
                </h3>
                <button className="text-sm text-blue-500 font-bold hover:underline">View All</button>
             </div>
             <div className="space-y-4">
                 {[1,2,3,4].map((i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition border border-gray-100">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">🛍️</div>
                             <div>
                                 <p className="font-bold text-slate-700">Order #{202400 + i}</p>
                                 <p className="text-xs text-gray-500">2 mins ago • Jollof Rice x2</p>
                             </div>
                         </div>
                         <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">Pending</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* ✅ Low Stock Alert */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-8 shadow-xl shadow-red-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
             <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    ⚠️ Low Stock Alert
                </h3>
                <p className="text-red-100 max-w-xl">
                    The following items are running low on stock. Please restock immediately to avoid missing sales opportunities.
                </p>
             </div>
             <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-50 transition">
                 Manage Inventory
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {["Fried Rice", "Coke Zero", "Chicken Wings", "Beef Burger"].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center justify-between">
                      <span className="font-bold">{item}</span>
                      <span className="bg-red-800/50 text-white text-xs px-2 py-1 rounded-lg">{i + 2} left</span>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};

// ✅ Reusable Card Component (Unchanged)
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-xl shadow-gray-100 border border-gray-100 hover:-translate-y-1 transition duration-300">
    <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl shadow-lg shadow-gray-200/50 ${color}`}>
            {icon}
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full text-center">+2.5%</span>
    </div>
    
    <div>
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default DashboardHome;
