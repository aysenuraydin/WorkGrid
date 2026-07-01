import { CalendarEvent } from "common/data/CalendarEvent";
import React, { createContext, useContext, useState } from "react";

interface CalendarContextValue {
    selectedEvent: CalendarEvent | null;
    setSelectedEvent: (event: CalendarEvent | null) => void;
    isModalOpen: boolean;
    isEdit: boolean;
    isReadOnly: boolean;
    openModal: (event?: CalendarEvent, readOnly?: boolean) => void;
    closeModal: () => void;
    switchToEditMode: () => void;
    deleteModalOpen: boolean;
    openDeleteModal: () => void;
    closeDeleteModal: () => void;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const openModal = (event?: CalendarEvent, readOnly: boolean = false) => {
        setSelectedEvent(event ?? null);
        setIsEdit(!!event);
        setIsReadOnly(!!event && readOnly);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setIsEdit(false);
        setIsReadOnly(false);
        setIsModalOpen(false);
    };

    const switchToEditMode = () => {
        setIsReadOnly(false);
    };

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    return (
        <CalendarContext.Provider
            value={{
                selectedEvent,
                setSelectedEvent,
                isModalOpen,
                isEdit,
                isReadOnly,
                openModal,
                closeModal,
                switchToEditMode,
                deleteModalOpen,
                openDeleteModal,
                closeDeleteModal,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendarContext = (): CalendarContextValue => {
    const ctx = useContext(CalendarContext);
    if (!ctx) {
        throw new Error("useCalendarContext must be used within a CalendarProvider");
    }
    return ctx;
};