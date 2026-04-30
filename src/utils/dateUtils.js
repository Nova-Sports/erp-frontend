export function getDateFromTimeStamp(
  dateTime,
  yearFormat = "2-digit",
  monthFormat = "2-digit",
  dayFormat = "2-digit",
) {
  if (!dateTime) return "---";
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "---";
  const options = {
    year: yearFormat,
    month: monthFormat,
    day: dayFormat,
    // Use user's local timezone
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  return date.toLocaleDateString("en-US", options);
}

export function getTimeFromTimeStamp(
  dateTime,
  hourFormat = "2-digit",
  minuteFormat = "2-digit",
  secondFormat = "2-digit",
) {
  if (!dateTime) return "---";
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "---";
  const options = {
    hour: hourFormat,
    minute: minuteFormat,
    // second: secondFormat,
    hour12: true,
    // Use user's local timezone
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  return date.toLocaleTimeString("en-US", options);
}

export function getDateTimeFromTimeStamp(dateTime, separator = " ") {
  const datePart = getDateFromTimeStamp(dateTime);
  const timePart = getTimeFromTimeStamp(dateTime);
  if (datePart === "---" || timePart === "---") return "---";
  return `${datePart}${separator}${timePart}`;
}
