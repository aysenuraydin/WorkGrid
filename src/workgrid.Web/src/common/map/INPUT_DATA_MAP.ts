import { AttributeEnum } from "common/enums/AttributeEnum";
import { INPUT_FORMAT_ENUM } from "common/enums/INPUT_FORMAT_ENUM";
import { InputTypeEnum } from "common/enums/inputTypeEnum";

export const INPUT_DATA_MAP: Record<InputTypeEnum, AttributeEnum[]> = {
    [InputTypeEnum.Alert]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Badge]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Badges]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Checkbox]: [
        AttributeEnum.options,
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Color]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Date]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.DatetimeLocal]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.DropFiles]: [
        AttributeEnum.accept,
        AttributeEnum.maxSizeMB,
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Email]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.File]: [
        AttributeEnum.accept,
        AttributeEnum.maxSizeMB,
        AttributeEnum.multiple, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.ForeignColumn]: [
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Html]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.HtmlEditor]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Image]: [
        AttributeEnum.accept,
        AttributeEnum.maxSizeMB,
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Month]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.MultipleDate]: [
        AttributeEnum.multiple, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.MultipleTime]: [
        AttributeEnum.multiple, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Number]: [
        AttributeEnum.format,
        AttributeEnum.step, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label, 
    ],

    [InputTypeEnum.Password]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.QRCode]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Quarter]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Radio]: [
        AttributeEnum.options, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Range]: [
        AttributeEnum.step,
        AttributeEnum.rangeLimit,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeDate]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeDatetimeLocal]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeMonth]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeQuarter]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeWeek]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.RangeYear]: [
        AttributeEnum.rangeLimit, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Ratings]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Select]: [
        AttributeEnum.options,
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Tel]: [
        AttributeEnum.format,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Text]: [
        AttributeEnum.format,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Textarea]: [
        AttributeEnum.rows,
        AttributeEnum.cols,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Time]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.URL]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Video]: [ 
        AttributeEnum.accept,
        AttributeEnum.maxSizeMB,
        AttributeEnum.multiple, 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Week]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],

    [InputTypeEnum.Year]: [ 
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ], 

    [InputTypeEnum.User]: [
        AttributeEnum.multiple,
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Parent]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Icon]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
    [InputTypeEnum.Switch]: [
        AttributeEnum.required,
        AttributeEnum.autoFocus,
        AttributeEnum.label,
    ],
};
export type InputFormat = (typeof INPUT_FORMAT_ENUM)[number];

