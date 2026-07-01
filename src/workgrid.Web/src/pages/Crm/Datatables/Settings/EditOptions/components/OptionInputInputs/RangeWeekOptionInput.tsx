import { Input } from "reactstrap"; 
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps, pickerCls } from "./RangeQuarterOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;
export const RangeWeekOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps, limit = 56 }: BaseDateInputProps & { limit?: number }) => {
    const onChange = (dates: any) => {
        if (!dates) { formik.setFieldValue(inputName, ""); return; }
        const [s, e] = dates as [Dayjs, Dayjs];
        formik.setFieldValue(inputName, `${s.year()}-${s.isoWeek()} - ${e.year()}-${e.isoWeek()}`);
        markChanged();
    };
    const disabledDate: DatePickerProps["disabledDate"] = (current, { from, type }: any) => {
    if (!current || !from) return false;
    const weekOf = (d: Dayjs) => Math.floor(d.diff(dayjs(d.year().toString()), "week")) + 1;
    const fw = weekOf(from), cw = weekOf(current);
    const ym = (d: Dayjs) => d.year() * 12 + d.month();
    if (type === "year") return current.year() < from.add(-limit, "week").year() || current.year() > from.add(limit, "week").year();
    if (type === "month") return ym(current) < ym(from.subtract(limit, "week")) || ym(current) > ym(from.add(limit, "week"));
    if (type === "week") return Math.abs(cw - fw) > limit;
    return false;
    };
    return (
        <>
        <Input {...commonProps} type="hidden" />
        <DatePicker.RangePicker
            picker="week"
            popupClassName="custom-week-range-picker"
            className={pickerCls(changedMap)}
            onChange={onChange}
            disabledDate={disabledDate}
            value={
            resolvedValue
                ? resolvedValue.split(" - ").map((v: string) => {
                    const [y, w] = v.split("-");
                    return dayjs().year(Number(y)).isoWeek(Number(w)).startOf("isoWeek");
                }) as any
                : null
            }
        />
        </>
    );
};