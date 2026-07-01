import { FieldTypeEnum } from "common/enums/FieldTypeEnum";
import { InputTypeEnum } from "common/enums/inputTypeEnum";

export const getValitationType = (colType:InputTypeEnum) => (
    colType.toLowerCase() === InputTypeEnum.Number.toLowerCase() ||
    colType.toLowerCase() === InputTypeEnum.Tel.toLowerCase() ||
    colType.toLowerCase() === InputTypeEnum.Ratings.toLowerCase() 
)?  FieldTypeEnum.number
:   FieldTypeEnum.text;