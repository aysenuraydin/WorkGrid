import { useMemo } from "react";
import { useLocation } from "react-router-dom";  

export const useCreatePage = () => {
    const location = useLocation(); 
    return useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return {
            rowId: queryParams.get("rowId"),
            modalType: queryParams.get("type"),
            modalSize: queryParams.get("size")
        };
    }, [location.search]);
};