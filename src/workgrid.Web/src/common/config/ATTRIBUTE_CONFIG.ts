import { AttributeEnum } from "common/enums/AttributeEnum";
import { AttributeConfig } from "./AttributeConfig";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { INPUT_FORMAT_ENUM } from "common/enums/INPUT_FORMAT_ENUM";

export const ATTRIBUTE_CONFIG: Record<AttributeEnum, AttributeConfig> = {
    [AttributeEnum.options]: {
        dataType: "array",
        uiType: InputTypeEnum.Select,
        defaultValue: [],
    },

    [AttributeEnum.multiple]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
        defaultValue: false,
    },

    [AttributeEnum.rows]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: 3,
    },

    [AttributeEnum.cols]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: 15,
    },

    [AttributeEnum.step]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: 1,
    },

    [AttributeEnum.accept]: {
        dataType: "string",
        uiType: InputTypeEnum.Text,
    },

    [AttributeEnum.maxSizeMB]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: 5,
    },

    [AttributeEnum.format]: {
        dataType: "enum",
        uiType: InputTypeEnum.Select,
        enumValues: INPUT_FORMAT_ENUM,
        defaultValue: "",
        formatValue: "format",
    },

    [AttributeEnum.rangeLimit]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
    },

    [AttributeEnum.required]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
    }, 
    [AttributeEnum.autoFocus]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
    }, 
    [AttributeEnum.label]: {
        dataType: "string",
        uiType: InputTypeEnum.Text,
    },
};