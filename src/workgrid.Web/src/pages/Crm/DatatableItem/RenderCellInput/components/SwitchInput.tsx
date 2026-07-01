import { DataType } from 'common/enums/DataType';
import { Input } from 'reactstrap';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
    modalType: DataType;
    setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
    extra: IExtraProps | any;
    formik: any;
    inputProps: IInputProps;
    handleChange: (val: any, ...args: any[]) => void;
    key: string;
    value: any;
    val: any;
    colId: number;
    rowId: number;
    cellId: number;
}

export const SwitchInput = ({
    modalType,
    setChangedMap,
    formik,
    extra,
    handleChange,
    inputProps,
    key,
    val,
    colId,
    rowId,
    cellId,
}: InputProps) => {
    const isDisabled =
        inputProps?.disabled || modalType === DataType.View || inputProps?.readOnly;

    return (
        <div className={`${inputProps?.hidden ? "d-none" : ""} form-check form-switch pt-2`}>
            <Input
                {...extra}
                type="checkbox"
                role="switch"
                size={undefined}
                className="form-check-input switch-primary"
                style={{ width: 40, height: 20, cursor: isDisabled ? "not-allowed" : "pointer" }}
                checked={val === "*1*"}
                disabled={isDisabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (isDisabled) return;
                    const v = e.target.checked ? "*1*" : "*0*";
                    formik.setFieldValue(key, v);
                    handleChange(v, colId, rowId, cellId);
                    setChangedMap(true);
                }}
            /> 
        </div>
    );
};