import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Button from "../buttons/Button";

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
  labelTrue = "Yes",
  labelFalse = "No",
  id = undefined,
}) {
  /* ******************** All States ************************* */

  const [showPassword, setShowPassword] = useState(false);

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  const inputClass = `peer rounded-full outline-none duration-100 after:duration-500 w-14 h-6 bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light  after:content-['${labelFalse}'] after:absolute after:outline-none after:rounded-full after:h-4 after:w-8 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-4 text-xs peer-checked:after:content-['${labelTrue}'] peer-checked:after:border-white`;

  if (type === "checkbox") {
    return (
      <div className="flex items-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            className="sr-only "
            checked={value}
            onChange={onChange}
            disabled={disabled}
            id={id || `checkbox-${value}`}
            type="checkbox"
          />
          <div
            className={`relative rounded-full outline-none duration-100 after:duration-500 w-16 h-6 bg-primary `}
          >
            <div
              className={`absolute outline-none rounded-full h-4 w-fit px-1 bg-white top-1 left-1 flex justify-center items-center text-sky-800 font-bold duration-300 text-xs ${value ? "translate-x-4" : "left-1"}`}
            >
              {value ? labelTrue : labelFalse}
            </div>
          </div>
        </label>
      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="relative">
        <Mail
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type={type}
          className={`w-full ${customClasses ? customClasses : "border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"} ${appendClasses}  pl-10 `}
          placeholder={placeholder || "you@company.com"}
          autoComplete="email"
          value={value}
          onChange={onChange}
          disabled={disabled}
          regexPattern={regexPattern}
          // className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>
    );
  }

  if (type === "password") {
    return (
      <div className="relative">
        <Lock
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full ${customClasses ? customClasses : "border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"} ${appendClasses}  pl-10 pr-10 `}
          placeholder={placeholder || "Enter your password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          regexPattern={regexPattern}
          autoComplete="current-password"

          // className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
        <Button
          type="icon"
          variant="none"
          onClick={() => setShowPassword((p) => !p)}
          customClasses="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          // aria-label={showPassword ? "Hide password" : "Show password"}
          title={() => {
            return showPassword ? <EyeOff size={15} /> : <Eye size={15} />;
          }}
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
