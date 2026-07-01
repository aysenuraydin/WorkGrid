import { Input } from "reactstrap";
import { Select } from 'antd';
import dayjs from 'dayjs';
import isoWeek from "dayjs/plugin/isoWeek";   
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);

interface SelectWithOptionsProps {
  resolvedValue: any;
  inputName: string;
  formik: any;
  markChanged: () => void;
  changedMap: any;
  options: string[];
  isMultiSelect: boolean;
  colType: string; // col.type
}

export const SelectWithOptionInput = ({
  resolvedValue, inputName, formik, markChanged, changedMap,
  options, isMultiSelect, colType,
}: SelectWithOptionsProps) => {
  const formatted = options
    .filter((o) => o !== null && o !== undefined && String(o).trim() !== "")
    .map((o) => ({ label: o, value: o }));

  const isDefaultList = formatted.length === 0;
  const finalOptions = isDefaultList
    ? [{ label: "True", value: "1" }, { label: "False", value: "0" }]
    : formatted;

  const toArray = (v: any): string[] => {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return v ? v.split(",*,").filter(Boolean) : [];
    return [];
  };

  // Checkbox / Radio default → basit checkbox olarak göster
  if (isDefaultList) {
    return (
      <Input
        type="checkbox"
        checked={resolvedValue === "true"}
        style={{ width: "20px", height: "20px", borderRadius: colType === "radio" ? "20px" : undefined }}
        onChange={(e) => formik.setFieldValue(inputName, e.target.checked ? "true" : "")}
      />
    );
  }

  return (
    <Select
      mode={isMultiSelect ? "multiple" : undefined}
      value={isMultiSelect ? toArray(resolvedValue) : (resolvedValue ?? undefined)}
      options={finalOptions}
      allowClear
      style={{ width: "100%" }}
      className={`${changedMap[inputName] ? "bg-primary bg-opacity-10" : ""} p-2`}
      size="middle"
      placeholder="Please select"
      getPopupContainer={(trigger: any) => trigger.parentElement}
      onChange={(val) => {
        formik.setFieldValue(inputName, Array.isArray(val) ? val.join(",*,") : val);
        markChanged();
      }}
    />
  );
};
