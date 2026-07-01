import { Input } from "reactstrap";
import dayjs from 'dayjs'; 
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek); 

export const WeekOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps }: BaseDateInputProps) => {
  const onChange: DatePickerProps["onChange"] = (date: any) => {
    if (!date) { formik.setFieldValue(inputName, ""); return; }
    formik.setFieldValue(inputName, `${date.year()}-${date.isoWeek()}`);
    markChanged();
  };
  return (
    <>
      <Input {...commonProps} type="hidden" />
      <DatePicker
        picker="week"
        popupClassName="custom-week-picker"
        className={pickerCls(changedMap)}
        onChange={onChange}
        value={
          resolvedValue
            ? dayjs().year(Number(resolvedValue.split("-")[0])).isoWeek(Number(resolvedValue.split("-")[1])).startOf("isoWeek")
            : null
        }
      />
    </>
  );
};