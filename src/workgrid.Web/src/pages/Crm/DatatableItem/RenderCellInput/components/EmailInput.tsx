
import dayjs from 'dayjs';
import DatePicker from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek"; 
import quarterOfYear from "dayjs/plugin/quarterOfYear"; 
import { IInputProps } from 'hooks/useCellLogic';
import { Input } from 'reactstrap';
import { IExtraProps } from '..';
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker; 
interface InputProps { 
    inputProps:IInputProps, 
    extra: IExtraProps | any,   
}
export const EmailInput = ({ 
    extra,  
    inputProps, 
} : InputProps) => {  
    return (
    <> 
        <div className={`${inputProps?.hidden  ? "d-none" : ""} form-icon right`}>
            <Input type="email" 
                {...extra}
                className={extra.className+"form-control form-control-icon"}
            />
            <i className="ri-mail-unread-line" style={{color:"#BFBFBF"}}></i>
        </div>
    </>
    );
}
