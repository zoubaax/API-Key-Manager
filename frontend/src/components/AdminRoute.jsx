import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingSpinner from "./LoadingSpinner";

function AdminRoute({ children }) {
  const { loading, session, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner label="Checking admin access..." fullScreen />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
