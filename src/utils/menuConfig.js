import { ROLES } from "./roles";

export const MENU_CONFIG = {
    [ROLES.SUPER_ADMIN]: [
        { name: "Dashboard", path: "/super-admin/dashboard" },
        { name: "Schools", path: "/super-admin/schools" },
        { name: "Subscriptions", path: "/super-admin/subscriptions" },
    ],
    [ROLES.SCHOOL_ADMIN]: [
        { name: "Dashboard", path: "/school-admin/dashboard" },
        { name: "Students", path: "/school-admin/students" },
        { name: "Staff", path: "/school-admin/staff" },
    ],
    [ROLES.STAFF]: [
        { name: "Dashboard", path: "/staff/dashboard" },
        { name: "Attendance", path: "/staff/attendance" },
    ],
    [ROLES.STUDENT]: [
        { name: "Dashboard", path: "/student/dashboard" },
        { name: "Fees", path: "/student/fees" },
        { name: "Results", path: "/student/results" },
    ],
    [ROLES.PARENT]: [
        { name: "Dashboard", path: "/parent/dashboard" },
        { name: "Fees", path: "/parent/fees" },
        { name: "Results", path: "/parent/results" },
    ],
};