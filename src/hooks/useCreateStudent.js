import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../services/queryKeys";

export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => { return 1 },

        onSuccess: () => {
            // 🔄 refresh student list
            queryClient.invalidateQueries([QUERY_KEYS.STUDENTS]);
        },
        onError: (error) => {
            console.error("Create failed", error);
        },
    });
};