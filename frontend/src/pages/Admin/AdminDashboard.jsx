import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  BarChart3,
  UserCircle,
  LogOut,
} from "lucide-react"; // for icons

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // Logged-in admin data

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ✅ Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-blue-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h1
            className={`text-xl font-semibold text-yellow-400 transition-all ${
              !isSidebarOpen && "hidden"
            }`}
          >
            Brightway Admin
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <NavItem
            to="/Admin/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/Admin/users"
            icon={<Users size={20} />}
            label="Users"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/Admin/products"
            icon={<Package size={20} />}
            label="Products"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/Admin/orders"
            icon={<FileText size={20} />}
            label="Orders"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/Admin/reports"
            icon={<BarChart3 size={20} />}
            label="Reports"
            isSidebarOpen={isSidebarOpen}
          />
          <NavItem
            to="/Admin/profile"
            icon={<UserCircle size={20} />}
            label="Profile"
            isSidebarOpen={isSidebarOpen}
          />
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 p-4 text-red-200 hover:bg-red-800 transition"
        >
          <LogOut size={18} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* ✅ Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-3">
          <h2 className="text-xl font-semibold text-gray-700 capitalize">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">
              {user?.name || "Admin"}
            </span>
            <img
              src="/LOGO.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* 👈 This renders nested routes like DashboardHome, Users, etc. */}
        </div>
      </main>
    </div>
  );
};

// ✅ Sidebar Item Component
const NavItem = ({ to, icon, label, isSidebarOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-md transition-all hover:bg-blue-800 ${
        isActive ? "bg-blue-700 text-yellow-300" : "text-gray-200"
      }`
    }
  >
    {icon}
    {isSidebarOpen && <span>{label}</span>}
  </NavLink>
);

export default AdminDashboard;
