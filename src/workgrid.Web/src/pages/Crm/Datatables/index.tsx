import { DataTableProvider } from "context/DatatableContext";
import { Datatables } from "./components/Datatables";

export const MainDatatables = () => { 
    return (
        <DataTableProvider>
            <Datatables />
        </DataTableProvider>
    );
}







