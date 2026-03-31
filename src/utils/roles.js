export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    SCHOOL_ADMIN: "SCHOOL_ADMIN",
    STUDENT: "STUDENT",
    PARENT: "PARENT",
    STAFF: "STAFF",
};

export const ROLE_ROUTES = {
    [ROLES.SUPER_ADMIN]: "/super-admin/dashboard",
    [ROLES.SCHOOL_ADMIN]: "/school-admin/dashboard",
    [ROLES.STUDENT]: "/student/dashboard",
    [ROLES.PARENT]: "/parent/dashboard",
    [ROLES.STAFF]: "/staff/dashboard",
};