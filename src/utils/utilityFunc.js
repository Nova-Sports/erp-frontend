export function truncateString(str, maxLength) {
  if (typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
