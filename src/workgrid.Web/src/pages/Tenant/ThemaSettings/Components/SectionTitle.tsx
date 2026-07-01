import React from "react";

export const SectionTitle = ({
    icon,
    title,
    subtitle,
}: {
    icon: string;
    title: string;
    subtitle?: string;
}) => (
    <div className="mb-4 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
            <div
                className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                style={{ 
                    width: 32, 
                    height: 32, 
                    backgroundColor: "var(--vz-primary)"  
                }}
            >
                <i className={`${icon} fs-16 text-white`} />
            </div>
            <div>
                <h5 className="mb-0 fs-14 fw-semibold">{title}</h5>
                {subtitle && <p className="mb-0 fs-12 text-muted">{subtitle}</p>}
            </div>
        </div>
    </div>
);
export const SubHead = ({ title }: { title: string }) => (
    <h6 className="text-uppercase fw-semibold text-muted fs-11 mb-3 mt-4">{title}</h6>
);