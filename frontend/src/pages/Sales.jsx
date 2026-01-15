import React, { useState } from "react";
import ProductsSection from "../components/ProductsSection";
import OrdersSection from "../components/OrdersSection";
import OrderDetails from "../components/OrderDetails"; 
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  UserCircle
} from "lucide-react"; 

const Sales = () => {
  const [activePage, setActivePage] = useState("products");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // ✅ when the user clicks "Back to Orders" in OrderDetails
  const handleBackToOrders = () => setSelectedOrderId(null);

  // ✅ Reusable Sidebar Item with Active State
  const SidebarItem = ({ id, label, icon }) => (
    <button
      onClick={() => {
        setActivePage(id);
        setSelectedOrderId(null);
      }}
      className={`w-full flex items-center gap-3 p-3 mx-2 rounded-xl transition-all duration-300 font-medium ${
        activePage === id 
          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* ✅ Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-20`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-6 mb-2">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${!isSidebarOpen && "hidden"}`}>
             <img src="/LOGO.png" alt="Logo" className="w-8 h-8" />
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
               Brightway
             </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition p-1 hover:bg-white/10 rounded-lg mx-auto"
          >
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-2 py-4">
          <SidebarItem id="products" label="Products" icon={<Package size={20} />} />
          <SidebarItem id="orders" label="Orders" icon={<FileText size={20} />} />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5 mx-2 mb-2">
            <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${!isSidebarOpen && "justify-center"}`}
            >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
        </div>
      </aside>

      {/* ✅ Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48"></div>

        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md px-8 py-5 border-b border-gray-100 z-10 sticky top-0">
          <div>
              <h2 className="text-2xl font-bold text-slate-800 capitalize">{activePage}</h2>
              <p className="text-sm text-gray-500">Manage your store's {activePage}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <span className="block text-sm font-bold text-slate-700">{user?.name || "Salesperson"}</span>
                <span className="block text-xs text-gray-500">Sales Staff</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 p-0.5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.[0] || "S"}
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="animate-fade-in-up">
            {activePage === "products" && <ProductsSection />}

            {/* Orders logic */}
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
