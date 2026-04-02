export const ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    SCHOOL_ADMIN: "ADMIN",
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


export const ROLE_ROUTES_SIDEBAR = {
    [ROLES.SUPER_ADMIN]: "/super-admin",
    [ROLES.SCHOOL_ADMIN]: "/school-admin",
    [ROLES.STUDENT]: "/student",
    [ROLES.PARENT]: "/parent",
    [ROLES.STAFF]: "/staff",
};