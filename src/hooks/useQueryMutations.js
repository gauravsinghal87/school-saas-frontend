import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, getSchoolList, login, registerSchool } from "../api/apiMehods";
import useAppMutation from "./useAppMutation";
import { QUERY_KEYS } from "../services/queryKeys";
import { createTeacher, getTeachers } from "../api/apiMehods";
import useAppQuery from "./useAppQuery";
// export const useLoginMutation = () => {
//     const queryClient = useQueryClient();

//     return useAppMutation({
//         apiCall: login,
//         successMessage: "Login successful 🎉",
//         onSuccessCallback: (res) => {
//             console.log("responsesss",res);
//             localStorage.setItem("token", res.accessToken);
//              localStorage.setItem("user", JSON.stringify(res.user));  
//             localStorage.setItem("role", res?.user?.role);
//             queryClient.setQueryData(["me"], res.user);
//         },
//     });
// };

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
        onSuccessCallback: () => {
            queryClient.invalidateQueries(["schoolsList"]);
        },
    });

}

export const useSchoolList = (params) => {
    return useAppQuery({
        queryKey: ["schoolsList", params],  
        apiCall: () => getSchoolList(params), 
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
