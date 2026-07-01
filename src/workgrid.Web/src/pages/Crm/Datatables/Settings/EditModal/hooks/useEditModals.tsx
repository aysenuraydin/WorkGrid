import { useCallback, useEffect, useState } from "react";

export const useEditModals = (id:number, verticalTab:string) => {
    const [editDesignModal, setEditDesignModal] = useState<boolean>(false);   

    useEffect(() => {
        if(verticalTab == "10")
            setEditDesignModal(true);
    }, [verticalTab]);

    const designToggle = useCallback(() => {  setEditDesignModal(prev => !prev); }, [editDesignModal]);

    return{  
        setEditDesignModal, 
        editDesignModal, 
        designToggle 
    }
}