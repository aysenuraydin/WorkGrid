import React from 'react';
import { Col, FormFeedback, Input, Label, Row } from 'reactstrap';
import { IDataTableModalState } from 'components/Common/interfaces/DataTableContextType';
import { DataType } from 'common/enums/DataType';
import { getEnumValues } from 'helpers/enumHelper';
import { ModalSizeType } from 'common/enums/ModalSizeType';
import { TableViewType } from 'common/enums/TableViewType';
import { FormikProps } from 'formik/dist/types';
import { ITableFormValues } from '../hooks/useTableForm';
import { isLockControl } from 'common/data/constans';

export interface UseTableFormReturn {
    modal: IDataTableModalState;
    formik: FormikProps<ITableFormValues>;
    focusMap: Record<string, boolean>;
    changedMap: Record<string, boolean>;
    handleFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const EditTableForm = ({
    modal,
    formik,
    focusMap,
    changedMap,
    handleChange,
    handleFocus,
    handleBlur
}: UseTableFormReturn) => {

    return (
        <>
            <Row className="mb-3">
                <Col>
                    <Label htmlFor="name-field" className="form-label">
                        Tablo Adı
                    </Label>
                    <Input
                        name="name"
                        id="name-field"
                        readOnly={isLockControl(formik.values.name)}
                        className={`
                            w-100 form-control
                            ${focusMap["name"] ? "border-primary shadow-sm" : ""}
                            ${changedMap["name"] ? "bg-primary bg-opacity-10" : ""}
                            ${modal.modalType === DataType.View ? "text-primary" : ""}
                        `}
                        style={modal.modalType === DataType.View ? { border: "none" } : {}}
                        placeholder="Tablo Adı Girin"
                        type="text"
                        validate={{ required: { value: true } }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={modal.modalType === DataType.View}
                        value={formik.values.name || ""}
                        invalid={!!(formik.touched.name && formik.errors.name)}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
                    ) : null}
                </Col>
            </Row>
            <Row>
                <Col className="mb-3 w-100">
                    <Label htmlFor="modalSize-field" className="form-label">
                        Modal Boyutu
                    </Label>
                    <Input
                        name="modalSize"
                        id="modalSize-field"
                        type="select"
                        className={`
                            w-100 form-control
                            ${focusMap["modalSize"] ? "border-primary shadow-sm" : ""}
                            ${changedMap["modalSize"] ? "bg-primary bg-opacity-10" : ""}
                            ${modal.modalType === DataType.View ? "text-primary" : ""}
                        `}
                        style={modal.modalType === DataType.View ? { border: "none" } : {}}
                        validate={{ required: { value: true } }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={formik.values.modalSize || ""}
                        invalid={!!(formik.touched.modalSize && formik.errors.modalSize)}
                        disabled={modal.modalType === DataType.View}
                    >
                        <option value="">Seçiniz...</option>
                        {getEnumValues(ModalSizeType).map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </Input>
                    {formik.touched.modalSize && formik.errors.modalSize ? (
                        <FormFeedback type="invalid">{formik.errors.modalSize}</FormFeedback>
                    ) : null}
                </Col>
                <Col className="mb-3 w-100">
                    <Label htmlFor="viewType-field" className="form-label">
                        Görünüm Tipi
                    </Label>
                    <Input
                        name="viewType"
                        id="viewType-field"
                        type="select"
                        className={`
                            w-100 form-control
                            ${focusMap["viewType"] ? "border-primary shadow-sm" : ""}
                            ${changedMap["viewType"] ? "bg-primary bg-opacity-10" : ""}
                            ${modal.modalType === DataType.View ? "text-primary" : ""}
                        `}
                        style={modal.modalType === DataType.View ? { border: "none" } : {}}
                        validate={{ required: { value: true } }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={formik.values.viewType || ""}
                        invalid={!!(formik.touched.viewType && formik.errors.viewType)}
                        disabled={modal.modalType === DataType.View}
                    >
                        <option value="">Seçiniz...</option>
                        {getEnumValues(TableViewType).map((opt: string) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </Input>
                    {formik.touched.viewType && formik.errors.viewType ? (
                        <FormFeedback type="invalid">{formik.errors.viewType}</FormFeedback>
                    ) : null}
                </Col>
                <Col className="mb-3 w-100">
                    <Label htmlFor="pageSize-field" className="form-label">
                        Sayfa Boyutu
                    </Label>
                    <Input
                        name="pageSize"
                        id="pageSize-field"
                        type="select"
                        className={`
                            w-100 form-control
                            ${focusMap["pageSize"] ? "border-primary shadow-sm" : ""}
                            ${changedMap["pageSize"] ? "bg-primary bg-opacity-10" : ""}
                            ${modal.modalType === DataType.View ? "text-primary" : ""}
                        `}
                        style={modal.modalType === DataType.View ? { border: "none" } : {}}
                        validate={{ required: { value: true } }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        value={formik.values.pageSize || ""}
                        invalid={!!(formik.touched.pageSize && formik.errors.pageSize)}
                        disabled={modal.modalType === DataType.View}
                    >
                        <option value="">Seçiniz...</option>
                        {[5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </Input>
                    {formik.touched.pageSize && formik.errors.pageSize ? (
                        <FormFeedback type="invalid">{formik.errors.pageSize}</FormFeedback>
                    ) : null}
                </Col>
            </Row>
            <style>
                {`
                div.w-100:hover {
                    border: none !important;
                }
                `}
            </style>
        </>
    );
};