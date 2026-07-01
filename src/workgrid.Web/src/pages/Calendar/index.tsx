import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Col,
    Container,
    Form,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "reactstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import trLocale from "@fullcalendar/core/locales/tr";
import DeleteModal from "components/Common/DeleteModal";
import BreadCrumb from "components/Common/BreadCrumb";

import { CalendarProvider, useCalendarContext } from "../../context/CalendarContext";
import { useCalendarEvents } from "../../hooks/useCalendar";

import { useCalendarForm } from "./hooks/useCalendarForm";
import { useCalendarHandlers } from "./hooks/useCalendarHandlers";
import { CALENDAR_CATEGORIES } from "../../common/data/constans";

import CategoryPanel from "./components/CategoryPanel";
import UpcomingEventsPanel from "./components/UpcomingEventsPanel";
import CalendarWelcomeCard from "./components/CalendarWelcomeCard";
import EventDetailView from "./components/EventDetailView";
import EventForm from "./components/EventForm";

import { useUserProfile } from "hooks/useUser";
import { useAuth } from "context/AuthContext"; 
import { useGetBrand } from "hooks/useBrand";

// ─── İç bileşen ─────────────────────────────────────────────────────────────

const CalendarInner = () => {  
    const { data:brand } = useGetBrand();
    document.title = "Calendar | " +(brand?.companyName || "Workgrid");

    const {
        selectedEvent,
        isModalOpen,
        isEdit,
        isReadOnly,
        openModal,
        closeModal,
        switchToEditMode,
        deleteModalOpen,
        openDeleteModal,
        closeDeleteModal,
    } = useCalendarContext();

    const { data: events = [], isLoading } = useCalendarEvents();

    const { validation, isCreating, isUpdating } = useCalendarForm({
        selectedEvent,
        isEdit,
        onSuccess: closeModal,
    }); 

    const {
        handleDateClick,
        handleEventClick,
        handleEventDrop,
        handleExternalDrop,
        handleDeleteEvent,
        handleDragCategory,
        isDeleting,
    } = useCalendarHandlers({ validation });

    const { user: usr } = useAuth(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModalOpen}
                onDeleteClick={handleDeleteEvent}
                onCloseClick={closeDeleteModal}
            />

            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Takvim" pageTitle={brand?.companyName || "Workgrid"} />
                    <Row>
                        <Col xs={12}>
                            <Row>
                                {/* ── Sol Panel ─────────────────────────────── */}
                                <Col xl={3}> 
                                    <CategoryPanel
                                        categories={CALENDAR_CATEGORIES}
                                        onCreateClick={() => {
                                            validation.resetForm();
                                            openModal();
                                        }}
                                        onDrag={handleDragCategory}
                                    />

                                    <UpcomingEventsPanel
                                        events={events}
                                        isLoading={isLoading}
                                    />

                                    <CalendarWelcomeCard />
                                </Col>

                                {/* ── Takvim ────────────────────────────────── */}
                                <Col xl={9}>
                                    <div className="card card-h-100">
                                        <div className="card-body">
                                            {isLoading ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Yükleniyor...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <FullCalendar
                                                    locale={trLocale}
                                                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin, listPlugin, multiMonthPlugin]}
                                                    initialView="dayGridMonth"
                                                    slotDuration="00:15:00"
                                                    handleWindowResize={true}
                                                    themeSystem="bootstrap"
                                                    headerToolbar={{
                                                        left: "prev,next today",
                                                        center: "title",
                                                        right: "multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                                                    }}
                                                    events={events.map((e:any) => ({
                                                        id: e.id,
                                                        title: e.title,
                                                        start: e.start,
                                                        end: e.end,
                                                        className: e.className,
                                                        extendedProps: {
                                                            location: e.location,
                                                            description: e.description,
                                                            isPublic: e.isPublic,
                                                            userId: e.userId,
                                                        },
                                                    }))}
                                                    editable={true}
                                                    droppable={true}
                                                    selectable={true}
                                                    dateClick={handleDateClick}
                                                    eventClick={handleEventClick}
                                                    eventDrop={handleEventDrop}
                                                    drop={handleExternalDrop}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div style={{ clear: "both" }} />

                            {/* ── Modal ─────────────────────────────────────── */}
                            <Modal isOpen={isModalOpen} id="event-modal" centered>
                                <ModalHeader
                                    toggle={closeModal}
                                    tag="h5"
                                    className={`p-3 ${isEdit ? (selectedEvent?.className ?? "") : ""} modal-title`}
                                >
                                    {isEdit
                                        ? (selectedEvent?.title ?? "Etkinlik Detayı")
                                        : "Etkinlik Ekle"}
                                </ModalHeader>
                                <ModalBody>
                                    <Form
                                        className={isEdit && isReadOnly ? "needs-validation view-event" : "needs-validation"}
                                        name="event-form"
                                        id="form-event"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                        }}
                                    >
                                        <EventDetailView selectedEvent={selectedEvent} />
                                        <EventForm
                                            validation={validation}
                                            isReadOnly={isReadOnly}
                                            isEdit={isEdit}
                                        />

                                        {/* ── Alt butonlar ────────────────────── */}
                                        <div className="hstack gap-2 justify-content-end">
                                        {((selectedEvent?.isPublic && isAdmin) || !selectedEvent?.isPublic) && (
                                            <>
                                            {isEdit && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-soft-danger"
                                                    id="btn-delete-event"
                                                    disabled={isDeleting}
                                                    onClick={() => openDeleteModal()}
                                                >
                                                    <i className="ri-close-line align-bottom" />{" "}
                                                    {isDeleting ? "Siliniyor..." : "Sil"}
                                                </button>
                                            )}
                                            {isEdit && isReadOnly && (
                                                <Link
                                                    to="#"
                                                    className="btn btn-sm btn-soft-primary"
                                                    id="edit-event-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        switchToEditMode();
                                                    }}
                                                >
                                                    <i className="ri-pencil-fill align-bottom" />{" "}
                                                    Düzenle
                                                </Link>
                                            )}

                                            {(!isReadOnly || !isEdit) && (
                                                <button
                                                    type="submit"
                                                    className="btn btn-sm btn-soft-success"
                                                    id="btn-save-event"
                                                    disabled={isCreating || isUpdating}
                                                >
                                                    <i className="ri-pencil-fill align-bottom" />{" "}
                                                    {isCreating || isUpdating
                                                        ? "Kaydediliyor..."
                                                        : isEdit
                                                        ? "Etkinliği Güncelle"
                                                        : "Etkinliği Ekle"}
                                                </button>
                                            )}
                                            </>
                                        )}
                                        </div>
                                    </Form>
                                </ModalBody>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

// ─── Export ──────────────────────────────────────────────────────────────────

const Calendar = () => (
    <CalendarProvider>
        <CalendarInner />
    </CalendarProvider>
);

export default Calendar;