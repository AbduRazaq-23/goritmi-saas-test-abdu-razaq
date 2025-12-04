import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;
  return children;
};
export default ProtectedRoute;
