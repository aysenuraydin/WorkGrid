import { ConfigDataType } from "common/enums/ConfigDataType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";

export interface PropertyConfig {
    dataType: ConfigDataType;          
    uiType?: InputTypeEnum;          
    enumValues?: readonly any[];
    defaultValue?: any;
    formatValue?: string; 
}