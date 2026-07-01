import { Input, Label } from 'reactstrap';
import dayjs from 'dayjs';
import DatePicker from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek"; 
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;
interface InputProps {  
     extra: IExtraProps | any,   
    val: any,  
    type: any, 
    inputProps: IInputProps, 
}
export const RangeInput = ({ 
    extra, 
    type, 
    val, 
    inputProps, 
} : InputProps) => { 
    return(
        <div className={`${inputProps?.hidden ? "d-none" : ""} pe-5`} style={{position:"relative"}}>
            <Input type={type} {...extra} />
            <span className='ms-2 fs-8 text-primary bg-primary bg-opacity-10 p-1 px-2 rounded'
            style={{position:"absolute", bottom:"2px"}}>
                {val?.length>0?val:"--"}
            </span>
        </div>
    );
}
