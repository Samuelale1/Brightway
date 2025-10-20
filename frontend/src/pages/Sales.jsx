import React, { useState, useEffect } from "react";
import ProductsSection from "../components/ProductsSection";

const Sales = () => {
  const [activePage, setActivePage] = useState("products"); // default section
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user info

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-6">
        <div className="text-center text-2xl font-semibold border-b border-gray-600 pb-3">
          <img src="/LOGO.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-yellow-400">Brightway Sales</h1>
        </div>

        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActivePage("products")}
            className={`p-3 rounded-md text-left hover:bg-blue-700 transition ${
              activePage === "products" ? "bg-blue-700" : ""
            }`}
          >
            🛒 Products
          </button>
          <button
            onClick={() => setActivePage("orders")}
            className={`p-3 rounded-md text-left hover:bg-blue-700 transition ${
              activePage === "orders" ? "bg-blue-700" : ""
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => setActivePage("notifications")}
            className={`p-3 rounded-md text-left hover:bg-blue-700 transition ${
              activePage === "notifications" ? "bg-blue-700" : ""
            }`}
          >
            🔔 Notifications
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto p-3 bg-gradient-to-r from-amber-200 via-cyan-500 to-cyan-200 hover:bg-red-600 rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* ✅ Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700 capitalize">
            {activePage}
          </h1>
          <div className="text-gray-600 font-medium">
            Welcome, {user?.name || "Salesperson"}
          </div>
        </header>

        {/* ✅ Dynamic Section Rendering */}
        {activePage === "products" && <ProductsSection />}
        {activePage === "orders" && <OrdersSection />}
        {activePage === "notifications" && <NotificationsSection />}
      </main>
    </div>
  );
};

// ✅ Placeholder components for now




const OrdersSection = () => (
  <div className="text-gray-700">Orders Handling UI coming soon...</div>
);

const NotificationsSection = () => (
  <div className="text-gray-700">Notifications display coming soon...</div>
);

export default Sales;
