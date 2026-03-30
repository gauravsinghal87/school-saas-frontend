import api from "./apiConfig";
import { apiPaths } from "./apiPath";

export const login = (data) => {
    return api.post(apiPaths.auth.login, data);
};

export const createStudent = (data) => {
    return api.post(apiPaths.students.create, data);
};

export const getStudents = () => {
    return api.get(apiPaths.students.list);
};