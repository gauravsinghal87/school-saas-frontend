import api from "./apiConfig";
import { apiPaths } from "./apiPath";


let role = "student"; // default role for testing


export const login = async (data) => {

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.password !== "123456") {
        throw {
            message: "Invalid email or password",
        };
    }

    if (data.email.includes("super")) role = "super_admin";
    else if (data.email.includes("school_admin")) role = "school_admin";
    else if (data.email.includes("student")) role = "student";
    else if (data.email.includes("parent")) role = "parent";
    else if (data.email.includes("staff")) role = "staff";

    // ✅ success response
    return {
        success: true,
        token: "dummy-token",
        user: {
            id: 1,
            name: role.toUpperCase(),
            email: data.email,
            role,
            permissions: ["ALL_ACCESS"],
        },
    };
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


export const createStudent = (data) => {
    return api.post(apiPaths.students.create, data);
};

export const getStudents = () => {
    return api.get(apiPaths.students.list);
};