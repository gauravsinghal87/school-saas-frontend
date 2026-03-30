import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log("Access denied for role:", user?.role); // Debugging line
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Access Denied 🚫
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;