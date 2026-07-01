import { TimePickerProps } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';  
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { BaseDateInputProps } from "./RangeQuarterOptionInput";
import { pickerCls } from "./SingleDateOptionInput";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek); 

export const TimeOptionInput = ({ resolvedValue, inputName, formik, changedMap }: BaseDateInputProps) => {
  const onChange: TimePickerProps["onChange"] = (_, s) => { formik.setFieldValue(inputName, s); };
  return (
    <TimePicker
      value={resolvedValue ? dayjs(resolvedValue, "HH:mm") : null}
      onChange={onChange}
      className={pickerCls(changedMap)}
      needConfirm={false}
      format="HH:mm"
    />
  );
};
