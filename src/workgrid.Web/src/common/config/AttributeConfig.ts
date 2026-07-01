import { ConfigDataType } from "common/enums/ConfigDataType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";

export interface AttributeConfig {
    dataType: ConfigDataType;  
    uiType: InputTypeEnum;   
    enumValues?: readonly any[];
    formatValue?: string; 
    defaultValue?: any;
}
