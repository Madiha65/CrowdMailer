// frontend/src/routes/AdminRoute.js

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? children
    : <Navigate to="/dashboard" />;
};

export default AdminRoute;
