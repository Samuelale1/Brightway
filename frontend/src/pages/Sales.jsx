import React, { useState, useEffect } from "react";
import ProductsSection from "../components/ProductsSection";
import OrdersSection from "../components/OrdersSection";
import NotificationsSection from "../components/NotificationsSections";
import OrderDetails from "../components/OrderDetails"; // ✅ import details component

const Sales = () => {
  const [activePage, setActivePage] = useState("products");
  const [selectedOrderId, setSelectedOrderId] = useState(null); // ✅ new
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // ✅ when the user clicks "Back to Orders" in OrderDetails
  const handleBackToOrders = () => setSelectedOrderId(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-4 space-y-6">
        <div className="text-center text-2xl font-semibold border-b border-gray-600 pb-3">
          <img src="/LOGO.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-yellow-400">Brightway Sales</h1>
        </div>

        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => {
              setActivePage("products");
              setSelectedOrderId(null);
            }}
            className={`p-3 rounded-md text-left hover:bg-blue-700 transition ${
              activePage === "products" ? "bg-blue-700" : ""
            }`}
          >
            🛒 Products
          </button>
          <button
            onClick={() => {
              setActivePage("orders");
              setSelectedOrderId(null);
            }}
            className={`p-3 rounded-md text-left hover:bg-blue-700 transition ${
              activePage === "orders" ? "bg-blue-700" : ""
            }`}
          >
            📦 Orders
          </button>
          <button
            onClick={() => {
              setActivePage("notifications");
              setSelectedOrderId(null);
            }}
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700 capitalize">
            {activePage}
          </h1>
          <div className="text-gray-600 font-medium">
            Welcome, {user?.name || "Salesperson"}
          </div>
        </header>

        {/* ✅ Page logic */}
        {activePage === "products" && <ProductsSection />}
        {activePage === "notifications" && <NotificationsSection />}

        {/* ✅ Orders logic */}
        {activePage === "orders" && !selectedOrderId && (
          <OrdersSection onSelectOrder={setSelectedOrderId} />
        )}

        {activePage === "orders" && selectedOrderId && (
          <OrderDetails
            orderId={selectedOrderId}
            onBack={handleBackToOrders}
          />
        )}
      </main>
    </div>
  );
};

export default Sales;
