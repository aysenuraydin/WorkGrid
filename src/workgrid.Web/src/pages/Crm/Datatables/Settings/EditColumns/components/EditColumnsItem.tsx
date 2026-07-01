import { FormFeedback, Input, Spinner } from "reactstrap";
import { PopConfirm } from "components/Common/PopConfirm";
import { toast } from 'react-toastify';
import { getEnumValues } from "helpers/enumHelper";
import { TableColumn } from "common/data/TableColumn";
import { ModalType } from "common/enums/ModalType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { useEditColumnsItem } from "../hooks/useEditColumnsItem";
import { useTableColumn } from "context/TableColumnContext";
import { ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";
import useThemeMode from "hooks/useThemeMode";
import { useGetTenantConfig } from "hooks/useTenant";
import { useDataTable } from "context/DatatableContext";
import { isLockControl } from "common/data/constans";

export const EditColumnItem = ({ column }: { column: ExtendedTableColumn }) => {
    const { data: tenantConfig } = useGetTenantConfig();
    const {
        isMove,
        visibleColumns,
        markToBeEdited,
        markToBeDeleted,
        moveDown,
        moveUp,
        resetOrder,
        confirmOrder
    } = useTableColumn();

    const {
        formik,
        doMove,
        isForeignColumn,
        handleChange,
        handleFocus,
        handleBlur,
        focusMap,
        changedMap,
        moveAction
    } = useEditColumnsItem(
        markToBeEdited,
        column,
        isMove,
        moveUp,
        moveDown,
        confirmOrder,
        visibleColumns.length,
        resetOrder
    );
    const { modal } = useDataTable(); 
    const { isDark } = useThemeMode();
    const isLock =  isLockControl(modal.table.name);

    return (
        <tr style={{ zIndex: "9999", backgroundColor: `${isMove[column.id] || column?.isAdded ? "rgba(var(--vz-primary-rgb), 0.1)" : ""}` }}
            className={`${isMove[column.id] ? "my-inner-border" : ""} border-bottom border-${isDark ? 'dark' : 'light'}`}>
            <td className={`text-${isDark ? "light" : "dark"} bg-${isForeignColumn ? "soft-light" : "transparent"}`}>
                {doMove(column?.tableOrder ?? 0)}
            </td>

            <td className={`text-primary bg-${isForeignColumn ? "soft-light" : "transparent"}`}>
                {column?.isAdded ? <Spinner color="primary ms-2" style={{ width: "1.25rem", height: "1.25rem", borderWidth: 2 }} /> : <span>#{column.id}</span>}
            </td>
            <td className={`bg-${isForeignColumn ? "soft-light" : "transparent"}`}>
                <Input name="tableOrder" type="hidden" value={formik.values.tableOrder} />
                <Input
                    name="name"
                    id="name-field"
                    placeholder="Sütun Adı Girin"
                    type="text"
                    onChange={handleChange}
                    value={formik.values.name}
                    disabled={(isForeignColumn === true && column.realColumnId == null)|| isLock}
                    invalid={formik.touched.name && !!formik.errors.name}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-100 ${focusMap["name"] ? "border-primary shadow-sm" : ""} ${changedMap["name"] ? "bg-primary bg-opacity-10" : ""}`}
                />
                {formik.touched.name && formik.errors.name && (
                    <FormFeedback style={{ position: "absolute" }}>{formik.errors.name}</FormFeedback>
                )}
            </td>

            <td className={`bg-${isForeignColumn ? "soft-light" : "transparent"}`}>
                <Input
                    name="type"
                    id="type-field"
                    placeholder="Sütun Tipi Girin"
                    type="select"
                    disabled={isForeignColumn === true || isLock}
                    onChange={handleChange}
                    value={formik.values.type}
                    invalid={formik.touched.type && !!formik.errors.type}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-100 ${focusMap["type"] ? "border-primary shadow-sm" : ""} ${changedMap["type"] ? "bg-primary bg-opacity-10" : ""}`}
                >
                    <option value="">Seçiniz...</option>
                    {getEnumValues(InputTypeEnum).map((opt: string, i: number) => {
                        if (opt !== InputTypeEnum.ForeignColumn && column.type !== InputTypeEnum.ForeignColumn) {
                            return <option key={i} value={opt}>{opt}</option>
                        } else if (column.type === InputTypeEnum.ForeignColumn && opt === InputTypeEnum.ForeignColumn) {
                            return <option key={i} value={opt}>{opt}</option>
                        }
                    })}
                </Input>
                {formik.touched.type && formik.errors.type && (
                    <FormFeedback style={{ position: "absolute" }}>{formik.errors.type}</FormFeedback>
                )}
            </td>
            <td className={`text-center bg-${isForeignColumn ? "soft-light" : "transparent"}`}>
                <Input
                    name="isVisible"
                    id="isVisible-field"
                    type="checkbox"
                    className="form-check-input"
                    style={{
                        width: '20px',
                        height: '20px',
                        accentColor: "var(--vz-primary)",
                        backgroundColor: formik.values.isVisible ? ("var(--vz-primary)") : undefined,
                        borderColor: formik.values.isVisible ? ("var(--vz-primary)") : undefined,
                        cursor: 'pointer'
                    }}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    checked={formik.values.isVisible}
                />
            </td>
            <td className={`text-center bg-${isForeignColumn ? "soft-light" : "transparent"}`} >
                <Input
                    name="isFilter"
                    id="isFilter-field"
                    type="checkbox"
                    className="form-check-input"
                    style={{
                        width: '20px',
                        height: '20px',
                        accentColor: "var(--vz-primary)",
                        backgroundColor: formik.values.isVisible ? ("var(--vz-primary)" ) : undefined,
                        borderColor: formik.values.isVisible ? ("var(--vz-primary)") : undefined,
                        cursor: 'pointer'
                    }}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    checked={formik.values.isFilter}
                />
            </td>
            <td className={`text-center bg-${isForeignColumn ? "soft-light" : "transparent"}`} >
                {isMove[column.id]
                    ? moveAction()
                    : <>
                        <div id={`column-popconfirm-${column.id}`} className={`btn btn-sm btn-soft-${isLock ?"dark":"danger"} text-danger btn-hover`}>
                            <i className={`ri-delete-bin-5-fill fs-14 text-${isLock ?"dark":"danger"}`}></i>
                        </div>
                        { !isLock &&
                            <PopConfirm
                                targetId={`column-popconfirm-${column.id}`}
                                type={ModalType.Alert}
                                message='Bu kaydı silmek istediğinizden emin misiniz?'
                                confirmText='Sil'
                                onConfirm={async () => {
                                    markToBeDeleted(column);
                                }}
                                onClose={() => toast.error("Silinemedi!")}
                            />
                        }
                    </>}
            </td>
        </tr>
    )
}