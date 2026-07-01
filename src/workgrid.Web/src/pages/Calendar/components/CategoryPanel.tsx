import React, { useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import { Draggable } from "@fullcalendar/interaction";
import { CalendarCategory } from "../../../common/data/CalendarEvent";

interface CategoryPanelProps {
    categories: CalendarCategory[];
    onCreateClick: () => void;
    onDrag: (e: React.DragEvent) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({
    categories,
    onCreateClick,
    onDrag,
}) => {
    useEffect(() => {
        const el = document.getElementById("external-events");
        if (el) {
            new Draggable(el, {
                itemSelector: ".external-event",
                eventData: (eventEl) => ({
                    title: eventEl.innerText,
                    className: eventEl.className,
                }),
            });
        }
    }, []);

    return (
        <Card className="card-h-100">
            <CardBody>
                <button
                    className="btn btn-primary w-100"
                    id="btn-new-event"
                    onClick={onCreateClick}
                >
                    <i className="mdi mdi-plus"></i> Yeni Etkinlik Oluştur
                </button>

                <div id="external-events">
                    <br />
                    <p className="text-muted">
                        Etkinliğinizi sürükleyip bırakın veya takvime tıklayın
                    </p>
                    {categories.map((category) => (
                        <div
                            className={`bg-${category.type}-subtle external-event fc-event text-${category.type}`}
                            key={"cat-" + category.id}
                            draggable
                            onDrag={onDrag}
                        >
                            <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                            {category.title}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default CategoryPanel;