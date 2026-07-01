import React from "react";
import { Col, FormFeedback, Input, Label, Row, FormGroup } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { FormikProps } from "formik";
import { EventFormValues } from "../../../common/data/CalendarEvent";
import { EVENT_CLASS_OPTIONS } from "../../../common/data/constans";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";
import useThemeMode from "hooks/useThemeMode";

interface EventFormProps {
    validation: FormikProps<EventFormValues>;
    isReadOnly: boolean;
    isEdit: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ validation, isReadOnly, isEdit }) => {
    const hidden = isEdit && isReadOnly;
    const { user: usr } = useAuth();  
    const { isDark } = useThemeMode(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

    return (
        <Row className="event-form">
            {/* ── Kategori ────────────────────────────────────────── */}
            <Col xs={12}>
                <div className="mb-3">
                    <Label className="form-label">Etkinlik Türü</Label>
                    <Input
                        className={hidden ? "form-select d-none" : "form-select d-block"}
                        name="category"
                        id="event-category"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category}
                    >
                        {EVENT_CLASS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Input>
                    {validation.touched.category && validation.errors.category ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.category}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Etkinlik Adı ────────────────────────────────────── */}
            <Col xs={12}>
                <div className="mb-3">
                    <Label className="form-label">Etkinlik Adı</Label>
                    <Input
                        className={hidden ? "d-none" : "d-block"}
                        placeholder="Etkinlik adını girin"
                        type="text"
                        name="title"
                        id="event-title"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.title}
                    />
                    {validation.touched.title && validation.errors.title ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.title}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Etkinlik Tarihi ──────────────────────────────────── */}
            <Col xs={12}>
                <div className="mb-3">
                    <Label>Etkinlik Tarihi</Label>
                    <div className={hidden ? "input-group d-none" : "input-group"}>
                        <Flatpickr
                            className="form-control"
                            id="event-start-date"
                            name="defaultDate"
                            placeholder="Tarih seçin"
                            value={validation.values.defaultDate}
                            options={{ mode: "range", dateFormat: "Y-m-d" }}
                            onChange={(dates: Date[]) => {
                                validation.setFieldValue("defaultDate", dates);
                            }}
                        />
                        <span className="input-group-text">
                            <i className="ri-calendar-event-line"></i>
                        </span>
                    </div>
                    {validation.touched.defaultDate && validation.errors.defaultDate ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.defaultDate as string}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Başlangıç Saati ─────────────────────────────────── */}
            <Col xs={6}>
                <div className="mb-3">
                    <Label>Başlangıç Saati</Label>
                    <div className={hidden ? "input-group d-none" : "input-group"}>
                        <Flatpickr
                            className="form-control"
                            name="startTime"
                            value={validation.values.startTime}
                            onChange={(dates: Date[]) => {
                                if (dates[0]) {
                                    const h = String(dates[0].getHours()).padStart(2, "0");
                                    const m = String(dates[0].getMinutes()).padStart(2, "0");
                                    validation.setFieldValue("startTime", `${h}:${m}`);
                                }
                            }}
                            options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                            }}
                        />
                        <span className="input-group-text">
                            <i className="ri-time-line"></i>
                        </span>
                    </div>
                    {validation.touched.startTime && validation.errors.startTime ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.startTime}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Bitiş Saati ──────────────────────────────────────── */}
            <Col xs={6}>
                <div className="mb-3">
                    <Label>Bitiş Saati</Label>
                    <div className={hidden ? "input-group d-none" : "input-group"}>
                        <Flatpickr
                            className="form-control"
                            name="endTime"
                            value={validation.values.endTime}
                            onChange={(dates: Date[]) => {
                                if (dates[0]) {
                                    const h = String(dates[0].getHours()).padStart(2, "0");
                                    const m = String(dates[0].getMinutes()).padStart(2, "0");
                                    validation.setFieldValue("endTime", `${h}:${m}`);
                                }
                            }}
                            options={{
                                enableTime: true,
                                noCalendar: true,
                                dateFormat: "H:i",
                                time_24hr: true,
                            }}
                        />
                        <span className="input-group-text">
                            <i className="ri-time-line"></i>
                        </span>
                    </div>
                    {validation.touched.endTime && validation.errors.endTime ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.endTime}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Konum ────────────────────────────────────────────── */}
            <Col xs={12}>
                <div className="mb-3">
                    <Label htmlFor="event-location">Konum</Label>
                    <Input
                        type="text"
                        className={hidden ? "d-none" : "d-block"}
                        name="location"
                        id="event-location"
                        placeholder="Konum belirtin"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.location}
                    />
                    {validation.touched.location && validation.errors.location ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.location}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Açıklama ────────────────────────────────────────── */}
            <Col xs={12}>
                <div className="mb-3">
                    <Label className="form-label">Açıklama</Label>
                    <textarea
                        className={hidden ? "form-control d-none" : "form-control d-block"}
                        id="event-description"
                        name="description"
                        placeholder="Etkinlik hakkında açıklama girin"
                        rows={3}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description}
                    />
                    {validation.touched.description && validation.errors.description ? (
                        <FormFeedback type="invalid" className="d-block">
                            {validation.errors.description}
                        </FormFeedback>
                    ) : null}
                </div>
            </Col>

            {/* ── Gizlilik Şalteri ────────────────────────────────── */}
            {isAdmin && !hidden && (
                <Col xs={12}>
                    <FormGroup switch className={`mb-3 p-2 border rounded d-flex align-items-center justify-content-between bg-${isDark ? "dark" : "light"}`}>
                        <div className="ms-2">
                            <Label for="isPublicSwitch" className="mb-0 fw-semibold text-dark cursor-pointer">
                                {validation.values.isPublic ? "📢 Herkese Açık Etkinlik" : "🔒 Kişisel Etkinlik"}
                            </Label>
                            <span className="d-block text-muted" style={{ fontSize: "11px" }}>
                                {validation.values.isPublic 
                                    ? "Bu etkinlik ortak takvimde tüm ekip tarafından görüntülenebilir." 
                                    : "Bu etkinlik tamamen size özeldir, sizden başka kimse göremez."}
                            </span>
                        </div>
                        <Input
                            type="switch"
                            id="isPublicSwitch"
                            name="isPublic"
                            className="me-2 cursor-pointer"
                            style={{ width: "45px", height: "22px" }}
                            checked={validation.values.isPublic}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                validation.setFieldValue("isPublic", e.target.checked)
                            }
                        />
                    </FormGroup>
                </Col>
            )}
        </Row>
    );
};

export default EventForm;