import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useMemo } from "react";  
import { Datatable } from "common/data/Datatable";
import { Card, CardBody, CardHeader, Container, Row } from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { ToastContainer } from "react-toastify";
import { CreateRow } from ".."; 
import { useDataTableItem } from 'context/DatatableItemContext';
import Loader from 'components/Common/Loader'; 
import { useGetBrand } from 'hooks/useBrand';

export const CreateOrUpdatePage = () =>{     
    const { data:brand } = useGetBrand();
    const{       
        pageType, 
        datatable,    
        isTableColumnsLoading,
        tableColumns,
        row,
        effectiveRowId
    } = useDataTableItem(); 
    const table:Datatable = useMemo(() => datatable?.data ?? {} as Datatable, [datatable]); 
    const { data:name } = useGetBrand();
    document.title = (table?.name ?? "Table")+ " | " +(name?.companyName || "Workgrid");


    const isDataMissing = !datatable?.data || !tableColumns?.data;
    const isEditLoading = pageType === "edit" && (!row || effectiveRowId === 0);

    if (isTableColumnsLoading || isDataMissing || isEditLoading) {
        return <div className="pt-4"> <Loader isText={true} /> </div> 
    }
    
    return (
        <div className="page-content" style={{userSelect:"none"}}>
            <Container fluid>
                <BreadCrumb title="Tablo" pageTitle={brand?.companyName || "Workgrid"}/> 
                <Card className="p-1" style={{position:"relative"}}>
                    <CardHeader className="card-header btable-0">
                        <Row className="align-items-center gy-3">
                            <div className="col-sm">
                                <h5 className="card-title mb-0 text-capitalize pt-2">
                                    <span className="text-capitalize">{pageType} </span> 
                                    {table?.name 
                                        ? (table?.name)
                                        : (
                                        <p className="card-text placeholder-glow">
                                            <span className="placeholder col-2"></span>
                                        </p>
                                        )
                                    }
                                </h5>
                            </div>
                        </Row>
                    </CardHeader>
                    <CardBody style={{minHeight:"65vh"}}>
                        <div style={{ userSelect: "none" }}>
                            <CreateRow />
                        </div>
                        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
                    </CardBody>
                </Card>
            </Container> 
        </div>
    )
}


