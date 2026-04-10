import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/roles";

// 🔥 Lazy imports
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../components/common/NotFound"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));
const SuperAdminLayout = lazy(() => import("../layouts/SuperAdminLayout"));

import PageLoader from "../components/common/PageLoader";
import ParentLayout from "../layouts/ParentLayout";
import SchoolsPage from "../modules/superAdmin/schools/SchoolPage";
import SubjectPage from "../modules/admin/subjects/SubjectPage";
import RolesPage from "../modules/superAdmin/roles/RolesPage";

import AdminStaff from "../modules/admin/staff/AdminStaff";
import HolidaysPage from "../modules/admin/holidays/HolidaysPage";
import AdminStudents from "../modules/admin/students/AdminStudents";
import Holidays from "../modules/admin/staff/Holidays";
import AssignmentsPage from "../modules/staff/assignments/AssignmentPage";
import StudentHolidays from "../modules/student/holidays/StudentHolidays.jsx";
import StudentTimetable from "../modules/student/timetable/StudentTimetable.jsx";
import FeesReport from "../modules/admin/reports/fees/FeesReport.jsx";
import FeesDetails from "../modules/admin/reports/fees/FeesDetails.jsx";

import TeacherTimeTable from "../modules/staff/TeacherTimeTable";
import StudentAttendancePage from "../modules/staff/attendance/AttendancePage.jsx";
import TeacherProfile from "../modules/staff/teachers/TeacherProifle.jsx";
import AssignmentSubmission from "../modules/staff/assignments/AssignmentSubmission.jsx";
import TeacherAttendanceRecords from "../modules/staff/TeacherAttendanceRecords.jsx";
import AttendanceReport from "../modules/admin/reports/attendance/AttendanceReport.jsx";
import AttendanceDetail from "../modules/admin/reports/attendance/AttendanceDetail.jsx";
import ParentChildrenAttendance from "../modules/parent/children/ParentChildrenAttendance.jsx";
import ParentProfile from "../modules/parent/profile/ParentProfile.jsx";
import ParentPayments from "../modules/parent/payments/ParentPayments.jsx";
import ParentAssignments from "../modules/parent/assignments/ParentAssignments.jsx";
import { AdminSubscriptionPage } from "../modules/admin/subscription/AdminSubscriptionPage.jsx";
import StudentMarksByStaffPage from "../modules/staff/StudentMarksByStaffPage.jsx";
import GiveExamMarkorUpload from "../modules/staff/GiveExamMarkorUpload.jsx";
//staff imports
const StaffDashboard = lazy(
  () => import("../modules/staff/dashboard/StaffDashboard"),
);
const StaffLayout = lazy(() => import("../layouts/StaffLayout"));
const StaffTeachers = lazy(
  () => import("../modules/staff/teachers/StaffTeachers"),
);
const StaffStudents = lazy(
  () => import("../modules/staff/students/StaffStudents"),
);
const StaffParents = lazy(
  () => import("../modules/staff/parents/StaffParents"),
);

const Addteacher = lazy(
  () => import("../modules/admin/teachers/addteacher/Addteacher"),
);
const Subscription = lazy(
  () => import("../modules/superAdmin/subscription/Subscription"),
);
const AdminPage = lazy(() => import("../modules/superAdmin/admins/AdminPage"));
const AcademicSessions = lazy(
  () => import("../modules/admin/academic-sessions/AcademicSessions"),
);
const Sections = lazy(() => import("../modules/admin/sections/Sections"));
const Classes = lazy(() => import("../modules/admin/classes/Classes"));
const Fees = lazy(() => import("../modules/admin/fees/Fees"));
const Timetable = lazy(() => import("../modules/admin/timetable/Timetable"));

const ExamRoutes = lazy(() => import("../modules/admin/exams/Exams"));
const ClassSubjects = lazy(
  () => import("../modules/admin/classes/ClassSubjects"),
);
const Exams = lazy(() => import("../modules/admin/exams/Exams"));
const ExamSubjects = lazy(() => import("../modules/admin/exams/ExamSubjects"));
const ExamMarks = lazy(() => import("../modules/admin/exams/ExamMarks"));
const ExamResults = lazy(() => import("../modules/admin/exams/ExamResults"));

const ParentDashboard = lazy(
  () => import("../modules/parent/dashboard/ParentDashboard"),
);
const AdminDashboard = lazy(
  () => import("../modules/admin/dashboard/Dashboard"),
);
const StudentDashboard = lazy(
  () => import("../modules/student/dashboard/Dashboard"),
);
const StudentExamTimetable = lazy(() => import("../modules/student/exams/ExamTimetable"));
const StudentProfile = lazy(() => import("../modules/student/profile/Profile"));

const StudentSubjects = lazy(() => import("../modules/student/subjects/Subjects"));
const StudentAssignments = lazy(() => import("../modules/student/assignments/Assignments"));

const SuperAdminDashboard = lazy(
  () => import("../modules/superAdmin/dashboard/SuperAdminDashboard"),
);

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

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
            {/* <Route path="teachers/add" element={<Addteacher />} /> */}
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="subscriptions" element={<Subscription />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="*" element={<NotFound />} />
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
            <Route path='active-plans' element={<AdminSubscriptionPage />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teachers/add" element={<Addteacher />} />
            <Route path="academic-sessions" element={<AcademicSessions />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id/subjects" element={<ClassSubjects />} />
            <Route path="exams" element={<ExamRoutes />} />
            <Route path="holidays" element={<HolidaysPage />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/:id/subjects" element={<ExamSubjects />} />
            <Route path="exams/:id/marks" element={<ExamMarks />} />
            <Route path="exams/:id/results" element={<ExamResults />} />
            <Route path="sections" element={<Sections />} />
            <Route path="fees" element={<Fees />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="subjects" element={<SubjectPage />} />

            <Route path="reports/fee" element={<FeesReport />} />
            <Route path="fees/:id/details" element={<FeesDetails />} />

            <Route path="reports/attendance" element={<AttendanceReport />} />
            <Route path="reports/attendance/:id" element={<AttendanceDetail />} />

            <Route path="*" element={<NotFound />} />

            <Route path="staff" element={<AdminStaff />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="holidays" element={<StudentHolidays />} />
            <Route path="timetable" element={<StudentTimetable />} />

            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="exam-timetable" element={<StudentExamTimetable />} />
            <Route path="profile" element={<StudentProfile />} />


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
            <Route path="children" element={<ParentChildrenAttendance />} />
            <Route path="payments" element={<ParentPayments />} />
            <Route path="profile" element={<ParentProfile />} />
            <Route path="assignments" element={<ParentAssignments />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* staff */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="teachers" element={<StaffTeachers />} />
            <Route path="students" element={<StaffStudents />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="timetable" element={<TeacherTimeTable />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="assignments/:id/submissions" element={<AssignmentSubmission />} />
            <Route path="attendance-records" element={<TeacherAttendanceRecords />} />
            <Route path="exams" element={<StudentMarksByStaffPage />} />
            <Route path='exams/marks' element={<GiveExamMarkorUpload />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="parents" element={<StaffParents />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
