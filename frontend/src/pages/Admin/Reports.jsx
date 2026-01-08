import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
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
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      };

      const [overviewRes, dailyRes, productsRes, staffRes] = await Promise.all([
        fetch(`${API_BASE}/overview`, { headers }),
        fetch(`${API_BASE}/daily-revenue?days=7`, { headers }),
        fetch(`${API_BASE}/top-products`, { headers }),
        fetch(`${API_BASE}/staff-performance`, { headers }),
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

  // ✅ Download Report CSV
  const handleDownload = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
          + "Metric,Value\n"
          + `Total Orders,${overview?.total_orders}\n`
          + `Total Revenue,${overview?.total_revenue}\n`
          + `Pending Orders,${overview?.total_pending}\n`
          + `Delivered Orders,${overview?.total_delivered}\n`
          + `Today Revenue,${overview?.today_revenue}\n`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Reports...
      </div>
    );

  const pieData = [
      { name: 'Pending', value: overview?.total_pending || 0, fill: '#EAB308' },
      { name: 'Delivered', value: overview?.total_delivered || 0, fill: '#6366F1' },
      { name: 'Cancelled', value: 0, fill: '#EF4444' } // Placeholder if needed
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">
            📊 Business Reports & Analytics
        </h1>
        <button onClick={handleDownload} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-700 transition">
            📥 Download Report
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border-b-4 border-blue-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Orders</h3>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            {overview?.total_orders ?? 0}
          </p>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border-b-4 border-green-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Revenue</h3>
          <p className="text-3xl font-extrabold text-green-600 mt-2">
            ₦{overview?.total_revenue?.toLocaleString() ?? 0}
          </p>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border-b-4 border-yellow-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Pending</h3>
          <p className="text-3xl font-extrabold text-yellow-600 mt-2">
            {overview?.total_pending ?? 0}
          </p>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border-b-4 border-indigo-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Delivered</h3>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">
            {overview?.total_delivered ?? 0}
          </p>
        </div>

        <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border-b-4 border-red-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Today's Sales</h3>
          <p className="text-3xl font-extrabold text-red-600 mt-2">
            ₦{overview?.today_revenue?.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid lg:grid-cols-3 gap-8">
          {/* DAILY REVENUE CHART */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
            📈 Revenue Trend
            </h2>
            {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
                />
                <Line
                    type="monotone"
                    dataKey="total_revenue"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{r: 4, strokeWidth: 2, fill: 'white'}}
                    activeDot={{r: 8, strokeWidth: 0}}
                />
                </LineChart>
            </ResponsiveContainer>
            ) : (
            <p className="text-gray-400 text-center py-12">No revenue data available yet.</p>
            )}
          </div>

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center">
             <h2 className="text-xl font-bold mb-4 text-slate-800 self-start">
             🍰 Order Status
             </h2>
             <div className="relative w-full h-64">
                 <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                         <Pie
                             data={pieData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                         >
                             {pieData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.fill} />
                             ))}
                         </Pie>
                         <Tooltip />
                         <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                 </ResponsiveContainer>
                 {/* Center Text */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 text-center pointer-events-none">
                     <p className="text-3xl font-extrabold text-slate-800">{overview?.total_orders}</p>
                     <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                 </div>
             </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* TOP PRODUCTS */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
            🥇 Top Selling Products
            </h2>
            {topProducts.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                        <tr>
                            <th className="py-3 font-semibold">Product</th>
                            <th className="py-3 font-semibold text-right">Sold</th>
                            <th className="py-3 font-semibold text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {topProducts.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                                <td className="py-4 font-bold">{item.product?.name}</td>
                                <td className="py-4 text-right">{item.total_sold}</td>
                                <td className="py-4 text-right font-bold text-green-600">₦{item.total_revenue?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
            <p className="text-gray-400 text-center py-6">No product sales data found.</p>
            )}
        </div>

        {/* STAFF PERFORMANCE */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
            💼 Staff Performance
            </h2>
            {staffPerformance.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                        <tr>
                            <th className="py-3 font-semibold">Staff</th>
                            <th className="py-3 font-semibold text-right">Orders</th>
                            <th className="py-3 font-semibold text-right">Sales</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {staffPerformance.map((s, idx) => (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                                <td className="py-4 font-medium flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {s.salesperson?.name?.charAt(0)}
                                    </div>
                                    {s.salesperson?.name}
                                </td>
                                <td className="py-4 text-right">{s.orders_handled}</td>
                                <td className="py-4 text-right font-bold text-blue-600">₦{s.total_sales?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
            <p className="text-gray-400 text-center py-6">No staff performance data found.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
