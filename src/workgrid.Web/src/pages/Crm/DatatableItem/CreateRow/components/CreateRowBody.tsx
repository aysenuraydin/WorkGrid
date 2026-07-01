import { useMemo } from "react";
import { ModalBody, Alert } from "reactstrap";
import Loader from "components/Common/Loader";
import { TableColumn } from "common/data/TableColumn"; 
import { ModalSizeType } from "common/enums/ModalSizeType";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { RenderInput } from "./RenderInput"; 
import { useDataTableItem } from "context/DatatableItemContext";  

interface CreateRowBodyProps { 
    formik: any; 
    handleChange: (value: any, colId: number, rowId: number, _cellId: number, relatedCols?: any[] | undefined, rowsString?: string | undefined) => void;   
}

export const CreateRowBody = ({ 
    formik, 
    handleChange,  
}: CreateRowBodyProps) => {
    const{   
        cells,
        columns, 
        table,    
        modalType,  
        loading, setLoading,
        selectedFile, setSelectedFile,
        selectedForDeletion, setSelectedForDeletion,
        fileManagerRefs, 
        foreignRows,
        sortedCols,  
        isFullModal, 
        isTableRowLoading,  
        effectiveRowId,
        modalSize
    } = useDataTableItem();
    
    return (
        <ModalBody
            className="hide-scroll"
            style={{
                height: table?.modalHeight ? table?.modalHeight + 30 : undefined,
                maxHeight: isFullModal ? "88vh" : "70vh",
                minHeight: modalSize == ModalSizeType.Blank.toLocaleLowerCase() ? "64vh" : undefined,
                overflow: "scroll",
            }}
        >
            <div className="hide-scrollbar d-flex flex-wrap align-content-start">
                {isTableRowLoading && <div className="pt-4"> <Loader isText={true} /> </div>}
                {sortedCols?.map((col: TableColumn) => {
                    const modal = col.modalDesignFk;
                    let displayValue = formik.values.cells?.[effectiveRowId]?.[col.id] ?? "";

                    if (col?.realColumnId != null && col?.type.toLowerCase() !== InputTypeEnum.ForeignColumn.toLowerCase()) {
                        const foreignRowIdList = formik.values.cells?.[effectiveRowId]?.[col.id]?.toString().split(",") || [];

                        const labels = foreignRowIdList
                            .map((fId: any) => {
                                const rowCells = foreignRows[fId];
                                if (!rowCells) return null;
                                const targetCell = rowCells.find((c: any) => c.columnId === Number(col.realColumnId));
                                return targetCell ? targetCell.value : null;
                            })
                            .filter((val: any) => val !== null);

                        displayValue = labels.length > 0
                            ? labels.join(", ")
                            : formik.values.cells?.[effectiveRowId]?.[col.id];
                    }

                    return (
                        <RenderInput
                            key={`input-${effectiveRowId}-${col.id}`}
                            value={displayValue}
                            columns={columns}
                            modal={modal}
                            rowId={effectiveRowId}
                            col={col}
                            cells={cells}
                            formik={formik}
                            modalType={modalType}
                            handleChange={handleChange}
                            fileManagerRefs={fileManagerRefs}
                            table={table!}
                            loading={loading}
                            setLoading={setLoading}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            selectedForDeletion={selectedForDeletion}
                            setSelectedForDeletion={setSelectedForDeletion}
                        />
                    );
                })}
            </div>
            {!sortedCols?.length && (
                <Alert color="danger" isOpen={true} className="p-3 my-3">
                    Kolonlar bulunamadı!
                </Alert>
            )}
        </ModalBody>
    );
};
