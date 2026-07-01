import { useEffect, useMemo } from "react";
import { Form, ModalBody, Label, Row, Col, Accordion, AccordionItem, AccordionHeader, AccordionBody, Alert } from "reactstrap";  
import Select from "react-select"; 
import { Datatable } from "common/data/Datatable"; 
import { IForeignTableRelation, useEditRelations } from "./hooks/useEditRelations";
import { useDataTable } from "context/DatatableContext"; 
import { MultiValue, SingleValue } from "react-select/dist/declarations/src/types"; 
import useThemeMode from "hooks/useThemeMode";
import { DARK_COLOR } from "context/Tenantbootstrap";
import { useGetTenantConfig } from "hooks/useTenant";
import { useTenantContext } from "context/TenantContext";
import { isBlogControl, isLockControl, isProductControl } from "common/data/constans";

export interface ISelectOption {
    label: string;
    value: number;
}

export const EditRelation = ({ isSettings }: { isSettings?: boolean }) => { 
    const { config: tenantConfig } = useTenantContext();
    const { modal } = useDataTable();
    const { isDark } = useThemeMode(); 
    const { 
        formik, 
        focusMap, 
        foreignTables, 
        setForeignTables, 
        setChangedMap, 
        handleFocus, 
        handleBlur, 
        changedMap,  
        openDefault, 
        setOpenDefault, 
        toggleDefault, 
        columns, 
        tables 
    } = useEditRelations(modal.table?.id, !!modal.editRelationModal, !!isSettings); 

    const filteredList = useMemo(() => {
        let filteredList =tables?.data;
        if(filteredList == null) return []
        
        if (!tenantConfig.showECommerce) {
            filteredList = filteredList.filter(t => !isProductControl(t.name));
        }
        if (!tenantConfig.showBLog) {
            filteredList = filteredList.filter(t => !isBlogControl(t.name));
        } 
        if (!tenantConfig.showCrm) {
            filteredList = filteredList.filter(t => isLockControl(t.name));
        }
        
        filteredList = filteredList.filter(t => t.deletedAt == null);
        
        return filteredList
    }, [tables?.data, tenantConfig]);

    const selectItems = useMemo(
        () => [
            {
                label: "Tüm Tablolar",
                options: filteredList
                    // .filter((t: Datatable) => t.id !== modal.table?.id)
                    ?.map((t: Datatable) => ({
                        label: t.name,
                        value: t.id
                    })) ?? []
            }
        ],
        [tables, modal.table?.id]
    );



    return (
        <div>
            <Form className="tablelist-form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                formik.handleSubmit();
            }}>
                <ModalBody className="p-0"
                    style={!!isSettings ? { marginBottom: "0px" } : { minHeight: "49vh", maxHeight: "60vh" }}>
                    <Row className="mb-3">
                        <Col>
                            <Label htmlFor="foreignTablesId" className="form-label">
                                İlişkili Tablolar
                            </Label>
                            <div className={`rounded ${focusMap["foreignTablesId"] ? "border-primary shadow-sm" : ""}`}>
                                <Select
                                    value={foreignTables}
                                    isMulti={true} 
                                    onChange={async (selected: MultiValue<ISelectOption>) => {
                                        if (!selected) { 
                                            setForeignTables([]);
                                            formik.setFieldValue("foreignTablesId", []);
                                            setChangedMap(prev => ({ ...prev, foreignTablesId: true }));
                                            return;
                                        } 

                                        const normalized = selected.map(s => {
                                            const existing = (foreignTables ?? []).find(ft => ft.foreignTableId === s.value);
                                            return {
                                                ...s,
                                                foreignTableId: s?.value ?? "",
                                                createOrUpdateColumnId: Number(existing?.createOrUpdateColumnId) ?? "",
                                                listColumnIds: existing?.listColumnIds ?? [],
                                            };
                                        });

                                        setForeignTables(normalized);
                                        formik.setFieldValue("foreignTables", normalized); 
                                        formik.setFieldValue("foreignTablesId", normalized.map(x => x.value));
                                        setChangedMap(prev => ({ ...prev, foreignTablesId: true })); 
                                    }} 
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    options={selectItems}
                                    classNamePrefix="js-example-disabled-multi mb-0"
                                    styles={{
                                        control: (base: any, state: any) => ({
                                            ...base,
                                            boxShadow: 'none',
                                            borderColor: state.isFocused ? "var(--vz-primary)" : base.borderColor,
                                            backgroundColor: changedMap["foreignTablesId"] ? '#F3F0FA' : base.backgroundColor,
                                            '&:hover': { borderColor: "var(--vz-primary)" },
                                        }),
                                        multiValue: (base: any) => ({ ...base, backgroundColor: "var(--vz-primary)", color: 'white' }),
                                        multiValueLabel: (base: any) => ({ ...base, color: 'white', fontWeight: 'bold' }),
                                        multiValueRemove: (base: any) => ({
                                            ...base, color: 'white',
                                            ':hover': { backgroundColor: "var(--vz-primary)", color: 'white', cursor: 'pointer' },
                                        }),
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row> 
                        <Accordion id="default-accordion-example" open={openDefault} toggle={toggleDefault}>
                            {foreignTables?.map((tbl: IForeignTableRelation, index: number) => { 
                                const datatable = (tables?.data ?? []).find((x: any) => x.id === tbl.value);
                                if (!datatable) return null;
                                return(
                                    <AccordionItem key={tbl.value} className={openDefault === tbl.value?.toString() ? "border border-primary" : ""}>
                                        <AccordionHeader onDoubleClick={() => setOpenDefault('')} targetId={String(tbl.value)}>
                                            {datatable?.name}
                                        </AccordionHeader>
                                        <AccordionBody accordionId={String(tbl.value)}>
                                            <Row>
                                                <Col xs={4}>
                                                    <Label htmlFor={`EditableColumns_${datatable?.id}`}>Düzenlenebilir</Label>
                                                    <div className={`rounded ${focusMap[`EditableColumns_${datatable?.id}`] ? "border-primary shadow-sm" : ""}`}>
                                                        <Select
                                                            isClearable={true} 

                                                            options={(columns?.[datatable?.id] ?? [])
                                                            .filter(opt => !opt.realColumnId && opt.type?.toLowerCase() !== "parent")
                                                            .map(c => ({ label: c.name, value: c.id }))}

                                                            onFocus={handleFocus}
                                                            onBlur={handleBlur} 
                                                            onChange={(selected: SingleValue<{ label: string; value: number }>) => {
                                                                const selectedId = selected ? selected.value : null; 
                                                                const updated = foreignTables.map(ft =>
                                                                    ft.foreignTableId === datatable?.id ? { ...ft, createOrUpdateColumnId: selectedId } as IForeignTableRelation : ft
                                                                );
                                                                setForeignTables(updated);
                                                                formik.setFieldValue("foreignTables", updated);  
                                                                setChangedMap(prev => ({ ...prev, [`EditableColumns_${datatable?.id}`]: true }));
                                                            }}
                                                            value={(() => {
                                                                const ft = foreignTables.find(ft => ft.foreignTableId === datatable?.id);
                                                                if (!ft || !ft.createOrUpdateColumnId) return null;
                                                                const col = (columns?.[datatable?.id] ?? []).find(c => c.id === Number(ft.createOrUpdateColumnId));
                                                                return col ? { label: col.name, value: col.id } : null;
                                                            })()}
                                                        /> 
                                                    </div>
                                                </Col>
                                                <Col xs={8}>
                                                    <Label htmlFor={`DisplayColumns_${datatable?.id}`}>Görüntülenecek</Label>
                                                    <div className={`rounded ${focusMap[`DisplayColumns_${datatable?.id}`] ? "border-primary shadow-sm" : ""}`}>
                                                        <Select
                                                            isMulti

                                                            options={(columns?.[datatable?.id] ?? []).filter(opt => !opt.realColumnId).map(c => ({ label: c.name, value: c.id }))}

                                                            value={(foreignTables ?? []).find(ft => ft.foreignTableId === datatable?.id)?.listColumnIds?.map(id => {
                                                                const col = (columns?.[datatable?.id ?? 0] ?? []).find(c => c.id === id);
                                                                return col ? { label: col.name, value: col.id } : null;
                                                            })?.filter(Boolean) ?? []}
                                                            onFocus={handleFocus}
                                                            isDisabled ={ datatable.id == modal.table.id}
                                                            onBlur={handleBlur} 
                                                            onChange={(selected: MultiValue<ISelectOption>) => {
                                                                const selectedIds = selected?.map(s => s.value) ?? [];
                                                                const updated = foreignTables?.map(ft =>
                                                                    ft.foreignTableId === datatable?.id ? { ...ft, listColumnIds: selectedIds } : ft
                                                                );
                                                                setForeignTables(updated);
                                                                formik.setFieldValue("foreignTables", updated); 
                                                                setChangedMap(prev => ({ ...prev, [`DisplayColumns_${datatable?.id}`]: true }));
                                                            }}
                                                        />
                                                    </div>
                                                </Col> 
                                            </Row>
                                            <Row className="mt-3">
                                                <Col xs={12}>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            id={`isMultiSelect_${datatable?.id}`}
                                                            checked={foreignTables.find(ft => ft.foreignTableId === datatable?.id)?.isMultiSelect ?? false}
                                                            disabled ={ datatable.id == modal.table.id}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                const updated = foreignTables.map(ft =>
                                                                    ft.foreignTableId === datatable?.id ? { ...ft, isMultiSelect: checked } : ft
                                                                );
                                                                setForeignTables(updated);
                                                                formik.setFieldValue("foreignTables", updated);
                                                                setChangedMap(prev => ({ ...prev, [`isMultiSelect_${datatable?.id}`]: true }));
                                                            }}
                                                        />
                                                        <Label className="form-check-label" htmlFor={`isMultiSelect_${datatable?.id}`}>
                                                            Çoklu seçime izin ver (bu ilişkide birden fazla kayıt seçilebilir)
                                                        </Label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </AccordionBody>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </Row>
                    {foreignTables?.length === 0 && (
                        <Alert color="danger" isOpen={true} className="p-3">
                            İlişki bulunamadı! İlişkileri görüntülemek için ekleme yapın.
                        </Alert>
                    )}
                </ModalBody> 
                
                <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top ${!isSettings ? "pe-3 pb-3" : ""}`}
                    style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                    <button type="button" className="btn btn-light" onClick={() => modal.setEditRelationModal(false)}>
                        <i className="ri-close-line fs-16 me-2"></i> İptal
                    </button> 
                    <button type="submit" className="btn btn-success">
                        <i className="ri-save-3-fill fs-16 me-2"></i> İlişkileri Kaydet
                    </button>
                </div> 
            </Form>
        </div>
    );
};