import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/roles";
import PageLoader from "../components/common/PageLoader";
import ParentLayout from "../layouts/ParentLayout";
import StaffLayout from "../layouts/StaffLayout";
import Teachers from "../modules/admin/teachers/Teachers";


// 🔥 Lazy imports
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../components/common/NotFound"));

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const SuperAdminLayout = lazy(() => import("../layouts/SuperAdminLayout"));
const StaffDashboard = lazy(() => import("../modules/staff/dashboard/StaffDashboard"));
const Addteacher = lazy(() => import("../modules/teachers/addteacher/Addteacher"));

const ParentDashboard = lazy(() =>
  import("../modules/parent/dashboard/ParentDashboard")
);
const AdminDashboard = lazy(() =>
  import("../modules/admin/dashboard/Dashboard")
);
const StudentDashboard = lazy(() =>
  import("../modules/student/dashboard/Dashboard")
);
const SuperAdminDashboard = lazy(() =>
  import("../modules/superAdmin/dashboard/SuperAdminDashboard")
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* 👑 Super Admin */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teachers/add" element={<Addteacher />} />
          </Route>

          {/* 🧑‍💼 Admin */}
          <Route
            path="/school-admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SCHOOL_ADMIN]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="teachers" element={<Teachers />} />
       

          </Route>

          {/* 🎓 Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>

          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ParentDashboard />} />
          </Route>



          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StaffDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;