import { Navigate, useLocation } from "react-router-dom";
import { ROLE_ROUTES, ROLES } from "../utils/roles";
import { useUser } from "../hooks/useUser";



const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useUser();
  console.log("user", user);
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
  // if (!isAuthenticated) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  const userRole = localStorage.getItem("role");
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const redirectPath = ROLE_ROUTES[(userRole)] // default to home if role is unknown

    // 🧠 Prevent infinite loop
    if (redirectPath && location.pathname !== redirectPath) {
      // return <Navigate to={redirectPath} replace />;
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