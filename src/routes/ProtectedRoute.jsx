import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ROLE_ROUTES, ROLES } from "../utils/roles";



const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useUser();
  const location = useLocation();

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = user?.role;
  console.log("userRole",userRole);

  // 🚀 ROLE MISMATCH → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirectPath = ROLE_ROUTES[userRole];

    // 🧠 Prevent infinite loop
    if (redirectPath && location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }

    // ⚠️ fallback (rare case)
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Access Denied 🚫
      </div>
    );
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;