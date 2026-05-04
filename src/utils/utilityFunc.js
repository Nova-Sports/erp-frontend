export function truncateString(str, maxLength) {
  if (typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function parseJsonSafe(jsonString) {
  try {
    if (typeof jsonString !== "string") {
      return jsonString;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // or you can return an empty object {} depending on your needs
  }
}
