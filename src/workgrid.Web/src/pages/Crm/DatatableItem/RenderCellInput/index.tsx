import React, { useMemo } from "react"; 
import dayjs from 'dayjs';
import DatePicker from "antd/es/date-picker"; 
import isoWeek from "dayjs/plugin/isoWeek";  
import quarterOfYear from "dayjs/plugin/quarterOfYear"; 
import { TableCell } from "common/data/TableCell";
import { TableColumn } from "common/data/TableColumn";
import { DataType } from "common/enums/DataType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { PropertyEnum } from "common/enums/PropertyEnum";
import { AttributeEnum } from "common/enums/AttributeEnum"; 
import { InputWrapper } from "./components/InputWrapper";
import { DefaultInput } from "./components/DefaultInput"; 
import { useCellLogic } from "hooks/useCellLogic"; 
import { formatFormula } from "helpers/formatHelper"; 
import { INPUT_COMPONENT_MAP } from "common/map/INPUT_COMPONENT_MAP";
import { getAntdDimensions } from "common/utils/getAntdDimensions";
import { useCellStates } from "./hooks/useCellStates"; 
import { Datatable } from "common/data/Datatable"; 
dayjs.extend(quarterOfYear)
dayjs.extend(isoWeek);
const { RangePicker } = DatePicker;
export interface ICellConfigs {
    [key: string]: string | number | boolean | null | undefined;
}
export interface IExtraProps {
    type: string;
    name: string;
    id: string;
    placeholder: string;
    readOnly: boolean;
    invalid: boolean;
    disabled: boolean;
    className: string;
    style: React.CSSProperties;
    onFocus: (e: React.FocusEvent<FormElement>) => void;
    onBlur: (e: React.FocusEvent<FormElement>) => void;
    rows?: number | string;
    cols?: number | string;
    value?: string | number | boolean | null;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
} 
export interface RenderCellProps {
    value: string | number | boolean | null | any, 
    columns: TableColumn[], 
    col: TableColumn, 
    rowId: number, 
    cells: { [columnId: number]: TableCell[]; }, 
    formik: any,
    modalType: DataType,
    handleChange: (val: any, ...args: any[]) => void,
    table: Datatable,
    fileManagerRefs: React.MutableRefObject<{ [key: string]: any; }>,
    loading: { [key: string]: boolean[]; },
    setLoading: (update: any) => void,
    selectedFile:{ [key: string]: File[]; },
    setSelectedFile: (update: any) => void,
    selectedForDeletion: { [key: string]: string[]; },
    setSelectedForDeletion: (update: any) => void,
    isEditRow?:boolean,
    cell?:TableCell, 
} 
export const RenderCellInput = (props: RenderCellProps) => {  
    const { 
        value: val,
        columns,
        col, 
        formik,
        modalType,
        handleChange,
        fileManagerRefs,
        table, 
        isEditRow,
        cell,
        rowId
    } = props;
    const key = `cells.${rowId??0}.${col.id}`; 
    
    const cellConfigs = useMemo<ICellConfigs>(() => {
        const config: ICellConfigs = {};
        
        [...(col.dataFk || []), ...(col.uiFk || [])]
        ?.forEach(item => {
            config[item.type] = item.value;
        }); 
        return config;
    }, [col.dataFk, col.uiFk]);

    const { inputRule, inputProps } = useCellLogic(col, cellConfigs);  
    
    const {  antdSize, targetHeight, dateHeight } = getAntdDimensions(cellConfigs);   
    const { changedMap, setChangedMap, copyMap, setCopyMap, focusMap, setFocusMap } = useCellStates();    
    
    const value = val ?? "";
    const type = typeof col.type === "string"
        ? col.type.toLowerCase()
        : String(col.type).toLowerCase();
    
    const isCheckbox = type === InputTypeEnum.Checkbox.toLowerCase();
    const isRadio = type === InputTypeEnum.Radio.toLowerCase(); 

    const placeholders = inputProps?.placeholder?.split(",*,") || [];
    const firstPlaceholder = placeholders[0] || "Enter start "+col?.name;
    const secondPlaceholder = placeholders[1] || "Enter end "+col?.name;

    if(DataType.Create && val == "" && cellConfigs[PropertyEnum.defaultValue] != undefined) { 
        const dVal = (isCheckbox || isRadio )  && (inputProps?.options ==undefined)
                    ?((cellConfigs[PropertyEnum.defaultValue] === "true" ? "*1*": "*0*"))
                    : cellConfigs[PropertyEnum.defaultValue]

        formik.setFieldValue(key, dVal);
    }  

    const touchedCells = formik.touched.cells;
    const errorsCells = formik.errors.cells; 

    const isError = !!(
        (touchedCells?.[rowId]?.[col.id] || formik.submitCount > 0) && 
        errorsCells?.[rowId]?.[col.id]
    ); 

    const extra: IExtraProps = {
        ...inputProps,
        type: type,
        name:key,
        id:`field-${rowId}-${col?.id ?? 0}`,  
        placeholder: typeof cellConfigs[PropertyEnum.placeholder] === "string"
                    ? cellConfigs[PropertyEnum.placeholder]
                    : (typeof cellConfigs[AttributeEnum.format] === "string" && 
                        cellConfigs[AttributeEnum.format].startsWith("custom")
                        ? cellConfigs[AttributeEnum.format].split(',*,')?.[1] 
                            ?? `Enter ${col.name}`
                        : `Enter ${col.name}`),

        readOnly: !!(cellConfigs[PropertyEnum.readonly] || col.functionText),
        invalid:  !!(touchedCells?.[rowId]?.[col.id] && !!errorsCells?.[rowId]?.[col.id]),
        disabled: !!(col.realTableId != null || 
                modalType == DataType.View || 
                // col.functionText || 
                cellConfigs[PropertyEnum.disabled]),
        
        className:`
            ${!isCheckbox && !isRadio && focusMap ? " border-primary shadow-sm" : ""}
            ${!isCheckbox && !isRadio && changedMap ? "bg-primary bg-opacity-10" : ""}
            ${modalType == DataType.View ?  "text-primary" : ""}
            ${isCheckbox ? " checkbox-style" : isRadio ? "": " w-100"}
        `.trim(),
        style: type === InputTypeEnum.Color.toLowerCase() 
                ?{
                    height: dateHeight,
                    lineHeight: '0', 
                    appearance: 'none', 
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                }
                :{},
        onFocus: (e: React.FocusEvent<FormElement>) => {
            setFocusMap(true);
        },
        onBlur: (e: React.FocusEvent<FormElement>) => {
            setFocusMap(false);
            formik.handleBlur(e);
        },
    };

    if (!fileManagerRefs.current[key]) {
        fileManagerRefs.current[key] = React.createRef();
    } 

    if( type === InputTypeEnum.File.toLowerCase()) {
        extra.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if(modalType == DataType.View || inputProps?.readOnly || inputProps?.disabled) return;
            const file = e.target.files?.[0] ?? null;
            formik.setFieldValue(key, file);
            handleChange( file, col.id, rowId, cell?.id );
        };
        extra.accept = inputProps?.accept ?? "*/*";
    } else {
        extra.value = value ?? "";
        extra.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if(modalType == DataType.View || inputProps?.readOnly || inputProps?.disabled) return;
            const val = e?.target?.value;
            setChangedMap(true);
            handleChange( val, col.id, rowId, cell?.id );
        };
        if (type === InputTypeEnum.Color.toLowerCase()) {
            extra.className = extra.className + " p-0";
        } else if(type === InputTypeEnum.Textarea.toLowerCase()){
            extra.rows= Number(cellConfigs[AttributeEnum.rows]);
            extra.cols= Number(cellConfigs[AttributeEnum.cols]);
        } 
    }  

    const sharedInputProps = { 
        modal: true, 
        downloadName: table?.name ?? "",
        fileKey: key,
        // Referans
        ref: fileManagerRefs.current[key],
        // Olaylar (Callbacks)
        onChangeVal: (newValue: string) => {
            handleChange(newValue, col.id, rowId, cell?.id);
            setChangedMap(true);
        },
        value,
        val,
        extra:{...extra},   
        inputProps,
        isError,
        changedMap,
        setChangedMap,
        targetHeight,
        rowId: rowId,
        cellId: cell?.id, 
        dateHeight, 
        antdSize,
        key,
        inputRule, 
        focusMap,
        setFocusMap,
        colId:col.id,
        firstPlaceholder,
        secondPlaceholder,
    };
    const Component = INPUT_COMPONENT_MAP[type] || DefaultInput;

    const withWrapper = (children: React.ReactNode) => ( 
        <InputWrapper
            type={type}
            label={inputProps?.label ?? col.name}
            value={value}
            val={val}
            required={inputProps?.required}
            rowId={rowId}
            colId={col.id}
            realTableId={col.realTableId}
            modalType={modalType}
            changedMap={changedMap}
            copyMap={copyMap}
            setCopyMap={setCopyMap}
            helpText={cellConfigs[PropertyEnum.helpText]?.toString()}
            funcText={formatFormula(col?.functionText ?? "", columns)}
            isEditRow={isEditRow}
            error={errorsCells?.[rowId]?.[col.id]}
            touched={touchedCells?.[rowId]?.[col.id]}
        >
            {children}
        </InputWrapper>
    ); 



    // if( col.realColumnId != null && col.realTableId != null){
    //     return withWrapper(
    //         <ForeignColumnInput 
    //             columns={columns}
    //             col={col}
    //             targetHeight={targetHeight}
    //             changedMap={changedMap}
    //             cells={props.cells[col.realColumnId ?? 0]} 
    //             modalType={modalType}
    //             setChangedMap={setChangedMap}
    //             formik={formik}
    //             extra={extra}
    //             handleChange={handleChange}
    //             inputProps={inputProps}
    //             key={key}
    //             value={value}
    //             rowId={rowId}
    //             cellId={cell?.id??0}
    //             isError={isError}
    //         />
    //     );
    // } 

    return withWrapper(
        <Component
            {...props}  
            {...sharedInputProps}   
        />
    );

{/* 
    <AutoComplete
    value={value}
    options={options}
    onSearch={handleSearch}
    onSelect={handleSelect}
    onChange={(value) => { 
        setValue(value);
        setChangedMap(prev => ({ ...prev, [`class.${col?.id}`]: true }));
    }}
    placeholder="Yaz..."
    style={{ width: "100%" }}
    className={`p-2 no-focus-ring ${changedMap[`class.${col?.id}`] ? "bg-primary bg-opacity-10":""}`}
/> */}
};
