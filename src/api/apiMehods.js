import api from "./apiConfig";
import { apiPaths } from "./apiPath";

let role = localStorage.getItem("role") || "";

export const login = async (data) => {
  const res = await api.post(apiPaths.auth.login, data);
  return res;
};

export const registerSchool = async (data) => {
  return await api.post(apiPaths.superAdmin.REG_SCHOOL, data);
};

export const getSchoolList = async (params) => {
  return await api.get(apiPaths.superAdmin.SCHOOL_LIST, { params });
};

export const getAdminList = async (params) => {
  return await api.get(apiPaths.superAdmin.ADMINS, { params });
};

export const updateSchoolStatus = async (data) => {
  const { id, ...rest } = data;
  const url = apiPaths.superAdmin.UPDATE_SCHOOL.replace("{id}", id);
  return await api.patch(url, rest);
};

export const fetchRolesList = async () => {
  return await api.get(apiPaths.superAdmin.ROLES);
};

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
};

export const createSubscription = async (formData) => {
  return await api.post(apiPaths.superAdmin.CREATE_SUBSCRIPTION, formData);
};
export const updateSubscription = async ({ id, formData }) => {
  return await api.put(
    `${apiPaths.superAdmin.UPDATE_SUBSCRIPTION}/${id}`,
    formData,
  );
};

export const updateSubscriptionStatus = async ({ id, data }) => {
  return await api.patch(
    `${apiPaths.superAdmin.UPDATE_SUBSCRIPTION_STATUS}/${id}`,
    data,
  );
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
};

export const getStudents = () => {
  return api.get(apiPaths.students.list);
};

// <<<<<<<<<<<<<----admin---->>>>>>>>>>>>>>>>>>

export const fetchStaffList = ({ page, searchTerm, statusFilter }) => {
  return api.get(
    `${apiPaths.admin.staff}?page=${page}&limit=10&search=${searchTerm}&status=${statusFilter}`,
  );
};

export const deleteStaff = (id) => {
  return api.delete(`${apiPaths.admin.staff}/${id}`);
};
export const getStaffById = (id) => {
  return api.get(`${apiPaths.admin.staff}/${id}`);
};

export const uploadStaffDocuments = ({ userId, formData }) => {
  console.log(userId);
  return api.post(`${apiPaths.admin.staff}/${userId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
