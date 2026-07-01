import { Input } from "reactstrap"; 

interface NumberInputProps {
  resolvedValue: any;
  inputName: string;
  formik: any;
  markChanged: () => void;
  changedMap: any;
  isRating?: boolean;  
}

export const NumberOptionInput = ({
  resolvedValue, inputName, formik, markChanged, changedMap, isRating = false,
}: NumberInputProps) => {
  const current = resolvedValue === "" || resolvedValue == null ? 0 : Number(resolvedValue);

  const step = (dir: 1 | -1) => {
    if (isRating && dir === -1 && current <= 0) return;
    if (isRating && dir === 1 && current >= 5) return;
    formik.setFieldValue(inputName, current + dir);
    markChanged();
  };

  return (
    <div className="input-step w-100">
      <button type="button" className="minus" onClick={() => step(-1)}>–</button>
      <Input
        type="number"
        className={`w-100 ${changedMap[inputName] ? "bg-primary bg-opacity-10" : ""}`}
        name={inputName}
        value={Number(resolvedValue ?? "")}
        onChange={(e) => {
          const val = e.target.value;
          if (isRating && (Number(val) > 5 || Number(val) < 0)) return;
          formik.setFieldValue(inputName, val === "" ? "" : Number(val));
          markChanged();
        }}
      />
      <button type="button" className="plus" onClick={() => step(1)}>+</button>
    </div>
  );
};