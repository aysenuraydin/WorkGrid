import { Dispatch, SetStateAction, useState } from "react";
import { Input, Label } from "reactstrap";
import { AttributeEnum } from "common/enums/AttributeEnum";
import { PropertyEnum } from "common/enums/PropertyEnum";
import { TableColumn } from "common/data/TableColumn";
import { ATTRIBUTE_CONFIG } from "common/config/ATTRIBUTE_CONFIG";
import { PROPERTY_CONFIG } from "common/config/PROPERTY_CONFIG";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { ArrayTagOptionInput } from "./OptionInputInputs/ArrayTagOptionInput"; 
import { PatternOptionInput } from "./OptionInputInputs/PatternOptionInput";
import { DateSingleOptionInput } from "./OptionInputInputs/DateSingleOptionInput";
import { WeekOptionInput } from "./OptionInputInputs/WeekOptionInput";
import { MonthOptionInput } from "./OptionInputInputs/MonthOptionInput";
import { QuarterOptionInput } from "./OptionInputInputs/QuarterOptionInput";
import { DateTimeOptionInput } from "./OptionInputInputs/DateTimeOptionInput";
import { TimeOptionInput } from "./OptionInputInputs/TimeOptionInput";
import { YearOptionInput } from "./OptionInputInputs/YearOptionInput.tsx";
import { NumberOptionInput } from "./OptionInputInputs/NumberOptionInput";
import { FormatOptionInput } from "./OptionInputInputs/FormatOptionInput";
import { SelectWithOptionInput } from "./OptionInputInputs/SelectWithOptionInput";
import { MultipleTimeOptionInput } from "./OptionInputInputs/MultipleTimeOptionInput";
import { MultipleDateOptionInput } from "./OptionInputInputs/SingleDateOptionInput";
import { RangeDateOptionInput } from "./OptionInputInputs/RangeDateOptionInput";
import { RangeWeekOptionInput } from "./OptionInputInputs/RangeWeekOptionInput";
import { RangeYearOptionInput } from "./OptionInputInputs/RangeYearOptionInput";
import { RangeDateTimeOptionInput } from "./OptionInputInputs/RangeDateTimeOptionInput";
import { RangeMonthOptionInput } from "./OptionInputInputs/RangeMonthOptionInput";
import { RangeQuarterOptionInput } from "./OptionInputInputs/RangeQuarterOptionInput";
import { PlaceholderPairOptionInput } from "./OptionInputInputs/PlaceholderPairOptionInput";

dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);

interface OptionsInputProps {
    propKey: PropertyEnum | AttributeEnum;
    columnIndex: number;
    scope: "ui" | "data";
    formik: any;
    setChangedMap:  Dispatch<SetStateAction<{ [key: string]: boolean; }>>;
    changedMap: { [key: string]: boolean; };
    col: TableColumn;
}

export const OptionsInput = ({  propKey, columnIndex, scope, formik, col, setChangedMap, changedMap,
}: OptionsInputProps) => {
    const [tagValue, setTagValue] = useState("");

    const config =
        scope === "ui"
            ? ATTRIBUTE_CONFIG[propKey as AttributeEnum]
            : PROPERTY_CONFIG[propKey as PropertyEnum];

    if (!config) return null;

    const resolvedValue = formik.values?.columns?.[columnIndex]?.[`${scope}Fk`]?.[propKey];
    const inputName     = `columns.${columnIndex}.${scope}Fk.${propKey}`;
    const isMulti       = formik.values?.columns?.[columnIndex]?.uiFk?.multiple ?? false;
    const isMultiSelect =
        (col?.type.toLowerCase() === InputTypeEnum.Select.toLowerCase() ||
        col?.type.toLowerCase() === InputTypeEnum.Checkbox.toLowerCase()) && isMulti;
    const options = (formik.values?.columns?.[columnIndex]?.uiFk?.options ?? "")
        .split(",*,").filter((v: string) => v !== "");
    const rangeLimit = Number(formik.values?.columns?.[columnIndex]?.uiFk?.rangeLimit);

    const markChanged = () =>
        setChangedMap(prev => ({ ...prev, [inputName]: true }));

    const commonProps = {
        name: inputName,
        value: resolvedValue ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        formik.handleChange(e); markChanged();
        },
        onBlur: formik.handleBlur,
        className: changedMap[inputName] ? "bg-primary bg-opacity-10" : "",
    };

    const dateProps = { resolvedValue, inputName, formik, markChanged, changedMap, commonProps };

    const colType = col?.type.toLowerCase();

    const renderInput = () => {
        const { uiType, dataType, formatValue, enumValues } = config;

    if (uiType === InputTypeEnum.Number) {
        if (dataType === "numOrDate") {
            if (colType === InputTypeEnum.Date.toLowerCase() || colType === InputTypeEnum.RangeDate.toLowerCase() || colType === InputTypeEnum.MultipleDate.toLowerCase())
            return <DateSingleOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.Week.toLowerCase() || colType === InputTypeEnum.RangeWeek.toLowerCase())
            return <WeekOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.Month.toLowerCase() || colType === InputTypeEnum.RangeMonth.toLowerCase())
            return <MonthOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.Quarter.toLowerCase() || colType === InputTypeEnum.RangeQuarter.toLowerCase())
            return <QuarterOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.DatetimeLocal.toLowerCase() || colType === InputTypeEnum.RangeDatetimeLocal.toLowerCase())
            return <DateTimeOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.Time.toLowerCase() || colType === InputTypeEnum.MultipleTime.toLowerCase())
            return <TimeOptionInput {...dateProps} />;
            if (colType === InputTypeEnum.Year.toLowerCase() || colType === InputTypeEnum.RangeYear.toLowerCase())
            return <YearOptionInput {...dateProps} />;
        }
        return <NumberOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} changedMap={changedMap} />;
    }

    if (uiType === InputTypeEnum.Checkbox) {
        return (
            <Input
            type="checkbox"
            checked={resolvedValue === "true"}
            style={{ width: "20px", height: "20px" }}
            onChange={(e) => formik.setFieldValue(inputName, e.target.checked ? "true" : "")}
            />
        );
    }

    if (uiType === InputTypeEnum.Select) {
        if (dataType === "array")
            return (
            <ArrayTagOptionInput
                resolvedValue={resolvedValue} inputName={inputName} formik={formik}
                changedMap={changedMap} commonProps={commonProps}
                tagValue={tagValue} setTagValue={setTagValue}
                onAdd={() => {
                const v = tagValue.trim();
                if (!v || (resolvedValue ?? "").split(",*,").includes(v)) return;
                formik.setFieldValue(inputName, resolvedValue == null ? v : `${resolvedValue},*,${v}`);
                setTagValue("");
                markChanged();
                }}
                onRemove={ item => {
                    formik.setFieldValue(inputName, (resolvedValue ?? "").split(",*,").filter((v: string) => v !== item).join(",*,"));
                    markChanged();
                }}
            />
            );
        if (dataType === "enum" && formatValue === "format")
            return <FormatOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} changedMap={changedMap} commonProps={commonProps} enumValues={enumValues} />;
        if (dataType === "enum" && formatValue === "pattern")
            return <PatternOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} changedMap={changedMap} />;
        // size (default enum select)
        return (
            <Input type="select" {...commonProps}>
            {enumValues?.map((v: any) => <option key={v} value={v}>{v}</option>)}
            </Input>
        );
    }

    if (dataType === "any") {
        // Checkbox / Radio / Select → ant Select
        if ([InputTypeEnum.Checkbox, InputTypeEnum.Radio, InputTypeEnum.Select].map(t => t.toLowerCase()).includes(colType))
            return <SelectWithOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} changedMap={changedMap} options={options} isMultiSelect={isMultiSelect} colType={colType} />;

        // Number / Ratings / Range → stepper
        if ([InputTypeEnum.Number, InputTypeEnum.Ratings, InputTypeEnum.Range].map(t => t.toLowerCase()).includes(colType))
            return <NumberOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} changedMap={changedMap} isRating={colType === InputTypeEnum.Ratings.toLowerCase()} />;

        // Basit tipler
        if (colType === InputTypeEnum.Color.toLowerCase())   
            return <Input type="color" {...commonProps} className="p-0" style={{ height: "37px" }} />;
        if (colType === InputTypeEnum.Tel.toLowerCase())     
            return <Input type="number" {...commonProps} />;
        if (colType === InputTypeEnum.Textarea.toLowerCase())
            return <Input type="textarea" {...commonProps} />;

        // Tekil date/time
        if (colType === InputTypeEnum.Date.toLowerCase())          
            return <DateSingleOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.Week.toLowerCase())          
            return <WeekOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.Month.toLowerCase())         
            return <MonthOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.Year.toLowerCase())          
            return <YearOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.Quarter.toLowerCase())       
            return <QuarterOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.DatetimeLocal.toLowerCase()) 
            return <DateTimeOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.Time.toLowerCase())          
            return <TimeOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.MultipleTime.toLowerCase())  
            return <MultipleTimeOptionInput {...dateProps} />;
        if (colType === InputTypeEnum.MultipleDate.toLowerCase())  
            return <MultipleDateOptionInput {...dateProps} isMulti={isMulti} />;

        // Range date/time
        if (colType === InputTypeEnum.RangeDate.toLowerCase())          
            return <RangeDateOptionInput {...dateProps} limit={rangeLimit || 14} />;
        if (colType === InputTypeEnum.RangeDatetimeLocal.toLowerCase()) 
            return <RangeDateTimeOptionInput {...dateProps} limit={rangeLimit || 365} />;
        if (colType === InputTypeEnum.RangeWeek.toLowerCase())          
            return <RangeWeekOptionInput {...dateProps} limit={rangeLimit || 56} />;
        if (colType === InputTypeEnum.RangeMonth.toLowerCase())         
            return <RangeMonthOptionInput {...dateProps} limit={rangeLimit || 12} />;
        if (colType === InputTypeEnum.RangeYear.toLowerCase())          
            return <RangeYearOptionInput {...dateProps} limit={rangeLimit || 10} />;
        if (colType === InputTypeEnum.RangeQuarter.toLowerCase())       
            return <RangeQuarterOptionInput {...dateProps} limit={rangeLimit || 4} />;
    }

    if (dataType === "array") {
        const rangeTypes = [
            InputTypeEnum.RangeDate, InputTypeEnum.RangeDatetimeLocal, InputTypeEnum.RangeWeek,
            InputTypeEnum.RangeMonth, InputTypeEnum.RangeYear, InputTypeEnum.RangeQuarter,
            InputTypeEnum.MultipleTime,
        ].map(t => t.toLowerCase());
        if (rangeTypes.includes(colType))
            return <PlaceholderPairOptionInput resolvedValue={resolvedValue} inputName={inputName} formik={formik} markChanged={markChanged} commonProps={commonProps} />;
    }
    return <Input type="text" {...commonProps} />;
};

return (
    <div className="mb-3 row align-items-start">
    <div className="col-12 col-md-5 mb-1 mb-md-0">
        <Label className="form-label ps-md-3 mt-lg-2 text-capitalize">{propKey}:</Label>
    </div>
    <div className="col-12 col-lg-7">
        {renderInput()}
    </div>
    </div>
);
};