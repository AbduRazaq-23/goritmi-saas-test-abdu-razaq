import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    // Logged in but not admin → redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin → allow access
  return children;
};
