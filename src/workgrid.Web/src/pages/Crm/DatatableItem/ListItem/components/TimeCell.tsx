interface CellProps {
    val: string, 
    colClass: string,  
    clssnm: string,   
}  

export const TimeCell = ({
    clssnm,
    colClass, 
    val, 
} : CellProps) => {  
    return (
        <span className={'pe-5'+colClass} style={{position:"relative"}}>
            <i className='mdi mdi-clock-time-five-outline' style={{color:"gray"}}></i> 
            {" "}
            <span className={clssnm}>
                {val}
            </span>
        </span>
    )
}
