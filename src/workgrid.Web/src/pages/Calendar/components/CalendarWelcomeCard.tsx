import React from "react";
import { Card, CardBody } from "reactstrap";
import FeatherIcon from "feather-icons-react";

const CalendarWelcomeCard: React.FC = () => {
    return (
        <Card>
            <CardBody className="bg-info-subtle">
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <FeatherIcon
                            icon="calendar"
                            className="text-info icon-dual-info"
                        />
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="fs-15">Takviminize Hoş Geldiniz!</h6>
                        <p className="text-muted mb-0">
                            Uygulamalar üzerinden oluşturulan etkinlikler burada görüntülenecektir. 
                            Detayları görüntülemek ve etkinlik yönetimi yapmak için bir etkinliğe tıklayabilirsiniz.
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default CalendarWelcomeCard;