import { useParams } from "react-router-dom";  
import { DataTableItemProvider } from "context/DatatableItemContext";
import { CreateOrUpdatePage } from "./CreateOrUpdatePage";

export const MainCreateOrUpdatePage = () => { 
    const { id } = useParams<{ id: string }>();  
    return(
        <DataTableItemProvider tableId={Number(id)}>
            <CreateOrUpdatePage/>
        </DataTableItemProvider>
    )
}  


