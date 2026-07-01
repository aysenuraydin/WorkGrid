import React from "react";
import { SECTIONS } from "./Constanst";

interface SidebarNavProps {
    activeSection: string;
    onScrollTo: (id: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeSection, onScrollTo }) => (
    <div className="card mb-0 flex-shrink-0" style={{ width: 210, position: "sticky", top: 80 }}>
        <div className="card-body p-2">
            <p className="text-uppercase fw-semibold text-muted fs-11 mb-2 px-2">Bölümler</p>
            <nav className="d-flex flex-column gap-1">
                {SECTIONS.map((sec) => {
                    const active = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            type="button"
                            onClick={() => onScrollTo(sec.id)}
                            className={`btn btn-sm text-start d-flex align-items-center gap-2 ${
                                active ? "btn-primary" : "btn-ghost-primary text-muted"
                            }`}
                            style={{ borderRadius: 6 }}
                        >
                            <i className={`${sec.icon} fs-14 flex-shrink-0`} />
                            <span className="fs-12">{sec.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    </div>
);