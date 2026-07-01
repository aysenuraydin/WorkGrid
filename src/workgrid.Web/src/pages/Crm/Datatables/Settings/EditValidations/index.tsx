import { getEnumValues } from 'helpers/enumHelper';
import { Alert, Col, Form, Input, Label, Row } from 'reactstrap';  
import 'react-toastify/dist/ReactToastify.css';
import { InputType } from 'reactstrap/types/lib/Input'; 
import { ValidationRuleEnum } from 'common/enums/ValidationRuleEnum';
import { FieldTypeEnum } from 'common/enums/FieldTypeEnum';
import { TableColumn } from 'common/data/TableColumn';
import { RULE_CONFIG } from 'common/config/RULE_CONFIG'; 
import { useValidationUtils } from './hooks/useValidationUtils';
import { useValidationForm } from './hooks/useValidationForm';
import { dateTypes } from 'common/data/dateTypes';
import { useDataTable } from 'context/DatatableContext';
import { RulesValidationConfig } from 'common/config/RulesValidationConfig';
import { InputTypeEnum } from 'common/enums/inputTypeEnum';
import useThemeMode from 'hooks/useThemeMode';
import { DARK_COLOR } from 'context/Tenantbootstrap';
import { useGetTenantConfig } from 'hooks/useTenant';

export type ValidationRuleForm = {
    rule: ValidationRuleEnum | "";
    isActive: boolean;
    value: string;
    message: string;
};

export type ColumnValidationForm = {
    type: FieldTypeEnum;
    rules: ValidationRuleForm[];
    newRule: ValidationRuleForm;
};

export type FormValues = {
    columns: {
        id: number;
        validationFk: ColumnValidationForm;
    }[];
}; 

export const EditValidations = () => {
    const { data: tenantConfig } = useGetTenantConfig();
    const { modal } = useDataTable();    
    const { isDark } = useThemeMode();   
    const { 
        columns, 
        formik, 
        changedMap, 
        handleRuleChange, 
        setChangedMap, 
        handleValueChange, 
        handleChange 
    } = useValidationForm(modal.table);

    const { 
        getFilteredNewRuleTypes, 
        getInputTypeByRule 
    } = useValidationUtils();
    
    return (
        <div>
            <Label htmlFor="foreignTablesId" className="form-label">
                Doğrulamalar
            </Label>
            {columns?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3">
                    Sütun bulunamadı! Doğrulamaları görmek için önce sütun ekleyin.
                </Alert>
            )} 
            <Form className="tablelist-form hide-scrollbar" 
                style={{ overflow: "scroll", height: "32.5rem" }}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}>
                <div className='pb-5'> 
                    {(columns ?? []).map((col: TableColumn, index: number) => {
                        const name = `columns.${index}.validationFk`;
                        const validationFk = formik.values.columns[index]?.validationFk;
                        const allowedRules = (getEnumValues(ValidationRuleEnum) as ValidationRuleEnum[]);
                        const newRuleConfig = RULE_CONFIG[validationFk?.newRule.rule as ValidationRuleEnum] 
                                            ?? { hasValue: true, hasMessage: true }; 

                        return(
                        <div key={col.id} className={`p-3 px-4 mb-3 shadow bg-${isDark ? "soft-" : ""}light `}
                        style={{ borderRadius: "8px" }}>
                            <div> 
                                <span className='text-black ms-1 text-uppercase'>{col.name} </span>
                                - <span> {col.type}</span>  
                            </div>
                            <div className='d-flex gap-2 mt-2'>  
                                <div className='col-12'> 
                                    <Input type="hidden" name={`${name}.type`} 
                                           value={validationFk?.type === FieldTypeEnum.text ? "string" : validationFk?.type} />
                                    
                                    {validationFk?.rules?.map((r: RulesValidationConfig, ruleIndex: number) => {
                                        const config = RULE_CONFIG[r.rule as ValidationRuleEnum] ?? { hasValue: true, hasMessage: true };
                                        const nameValue = `${name}.rules.${ruleIndex}`;
                                        const isDeletable = getFilteredNewRuleTypes(col.type).includes(r.rule ?? "");
                                        const isDisabled = dateTypes.some((type: InputTypeEnum) => type.toLowerCase() === col.type.toLowerCase()) && 
                                                            (r.rule === ValidationRuleEnum.min || r.rule === ValidationRuleEnum.max);

                                        return( 
                                        <Row key={ruleIndex} className="g-2 mb-3 align-items-center">
                                            <Col md={2}>
                                                <Input type="select" name={`${nameValue}.rule`} disabled={!isDeletable} value={r.rule ?? ""}
                                                    className={`${changedMap[`${nameValue}.rule`] ? "bg-primary bg-opacity-10" : ""}`}
                                                    onChange={(e) => {
                                                        handleRuleChange(col.name, nameValue, e.target.value);
                                                        setChangedMap(prev => ({ ...prev, [`${nameValue}.rule`]: true }));
                                                    }}>
                                                    <option value="">Kural Seç...</option>
                                                    {allowedRules?.map(rule => <option key={rule} value={rule}>{rule}</option>)}
                                                </Input>
                                            </Col>

                                            <Col md={2}>
                                                <Input type={getInputTypeByRule(r.rule ?? "", col.type) as InputType} placeholder="Değer"
                                                    name={`${nameValue}.value`} value={r.value || ""}
                                                    className={`${changedMap[`${nameValue}.value`] ? "bg-primary bg-opacity-10" : ""}`}
                                                    onChange={(e) => {
                                                        handleValueChange(col.name, nameValue, e.target.value);
                                                        setChangedMap(prev => ({ ...prev, [`${nameValue}.value`]: true }));
                                                    }}
                                                    disabled={!config.hasValue || !isDeletable} />
                                            </Col>

                                            <Col md={8} className='d-flex gap-2'>
                                                <Input type="text" placeholder="Hata Mesajı" name={`${nameValue}.message`} value={r.message || ""}
                                                    className={`${changedMap[`${nameValue}.message`] ? "bg-primary bg-opacity-10" : ""}`}
                                                    onChange={handleChange} disabled={!config.hasMessage} />
                                                <Input type="checkbox" className="form-check-input mt-2" name={`${nameValue}.isActive`} checked={!!r.isActive}  
                                                    disabled={isDisabled}
                                                    onChange={(e) => { 
                                                        formik.setFieldValue(`${nameValue}.isActive`, e.target.checked);
                                                        setChangedMap(prev => ({ ...prev, [`${nameValue}.isActive`]: true }));
                                                    }}
                                                    style={{ 
                                                        cursor: 'pointer', width: '20px', height: '20px', margin: "7px", 
                                                        accentColor: "var(--vz-primary)"
                                                    }} />
                                                <button type="button" className={`btn btn-soft-danger ${isDeletable ? "" : "invisible"} btn-sm my-1`}
                                                    style={{ width: "30px" }}
                                                    onClick={() => {
                                                        const rules = [...validationFk?.rules];
                                                        rules.splice(ruleIndex, 1);
                                                        formik.setFieldValue(`${name}.rules`, rules);
                                                    }}>
                                                    <i className="ri-close-fill fs-6"></i>
                                                </button>
                                            </Col>
                                        </Row>
                                        )
                                    })}

                                    <Row className="g-2 mb-2 align-items-center">
                                        <Col md={2}>
                                            <Input type="select" name={`${name}.newRule.rule`} value={validationFk?.newRule?.rule ?? ""}
                                                onChange={(e) => handleRuleChange(col.name, `${name}.newRule`, e.target.value)}>
                                                <option value="">Kural Ekle...</option>
                                                { [ ...getFilteredNewRuleTypes(col.type) ]?.map(rule => <option key={rule} value={rule}>{rule}</option>)}
                                            </Input>
                                        </Col>
                                        <Col md={2}>
                                            <Input type={getInputTypeByRule(validationFk?.newRule?.rule ?? "", col.type) as InputType}
                                                placeholder="Değer" value={newRuleConfig.hasValue ? validationFk?.newRule?.value ?? "" : ""}
                                                name={`${name}.newRule.value`} disabled={!newRuleConfig.hasValue}
                                                onChange={(e) => handleValueChange(col.name, `${name}.newRule`, e.target.value)} />
                                        </Col>
                                        <Col md={8} className="d-flex gap-2">
                                            <Input type="text" placeholder="Hata Mesajı" name={`${name}.newRule.message`} 
                                                value={newRuleConfig.hasMessage ? validationFk?.newRule?.message ?? "" : ""}
                                                onChange={handleChange} disabled={!newRuleConfig.hasMessage} />  
                                            <button type="button" className="btn btn-soft-primary btn-sm my-1" style={{ width: "30px" }}
                                                onClick={() => { 
                                                    const newRule = validationFk.newRule;
                                                    if (!newRule.rule) return;
                                                    formik.setFieldValue(`${name}.rules`, [...validationFk.rules, { ...newRule }]);
                                                    formik.setFieldValue(`${name}.newRule`, { rule: "", value: "", message: "" }); 
                                                }}>
                                                <i className="ri-add-line fs-6"></i>
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
                
                <div className="hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top"
                    style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                    <button type="button" className="btn btn-light" onClick={() => modal.setEditSettingModal(false)}>
                        <i className="ri-close-line fs-16 me-2"></i> İptal
                    </button>
                    <button type="submit" className="btn btn-success">
                        <i className="ri-save-3-fill fs-16 me-2"></i> Doğrulamaları Kaydet
                    </button>
                </div> 
            </Form>
        </div>
    );
};