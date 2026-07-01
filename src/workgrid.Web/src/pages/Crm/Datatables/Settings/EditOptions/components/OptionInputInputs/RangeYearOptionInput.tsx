import { Input } from "reactstrap";
import dayjs from 'dayjs'; 
import DatePicker, { DatePickerProps} from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps, makeRangeOnChange, pickerCls } from "./RangeQuarterOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;

export const RangeYearOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps, limit = 10 }: BaseDateInputProps & { limit?: number }) => {
    const onChange = makeRangeOnChange(inputName, formik, markChanged);
    const disabledDate: DatePickerProps["disabledDate"] = (current, { from, type }: any) => {
        if (!current || !from) return false;
        if (type === "year") return Math.abs(current.year() - from.year()) > limit;
        return false;
    };
    return (
        <>
        <Input {...commonProps} type="hidden" />
        <DatePicker.RangePicker
            picker="year"
            popupClassName="custom-range-picker"
            className={pickerCls(changedMap)}
            onChange={onChange}
            disabledDate={disabledDate}
            value={resolvedValue ? resolvedValue.split(" - ").map((v: string) => dayjs(v, "YYYY")) as any : null}
        />
        </>
    );
};