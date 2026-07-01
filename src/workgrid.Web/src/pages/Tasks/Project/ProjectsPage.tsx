import React from "react";
import {Container} from "reactstrap";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BreadCrumb from "components/Common/BreadCrumb";
import { ProjectProvider } from "../../../context/ProjectContext";"Services/kanbanApi";
import { ProjectsContent } from "./ProjectsContent"; 
import { useGetBrand } from "hooks/useBrand";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });

export const ProjectsPage: React.FC = () => {
  const { data:brand } = useGetBrand();
  document.title = "Projeler | " +(brand?.companyName || "Workgrid");
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <div className="page-content border">
          <Container fluid>
            <BreadCrumb title="Projeler" pageTitle={brand?.companyName || "Workgrid"} />
            <ProjectsContent />
          </Container>
        </div>
        <style>{`
          .card:has(.show) {
            z-index: 999 !important;
          }
        `}</style>
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
      </ProjectProvider>
    </QueryClientProvider>
  );
};

export default ProjectsPage;