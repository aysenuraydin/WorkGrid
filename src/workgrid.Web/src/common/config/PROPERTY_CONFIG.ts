import { PropertyEnum } from "common/enums/PropertyEnum";
import { PropertyConfig } from "./PropertyConfig";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { INPUT_SUFFIX_ENUM } from "common/enums/INPUT_SUFFIX_ENUM";
import { INPUT_PREFIX_ENUM } from "common/enums/INPUT_PREFIX_ENUM";
import { regexList } from "common/data/customList";

export const PROPERTY_CONFIG: Record<PropertyEnum, PropertyConfig> = {
    [PropertyEnum.placeholder]: {
        dataType: "array",
        uiType: InputTypeEnum.Text,
        defaultValue: "",
    },

    [PropertyEnum.defaultValue]: {
        dataType: "any",
        uiType: InputTypeEnum.Text,
    },

    [PropertyEnum.readonly]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
        defaultValue: false,
    },

    [PropertyEnum.disabled]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
        defaultValue: false,
    },

    [PropertyEnum.hidden]: {
        dataType: "boolean",
        uiType: InputTypeEnum.Checkbox,
        defaultValue: false,
    },

    [PropertyEnum.helpText]: {
        dataType: "string",
        uiType: InputTypeEnum.Text,
    },

    [PropertyEnum.prefix]: {
        dataType: "enum",
        uiType: InputTypeEnum.Select,
        enumValues: INPUT_PREFIX_ENUM,
        defaultValue: "",
    },

    [PropertyEnum.suffix]: {
        dataType: "enum",
        uiType: InputTypeEnum.Select,
        enumValues: INPUT_SUFFIX_ENUM,
        defaultValue: "",
    },

    [PropertyEnum.size]: {
        dataType: "enum",
        uiType: InputTypeEnum.Select,
        enumValues: ["" ,"small", "middle", "large"] as const,
        defaultValue: "middle",
    },


    [PropertyEnum.min]: {
        dataType: "numOrDate",
        uiType: InputTypeEnum.Number,
        defaultValue: "",
    },
    [PropertyEnum.max]: {
        dataType: "numOrDate",
        uiType: InputTypeEnum.Number,
        defaultValue: "",
    },
    [PropertyEnum.minLength]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: "",
    },
    [PropertyEnum.maxLength]: {
        dataType: "number",
        uiType: InputTypeEnum.Number,
        defaultValue: "",
    },
    [PropertyEnum.pattern]: {
        dataType: "enum",
        uiType: InputTypeEnum.Select,
        enumValues: regexList,
        defaultValue: "",
        formatValue: "pattern",
    },
    
}; 