import { FormFeedback, Input } from 'reactstrap';
import { getEnumValues } from 'helpers/enumHelper';
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { useTableColumnForm } from '../hooks/useTableColumnForm';
import { useDataTable } from 'context/DatatableContext';
import { useTableColumn } from 'context/TableColumnContext';
import useThemeMode from 'hooks/useThemeMode';
import { DARK_COLOR } from 'context/Tenantbootstrap';
import { isLockControl } from 'common/data/constans';

export const AddColumn = ({}) => {
    const { modal } = useDataTable();
    const { markToBeAdded } = useTableColumn(); 
    const { isDark } = useThemeMode();     

    const {
        formik, 
        handleSubmit,
        handleChange, 
        handleBlur, 
        handleFocus, 
        focusMap, 
        changedMap
    } = useTableColumnForm(modal.table?.id ?? 0, markToBeAdded);

    const getDynamicClass = (name: string) => `
        w-100 
        ${focusMap[name] ? "border-primary shadow-sm" : ""}
        ${changedMap[name] ? "bg-primary bg-opacity-10" : ""}
    `.trim();

    const types = getEnumValues(InputTypeEnum)
                ?.filter((t: string) => t !== InputTypeEnum.ForeignColumn);

    if(isLockControl(modal.table.name)) return;

    return (
        <>
        <tr className={`sticky-row border`} style={{ backgroundColor: isDark ? DARK_COLOR : "#fff" }}
            onKeyDown={(e) => {                             
                if (e.key === "Enter") {
                    e.preventDefault();
                    formik.handleSubmit();
                }
        }}
        >
            <td> </td>
            <td>
                <button className="btn btn-light btn-sm" onClick={handleSubmit} type="button">
                    <i className="ri-add-fill text-primary fs-5"></i>
                </button>
            </td>

            <td>
                <Input
                    name="name"
                    id="name-field"
                    placeholder="Sütun Adı Girin"
                    type="text"
                    value={formik.values.name}
                    invalid={formik.touched.name && !!formik.errors.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={getDynamicClass("name")} 
                />
                {formik.touched.name && formik.errors.name && (
                    <FormFeedback style={{ position: "absolute", bottom: "-5px" }}>{formik.errors.name}</FormFeedback>
                )}
            </td>
            <td>
                <Input
                    name="type"
                    id="type-field"
                    placeholder="Sütun Tipi Girin"
                    type="select"
                    onChange={handleChange}
                    value={formik.values.type}
                    invalid={formik.touched.type && !!formik.errors.type}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    // HATA DÜZELTMESİ: 'name' yerine 'type' kullanılmalı
                    className={getDynamicClass("type")}
                >
                    <option value="">Seçiniz...</option>
                    {types.map((opt: string, i: number) => (
                        <option key={i} value={opt}>{opt}</option>
                    ))}
                </Input>
                {formik.touched.type && formik.errors.type && (
                    <FormFeedback style={{ position: "absolute", bottom: "-5px" }}>{formik.errors.type}</FormFeedback>
                )}
            </td>
            <td className='text-center'>
                <Input
                    name="isVisible"
                    id="isVisible-field"
                    type="checkbox"
                    className="form-check-input"
                    style={{ width: '20px', height: '20px' }}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    checked={formik.values.isVisible}
                />
            </td>
            <td className='text-center'>
                <Input
                    name="isFilter"
                    id="isFilter-field"
                    type="checkbox"
                    className="form-check-input"
                    style={{ width: '20px', height: '20px' }}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    checked={formik.values.isFilter}
                />
            </td>
            <td className="text-center">
                <div id={`column-popconfirm-0`} className="btn btn-sm btn-light border shadow-sm">
                    <i className="ri-delete-bin-5-fill fs-14 text-danger"></i>
                </div>
            </td>
        </tr>
        <style>
            {`
            .sticky-row {
                position: sticky;
                top: 44px;
                background: #f8f9fa;
                z-index: 10;
                border-bottom: 1px solid #dee2e6;
            }
            `}
        </style>
        </>
    )
}