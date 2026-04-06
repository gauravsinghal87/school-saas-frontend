import api from "./apiConfig";
import { apiPaths } from "./apiPath";


let role = localStorage.getItem("role") || "";

export const login = async (data) => {
    const res = await api.post(apiPaths.auth.login, data);
    return res;
};

//admin

export const updateSection = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.UPDATE_SECTION}/${id}`, data);
};
export const createSection
    = async (formData) => {
        return await api.post(apiPaths.admin.CREATE_SECTION, formData);
    };
export const createClass = async (formData) => {
    return await api.post(apiPaths.admin.CREATE_CLASS, formData);
};

export const updateClass = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.UPDATE_CLASS}/${id}`, data);
};

export const deleteClass = async (id) => {
    return await api.delete(`${apiPaths.admin.DELETE_CLASS}/${id}`);
};
export const createAcademicYear = async (data) => {
    return await api.post(apiPaths.admin.CREATE_ACADEMIC_YEAR, data);
};

export const updateAcademicYear = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.UPDATE_ACADEMIC_YEAR}/${id}`, data);
};
export const getAcademicYearList = async (params) => {
    return await api.get(apiPaths.admin.ACADEMIC_YEAR_LIST, { params });
}

export const getSectionList = async (params) => {
    return await api.get(apiPaths.admin.SECTIONS_LIST, { params });
}
export const classesList = async (params) => {
    return await api.get(apiPaths.admin.CLASSES_LIST, { params });
}
export const registerSchool = async (data) => {
    return await api.post(apiPaths.superAdmin.REG_SCHOOL, data);
};

export const getSchoolList = async (params) => {
    return await api.get(apiPaths.superAdmin.SCHOOL_LIST, { params });
}


export const getAdminList = async (params) => {
    return await api.get(apiPaths.superAdmin.ADMINS, { params });
}

export const updateSchoolStatus = async (data) => {
    const { id, ...rest } = data;
    const url = apiPaths.superAdmin.UPDATE_SCHOOL.replace("{id}", id);
    return await api.patch(url, rest);
}

export const getCurrentUser = async () => {

    const storedUser = localStorage.getItem("user");
    let user = storedUser ? JSON.parse(storedUser) : null;
    return user;
    // const res = await api.get(apiPaths.auth.me);

    // if (res.success) {
    //     const user = res.data;

    //     localStorage.setItem("user", JSON.stringify(user));
    //     localStorage.setItem("role", user?.role);

    //     return user;
    // }

    // return null;

};

export const getSubscriptionList = async (params) => {
    return await api.get(apiPaths.superAdmin.SUBSCRIPTION_LIST, { params });
}


export const createSubscription = async (formData) => {
    return await api.post(apiPaths.superAdmin.CREATE_SUBSCRIPTION, formData);
};
export const updateSubscription = async ({ id, formData }) => {
    return await api.put(`${apiPaths.superAdmin.UPDATE_SUBSCRIPTION}/${id}`, formData);
};

export const updateSubscriptionStatus = async ({ id, data }) => {
    return await api.patch(`${apiPaths.superAdmin.UPDATE_SUBSCRIPTION_STATUS}/${id}`, data);
};
export const deleteSubscription = async (id) => {
    return await api.delete(`${apiPaths.superAdmin.DELETE_SUBSCRIPTION}/${id}`);
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


export const createRole = (data) => {
    return api.post(apiPaths.superAdmin.CREATE_ROLE, data);
};

export const getRoles = (params) => {
    return api.get(apiPaths.superAdmin.GET_ROLES, { params });
}

export const updateRole = (data) => {
    const { _id: id, ...rest } = data;
    console.log("Updating role with ID:", id, "and data:", rest);
    return api.put(apiPaths.superAdmin.UPDATE_ROLE.replace("{id}", id), rest);
}