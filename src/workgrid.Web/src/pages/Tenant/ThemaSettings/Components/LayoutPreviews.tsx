import React from "react";

export const PVVertical = ({
    topbarDark = false,
    sidebarDark = false,
    sidebarGradient = false,
}: {
    topbarDark?: boolean;
    sidebarDark?: boolean;
    sidebarGradient?: boolean;
}) => (
    <span className="d-flex gap-1 h-100">
        <span className="flex-shrink-0">
            <span
                className={`${
                    sidebarDark
                        ? "bg-primary"
                        : sidebarGradient
                        ? "bg-vertical-gradient"
                        : "bg-light"
                } d-flex h-100 flex-column gap-1 p-1`}
            >
                <span
                    className={`d-block p-1 px-2 rounded mb-2 ${
                        sidebarDark || sidebarGradient
                            ? "bg-white bg-opacity-10"
                            : "bg-primary-subtle"
                    }`}
                />
                <span
                    className={`d-block p-1 px-2 pb-0 ${
                        sidebarDark || sidebarGradient
                            ? "bg-white bg-opacity-10"
                            : "bg-primary-subtle"
                    }`}
                />
                <span
                    className={`d-block p-1 px-2 pb-0 ${
                        sidebarDark || sidebarGradient
                            ? "bg-white bg-opacity-10"
                            : "bg-primary-subtle"
                    }`}
                />
                <span
                    className={`d-block p-1 px-2 pb-0 ${
                        sidebarDark || sidebarGradient
                            ? "bg-white bg-opacity-10"
                            : "bg-primary-subtle"
                    }`}
                />
            </span>
        </span>
        <span className="flex-grow-1">
            <span className="d-flex h-100 flex-column">
                <span className={`${topbarDark ? "bg-primary" : "bg-light"} d-block p-1`} />
                <span className="bg-light d-block p-1 mt-auto" />
            </span>
        </span>
    </span>
);

export const PVHorizontal = () => (
    <span className="d-flex h-100 flex-column gap-1">
        <span className="bg-light d-flex p-1 gap-1 align-items-center">
            <span className="d-block p-1 bg-primary-subtle rounded me-1" />
            <span className="d-block p-1 pb-0 px-2 bg-primary-subtle ms-auto" />
            <span className="d-block p-1 pb-0 px-2 bg-primary-subtle" />
        </span>
        <span className="bg-light d-block p-1" />
        <span className="bg-light d-block p-1 mt-auto" />
    </span>
);

export const PVSemiBox = () => (
    <span className="d-flex gap-1 h-100">
        <span className="flex-shrink-0 p-1">
            <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
                <span className="d-block p-1 px-2 bg-primary-subtle rounded mb-2" />
                <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
                <span className="d-block p-1 px-2 pb-0 bg-primary-subtle" />
            </span>
        </span>
        <span className="flex-grow-1">
            <span className="d-flex h-100 flex-column pt-1 pe-2">
                <span className="bg-light d-block p-1" />
                <span className="bg-light d-block p-1 mt-auto" />
            </span>
        </span>
    </span>
);

export const PVDark = () => (
    <span className="d-flex gap-1 h-100">
        <span className="flex-shrink-0">
            <span className="bg-white bg-opacity-10 d-flex h-100 flex-column gap-1 p-1">
                <span className="d-block p-1 px-2 bg-white bg-opacity-10 rounded mb-2" />
                <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
                <span className="d-block p-1 px-2 pb-0 bg-white bg-opacity-10" />
            </span>
        </span>
        <span className="flex-grow-1">
            <span className="d-flex h-100 flex-column">
                <span className="bg-white bg-opacity-10 d-block p-1" />
                <span className="bg-white bg-opacity-10 d-block p-1 mt-auto" />
            </span>
        </span>
    </span>
);

export const PVCompact = () => (
    <span className="d-flex gap-1 h-100">
        <span className="flex-shrink-0">
            <span className="bg-light d-flex h-100 flex-column gap-1 p-1">
                <span className="d-block p-1 bg-primary-subtle rounded mb-2" />
                <span className="d-block p-1 pb-0 bg-primary-subtle" />
                <span className="d-block p-1 pb-0 bg-primary-subtle" />
            </span>
        </span>
        <span className="flex-grow-1">
            <span className="d-flex h-100 flex-column">
                <span className="bg-light d-block p-1" />
                <span className="bg-light d-block p-1 mt-auto" />
            </span>
        </span>
    </span>
);

export const PVPreloader = () => (
    <div style={{ position: "relative" }}>
        <PVVertical />
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ position: "absolute", inset: 0 }}
        >
            <div className="spinner-border text-primary avatar-xxs" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
);