import { Input } from "reactstrap";
import { maskList } from 'common/data/customList';
import { AutoComplete } from 'antd';  

interface FormatInputProps {
  resolvedValue: string;
  inputName: string;
  formik: any;
  markChanged: () => void;
  changedMap: any;
  commonProps: any;
  enumValues: any;
}

export const FormatOptionInput = ({ resolvedValue, inputName, formik, markChanged, changedMap, commonProps, enumValues }: FormatInputProps) => {
  const formatType = resolvedValue?.split(",*,")?.[0] ?? "";
  const formatValue = resolvedValue?.split(",*,")?.[1] ?? "";
  const isCustom = formatType === "custom";

  return (
    <div className="d-flex">
      <div className={`${isCustom ? "col-5" : "col-12"} px-0`}>
        <Input
          type="select"
          {...commonProps}
          value={formatType}
          onChange={(e) => { formik.setFieldValue(inputName, e.target.value); markChanged(); }}
        >
          {enumValues?.map((v:any) => <option key={v} value={v}>{v}</option>)}
        </Input>
      </div>
      {isCustom && (
        <div className="col-7 px-0">
          <AutoComplete
            value={formatValue}
            options={(maskList ?? []).map((item) => ({ value: item }))}
            className={`${changedMap[inputName] ? "bg-primary bg-opacity-10" : ""} p-2 no-focus-ring`}
            placeholder="KOD-#####"
            style={{ width: "100%" }}
            onChange={(val) => { formik.setFieldValue(inputName, `${formatType},*,${val}`); markChanged(); }}
          />
        </div>
      )}
    </div>
  );
};
