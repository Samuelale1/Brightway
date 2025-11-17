import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import Sales from "./pages/Sales";
import Customer from "./pages/Customer";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DashboardHome from "./pages/Admin/DashboardHome";
import Users from "./pages/Admin/Users";
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/Orders";
import Reports from "./pages/Admin/Reports";
import Profile from "./pages/Admin/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reports" element={<Reports />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}> <AdminDashboard /> </ProtectedRoute> } >
          <Route index element={<DashboardHome />} /> 
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Sales Routes */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute allowedRoles={["salesperson", "admin"]}>
              <Sales />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <Customer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
