import { DataTableItemProvider } from "context/DatatableItemContext";
import { DatatableItem } from "./components/DatatableItem";
import { useParams } from "react-router-dom";
import { TableFeatureGuard } from "../../../Routes/TableFeatureGuard";
    
export const MainDatatableItem = () => {
    const { id } = useParams<{ id: string }>();
    const tableId = Number(id);
 
    return (
        <DataTableItemProvider tableId={tableId}>
            <TableFeatureGuard tableId={tableId}>
                <DatatableItem />
            </TableFeatureGuard>
        </DataTableItemProvider>
    );
};
 