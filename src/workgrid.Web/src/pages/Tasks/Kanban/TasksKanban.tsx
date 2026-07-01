import React from "react";
import { Container } from "reactstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KanbanProvider } from "../../../context/KanbanContext";
import BreadCrumb from "components/Common/BreadCrumb";
import { KanbanPageContent } from "./KanbanPageContent"; 
import { useGetBrand } from "hooks/useBrand";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

export const TaskKanbanboard: React.FC = () => {
  const { data:brand } = useGetBrand();
  document.title = "Kanban Board | " +(brand?.companyName || "Workgrid");
  return (
    <QueryClientProvider client={queryClient}>
      <KanbanProvider>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Kanban Board" pageTitle={brand?.companyName || "Workgrid"} />
            <KanbanPageContent />
          </Container>
        </div>
      </KanbanProvider>
    </QueryClientProvider>
  );
};