

export const mutationFn = async ({ apiCall, data }) => {
    try {
        const res = await apiCall(data);
        return res;
    } catch (error) {
        throw error?.response?.data || error;
    }
};