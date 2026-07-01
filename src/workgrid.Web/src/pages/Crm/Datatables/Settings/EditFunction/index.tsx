import { Alert, Form, Label } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { AutoComplete } from 'antd';
import { evalList } from 'common/data/evalList'; 
import { TableColumn } from 'common/data/TableColumn';
import { useEditFunctions } from './hooks/useEditFunctions';
import { useDataTable } from 'context/DatatableContext';  
import { DARK_COLOR } from 'context/Tenantbootstrap';
import useThemeMode from 'hooks/useThemeMode';

export const EditFunction = ({ }) => {
    const { modal } = useDataTable(); 
    const { isDark } = useThemeMode();  
    const {
        openIndex, 
        setOpenIndex, 
        setOptions, 
        isEval, 
        setIsEval, 
        columns, 
        formik, 
        options, 
        handleSearch, 
        handleSelect, 
        changedMap, 
        setChangedMap
    } = useEditFunctions(modal.table?.id);

    return (
        <div>
            <Label htmlFor="foreignTablesId" className="form-label">
                Fonksiyonlar
            </Label>
            {columns?.length === 0 && (
                <Alert color="danger" isOpen={true} className="p-3">
                    Sütun bulunamadı! Fonksiyonları görmek için sütun ekleyin.
                </Alert>
            )} 
            <Form className="tablelist-form" 
                style={{ height: "29.5rem" }}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    formik.handleSubmit();
                }}>
                <div className='hide-scrollbar h-100' style={{ overflow: "scroll", height: "29.5rem" }}>
                    {(columns ?? []).map((col: TableColumn, index: number) => {
                        return (
                            <div key={col.id} className={`p-1 px-3 mb-3 shadow bg-${isDark ? "soft-" : ""}light `}
                                style={{ borderRadius: "8px" }}>
                                <div> 
                                    <span className={`text-${isDark ? 'light' : 'black'} ms-1 text-uppercase`}>{col.name} </span>
                                    - <span> {col.type}</span>
                                </div>
                                <div className="g-2 mb-2 d-flex align-items-center">
                                    <div className='code-view' style={{ width: "100%" }}>
                                        <AutoComplete
                                            open={openIndex === index}
                                            options={options}
                                            placeholder={`${col.name} Fonksiyonunu Girin...`}
                                            value={formik.values.columns[index]?.functionText || ""}
                                            style={{ width: "100%", backgroundColor: isDark ? DARK_COLOR : "", color: isDark ? "#fff" : "" }}
                                            onSearch={(text) => handleSearch(text, index, col.id)}
                                            onSelect={(selected) => handleSelect(selected, index)}
                                            className={`mt-2 p-2 no-focus-ring ${
                                                changedMap[`functionText.${col?.id}`] ? "bg-primary bg-opacity-10" : ""
                                            }`} 
                                            onFocus={() => {
                                                setOpenIndex(index);
                                                const autoList = isEval[col.id]
                                                    ? columns.map(col => ({ value: "@" + col.name }))
                                                    : evalList.map(item => ({ value: item }));
                                                setOptions(autoList);
                                            }}
                                            onBlur={() => {
                                                setOpenIndex(null);
                                            }}
                                            onChange={(value) => {
                                                formik.setFieldValue(`columns[${index}].functionText`, value);
                                                setChangedMap(prev => ({ ...prev, [`functionText.${col.id}`]: true }));
                                            }}
                                        />
                                    </div>
                                    <div 
                                        onClick={() => {
                                            setIsEval(prev => {
                                                const next = !prev[col.id];
                                                const autoList = next
                                                    ? columns.map(col => ({ value: "@" + col.name }))
                                                    : evalList.map(item => ({ value: item }));
                                                setOptions(autoList);
                                                return { ...prev, [col.id]: next };
                                            });
                                        }}
                                        className='fs-16 ps-2'>
                                        <span className={`badge bg-${isDark ? "light" : "primary"}-subtle text-${isDark ? "light" : "primary"} cursor-pointer`}>
                                            {isEval[col.id] 
                                                ? <i className="ri-function-line"></i>
                                                : <i className="ri-functions"></i>
                                            }
                                        </span>
                                    </div>  
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={`hstack gap-2 pt-2 pe-2 position-absolute end-0 start-0 bottom-0 justify-content-end border-top`}
                    style={{ backgroundColor: isDark ? DARK_COLOR : "white" }}>
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => {
                            modal.setEditSettingModal(false);
                        }}
                    >
                        <i className="ri-close-line fs-16 me-2"></i>
                        İptal
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-success"
                    >
                        <i className="ri-save-3-fill fs-16 me-2"></i>
                        Fonksiyonları Kaydet
                    </button>
                </div>
            </Form>
        </div>
    );
};