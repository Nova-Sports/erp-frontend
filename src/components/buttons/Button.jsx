// default className
const baseClasses =
  "disabled:opacity-60 shadow-sm shadow-gray-400/60 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors";

// Sizes
const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3.5 text-base",
};

// variant classes can be added here if needed, e.g. primary, secondary, etc.
const variantClasses = {
  brand: "bg-brand hover:bg-brand-hover text-brand-foreground",
  primary: "bg-primary hover:bg-primary-hover text-primary-foreground",
  secondary: "bg-secondary hover:bg-secondary-hover text-secondary-foreground",
  info: "bg-info hover:bg-info-hover text-info-foreground",
  success: "bg-success hover:bg-success-hover text-success-foreground",
  warning: "bg-warning hover:bg-warning-hover text-warning-foreground",
  danger: "bg-danger hover:bg-danger-hover text-danger-foreground",
  light: "bg-white hover:bg-gray-100 text-gray-800",
  dark: "bg-gray-800 hover:bg-gray-900 text-white",
  none: "",
  // Outline variants
  outlineBrand:
    "border border-brand !text-brand bg-transparent hover:bg-brand hover:!text-white",
  outlinePrimary:
    "border border-primary !text-primary bg-transparent hover:bg-primary hover:!text-white",
  outlineSecondary:
    "border border-secondary !text-secondary bg-transparent hover:bg-secondary hover:!text-white",
  outlineInfo:
    "border border-info !text-info bg-transparent hover:bg-info hover:!text-white",
  outlineSuccess:
    "border border-success !text-success bg-transparent hover:bg-success hover:!text-white",
  outlineWarning:
    "border border-warning !text-warning bg-transparent hover:bg-warning hover:!text-white",
  outlineDanger:
    "border border-danger !text-danger bg-transparent hover:bg-danger hover:!text-white",
  outlineLight:
    "border border-gray-200 !text-gray-800 bg-transparent hover:bg-gray-100",
  outlineDark:
    "border border-gray-800 !text-gray-800 bg-transparent hover:bg-gray-100",
};

export default function Button({
  customClasses = "",
  appendClasses = "",
  size = "md",
  variant = "primary",
  type = "button",
  title = "Button",
  onClick = () => {},
  beforeTitle = () => {},
  afterTitle = () => {},
  disabled = false,
}) {
  /* ******************** All States ************************* */

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  return (
    <button
      type={type === "icon" ? "button" : type}
      className={`${customClasses ? customClasses : baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${appendClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {type === "icon" ? (
        title()
      ) : (
        <div className="flex items-center gap-1.5 justify-center">
          {beforeTitle()}
          {title}
          {afterTitle()}
        </div>
      )}
    </button>
  );
}
