import { Datatable } from "common/data/Datatable";
import { ModalDesign } from "common/data/ModalDesign";
import { TableCell } from "common/data/TableCell";
import { TableColumn } from "common/data/TableColumn";
import { DataType } from "common/enums/DataType";
import { getColHeight } from "common/utils/getColHeight";
import { FormikProps } from "formik/dist/types";
import { RenderCellInput } from "../../RenderCellInput";
export interface RenderInputProps {
    value: string | number | boolean | null | undefined;
    columns: TableColumn[];
    col: TableColumn;
    rowId: number;
    cells: { [columnId: number]: TableCell[] };
    formik: FormikProps<any>;  
    modalType: DataType;
    handleChange: (value: any, colId: number, rowId: number, _cellId: number, relatedCols?: any[] | undefined, rowsString?: string | undefined) => void
    table:  Datatable;
    fileManagerRefs: React.MutableRefObject<{ [key: string]: any }>;
    loading: { [key: string]: boolean[] };
    setLoading: (update: any) => void;
    selectedFile: { [key: string]: File[] };
    setSelectedFile: (update: any) => void;
    selectedForDeletion: { [key: string]: string[] };
    setSelectedForDeletion: (update: any) => void;
    modal?: ModalDesign | undefined;  
    isEditRow?: boolean;
}
export const RenderInput = (props: RenderInputProps) => { 
    const { modal,value } = props;
    const inputHeight = getColHeight(props?.col?.type);

    return (
        <div key={props.col.id} className={`col-${modal?.width} px-1 py-1`}>
            <div className={`position-relative d-flex rounded position-relative px-2 ${!modal?.isVisible ? 'd-none' : ''}`} 
            style={{
                minHeight:(modal?.spaceTop??0 + ( modal?.spaceBottom ?? 0 + inputHeight )+"px")
                }}> 

                <div className={`col-${modal?.spaceLeft}`}></div>
                <div className={`col-${12-((modal?.spaceLeft??0)+(modal?.spaceRight??0))} position-relative`}>
                    <div style={{height:modal?.spaceTop}}></div>
                    <div style={{minHeight: inputHeight+"px"}}>
                        <RenderCellInput
                            {...props}
                            value={value} 
                        />
                    </div>
                    <div style={{height:modal?.spaceBottom}}></div>
                </div>
                <div className={`col-${modal?.spaceRight}`}></div> 
            </div>
        </div>
    );
}
