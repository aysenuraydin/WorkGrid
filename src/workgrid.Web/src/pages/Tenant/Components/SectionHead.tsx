import React, { useState, useEffect } from "react";

export const SectionHead = ({
    icon, title, subtitle, action,
}: { icon: string; title: string; subtitle?: string; action?: React.ReactNode }) => (
    <div className="d-flex align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
            <div
                className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                style={{ 
                    width: 36, 
                    height: 36, 
                    backgroundColor: "var(--vz-primary)"  
                }}
            >
                <i className={`${icon} fs-16 text-white`} />
            </div>
            <div>
                <h5 className="mb-0 fs-15 fw-semibold">{title}</h5>
                {subtitle && <p className="mb-0 fs-12 text-muted mt-1">{subtitle}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);