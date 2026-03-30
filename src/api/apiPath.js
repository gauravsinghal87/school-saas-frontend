export const API_BASE_URL = "http://localhost:8080/api";


export const apiPaths = {
    auth: {
        login: "/auth/login",
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
    classes: {
        list: "/classes",
        create: "/classes",
    },
}