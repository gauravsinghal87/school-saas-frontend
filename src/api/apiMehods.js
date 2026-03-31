import api from "./apiConfig";
import { apiPaths } from "./apiPath";


let role = localStorage.getItem("role") || ""; // default role for testing



export const login = async (data) => {
  const res = await api.post(apiPaths.auth.login, data);

  // optional: normalize response
  return res.data;

    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // if (data.password !== "123456") {
    //     throw {
    //         message: "Invalid email or password",
    //     };
    // }


    // // ✅ success response
    // return {
    //     success: true,
    //     token: "dummy-token",
    //     user: {
    //         id: 1,
    //         name: role.toUpperCase(),
    //         email: data.email,
    //         role,
    //         permissions: ["ALL_ACCESS"],
    //     },
    // };
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

export const createTeacher = (data) => {
    return api.post(apiPaths.teachers.createTeacher, data);
};

export const getTeachers = () => {
    return api.get(apiPaths.teachers.teachersList);
}

export const getStudents = () => {
    return api.get(apiPaths.students.list);
};