import { useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Alert, Col, Form, Label, Row } from 'reactstrap';  
import { INPUT_UI_MAP } from 'common/map/INPUT_UI_MAP';
import { InputTypeEnum } from 'common/enums/inputTypeEnum';
import { INPUT_DATA_MAP } from 'common/map/INPUT_DATA_MAP';
import { OptionsInput } from './components/OptionsInput';
import { useEditOptions } from './hooks/useEditOptions';
import { useDataTable } from 'context/DatatableContext'; 
import './EditOptions.css';
import { PropertyEnum } from 'common/enums/PropertyEnum';
import { AttributeEnum } from 'common/enums/AttributeEnum';
import useThemeMode from 'hooks/useThemeMode';
import { DARK_COLOR } from 'context/Tenantbootstrap';

export const EditOptions = ({ }) => {
    const { modal } = useDataTable();  
    const { isDark } = useThemeMode();  
    const [changedMap, setChangedMap] = useState<{ [key: string]: boolean }>({});
    const { 
        columns, 
        formik, 
        openDefault, 
        toggleDefault, 
        setOpenDefault 
    } = useEditOptions(modal.table?.id);

    return (
        <div>
            <Label htmlFor="foreignTablesId" className="form-label">
                Seçenekler
            </Label>
            {columns?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3">
                    Sütun bulunamadı! Seçenekleri görmek için sütun ekleyin.
                </Alert>
            )} 
            <Form className="tablelist-form" 
                style={{ height: "29.5rem" }}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}>
                <div className='hide-scrollbar h-100' style={{ overflow: "scroll", height: "29.5rem" }}>
                    <Accordion id="default-accordion-example" open={openDefault} toggle={toggleDefault}>
                        {(columns ?? []).map((col, index) => {
                            const allowedProperties = INPUT_UI_MAP[col.type as InputTypeEnum] ?? [];
                            const allowedAttributes = INPUT_DATA_MAP[col.type as InputTypeEnum] ?? [];

                            return (
                                <AccordionItem key={col.id + "-" + index} className={openDefault == col?.id.toString() ? "border border-primary" : ""}>
                                    <AccordionHeader targetId={String(col.id)} onDoubleClick={() => setOpenDefault('')}>
                                        <span className="text-uppercase">{col?.name}</span>
                                        <span className="badge bg-primary ms-2">{col?.type}</span>
                                        <span className="badge bg-light text-muted border ms-2">
                                            {INPUT_UI_MAP[col.type]?.length ?? 0} prop /{" "}
                                            {INPUT_DATA_MAP[col.type]?.length ?? 0} öznitelik
                                        </span>
                                    </AccordionHeader>
                                    <AccordionBody accordionId={String(col.id)}>
                                        <Row>
                                            <Col md={6} className="mt-1" style={{ maxHeight: "16rem" }}>
                                                {allowedProperties.length > 0 &&
                                                    <div className="hide-scrollbar" style={{ maxHeight: "9rem", width: "100%", overflow: "scroll" }}>
                                                        {allowedProperties.map((prop: PropertyEnum, i: number) => (
                                                            <OptionsInput
                                                                key={i}
                                                                columnIndex={index}
                                                                propKey={prop}
                                                                scope="data" 
                                                                formik={formik}
                                                                col={col}
                                                                setChangedMap={setChangedMap}
                                                                changedMap={changedMap}
                                                            />
                                                        ))} 
                                                    </div>
                                                }
                                            </Col>
                                            <Col md={6} className="mt-1" style={{ maxHeight: "16rem" }}>
                                                {allowedAttributes.length > 0 &&
                                                    <div className="hide-scrollbar" style={{ maxHeight: "9rem", width: "100%", overflow: "scroll" }}>
                                                        {allowedAttributes.map((prop: AttributeEnum, i: number) => (
                                                            <OptionsInput
                                                                key={i}
                                                                columnIndex={index}
                                                                propKey={prop}
                                                                scope="ui" 
                                                                formik={formik}
                                                                col={col}
                                                                setChangedMap={setChangedMap}
                                                                changedMap={changedMap}
                                                            />
                                                        ))}
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                                    </AccordionBody>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>
                <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top`}
                    style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => modal.setEditSettingModal(false)}
                    >
                        <i className="ri-close-line fs-16 me-2"></i>
                        İptal
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-success"
                    >
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Seçenekleri Kaydet
                    </button>
                </div>
            </Form> 
        </div>
    )
}