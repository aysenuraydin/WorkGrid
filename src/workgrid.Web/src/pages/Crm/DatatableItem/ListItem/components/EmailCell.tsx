interface CellProps {
    val: string, 
    colClass: string,  
}  

export const EmailCell = ({
    colClass, 
    val, 
} : CellProps) => {  
    return (
        <span>
            <i className={'ri-mail-fill fs-12'+colClass} style={{color:"gray"}}></i> 
            {" "}
            <span>
                {val?.length > 25 ? val?.substring(0,25) + "..." : val?.length > 0 ? val : "..."}
            </span> 
        </span>
    )
}
