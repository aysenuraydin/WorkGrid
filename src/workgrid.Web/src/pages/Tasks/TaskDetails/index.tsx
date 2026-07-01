
import BreadCrumb from 'components/Common/BreadCrumb';
import { Container, Col, Row } from 'reactstrap';
import { KanbanProvider} from 'context/KanbanContext';
import { TimeTracking } from './TimeTracking';
import { Summary } from './Summary'; 
import { useGetBrand } from 'hooks/useBrand';
import { CommentList } from 'pages/Comment';
import { CommentItemType } from 'common/data/comment';
import { useParams } from 'react-router-dom'; 

export const TaskDetails = () => {
    const { data:brand } = useGetBrand();
    const { id } = useParams<{ id: string }>(); 
    document.title = "Görev Detayları | " + (brand?.companyName || "Workgrid");
    return (
        <KanbanProvider>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Görev Detayları" pageTitle={brand?.companyName || "Workgrid"} />
                    <Row>
                        <Col xxl={3}>
                            <TimeTracking />
                        </Col>
                        <Col xxl={9}>
                            <Summary />
                            <CommentList itemType={CommentItemType.Task} itemId={id!} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </KanbanProvider>
    );
}; 