/**
 * AppLogo — renders the app-logo.png image
 *
 * Sizing modes (mutually exclusive, `width` takes priority):
 *   width    - Tailwind width class, e.g. "w-[70%]"; height becomes auto
 *   height   - Tailwind height class, e.g. "h-9" (default when no width)
 *   centered - adds mx-auto + block for horizontal centering
 */
export default function AppLogo({
  height = "h-8",
  width,
  centered = false,
  className = "",
}) {
  const sizeClass = width ? `${width} h-auto` : `${height} w-auto`;
  const centerClass = centered ? "mx-auto block" : "";
  return (
    <img
      src="/app-logo.png"
      alt="SportswearERP"
      className={`object-contain ${sizeClass} ${centerClass} ${className}`}
      draggable={false}
    />
  );
}
