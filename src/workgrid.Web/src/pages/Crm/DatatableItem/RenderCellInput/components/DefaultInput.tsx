import { IInputProps } from 'hooks/useCellLogic'
import { Input } from 'reactstrap'
import { IExtraProps } from '..'
export const DefaultInput = ({  inputProps, extra }:{
    inputProps:IInputProps, extra:IExtraProps | any
}) => {
    return (
        <div className={`${inputProps?.hidden ? "d-none" : ""} d-flex border rounded`}>  
            {inputProps?.prefix && <span className="me-1 mt-2 px-2 text-nowrap" 
            style={{ whiteSpace: 'nowrap' }}>{inputProps?.prefix}</span> }
                <Input 
                    {...extra} 
                />  
            {inputProps?.suffix && <span className="ms-1 mt-2 px-2 text-nowrap text-nowrap" 
            style={{ whiteSpace: 'nowrap' }}>{inputProps?.suffix}</span> }
        </div> 
    )
}
 