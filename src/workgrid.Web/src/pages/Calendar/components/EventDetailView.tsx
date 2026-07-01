import React from "react";
import { CalendarEvent } from "../../../common/data/CalendarEvent";
import { getEventDateTag, getEventEndTimeTag, getEventStartTimeTag } from "common/utils/calendarUtils";

interface EventDetailViewProps {
    selectedEvent: CalendarEvent | null;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ selectedEvent }) => {
    const eventDateTag = getEventDateTag(selectedEvent);
    const eventStartTimeTag = getEventStartTimeTag(selectedEvent);
    const eventEndTimeTag = getEventEndTimeTag(selectedEvent);

    return (
        <div className="event-details">
            <div className="d-flex mb-2">
                <div className="flex-grow-1 d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                        <i className="ri-calendar-event-line text-muted fs-16"></i>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="d-block fw-semibold mb-0" id="event-start-date-tag">
                            {eventDateTag}
                        </h6>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center mb-2">
                <div className="flex-shrink-0 me-3">
                    <i className="ri-time-line text-muted fs-16"></i>
                </div>
                <div className="flex-grow-1">
                    <h6 className="d-block fw-semibold mb-0">
                        <span id="event-timepicker1-tag">{eventStartTimeTag}</span>
                        {eventEndTimeTag && (
                            <>
                                {" "}-{" "}
                                <span id="event-timepicker2-tag">{eventEndTimeTag}</span>
                            </>
                        )}
                    </h6>
                </div>
            </div>

            <div className="d-flex align-items-center mb-2">
                <div className="flex-shrink-0 me-3">
                    <i className="ri-map-pin-line text-muted fs-16"></i>
                </div>
                <div className="flex-grow-1">
                    <h6 className="d-block fw-semibold mb-0">
                        <span id="event-location-tag">
                            {selectedEvent?.location || "No Location"}
                        </span>
                    </h6>
                </div>
            </div>

            <div className="d-flex mb-3">
                <div className="flex-shrink-0 me-3">
                    <i className="ri-discuss-line text-muted fs-16"></i>
                </div>
                <div className="flex-grow-1">
                    <p className="d-block text-muted mb-0" id="event-description-tag">
                        {selectedEvent?.description || "No Description"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventDetailView;