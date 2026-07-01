import { useState } from "react";
export const useCellStates = () => {
    const [changedMap, setChangedMap] = useState<boolean>(false);
    const [copyMap, setCopyMap] = useState<boolean>(false);
    const [focusMap, setFocusMap] = useState<boolean>(false); 
    
    return { 
        changedMap, 
        setChangedMap, 
        copyMap, 
        setCopyMap, 
        focusMap, 
        setFocusMap 
    };
};