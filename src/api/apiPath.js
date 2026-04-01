export const API_BASE_URL = "http://localhost:8080/api";


export const apiPaths = {
    auth: {
        login: "/api/user/login",
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
        CREATE_SUBSCRIPTION: '/api/subscription-plan',
        SUBSCRIPTION_LIST: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION: '/api/subscription-plan',
        DELETE_SUBSCRIPTION: '/api/subscription-plan',
        UPDATE_SUBSCRIPTION_STATUS: '/api/subscription-plan',
    }
} 