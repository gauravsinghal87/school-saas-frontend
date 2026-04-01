import { ROLES } from "../utils/roles";

import SuperAdminLayout from "./SuperAdminLayout";
import AdminLayout from "./AdminLayout";
import StaffLayout from "./StaffLayout";
import StudentLayout from "./StudentLayout";
import ParentLayout from "./ParentLayout";

export const ROLE_LAYOUT = {
    [ROLES.SUPER_ADMIN]: SuperAdminLayout,
    [ROLES.SCHOOL_ADMIN]: AdminLayout,
    [ROLES.STAFF]: StaffLayout,
    [ROLES.STUDENT]: StudentLayout,
    [ROLES.PARENT]: ParentLayout,
};