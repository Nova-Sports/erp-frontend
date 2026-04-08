// default className
const baseClasses =
  "disabled:opacity-60 shadow-md shadow-gray-400/60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors";

// Sizes
const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
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
    <div>
      <button
        type={type}
        className={`${customClasses ? customClasses : baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${appendClasses}`}
        onClick={onClick}
        disabled={disabled}
      >
        {beforeTitle()}
        {title}
        {afterTitle()}
      </button>
    </div>
  );
}
