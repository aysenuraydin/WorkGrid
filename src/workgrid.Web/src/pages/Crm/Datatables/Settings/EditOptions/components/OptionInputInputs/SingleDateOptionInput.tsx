import { Input } from "reactstrap";
import dayjs from 'dayjs';
import DatePicker, { DatePickerProps } from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
import { BaseDateInputProps } from "./RangeQuarterOptionInput";

export const pickerCls = (changedMap: any) =>
  `w-100 p-2 ${changedMap ? "time-changed" : ""}`;

export const disabledQuarterStyle = `
  .ant-picker-disabled { background-color: #f0f2f8 !important; color: black !important; }
  .ant-picker-disabled input { background-color: #f0f2f8 !important; cursor: default; color: black !important; }
`;

export const MultipleDateOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps }: BaseDateInputProps & { isMulti: boolean }) => {
  const isMulti = (commonProps as any)?.isMulti ?? false;
  const onChange: DatePickerProps["onChange"] = (_, s) => {
    formik.setFieldValue(inputName, Array.isArray(s) ? s.join(",") : s || "");
    markChanged();
  };
  const parsed = resolvedValue
    ? isMulti
      ? resolvedValue.split(",").map((d: string) => dayjs(d, "DD-MM-YYYY"))
      : dayjs(resolvedValue, "DD-MM-YYYY")
    : null;
  return (
    <>
      <Input {...commonProps} type="hidden" />
      <DatePicker
        multiple={isMulti}
        onChange={onChange}
        maxTagCount="responsive"
        format="DD-MM-YYYY"
        value={parsed as any}
        size="large"
        className={pickerCls(changedMap)}
      />
    </>
  );
};