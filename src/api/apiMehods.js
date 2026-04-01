import api from "./apiConfig";
import { apiPaths } from "./apiPath";


let role = localStorage.getItem("role") || "";

export const login = async (data) => {
    const res = await api.post(apiPaths.auth.login, data);
    return res;
};

export const getCurrentUser = async () => {
    await new Promise((res) => setTimeout(res, 500));

    if (!localStorage.getItem("token")) {
        throw { message: "No token found" };
    }

    return {
        id: 1,
        name: "Admin User",
        role: role,
        permissions: ["ALL_ACCESS"],
    };
};

export const getSchoolList = async (params) => {
    return await api.get(apiPaths.superAdmin.SCHOOL_LIST, { params });
}

export const registerSchool = async (data) => {
    return await api.post(apiPaths.superAdmin.REG_SCHOOL, data);
};


export const createStudent = (data) => {
    return api.post(apiPaths.students.create, data);
};

export const createTeacher = (data) => {
    return api.post(apiPaths.teachers.createTeacher, data);
};

export const getTeachers = () => {
    return api.get(apiPaths.teachers.teachersList);
}

export const getStudents = () => {
    return api.get(apiPaths.students.list);
};