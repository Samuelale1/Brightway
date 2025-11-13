// pages/Admin/Reports.jsx
import React, { useEffect, useState } from "react";

const Reports = () => {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovRes, tpRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/reports/overview"),
        fetch("http://127.0.0.1:8000/api/reports/top-products?limit=6"),
      ]);
      const ov = await ovRes.json();
      const tp = await tpRes.json();
      if (ovRes.ok) setOverview(ov.data || ov);
      if (tpRes.ok) setTopProducts(tp.data || tp.top_products || tp);
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reports & Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Total Orders" value={overview?.total_orders ?? "—"} />
        <MetricCard title="Today's Revenue" value={`₦${overview?.today_revenue ?? "0"}`} />
        <MetricCard title="Total Products" value={overview?.total_products ?? "—"} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No data</p>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((p) => (
                <li key={p.product_id} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className="font-medium">× {p.sold_qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Unpaid Orders</h3>
          <p className="text-sm text-gray-500">(Implement endpoint /api/reports/unpaid to populate)</p>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow flex flex-col">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-semibold mt-2">{value}</div>
  </div>
);

export default Reports;
