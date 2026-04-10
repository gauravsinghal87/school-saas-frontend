import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    // Auth & User
    getCurrentUser,
    login,

    // Super Admin
    getSuperAdminDashboard,
    getSchoolList,
    registerSchool,
    updateSchoolStatus,
    getAdminList,
    createSubscription,
    getSubscriptionList,
    updateSubscription,
    deleteSubscription,
    updateSubscriptionStatus,
    createRole,
    getRoles,
    updateRole,

    // Admin - Academic
    createAcademicYear,
    updateAcademicYear,
    getAcademicYearList,
    createClass,
    updateClass,
    deleteClass,
    classesList,
    createSection,
    updateSection,
    deleteSection,
    getSectionList,

    // Admin - Subjects
    addSubject,
    getSubjects,
    updateSubject,
    deleteSubject,

    // Admin - Teachers & Staff
    createTeacher,
    getTeachers,
    fetchStaffList,
    deleteStaff,
    getStaffById,
    uploadStaffDocuments,

    getAdminTeachers,

    // Admin - Students
    createStudent,
    getStudents,

    // Admin - Fees
    createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    getFeeStructureById,

    // Admin - Timetable
    createPeriod,
    getPeriods,
    updatePeriod,
    deletePeriod,
    createTimetable,
    getTimetable,
    deleteTimetable,
    getStudentTimetable,
    // Admin - Class Subjects
    updateClassSubjects,
    removeClassSubjects,

    // Other
    fetchRolesList,
    createExam,
    getExams,
    getExamById,
    updateExam,
    markAttendance,
    getClassAttendance,
    getStudentAttendance,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    getHolidays,
    createStaff,
    updateStaff,
    getStudentById,
    uploadStudentDocuments,
    enrollStudent,
    getClasses,
    getSessions,
    getStudentsList,
    deleteExam,
    addExamSubjects,
    getExamSubjects,
    updateExamSubject,
    deleteExamSubject,
    upsertMarks,
    getExamMarks,
    generateResult,
    getExamResults,
    getStudentResults,
    createAssignment,
    getAssignments,
    updateAssignment,
    deleteAssignment,
    getTeacherTimetable,
    getClassSecSub,
    getStudentFeesDetails,
    addStudentFees,
    getPaymentHistoryDetails,
    getStudentSubjects,
    getStudentAssignments,
    submitAssignment,
    getStudentExamTimetable,
    getStudentProfile,
    giveFeedbackOnSubmission,
    getTeacherAssignmentSubmissions,
    getTeacherInOutTimes,
    getUsersList,
    getTeacherAttendance,
    generateStaffSalary,
    getStaffSalaryDetails,
} from "../api/apiMehods";
import useAppMutation from "./useAppMutation";
import { QUERY_KEYS } from "../services/queryKeys";
import useAppQuery from "./useAppQuery";
import { showError, showSuccess } from "../utils/toast";



//SUPERADMIN QUERIES & MUTATIONS    


export const useSuperAdminDashboard = (year) => {
    return useAppQuery({
        queryKey: ["superAdminDashboard", year],
        apiCall: () => getSuperAdminDashboard({ year }),
        enabled: !!year,
    });
};

export const createTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createTeacher,
        successMessage: "Teacher created successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["teachersList"]);
        },
    });
};








export const createSchoolMutation = () => {
    return useAppMutation({
        apiCall: registerSchool,
        queryKey: "schoolsList", // ✅ auto refetch after success
        successMessage: "School created successfully 🎉",
        // errorMessage: "Failed to create school ❌",
    });
};


export const updateSchoolStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const res = await updateSchoolStatus(data);
            if (res.success) {
                showSuccess(res?.message || "Status updated successfully 🎉");
            }
            if (!res.success) {
                showError(res?.message || "Failed to update status");
            }
            // 🔥 handle backend "fake success"
            if (res?.status >= 400) {
                throw new Error(res?.message || "Failed to update status");
            }

            return res;
        },

        // ⚡ OPTIMISTIC UPDATE
        onMutate: async (variables) => {
            await queryClient.cancelQueries(["schools"]);

            const previousData = queryClient.getQueryData(["schools"]);

            queryClient.setQueryData(["schools"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        schools: old.data.schools.map((s) =>
                            s._id === variables.id
                                ? { ...s, isActive: variables.isActive }
                                : s,
                        ),
                    },
                };
            });

            return { previousData };
        },

        // ❌ ROLLBACK
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["schools"], context.previousData);
            }

            showError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to update status ❌",
            );
        },

        // ✅ SUCCESS
        onSuccess: (res) => {
            showSuccess(res?.message || "Status updated ✅");
        },

        // 🔄 FINAL SYNC
        onSettled: () => {
            queryClient.invalidateQueries(["schools"]);
        },
    });
};




export const createSubscriptionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createSubscription,
        successMessage: "Subscription plan created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["schoolsList"]);
        },
    });
};
export const updateSubscriptionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSubscription,
        successMessage: "Subscription plan updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });
};

export const updateSubscriptionStatusMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSubscriptionStatus,
        successMessage: "Subscription status updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });
};
export const deleteSubscriptionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteSubscription,
        successMessage: "Subscription plan deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });
};

//admin
// Add this to your useQueryMutations.js file
// ✅ Attendance Users List
export const getUsersListQuery = (params) => {
    return useAppQuery({
        queryKey: ["usersList", params],
        apiCall: () => getUsersList(params),
    });
};

export const getPaymentHistory = (params) => {
    return useAppQuery({
        queryKey: ["paymentHistory", params],
        apiCall: () => getStudentFeesDetails(params),
    });
};
export const getPaymentHistoryDetailsQuery = (studentId, enabled = true) => {
    return useAppQuery({
        queryKey: ["paymentHistoryDetails", studentId],
        apiCall: () => getPaymentHistoryDetails(studentId),
        enabled: enabled && !!studentId,
    });
};

// Add Fees Mutation
export const addFeesMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: addStudentFees,
        successMessage: "Fees added successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["studentFees"]);
            queryClient.invalidateQueries(["feesReport"]);
        },
    });
};
export const academicYearList = (params) => {
    return useAppQuery({
        queryKey: ["academicYears", params],
        apiCall: () => getAcademicYearList(params),
    });
};


export const useSchoolList = (params) => {
    return useAppQuery({
        queryKey: ["schoolsList", params],
        apiCall: () => getSchoolList(params),
    });
};

export const getAdminListQuery = (params) => {
    return useAppQuery({
        queryKey: ["admins", params],
        apiCall: () => getAdminList(params),
    });
};
export const subscriptionList = (params) => {
    return useAppQuery({
        queryKey: ["subscriptionList", params],
        apiCall: () => getSubscriptionList(params),
    });
};

export const useRolesList = () => {
    return useAppQuery({
        queryKey: ["roles"],
        apiCall: fetchRolesList, // ✅ correct
    });
};

export const getTeachersMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: getTeachers,
        successMessage: "Teachers fetched successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["teachersList"]);
        },
    });
};

export const getTeachersQuery = () => {
    return useAppQuery({
        queryKey: ["teachers"],
        apiCall: getTeachers,
    });
};

export const getAdminTeachersQuery = () => {
    return useAppQuery({
        queryKey: ["adminTeachers"],
        apiCall: getAdminTeachers,
    });
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.ME],
        queryFn: getCurrentUser,
        enabled: !!localStorage.getItem("token"),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};


export const createRoleMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createRole,
        successMessage: "Role created successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["roles"]);
        },
    });
}

export const getRolesQuery = () => {
    return useAppQuery({
        queryKey: ["roles"],
        apiCall: getRoles,
    });
}

export const updateRoleMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateRole,
        successMessage: "Role updated successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["roles"]);
        },
    });
}

export const deleteRoleMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateRole,
        successMessage: "Role deleted successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["roles"]);
        },
    });
}






export const useStudents = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STUDENTS],
        queryFn: () => {
            return 1;
        },
    });
};

// <<<--------admin---------->>>

export const getStaffList = ({ page, searchTerm, statusFilter }) => {
    return useAppQuery({
        queryKey: ["staffList", page, searchTerm, statusFilter],
        apiCall: () =>
            fetchStaffList({ page, searchTerm, statusFilter }),
    });
};




//admin queries & mutations 

//admin

// Add these to your existing useQueryMutations.js file

// ✅ Get Teacher Attendance Query
export const getTeacherAttendanceQuery = (params, enabled = true) => {
    const { teacherId, startDate, endDate } = params;
    return useAppQuery({
        queryKey: ["teacherAttendance", teacherId, startDate, endDate],
        apiCall: () => getTeacherAttendance(params),
        enabled: enabled && !!teacherId,
    });
};


export const generateStaffSalaryMutation=()=>
{
        const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: generateStaffSalary,
        successMessage: "Salary generated successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["staffList"]);
        },
    });
}
export const useStaffSalaryDetails = (staffId) => {
  return useQuery({
    queryKey: ["staffSalary", staffId],
    queryFn: () => getStaffSalaryDetails(staffId),
    enabled: !!staffId, // only call when staffId exists
  });
};
// ✅ Get Student Attendance Query
export const getStudentAttendanceQuery = (params, enabled = true) => {
    const { studentId, startDate, endDate } = params;
    return useAppQuery({
        queryKey: ["studentAttendance", studentId, startDate, endDate],
        apiCall: () => getStudentAttendance(params),
        enabled: enabled && !!studentId,
    });
};

// ✅ Mark/Update Attendance Mutation
export const markAttendanceMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: markAttendance,
        successMessage: "Attendance updated successfully 🎉",
        onSuccessCallback: (res, variables) => {
            // Invalidate both teacher and student attendance queries
            queryClient.invalidateQueries(["teacherAttendance"]);
            queryClient.invalidateQueries(["studentAttendance"]);
            queryClient.invalidateQueries(["usersList"]);
        },
    });
};

// ✅ Get Single User Details (for the attendance page)
export const getUserDetailsQuery = (userId, enabled = true) => {
    return useAppQuery({
        queryKey: ["userDetails", userId],
        apiCall: () => getUsersList({ page: 1, limit: 1, search: userId }),
        select: (res) => {
            const users = res?.data?.users || [];
            return users.find(u => u._id === userId);
        },
        enabled: enabled && !!userId,
    });
};
export const createSectionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createSection,
        successMessage: "Section created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["sectionsList"]);
        },
    });
}
export const updateSectionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSection,
        successMessage: "Section updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["sectionsList"]);
        },
    });


}
export const createAcademicYearMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createAcademicYear,
        successMessage: "Academic year created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["academicYearsList"]);
        },
    });
}
export const updateAcademicYearMutation = () => {
    const queryClient = useQueryClient(); updateSection
    return useAppMutation({
        apiCall: updateAcademicYear,
        successMessage: "Academic year updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["academicYearsList"]);
        },
    });


}
export const deleteSectionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteSection,
        successMessage: "Section deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["sectionsList"]);
        },
    });

}

export const createClassMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createClass,
        successMessage: "Class created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["classesList"]);
        },
    });
}
export const updateClassMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateClass,
        successMessage: "Class updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["classesList"]);
        },
    });


}
export const deleteClassMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteClass,
        successMessage: "Class deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["classesList"]);
        },
    });

}
export const classesListMutation = (params) => {
    return useAppQuery({
        queryKey: ["classesList", params],
        apiCall: () => classesList(params),
    });
};
export const sectionList = (params) => {
    return useAppQuery({
        queryKey: ["sections", params],
        apiCall: () => getSectionList(params),
    });
};
export const updateClassSubjectsMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateClassSubjects,
        successMessage: "Subjects updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["classesList"]);
        },
    });
};

export const removeClassSubjectsMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: removeClassSubjects,
        successMessage: "Subjects removed successfully 🎉",
    });
};

export const addSubjectMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: addSubject,
        successMessage: "Subject added successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["subjects"]);
        },
    });
}

export const getSubjectsQuery = () => {
    return useAppQuery({
        queryKey: ["subjects"],
        apiCall: getSubjects,
    });
}

export const updateSubjectMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSubject,
        successMessage: "Subject updated successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["subjects"]);
        },
    });
}

export const deleteSubjectMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteSubject,
        successMessage: "Subject deleted successfully 🎉",
        onSuccessCallback
            : (res) => {
                queryClient.invalidateQueries(["subjects"]);
            },
    });
}


// fees module

// Get Fee Structures List
export const feeStructuresList = (params) => {
    return useAppQuery({
        queryKey: ["feeStructures", params],
        apiCall: () => getFeeStructures(params),
    });
};

// Get Single Fee Structure
export const feeStructureById = (id, enabled = true) => {
    return useAppQuery({
        queryKey: ["feeStructure", id],
        apiCall: () => getFeeStructureById(id),
        enabled: enabled && !!id,
    });
};

// Create Fee Structure
export const createFeeStructureMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createFeeStructure,
        successMessage: "Fee structure created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["feeStructures"]);
        },
    });
};

// Update Fee Structure
export const updateFeeStructureMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateFeeStructure,
        successMessage: "Fee structure updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["feeStructures"]);
        },
    });
};

// Delete Fee Structure
export const deleteFeeStructureMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteFeeStructure,
        successMessage: "Fee structure deleted successfully 🗑️",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["feeStructures"]);
        },
    });
};


// ==================== TIMETABLE MANAGEMENT ====================

// Periods
export const periodsList = (params) => {
    return useAppQuery({
        queryKey: ["periods", params],
        apiCall: () => getPeriods(params),
    });
};

export const createPeriodMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createPeriod,
        successMessage: "Period created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["periods"]);
        },
    });
};

export const updatePeriodMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updatePeriod,
        successMessage: "Period updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["periods"]);
        },
    });
};

export const deletePeriodMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deletePeriod,
        successMessage: "Period deleted successfully 🗑️",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["periods"]);
        },
    });
};

// Timetable
export const getTimetableQuery = (params, enabled = true) => {
    return useAppQuery({
        queryKey: ["timetable", params],
        apiCall: () => getTimetable(params),
        enabled: enabled && !!params?.classId && !!params?.sectionId,
    });
};

export const createTimetableMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createTimetable,
        successMessage: "Timetable created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["timetable"]);
        },
    });
};

export const deleteTimetableMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteTimetable,
        successMessage: "Timetable deleted successfully 🗑️",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["timetable"]);
        },
    });
};


// GET SINGLE STAFF
export const useStaffDetail = (staffId, enabled = true) => {
    return useAppQuery({
        queryKey: ["staff", staffId],
        apiCall: () => getStaffById(staffId),
        enabled: enabled && !!staffId,
    });
};

// CREATE STAFF
export const createStaffMutation = (onClose) => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: createStaff,
        successMessage: "Staff created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["staffList"]);
            onClose();
        },
    });
};


// ==================== Teacher Management ====================



// ==================== EXAM MANAGEMENT ====================



// Get Exams List
export const examsList = (params) => {
    return useAppQuery({
        queryKey: ["exams", params],
        apiCall: () => getExams(params),
    });
};

// Get Single Exam
export const examById = (id, enabled = true) => {
    return useAppQuery({
        queryKey: ["exam", id],
        apiCall: () => getExamById(id),
        enabled: enabled && !!id,
    });
};

// Create Exam
export const createExamMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createExam,
        successMessage: "Exam created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["exams"]);
        },
    });
};

// Update Exam
export const updateExamMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateExam,
        successMessage: "Exam updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["exams"]);
            queryClient.invalidateQueries(["exam"]);
        },
    });
};

// Delete Exam
export const deleteExamMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteExam,
        successMessage: "Exam deleted successfully 🗑️",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["exams"]);
        },
    });
};

// Exam Subjects
export const examSubjectsList = (examId, params, enabled = true) => {
    return useAppQuery({
        queryKey: ["examSubjects", examId, params],
        apiCall: () => getExamSubjects(examId, params),
        enabled: enabled && !!examId,
    });
};

export const addExamSubjectsMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: addExamSubjects,
        successMessage: "Subjects added to exam successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["examSubjects"]);
        },
    });
};

export const updateExamSubjectMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateExamSubject,
        successMessage: "Exam subject updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["examSubjects"]);
        },
    });
};

export const deleteExamSubjectMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteExamSubject,
        successMessage: "Exam subject deleted successfully 🗑️",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["examSubjects"]);
        },
    });
};

// Marks Management
export const examMarksList = (examId, params, enabled = true) => {
    return useAppQuery({
        queryKey: ["examMarks", examId, params],
        apiCall: () => getExamMarks(examId, params),
        enabled: enabled && !!examId,
    });
};

export const upsertMarksMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: upsertMarks,
        successMessage: "Marks saved successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["examMarks"]);
            queryClient.invalidateQueries(["examResults"]);
        },
    });
};

// Results Management
export const generateResultMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: generateResult,
        successMessage: "Result generated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["examResults"]);
        },
    });
};

export const examResultsList = (examId, params, enabled = true) => {
    return useAppQuery({
        queryKey: ["examResults", examId, params],
        apiCall: () => getExamResults(examId, params),
        enabled: enabled && !!examId,
    });
};

// Add getStudentsQuery if not exists
export const getStudentsQuery = () => {
    return useAppQuery({
        queryKey: ["students"],
        apiCall: getStudents,
    });
};

export const studentResultsList = (studentId, params, enabled = true) => {
    return useAppQuery({
        queryKey: ["studentResults", studentId, params],
        apiCall: () => getStudentResults(studentId, params),
        enabled: enabled && !!studentId,
    });
};


export const fetchstudentListQuery = (params) => {
    return useAppQuery({
        queryKey: ["students", params],
        apiCall: () => getStudents(params),
    });
}



export const getClassAttendanceQuery = ({ classId, sectionId, date }, enabled = true) => {
    return useAppQuery({
        // Add 'date' to the queryKey so it refetches when the date changes
        queryKey: ["classAttendance", classId, sectionId, date],
        apiCall: () => getClassAttendance({ classId, sectionId, date }),
        enabled: enabled && !!classId && !!sectionId && !!date, // Ensure date is present
    });
};






export const createHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createHoliday,
        successMessage: "Holiday created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["holidays"]);
        },
    });
};

export const getHolidaysQuery = (params) => {
    return useAppQuery({
        queryKey: ["holidays", params],
        apiCall: () => getHolidays(params),
    });
};

export const updateHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateHoliday,
        successMessage: "Holiday updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["holidays"]);
        },
    });
};

export const deleteHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteHoliday,
        successMessage: "Holiday deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["holidays"]);
        },
    });
}



// UPDATE STAFF
export const updateStaffMutation = (onClose) => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: updateStaff,
        successMessage: "Staff updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["staffList"]);
            onClose();
        },
    });
};
export const useUploadStaffDocumentsMutation = (staffId, userId) => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: ({ formData }) =>
            uploadStaffDocuments({ userId, formData }),

        successMessage: "Documents uploaded successfully 🎉",

        onSuccessCallback: () => {
            queryClient.invalidateQueries(["staff", staffId]);
        },
    });
};

export const deleteStaffMutation = () => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: deleteStaff,
        successMessage: "Staff deleted successfully 🎉",

        onSuccessCallback: () => {
            queryClient.invalidateQueries(["staffList"]);
        },
    });
};

export const useStudentDetail = (studentId) => {
    return useAppQuery({
        queryKey: ["student", studentId],
        apiCall: () => getStudentById(studentId),
        enabled: !!studentId,
    });
};

export const useUploadStudentDocumentsMutation = (studentId, userId) => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: ({ formData }) =>
            uploadStudentDocuments({ userId, formData }),

        successMessage: "Documents uploaded successfully 🎉",

        onSuccessCallback: () => {
            queryClient.invalidateQueries(["student", studentId]);
        },
    });
};

export const enrollStudentMutation = (onClose) => {
    const queryClient = useQueryClient();

    return useAppMutation({
        apiCall: enrollStudent,
        successMessage: "Student enrolled successfully 🎉",

        onSuccessCallback: () => {
            queryClient.invalidateQueries(["studentList"]);
            onClose(); // ✅ close drawer only on success
        },
    });
};

export const useStudentsList = ({
    page,
    searchTerm,
    classFilter,
    sectionFilter,
    sessionFilter,
}) => {
    return useAppQuery({
        queryKey: [
            "studentList",
            page,
            searchTerm,
            classFilter,
            sectionFilter,
            sessionFilter,
        ],
        apiCall: () =>
            getStudentsList({
                page,
                searchTerm,
                classFilter,
                sectionFilter,
                sessionFilter,
            }),
    });
};

export const useSessionsList = () => {
    return useAppQuery({
        queryKey: ["sessions"],
        apiCall: getSessions,
    });
};

export const useClassesList = () => {
    return useAppQuery({
        queryKey: ["classes"],
        apiCall: getClasses,
    });
};






export const createAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createAssignment,
        successMessage: "Assignment created successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
};

export const getAssignmentsQuery = (params) => {
    return useAppQuery({
        // queryKey: ["assignments", params.sectionId],
        apiCall: () => getAssignments(params),
        // enabled: !!params.sectionId,
    });
};

export const updateAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateAssignment,
        successMessage: "Assignment updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
};

export const deleteAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteAssignment,
        successMessage: "Assignment deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
};


export const getStudentSubmissionsQuery = (assignmentId) => {
    return useAppQuery({
        queryKey: ["studentSubmissions", assignmentId],
        apiCall: () => getTeacherAssignmentSubmissions({ assignmentId }),
        enabled: !!assignmentId,
    });
};


export const giveFeedbackOnSubmissionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: giveFeedbackOnSubmission,
        successMessage: "Feedback submitted successfully 🎉",
    });
};

export const getTeacherTimetableQuery = ({ classId, sectionId }) => {
    return useAppQuery({
        queryKey: ["teacherTimetable", classId, sectionId],
        apiCall: () => getTeacherTimetable({ classId, sectionId }),
        enabled: !!classId && !!sectionId,
    });
};
// 

export const getTeacherInOutTimesQuery = ({ teacherId }) => {
    return useAppQuery({
        queryKey: ["teacherInOutTimes", teacherId],
        apiCall: () => getTeacherInOutTimes({ teacherId }),
        enabled: !!teacherId,
    });
}



export const getClassSecSubQuery = ({ classId, sectionId }) => {
    return useAppQuery({
        queryKey: ["classSecSub", classId, sectionId],
        apiCall: () => getClassSecSub({ classId, sectionId }),
        enabled: !!classId && !!sectionId,
    });
};

export const studentHolidayQuery = ({ page, limit, debouncedSearch }) => {
    return useAppQuery({
        queryKey: ["holidays", page, limit, debouncedSearch],
        apiCall: () =>
            getHolidays({
                page,
                limit,
                search: debouncedSearch,
            }),
    });
};

export const useStudentTimetable = () => {
    return useAppQuery({
        queryKey: ["studentTimetable"],
        apiCall: getStudentTimetable,
    });
};






// STUDENT MODULE
export const useStudentSubjects = (studentId) => {
    return useAppQuery({
        queryKey: ["studentSubjects", studentId],
        apiCall: () => getStudentSubjects(studentId),
        enabled: !!studentId,
    });
};

// ==================== STUDENT ASSIGNMENTS ====================

export const useStudentAssignments = (params) => {
    return useAppQuery({
        queryKey: ["studentAssignments", params],
        apiCall: () => getStudentAssignments(params),
    });
};

export const submitAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: submitAssignment,
        successMessage: "Assignment submitted successfully! 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["studentAssignments"]);
        },
    });
};


export const useStudentExamTimetable = () => {
    return useAppQuery({
        queryKey: ["studentExamTimetable"],
        apiCall: () => getStudentExamTimetable(),
        enabled: true,
    });
};

export const useStudentProfile = () => {
    return useAppQuery({
        queryKey: ["studentProfile"],
        apiCall: () => getStudentProfile(),
        enabled: true,
    });
};
