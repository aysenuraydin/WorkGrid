import moment from "moment";
import React from "react";

export const getPopoverContent = (row: any) => {

    const handleValidDate = (date: any) => date 
        ? moment.utc(date).local().format("DD.MM.YYYY") 
        : null;

    const handleValidTime = (date: any) => date 
        ? moment.utc(date).local().format("HH:mm") 
        : null;
    
    if (row?.deletedAt) {
        return (
        <div style={{ fontSize: "13px", color: "#d9534f" }}> 
            <p className="mb-1">
            <strong>Silinme Tarihi:</strong>{" "}
            {handleValidDate(row.deletedAt)},
            <small className="text-muted"> {handleValidTime(row.deletedAt)}</small>
            </p>
            <p className="mb-0">
            <strong>Silen:</strong> {row?.deletedBy ?? "..."}
            </p>
        </div>
        );
    }

    const fields = [
        { label: "Eklenme", dateKey: "createdAt", userKey: "createdBy", action: "Ekleyen" },
        ...(row?.lastModifiedAt ? [{ 
            label: "Güncelleme", 
            dateKey: "lastModifiedAt", 
            userKey: "lastModifiedBy", 
            action: "Güncelleyen" 
        }] : []),
    ];

    return (
        <div style={{ fontSize: "13px", color: "#5c3b99" }}>
        {fields.map((field, idx) => {
            const dateVal = row?.[field.dateKey];
            const userVal = row?.[field.userKey];

            return (
            <React.Fragment key={idx}>
                <p className="mb-1">
                <strong>{field.label} Tarihi:</strong>{" "}
                {dateVal ? (
                    <>
                    <span className="text-muted"> {handleValidDate(dateVal)},</span>
                    <small className="text-muted"> {handleValidTime(dateVal)}</small>
                    </>
                ) : "..."}
                </p>
                <p className={idx !== fields.length - 1 ? "mb-2" : "mb-0"}>
                <strong>{field.action}:</strong>{" "}
                {userVal ?? "..."}
                </p>
            </React.Fragment>
            );
        })}
        </div>
    );
};