import React from 'react'  
import { TableColumn } from "common/data/TableColumn";
import { Datatable } from "common/data/Datatable"; 
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { DataType } from "common/enums/DataType"; 
import { useAddRowItemMethods } from "../hooks/useAddRowItemMethods";
import { useAddRowItem } from "../hooks/useAddRowItem"; 
import { useTableRow } from 'context/TableRowContext';
import { RenderCellInput } from 'pages/Crm/DatatableItem/RenderCellInput';

export const AddRowItem = React.memo(({ table }:{table:Datatable}) => { 
        const { 
            setRows,
            columns, 
            cells:columnCells, 
            fileDataRef,
            fileManagerRefs, 
            deleteCheckbox, 
        } = useTableRow();    

        const {
            formik, 
            foreignRows, 
            handleSubmit, 
            handleChange
        } = useAddRowItem(
            columns[table?.id], 
            table, 
            fileDataRef, 
            fileManagerRefs, 
            setRows
        );

        const {
            setSelectedFile, 
            setSelectedForDeletion, 
            setLoading
        } = useAddRowItemMethods(fileDataRef);
        
    return (
            <>
                <tr    
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            formik.handleSubmit();
                        }
                    }}
                >
                    <td>
                        <input
                            disabled
                            type="checkbox"
                            className="rowCheckBox form-check-input"
                            id={`checkbox-${0}`}
                            name={`checkbox-${0}`}
                            onChange={() => deleteCheckbox()}
                        />
                    </td>
                    <td scope="col">
                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={handleSubmit}
                        >
                            <i className=" ri-add-fill text-primary fs-5"></i>
                        </button>
                    </td>
                    {columns[table?.id]
                    ?.slice()
                    .sort((a:TableColumn, b:TableColumn) => (a.tableOrder ?? 0) - (b.tableOrder ?? 0))
                    ?.map((col:TableColumn) => {
        
                        var displayValue =  formik.values.cells?.[0]?.[col.id];
                        
                        if ( col?.realColumnId != null && col.type.toLowerCase() != InputTypeEnum.ForeignColumn.toLowerCase()) {
                            let raw = formik.values.cells?.[0]?.[col.id];
                            if (!raw) {
                                const bagKolon = columns[table?.id]?.find((c:any) =>
                                    c.realTableId === col.realTableId && c.realColumnId == null
                                );
                                if (bagKolon) {
                                    const bagVal = formik.values.cells?.[0]?.[bagKolon.id];
                                    if (bagVal) raw = bagVal;
                                }
                            }

                            const foreignRowIdList = raw?.split(",") || [];
                            const allForeignRows = foreignRows || {};

                            const labels = foreignRowIdList
                            .map((fId:string) => {
                                const rowCells = allForeignRows[Number(fId)];
                                if (!rowCells) return null;
                                const targetCell = rowCells.find(c => c.columnId === Number(col.realColumnId));
                                return targetCell ? targetCell.value : null;
                            }).filter((val:string) => val !== null);

                            displayValue = labels.length > 0 ? labels.join(", ") : raw;
                        }
                        return( 
                        <td key={col.id} style={{minWidth:"150px"}}>
                            <RenderCellInput
                                value={displayValue}
                                isEditRow={true}
                                rowId={0}
                                columns={columns[table?.id]}
                                col={col}
                                cells={columnCells}
                                formik={formik}
                                modalType={DataType.Create}
                                handleChange={handleChange}
                                fileManagerRefs={fileManagerRefs}
                                table={table}
                                loading={fileDataRef.current.loadings}        
                                setLoading={setLoading}  
                                selectedFile={fileDataRef.current.selectedFiles} 
                                setSelectedFile={setSelectedFile}    
                                selectedForDeletion={fileDataRef.current.deletions}
                                setSelectedForDeletion={setSelectedForDeletion}
                            />
                        </td>)}
                    )}
                    <td className="text-end" style={{width:"40px"}}>
                        <div
                            className="btn btn-sm btn-light"
                            onClick={() => {
                            // const orderData = cellProps.row.original;
                            // onClickDelete(orderData);
                            }}
                        >
                            <i className="ri-delete-bin-5-fill fs-14" style={{color:"#00000050"}}></i>
                        </div>
                    </td>
                    <style>{`
                        .w-100.form-control:hover{
                            border:1px solidvar(--vz-primary) ;
                        }
                    `}</style>
                </tr> 
            </>
    )
} 
);










