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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - Premium Dark Design */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-8 flex flex-col items-center border-b border-white/10">
          <img src="/LOGO.png" alt="Brightway" className="w-16 h-16 mb-4 drop-shadow-lg" />
          <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            BRIGHTWAY
          </h1>
          <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Sales Dashboard</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          <button
            onClick={() => {
              setActivePage("products");
              setSelectedOrderId(null);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
              activePage === "products" 
                ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg text-white" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-xl">🍔</span>
            <span className="font-medium">Products</span>
          </button>

          <button
            onClick={() => {
              setActivePage("orders");
              setSelectedOrderId(null);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
              activePage === "orders" 
                ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg text-white" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-xl">📦</span>
            <span className="font-medium">Orders</span>
          </button>

          <button
            onClick={() => {
              setActivePage("notifications");
              setSelectedOrderId(null);
            }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
              activePage === "notifications" 
                ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg text-white" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-xl">🔔</span>
            <span className="font-medium">Notifications</span>
          </button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium border border-white/5 hover:border-red-500/30"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
              {activePage}
            </h1>
            <p className="text-sm text-gray-500">Overview of your {activePage}</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0] || "S"}
            </div>
            <div className="text-sm text-gray-700 font-medium">
              {user?.name || "Salesperson"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* ✅ Page logic */}
          <div className="animate-fade-in">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sales;
