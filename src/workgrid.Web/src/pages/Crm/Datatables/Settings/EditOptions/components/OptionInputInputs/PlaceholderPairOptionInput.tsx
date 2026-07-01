import { Input } from "reactstrap";    

interface PlaceholderPairInputProps {
  resolvedValue: string;
  inputName: string;
  formik: any;
  markChanged: () => void;
  commonProps: any;
}

export const PlaceholderPairOptionInput = ({ resolvedValue, inputName, formik, markChanged, commonProps }: PlaceholderPairInputProps) => {
  const parts = typeof resolvedValue === "string" ? resolvedValue.split(",*,") : ["", ""];
  const firstId = `${inputName}_first`;
  const secondId = `${inputName}_second`;

  const combine = (v1: string, v2: string) => {
    formik.setFieldValue(inputName, `${v1},*,${v2}`);
    markChanged();
  };

  return (
    <>
      <Input
        id={firstId}
        type="text"
        placeholder="Enter first placeholder.."
        value={parts[0] || ""}
        onChange={(e) => {
          const second = (document.getElementById(secondId) as HTMLInputElement)?.value || "";
          combine(e.target.value, second);
        }}
      />
      <Input
        id={secondId}
        type="text"
        placeholder="Enter second placeholder.."
        className="mt-1"
        value={parts[1] || ""}
        onChange={(e) => {
          const first = (document.getElementById(firstId) as HTMLInputElement)?.value || "";
          combine(first, e.target.value);
        }}
      />
      <Input type="hidden" {...commonProps} className="mt-2" />
    </>
  );
};