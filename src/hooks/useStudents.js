import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../services/queryKeys";


export const useStudents = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STUDENTS],
        queryFn: () => { return 1 },
    });
};