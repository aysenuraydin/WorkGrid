
import {  Container} from "reactstrap";
import { ToastContainer } from "react-toastify";
import BreadCrumb from "components/Common/BreadCrumb";
import { KanbanProvider } from "context/KanbanContext";
import { ToDoListView } from "./ToDoListView"; 
import { useGetBrand } from "hooks/useBrand";
import { ProjectProvider } from "context/ProjectContext";

export const ToDoList = () => {
    const { data:brand } = useGetBrand();
    return (
            <KanbanProvider>
                <ProjectProvider>
                    <div className="page-content">
                        <Container fluid>
                            <BreadCrumb title="Yapılacaklar" pageTitle={brand?.companyName || "Workgrid"} />
                            <ToDoListView />
                        </Container>
                    </div>
                    <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
                </ProjectProvider>
            </KanbanProvider>
        );
};
export default ToDoList;
