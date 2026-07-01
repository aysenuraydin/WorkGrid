import { regexList } from 'common/data/customList';
import { AutoComplete } from 'antd';  

interface PatternInputProps {
  resolvedValue: string;
  inputName: string;
  formik: any;
  markChanged: () => void;
  changedMap: any;
}

export const PatternOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap }: PatternInputProps) => (
  <div className="px-0">
    <AutoComplete
      value={resolvedValue}
      options={(regexList ?? []).map((item) => ({ value: item }))}
      placeholder="^KOD-\d{5}$"
      style={{ width: "100%" }}
      className={`${changedMap[inputName] ? "bg-primary bg-opacity-10" : ""} p-2 no-focus-ring`}
      onChange={(val) => { formik.setFieldValue(inputName, val); markChanged(); }}
    />
  </div>
);
