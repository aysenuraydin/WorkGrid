import React from "react";
import { Card, CardBody } from "reactstrap";

function UpcommingEvents(props) {

  // 24 saat formatı, dakika her zaman 2 hane (09:05 gibi)
  const getTime = (params) => {
    const d = new Date(params);
    if (isNaN(d.getTime())) return null;
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return hour + ":" + minute;
  };

  const str_dt = function formatDate(date) {
    const monthNames = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];
    var d = new Date(date),
      month = "" + monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (day.length < 2) day = "0" + day;
    return day + " " + month + " " + year;
  };

  const category = props.event.className.split("-");
  var endUpdatedDay = "";
  var updatedDay;
  if (props.event.end) {
    endUpdatedDay = new Date(props.event.end);
    updatedDay = endUpdatedDay.setDate(endUpdatedDay.getDate() - 1);
  }

  const st_date = props.event.start ? str_dt(props.event.start) : null;
  const ed_date = updatedDay ? str_dt(updatedDay) : null;

  // Başlangıç tarihi (Türkçe ay)
  var startDate = props.event.start ? str_dt(props.event.start) : null;

  // Bitiş tarihi — başlangıçla aynıysa gösterme
  var e_dt = ed_date && ed_date !== st_date ? ed_date : null;
  var end_dt = e_dt ? " — " + e_dt : "";

  // Saatler — 24 saat
  var e_time_s = getTime(props.event.start);
  var e_time_e = updatedDay ? getTime(updatedDay) : null;

  if (e_time_s === e_time_e) {
    e_time_s = "Tüm gün";
    e_time_e = null;
  }
  e_time_e = e_time_e ? " — " + e_time_e : "";

  return (
    <Card className="mb-3">
      <CardBody>
        <div className="d-flex mb-3">
          <div className="flex-grow-1">
            <i
            className={"mdi mdi-checkbox-blank-circle me-2 text-info"}
            ></i>
            <span className="fw-medium">
              {startDate} {end_dt}
            </span>
          </div>
          <div className="flex-shrink-0">
            <small
              className="badge bg-primary-subtle text-primary ms-auto text-wrap"
              style={{
                maxWidth: "80px",
                wordBreak: "break-word",
                whiteSpace: "normal"
              }}
            >
              {e_time_s} {e_time_e}
            </small>
          </div>
        </div>
        <h6 className="card-title fs-16">{props.event.title}</h6>
        <p className="text-muted text-truncate-two-lines mb-0">
        {props.event.description === "N.A." ? "" : props.event.description}
        </p>
      </CardBody>
    </Card>
  );
}

export default UpcommingEvents;