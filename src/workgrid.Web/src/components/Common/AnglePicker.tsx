import React, { useCallback, useEffect, useRef, useState } from "react";

interface AnglePickerProps {
    value: number;
    onChange: (angle: number) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

function clamp(v: number): number {
    return Math.round(((v % 360) + 360) % 360);
}

function pointToAngle(cx: number, cy: number, px: number, py: number): number {
    const deg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90;
    return clamp(deg);
}

export const AnglePicker: React.FC<AnglePickerProps> = ({
    value,
    onChange,
    label = "Açı",
    disabled = false,
    className = "",
}) => {
    const dialRef  = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const [inputVal, setInputVal] = useState(String(value));

    useEffect(() => {
        if (!dragging.current) setInputVal(String(clamp(value)));
    }, [value]);

    const getAngle = useCallback((e: MouseEvent | TouchEvent) => {
        const rect = dialRef.current!.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const ex = "touches" in e ? e.touches[0].clientX : e.clientX;
        const ey = "touches" in e ? e.touches[0].clientY : e.clientY;
        return pointToAngle(cx, cy, ex, ey);
    }, []);

    const onDialDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        e.preventDefault();
        dragging.current = true;
        const move = (ev: MouseEvent | TouchEvent) => {
            const a = getAngle(ev);
            setInputVal(String(a));
            onChange(a);
        };
        const up = () => {
            dragging.current = false;
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", up);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        window.addEventListener("touchmove", move, { passive: false });
        window.addEventListener("touchend", up);
    }, [disabled, getAngle, onChange]);

    const commit = () => {
        const v = clamp(parseInt(inputVal, 10) || 0);
        setInputVal(String(v));
        onChange(v);
    };

    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commit();
        if (e.key === "ArrowUp")   { e.preventDefault(); const n = clamp(value + 1); onChange(n); setInputVal(String(n)); }
        if (e.key === "ArrowDown") { e.preventDefault(); const n = clamp(value - 1); onChange(n); setInputVal(String(n)); }
    };

    const SIZE = 28, R = SIZE / 2;
    const rad  = ((value - 90) * Math.PI) / 180;
    const dx   = R + R * 0.58 * Math.cos(rad);
    const dy   = R + R * 0.58 * Math.sin(rad);

    return (
        <div className={`d-inline-flex align-items-center gap-2 ${className}`} style={{ userSelect: "none" }}>
            {/* Dial */}
            <div
                ref={dialRef}
                onMouseDown={onDialDown}
                onTouchStart={onDialDown}
                title={`${value}°`}
                style={{
                    width: SIZE, height: SIZE,
                    borderRadius: "50%",
                    background: "var(--vz-secondary-bg, #e9ebec)",
                    border: "1.5px solid var(--vz-border-color, #ced4da)",
                    cursor: disabled ? "not-allowed" : "grab",
                    flexShrink: 0,
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ display: "block", pointerEvents: "none" }}>
                    <line x1={R} y1={R} x2={dx} y2={dy}
                        stroke="var(--vz-primary, #4f46e5)"
                        strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={dx} cy={dy} r="3"
                        fill="var(--vz-primary, #4f46e5)" />
                </svg>
            </div>

            {/* Input */}
            <div className="input-group input-group-sm" style={{ width: 88 }}>
                <input
                    type="number" min={0} max={359}
                    value={inputVal}
                    disabled={disabled}
                    onChange={e => setInputVal(e.target.value)}
                    onBlur={commit}
                    onKeyDown={onKey}
                    className="form-control text-end"
                    style={{ fontSize: "0.8rem" }}
                />
                <span className="input-group-text" style={{ fontSize: "0.8rem", padding: "0 8px" }}>°</span>
            </div>

            {label && (
                <span style={{ fontSize: "0.75rem", color: "var(--vz-secondary-color, #878a99)" }}>
                    {/* {label} */}
                </span>
            )}
        </div>
    );
};

export default AnglePicker;