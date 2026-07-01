import { Input } from "reactstrap";
import dayjs from 'dayjs'; 
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek); 

export const DateTimeOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps }: BaseDateInputProps) => {
  const onChange: DatePickerProps["onChange"] = (_, s) => { formik.setFieldValue(inputName, s); markChanged(); };
  const parsed = resolvedValue ? dayjs(resolvedValue, "DD-MM-YYYY HH:mm") : null;
  return (
    <>
      <Input {...commonProps} type="hidden" />
      <DatePicker
        needConfirm={false}
        showTime={{ format: "HH:mm", showSecond: false }}
        format="DD-MM-YYYY HH:mm"
        value={parsed?.isValid() ? parsed : null}
        onChange={onChange}
        className={pickerCls(changedMap)}
      />
    </>
  );
};