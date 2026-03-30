import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mutationFn } from "../services/mutationFn";
import { showSuccess, showError } from "../utils/toast";

const useAppMutation = ({
    apiCall,
    queryKey,
    successMessage,
    errorMessage,
    onSuccessCallback,
}) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => mutationFn({ apiCall, data }),

        onSuccess: (res) => {
            if (successMessage) showSuccess(successMessage);

            if (queryKey) {
                queryClient.invalidateQueries([queryKey]);
            }

            if (onSuccessCallback) {
                onSuccessCallback(res);
            }
        },

        onError: (error) => {
            showError(errorMessage || error?.message || "Something went wrong ❌");
        },
    });

    return mutation;
};

export default useAppMutation;