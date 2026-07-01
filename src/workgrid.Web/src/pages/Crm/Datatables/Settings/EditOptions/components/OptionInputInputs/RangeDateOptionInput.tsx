import { Input } from "reactstrap"; 
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DatePicker, { DatePickerProps, RangePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps, makeRangeOnChange, pickerCls } from "./RangeQuarterOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;

export const RangeDateOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps, limit = 14 }: BaseDateInputProps & { limit?: number }) => {
    const onChange = makeRangeOnChange(inputName, formik, markChanged);
    const disabledDate: DatePickerProps["disabledDate"] = (current, { from, type }: any) => {
        if (!from) return false;
        const ym = (d: Dayjs) => d.year() * 12 + d.month();
        const min = from.add(-limit, "days"), max = from.add(limit, "days");
        if (type === "year") return current.year() < min.year() || current.year() > max.year();
        if (type === "month") return ym(current) < ym(min) || ym(current) > ym(max);
        return Math.abs(current.diff(from, "days")) >= limit;
    };
    return (
        <>
        <Input {...commonProps} type="hidden" />
        <RangePicker
            format="DD-MM-YYYY"
            popupClassName="custom-range-picker"
            className={pickerCls(changedMap)}
            onChange={onChange}
            disabledDate={disabledDate}
            value={resolvedValue ? resolvedValue.split(" - ").map((d: string) => dayjs(d, "DD-MM-YYYY")) as any : null}
        />
        </>
    );
};