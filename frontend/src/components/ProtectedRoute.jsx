import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in at all
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in, but wrong role
    return <Navigate to="/" />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
