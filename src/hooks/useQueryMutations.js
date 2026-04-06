import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCurrentUser, getSchoolList, login, registerSchool, createSubscription, getSubscriptionList, updateSubscription, deleteSubscription, updateSubscriptionStatus, updateSchoolStatus, getAdminList, createRole, getRoles, updateRole, updateSubject, getSubjects, addSubject, deleteSubject, createClass, updateClass, updateAcademicYear, deleteClass, classesList, getAcademicYearList, createAcademicYear, updateSection, createSection, createFeeStructure,
    getFeeStructures,
    updateFeeStructure,
    deleteFeeStructure,
    getFeeStructureById,
    createPeriod,
    getPeriods,
    updatePeriod,
    deletePeriod,
    createTimetable,
    getTimetable,
    deleteTimetable,
    updateClassSubjects,
    removeClassSubjects,
    deleteSection,
    getSectionList,
} from "../api/apiMehods";
import useAppMutation from "./useAppMutation";
import { QUERY_KEYS } from "../services/queryKeys";
import useAppQuery from "./useAppQuery";
import { showError, showSuccess } from "../utils/toast";



//SUPERADMIN QUERIES & MUTATIONS    


export const createTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: createTeacher,
        successMessage: "Teacher created successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["teachersList"]);
        },
    });
}









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
                                : s
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
                "Failed to update status ❌"
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
}
export const updateSubscriptionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSubscription,
        successMessage: "Subscription plan updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });


}

export const updateSubscriptionStatusMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: updateSubscriptionStatus,
        successMessage: "Subscription status updated successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });


}
export const deleteSubscriptionMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: deleteSubscription,
        successMessage: "Subscription plan deleted successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["subscriptionPlans"]);
        },
    });

}


//admin
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



export const getTeachersMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: getTeachers,
        successMessage: "Teachers fetched successfully 🎉",
        onSuccessCallback: (res) => {
            queryClient.invalidateQueries(["teachersList"]);
        },
    });
}

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
        queryFn: () => { return 1 },
    });
};




//admin queries & mutations 

//admin
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