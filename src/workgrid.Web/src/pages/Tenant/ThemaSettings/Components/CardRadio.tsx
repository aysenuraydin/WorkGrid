import React from "react";

interface CardRadioProps {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
    preview: React.ReactNode;
    dark?: boolean;
}

export const CardRadio: React.FC<CardRadioProps> = ({
    id,
    name,
    value,
    checked,
    onChange,
    label,
    preview,
    dark = false,
}) => (
    <div className="col-3 p-2">
        <div className={`form-check card-radio${dark ? " dark" : ""}${checked ? " border-primary" : ""}`}>
            <input
                className="form-check-input"
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={(e) => {
                    if (e.target.checked) onChange(e.target.value);
                }}
            />
            <label
                className={`form-check-label p-0 avatar-md w-100${dark ? " bg-dark" : ""}`}
                htmlFor={id}
            >
                {preview}
            </label>
        </div>
        <h5 className='fs-13 text-center mt-2 text-muted'>{label}</h5>
    </div>
);