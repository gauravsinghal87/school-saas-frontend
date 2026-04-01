import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getSchoolList, login, registerSchool,createSubscription,getSubscriptionList,updateSubscription,deleteSubscription,updateSubscriptionStatus } from "../api/apiMehods";
import useAppMutation from "./useAppMutation";
import { QUERY_KEYS } from "../services/queryKeys";
import { createTeacher, getTeachers } from "../api/apiMehods";
import useAppQuery from "./useAppQuery";


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
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: registerSchool,
        successMessage: "School registered successfully 🎉",
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["schoolsList"]);
        },
    });

}






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

export const useStudents = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STUDENTS],
        queryFn: () => { return 1 },
    });
};
