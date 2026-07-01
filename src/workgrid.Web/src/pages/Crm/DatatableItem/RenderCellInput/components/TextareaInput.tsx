import { Input } from 'reactstrap';
import { IExtraProps } from '..';
interface InputProps { 
    extra: IExtraProps | any,    
}
export const TextareaInput = ({
    extra, 
} : InputProps) => {  
        return (
            <Input
                {...extra}
                type="textarea"  
            /> 
        );
}
