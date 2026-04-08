import api from "./apiConfig";
import { apiPaths } from "./apiPath";

let role = localStorage.getItem("role") || "";


//super-admin


export const login = async (data) => {
    const res = await api.post(apiPaths.auth.login, data);

    if (res?.data?.user?.role === "TEACHER") {
        res.data.user.role = "STAFF";
    }

    return res;
};

//admin
// Add Student Fees
export const addStudentFees = async (data) => {
  return await api.post(apiPaths.admin.ADD_STUDENT_FEES, data);
};

// Get Student Fees Details
export const getStudentFeesDetails = async (params) => {
  return await api.get(`${apiPaths.admin.GET_STUDENT_FEES}`,{params});
};

// Get Payment History
export const getPaymentHistoryDetails = async (studentId, params) => {
  return await api.get(`${apiPaths.admin.PAYMENT_HISTORY}/${studentId}`, { params });
};
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

export const deleteSection = async (id) => {
    return await api.delete(`${apiPaths.admin.DELETE_SECTION}/${id}`);
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

export const getClassSubjects = (classId) => {
    return api.get(`${apiPaths.admin.CLASS_SUBJECTS}/${classId}`);
};

export const updateClassSubjects = ({ id, data }) => {
    return api.put(`${apiPaths.admin.UPDATE_CLASS_SUBJECTS}/${id}`, data);
};

export const removeClassSubjects = ({ id, data }) => {
    return api.delete(`${apiPaths.admin.REMOVE_CLASS_SUBJECTS}/${id}`, { data });
};
export const classesList = async (params) => {
    return await api.get(apiPaths.admin.CLASSES_LIST, { params });
}
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

export const getSuperAdminDashboard = async (params) => {
    return await api.get(apiPaths.superAdmin.DASHBOARD, { params });
};
export const createStudent = (data) => {
    return api.post(apiPaths.students.create, data);
};

export const createTeacher = (data) => {
    return api.post(apiPaths.teacher.createTeacher, data);
};

export const getTeachers = () => {
    return api.get(apiPaths.teacher.teachersList);
};

export const getAdminTeachers = () => {
    return api.get(apiPaths.teacher.ADMIN_TEACHERS);
};

// export const getStudents = () => {
//     return api.get(apiPaths.students.list);
// };


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





//admin api methods would go here



export const addSubject = (data) => {
    return api.post(apiPaths.admin.ADD_SUBJECT, data);
}

export const getSubjects = (params) => {
    return api.get(apiPaths.admin.SUBJECT_LIST);
}

export const updateSubject = (data) => {
    const { _id: id, ...rest } = data;
    return api.put(apiPaths.admin.SUBJECT_UPDATE.replace("{id}", id), rest);
}

export const deleteSubject = (id) => {
    return api.delete(apiPaths.admin.SUBJECT_DELETE.replace("{id}", id));
}


// ==================== FEE MANAGEMENT API METHODS ====================

// Create Fee Structure
export const createFeeStructure = async (data) => {
    return await api.post(apiPaths.admin.FEE_STRUCTURE, data);
};

// Get Fee Structures List
export const getFeeStructures = async (params) => {
    return await api.get(apiPaths.admin.FEE_STRUCTURE, { params });
};

// Update Fee Structure
export const updateFeeStructure = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.FEE_STRUCTURE}/${id}`, data);
};

// Delete Fee Structure
export const deleteFeeStructure = async (id) => {
    return await api.delete(`${apiPaths.admin.FEE_STRUCTURE}/${id}`);
};

// Get Single Fee Structure
export const getFeeStructureById = async (id) => {
    return await api.get(`${apiPaths.admin.FEE_STRUCTURE}/${id}`);
};

// Periods
export const createPeriod = async (data) => {
    return await api.post(apiPaths.admin.PERIODS, data);
};

export const getPeriods = async (params) => {
    return await api.get(apiPaths.admin.PERIODS, { params });
};

export const updatePeriod = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.PERIODS}/${id}`, data);
};

export const deletePeriod = async (id) => {
    return await api.delete(`${apiPaths.admin.PERIODS}/${id}`);
};

// Timetable
export const createTimetable = async (data) => {
    return await api.post(apiPaths.admin.TIMETABLE, data);
};

export const getTimetable = async (params) => {
    return await api.get(apiPaths.admin.TIMETABLE, { params });
};

export const deleteTimetable = async (params) => {
    return await api.delete(apiPaths.admin.TIMETABLE, { params });
};



// Get single staff
export const getStaffById = (id) => {
    return api.get(`${apiPaths.admin.staff}/${id}`);
};

// Create staff
export const createStaff = (data) => {
    return api.post(apiPaths.admin.CREATE_STAFF, data);
};

// Update staff
export const updateStaff = ({ id, data }) => {
    return api.put(`${apiPaths.admin.staff}/${id}`, data);
};

export const uploadStaffDocuments = ({ userId, formData }) => {
    return api.post(
        `${apiPaths.admin.staff}/${userId}/documents`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};
export const fetchStaffList = ({ page, searchTerm, statusFilter }) => {
    return api.get(apiPaths.admin.staff, {
        params: {
            page,
            limit: 10,
            search: searchTerm,
            status: statusFilter,
        },
    });
};
export const deleteStaff = (id) => {
    return api.delete(`${apiPaths.admin.staff}/${id}`);
};

export const getStudentById = (id) => {
    return api.get(`${apiPaths.students.GET_STUDENT_BY_ID}/${id}`);
};

export const uploadStudentDocuments = ({ userId, formData }) => {
    return api.post(
        `${apiPaths.admin.staff}/${userId}/documents`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};
export const enrollStudent = (data) => {
    return api.post(apiPaths.students.ENROLL_STUDENT, data);
};

export const getStudentsList = ({
    page,
    searchTerm,
    classFilter,
    sectionFilter,
    sessionFilter,
}) => {
    return api.get(apiPaths.students.list, {
        params: {
            page,
            limit: 10,
            search: searchTerm || undefined,
            classId: classFilter !== "null" ? classFilter : undefined,
            sectionId: sectionFilter !== "null" ? sectionFilter : undefined,
            sessionId: sessionFilter !== "null" ? sessionFilter : undefined,
        },
    });
};

export const getSessions = () => {
    return api.get(apiPaths.admin.ACADEMIC_YEAR_LIST);
};

export const getClasses = () => {
    return api.get(apiPaths.admin.CLASSES_LIST);
};


// ==================== EXAM MANAGEMENT API METHODS ====================

// Create Exam
export const createExam = async (data) => {
    return await api.post(apiPaths.admin.EXAM, data);
};

// Get Exams List
export const getExams = async (params) => {
    return await api.get(apiPaths.admin.EXAM, { params });
};

// Get Single Exam
export const getExamById = async (id) => {
    return await api.get(`${apiPaths.admin.EXAM}/${id}`);
};

// Update Exam
export const updateExam = async ({ id, data }) => {
    return await api.put(`${apiPaths.admin.EXAM}/${id}`, data);
};

// Delete Exam
export const deleteExam = async (id) => {
    return await api.delete(`${apiPaths.admin.EXAM}/${id}`);
};

// Add Subjects to Exam
export const addExamSubjects = async ({ id, data }) => {
    return await api.post(`${apiPaths.admin.EXAM}/${id}/subjects`, data);
};

// Get Exam Subjects
export const getExamSubjects = async (id, params) => {
    return await api.get(`${apiPaths.admin.EXAM}/${id}/subjects`, { params });
};

// Update Exam Subject
export const updateExamSubject = async ({ examId, subjectId, data }) => {
    return await api.put(`${apiPaths.admin.EXAM}/${examId}/subjects/${subjectId}`, data);
};

// Delete Exam Subject
export const deleteExamSubject = async ({ examId, subjectId }) => {
    return await api.delete(`${apiPaths.admin.EXAM}/${examId}/subjects/${subjectId}`);
};

// Add/Update Marks
export const upsertMarks = async ({ id, data }) => {
    return await api.post(`${apiPaths.admin.EXAM}/${id}/marks`, data);
};

// Get Exam Marks
export const getExamMarks = async (id, params) => {
    return await api.get(`${apiPaths.admin.EXAM}/${id}/marks`, { params });
};

// Generate Result
export const generateResult = async (id) => {
    return await api.post(`${apiPaths.admin.EXAM}/${id}/generate-result`, {});
};

// Get Exam Results
export const getExamResults = async (id, params) => {
    return await api.get(`${apiPaths.admin.EXAM}/${id}/results`, { params });
};

// Get Student Results
export const getStudentResults = async (studentId, params) => {
    return await api.get(`${apiPaths.admin.EXAM}/student/${studentId}/results`, { params });
};


export const createHoliday = async (data) => {
    return await api.post(apiPaths.admin.CREATE_HOLIDAY, data);
};


export const updateHoliday = async ({ holidayId, data }) => {
    console.log("Updating holiday with ID:", holidayId);
    const url = apiPaths.admin.UPDATE_HOLIDAY.replace("{holidayId}", holidayId);
    return await api.put(url, data);
};

export const deleteHoliday = async (holidayId) => {
    const url = apiPaths.admin.DELETE_HOLIDAY.replace("{holidayId}", holidayId);
    return await api.delete(url);
};









//teacher api methods would go here


export const markAttendance = async (data) => {
    return await api.post(apiPaths.teacher.MARK_ATTENDANCE, data);
};

export const getStudentAttendance = async (studentId) => {
    return await api.get(apiPaths.teacher.GET_ATTENDANCE.replace("{studentId}", studentId));
};

export const getClassAttendance = async ({ classId, sectionId }) => {
    let url = apiPaths.teacher.GET_CLASS_ATTENDANCE.replace("{classId}", classId);
    url = url.replace("{sectionId}", sectionId);
    return await api.get(url);
};

export const getStudents = async (params) => {
    let url = apiPaths.teacher.GET_STUDENTS;
    url = url.replace("{page}", params.page || 1);
    url = url.replace("{limit}", params.limit || 10);
    url = url.replace("{classId}", params.classId || "");
    url = url.replace("{sectionId}", params.sectionId || "null");
    url = url.replace("{sessionId}", params.sessionId || "null");
    url = url.replace("{status}", params.status || "");
    return await api.get(url);
}

export const getHolidays = async ({ page = 1, limit = 10, search = "" }) => {
    const url = apiPaths.admin.GET_HOLIDAYS
        .replace("{page}", page)
        .replace("{limit}", limit)
        .replace("{search}", search);

    return await api.get(url);
};

export const createAssignment = async (data) => {
    return await api.post(
        apiPaths.teacher.CREATE_ASSIGNMENT,
        data
    );
};

export const getAssignments = async ({ sectionId }) => {
    const url = apiPaths.teacher.GET_ASSIGNMENTS.replace(
        "{sectionId}",
        sectionId
    );

    return await api.get(url);
};

export const updateAssignment = async (assignmentId, data) => {
    const url = apiPaths.teacher.UPDATE_ASSIGNMENT.replace(
        "{assignmentId}",
        assignmentId
    );

    return await api.put(url, data);
};

export const deleteAssignment = async (assignmentId) => {
    const url = apiPaths.teacher.DELETE_ASSIGNMENT.replace(
        "{assignmentId}",
        assignmentId
    );

    return await api.delete(url);
};

export const getTeacherTimetable = async ({ classId, sectionId }) => {
    let url = apiPaths.teacher.GET_TIMETABLE.replace("{classId}", classId);
    url = url.replace("{sectionId}", sectionId);
    return await api.get(url);
}

export const getStudentTimetable = async () => {
    return await api.get(apiPaths.admin.TIMETABLE);
};


export const getClassSecSub = async () => {
    return await api.get(apiPaths.teacher.GET_CLASS_SEC_SUB);
}   
