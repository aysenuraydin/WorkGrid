import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DatePicker, { RangePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;

export const MultipleTimeOptionInput = ({ resolvedValue, inputName, formik, changedMap }: BaseDateInputProps) => {
  const onChange: RangePickerProps["onChange"] = (_, strings) => {
    if (!strings) { formik.setFieldValue(inputName, null); return; }
    formik.setFieldValue(inputName, `${strings[0]}-${strings[1]}`);
  };
  const rangeValue =
    typeof resolvedValue === "string" && resolvedValue.includes("-")
      ? [dayjs(resolvedValue.split("-")[0], "HH:mm"), dayjs(resolvedValue.split("-")[1], "HH:mm")]
      : null;
  return (
    <>
      <TimePicker.RangePicker
        value={rangeValue as [Dayjs, Dayjs]}
        className={pickerCls(changedMap)}
        onChange={onChange}
        allowClear
        needConfirm={false}
        format="HH:mm"
      />
      <style>{`.ant-picker.ant-picker-multiple.ant-picker-large.ant-picker-outlined { padding: 1.5px 10px !important; }`}</style>
    </>
  );
};