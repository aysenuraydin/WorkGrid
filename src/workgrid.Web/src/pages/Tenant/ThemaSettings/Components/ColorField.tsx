import React from "react";
import { FormGroup, Label } from "reactstrap";

interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => (
    <FormGroup className="mb-0">
        <Label className="fs-12 fw-medium text-muted mb-1">{label}</Label>
        <div className="input-group input-group-sm">
            <span
                className="input-group-text p-0 border-end-0"
                style={{ width: 34, overflow: "hidden", position: "relative", cursor: "pointer" }}
            >
                <input
                    type="color"
                    value={value || "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        opacity: 0,
                        position: "absolute",
                        inset: 0,
                        cursor: "pointer",
                        width: "200%",
                        height: "200%",
                    }}
                />
                <span
                    className="d-block w-100 h-100"
                    style={{ background: value, pointerEvents: "none" }}
                />
            </span>
            <input
                type="text"
                className="form-control form-control-sm font-monospace fs-11"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </FormGroup>
);