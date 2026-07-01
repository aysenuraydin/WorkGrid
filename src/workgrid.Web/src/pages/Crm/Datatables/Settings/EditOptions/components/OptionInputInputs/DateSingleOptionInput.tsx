import dayjs from 'dayjs';
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek); 

export const DateSingleOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap }: BaseDateInputProps) => {
  const onChange: DatePickerProps["onChange"] = (_, s) => { formik.setFieldValue(inputName, s); markChanged(); };
  return (
    <DatePicker
      format="DD-MM-YYYY"
      value={resolvedValue ? dayjs(resolvedValue, "DD-MM-YYYY") : null}
      onChange={onChange}
      className={pickerCls(changedMap)}
    />
  );
};