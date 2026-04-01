import { useQuery } from "@tanstack/react-query";
import { showError } from "../utils/toast";

const useAppQuery = ({
    queryKey,
    apiCall,
    enabled = true,
    staleTime = 1000 * 60 * 5,
    onSuccessCallback,
}) => {
    return useQuery({
        queryKey: [queryKey],
        queryFn: apiCall,
        enabled,
        staleTime,

        onSuccess: (data) => {
            onSuccessCallback?.(data);
        },

        onError: (error) => {
            showError(error?.message || "Failed to fetch data ❌");
        },
    });
};

export default useAppQuery;