import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import Sales from "./pages/Sales";
import Customer from "./pages/Customer";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/Sales" element={<ProtectedRoute allowedRoles={['salesperson','admin']}><Sales /></ProtectedRoute>} />
          <Route path="/Customer" element={<ProtectedRoute allowedRoles={['customer','admin']}><Customer /></ProtectedRoute>} />
        </Routes>
    </Router>
  );
};

export default App;
