import { Mail } from "lucide-react";

// default className
const baseClasses =
  "form-control"; /* from index.css, can be overridden by customClasses prop */

export default function FormInput({
  customClasses = "",
  appendClasses = "",
  type = "text",
  placeholder = "Enter text",
  value = "",
  onChange = () => {},
  disabled = false,
  min = undefined,
  max = undefined,
  regexPattern = undefined,
}) {
  /* ******************** All States ************************* */

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  if (type === "email") {
    return (
      <div className="relative">
        <Mail
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type={type}
          className={`${customClasses ? customClasses : baseClasses} ${appendClasses} pl-10`}
          placeholder={placeholder || "you@company.com"}
          autoComplete="email"
          // className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div>
        <input
          type={type}
          className={`${customClasses ? customClasses : baseClasses} ${appendClasses} hide-input-arrow`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          regexPattern={regexPattern}
          min={min}
          max={max}
        />
      </div>
    );
  }

  return (
    <div>
      <input
        type={type}
        className={`${customClasses ? customClasses : baseClasses} ${appendClasses}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        regexPattern={regexPattern}
      />
    </div>
  );
}
