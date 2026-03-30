import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login } from "../api/apiMehods";
import useAppMutation from "./useAppMutation";
import { QUERY_KEYS } from "../services/queryKeys";

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useAppMutation({
        apiCall: login,
        successMessage: "Login successful 🎉",
        onSuccessCallback: (res) => {
            localStorage.setItem("token", res.token);
            localStorage.setItem("role", res?.user?.role);
            queryClient.invalidateQueries(["me"]);
        },
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

export const useStudents = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STUDENTS],
        queryFn: () => { return 1 },
    });
};
