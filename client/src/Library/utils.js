export function formatMessageTime(time) {
  // TODO: implement the function logic
  return new Date(time).toLocaleTimeString(
    "en-us", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

}