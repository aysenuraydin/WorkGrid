import { InputTypeEnum } from "common/enums/inputTypeEnum";

export const getColHeight = (type: InputTypeEnum): number => {
    const heights: Partial<Record<InputTypeEnum, number>> = {
        [InputTypeEnum.Alert]: 147, 
        [InputTypeEnum.Badge]: 130, 
        [InputTypeEnum.HtmlEditor]: 370, 
        [InputTypeEnum.Html]: 290, 
        [InputTypeEnum.Textarea]: 90, 
        [InputTypeEnum.Image]: 130, 
        [InputTypeEnum.DropFiles]: 180, 
    };
    return heights[type] ?? 69;
};