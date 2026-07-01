
import { Input } from "reactstrap";
import dayjs from 'dayjs'; 
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek); 

export const MonthOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps }: BaseDateInputProps) => {
  const onChange: DatePickerProps["onChange"] = (_, s) => { formik.setFieldValue(inputName, s); markChanged(); };
  return (
    <>
      <Input {...commonProps} type="hidden" />
      <DatePicker picker="month" value={resolvedValue ? dayjs(resolvedValue, "YYYY-MM") : null} onChange={onChange} className={pickerCls(changedMap)} />
    </>
  );
};