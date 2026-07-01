import { Input } from "reactstrap";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;

export interface BaseDateInputProps {
  resolvedValue: string;
  inputName: string;
  formik: any;
  markChanged: () => void;
  changedMap: any;
  commonProps?: any; // hidden <Input> için
}
export const pickerCls = (changedMap: any) => `w-100 p-2 ${changedMap ? "time-changed" : ""}`;

export const makeRangeOnChange =
    (inputName: string, formik: any, markChanged: () => void) =>
    (dates: any, dateStrings: [string, string]) => {
        if (!dates) { formik.setFieldValue(inputName, ""); return; }
        formik.setFieldValue(inputName, `${dateStrings[0]} - ${dateStrings[1]}`);
        markChanged();
    };
export const RangeQuarterOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps, limit = 4 }: BaseDateInputProps & { limit?: number }) => {
    const onChange = makeRangeOnChange(inputName, formik, markChanged);
    const disabledDate: DatePickerProps["disabledDate"] = (current, { from, type }: any) => {
        if (!current || !from) return false;
        const yq = (d: Dayjs) => d.year() * 4 + d.quarter();
        if (type === "year") return Math.abs(current.year() - from.year()) > Math.ceil(limit / 4);
        if (type === "quarter") return Math.abs(yq(current) - yq(from)) > limit;
        return false;
    };
    return (
        <>
        <Input {...commonProps} type="hidden" />
        <RangePicker
            picker="quarter"
            popupClassName="custom-range-picker"
            className={pickerCls(changedMap)}
            onChange={onChange}
            disabledDate={disabledDate}
            value={resolvedValue ? resolvedValue.split(" - ").map((v: string) => dayjs(v, "YYYY-Q")) as any : null}
        />
        </>
    );
};