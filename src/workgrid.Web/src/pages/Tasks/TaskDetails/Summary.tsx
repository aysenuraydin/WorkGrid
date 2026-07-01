import { Card, CardBody  } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useCard } from 'hooks/useKanban';

export const Summary = () => {
    const { id } = useParams<{ id: string }>(); 
    const { data: card, isLoading } = useCard(id??"");
    
    return (
        <>
            <Card className="border border-2">
                <CardBody>
                    <div className="text-muted">
                        <h6 className="mb-3 fw-semibold text-uppercase">Özet</h6>
                        <p>{card?.text}</p>

                        <div className="pt-3 border-top border-top-dashed mt-4">
                            <h6 className="mb-3 fw-semibold text-uppercase">Görev Etiketleri</h6>
                            <div className="hstack flex-wrap gap-2 fs-15">
                                {(card?.badges || []).map((badge: string, index: number) => (
                                    <div key={index} className="badge fw-medium bg-primary-subtle text-primary">
                                        {badge}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};