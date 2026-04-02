import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getSchoolList, login, registerSchool, createSubscription, getSubscriptionList, updateSubscription, deleteSubscription, updateSubscriptionStatus, updateSchoolStatus, getAdminList, createRole, getRoles, updateRole, updateSubject, getSubjects, addSubject, deleteSubject } from "../api/apiMehods";
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



// ADD_SUBJECT: '/api/admin/subject/reg',
//     SUBJECT_LIST: '/api/admin/subjects',
//         SUBJECT_UPDATE: '/api/admin/subject/{id}',
//             SUBJECT_DELETE: '/api/admin/delete/subject/{id}',


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