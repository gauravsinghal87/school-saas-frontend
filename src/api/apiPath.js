export const API_BASE_URL = "http://localhost:8080/api";


export const apiPaths = {
    auth: {
        login: "/api/user/login",
        me: "/api/user/me",
    },
    students: {
        list: "/students",
        create: "/students",
    },
    teachers: {
        // list: "/teachers",
        create: "/teachers",
        teachersList: "/teachers",
        createTeacher: "/create/teacher",
    },
    superAdmin: {
        REG_SCHOOL: '/api/super-admin/school-reg',
        SCHOOL_LIST: '/api/super-admin/schools',
        UPDATE_SCHOOL: '/api/super-admin/{id}/status',
        CREATE_SUBSCRIPTION: '/api/subscription-plan',
        SUBSCRIPTION_LIST: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION: '/api/subscription-plan',
        DELETE_SUBSCRIPTION: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION_STATUS: '/api/subscription-plan',
        ADMINS: '/api/super-admin/admins',
        CREATE_ROLE: '/api/super-admin/role',
        GET_ROLES: '/api/super-admin/role',
        UPDATE_ROLE: '/api/super-admin/role/{id}',
    },
    admin: {
        ADD_SUBJECT: '/api/admin/subject/reg',
        SUBJECT_LIST: '/api/admin/get/subjects',
        SUBJECT_UPDATE: '/api/admin/subject/{id}',
        SUBJECT_DELETE: '/api/admin/delete/subject/{id}',
    }
} 