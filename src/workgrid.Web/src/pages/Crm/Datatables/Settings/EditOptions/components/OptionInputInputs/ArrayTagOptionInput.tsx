import { Input } from "reactstrap"; 

interface ArrayTagInputProps {
  resolvedValue: string;
  inputName: string;
  formik: any;
  changedMap: any;
  commonProps: any;
  tagValue: string;
  setTagValue: (v: string) => void;
  onAdd: () => void;
  onRemove: (item: string) => void;
}

export const ArrayTagOptionInput = ({
  resolvedValue, inputName, changedMap, commonProps,
  tagValue, setTagValue, onAdd, onRemove,
}: ArrayTagInputProps) => {
  const tags = (resolvedValue ?? "").split(",*,").filter(Boolean);
  return (
    <>
      <div>
        <div>
          {tags.map((item: string, i: number) => (
            <span key={i} className="badge bg-primary-subtle text-primary m-1">
              {item}
              <span className="text-light mx-1 ms-2">|</span>
              <i className="ri-close-line cursor-pointer" onClick={() => onRemove(item)} />
            </span>
          ))}
        </div>
        <div className="d-flex mt-1 gap-1">
          <Input
            {...commonProps}
            type="text"
            size="sm"
            value={tagValue}
            className={changedMap[inputName] ? "bg-primary bg-opacity-10" : ""}
            onChange={(e) => setTagValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          />
          <button type="button" className="btn btn-primary" onClick={onAdd}>
            <i className="ri-add-line" />
          </button>
        </div>
      </div>
      <Input {...commonProps} type="hidden" />
    </>
  );
};