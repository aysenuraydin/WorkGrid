import React from "react";
import SimpleBar from "simplebar-react";
import UpcommingEvents from "../hooks/UpcommingEvents";
import { CalendarEvent } from "../../../common/data/CalendarEvent";

interface UpcomingEventsPanelProps {
    events: CalendarEvent[];
    isLoading: boolean;
}

const UpcomingEventsPanel: React.FC<UpcomingEventsPanelProps> = ({
    events,
    isLoading,
}) => {
    return (
        <div className="">
            <h5 className="mb-1 ">Yaklaşan Etkinlikler</h5>
            <p className="text-muted">Planlanmış etkinlikleri kaçırmayın</p>
            <style>{`
                .responsive-container {
                    max-height: 400px; 
                    overflow-y: auto;  
                    padding: 10px;
                }

                @media (max-width: 768px) {
                    .responsive-container {
                        height: auto !important;
                        max-height: 300px;
                    }
                }
            `}</style>
            <SimpleBar className="pe-2 me-n1 mb-3 responsive-container">
                <div id="upcoming-event-list">
                    {isLoading ? (
                        <p className="text-muted text-center mt-3">Yükleniyor...</p>
                    ) : events.length === 0 ? (
                        <p className="text-muted text-center mt-3">Yaklaşan etkinlik bulunmuyor.</p>
                    ) : (
                        events.map((event, key) => (
                            <React.Fragment key={key}>
                                <UpcommingEvents event={event} />
                            </React.Fragment>
                        ))
                    )}
                </div>
            </SimpleBar>
        </div>
    );
};

export default UpcomingEventsPanel;