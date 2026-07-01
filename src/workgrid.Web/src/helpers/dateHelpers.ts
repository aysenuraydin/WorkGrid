import moment from "moment";

export const formatDate = (date: any): string =>
  moment(new Date(date)).format("DD MMM Y");

export const formatTime = (time: any): string => {
  const d = new Date(time);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const meridiem = h >= 12 ? "PM" : "AM";
  return moment(`${h}:${m}`, "hh:mm").format("hh:mm") + " " + meridiem;
};
