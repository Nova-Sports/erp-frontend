import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Button from "../buttons/Button";
import { motion } from "framer-motion";

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
  name = undefined,
  iconStart = null,
  iconEnd = null,
  autoFocus = false,
}) {
  /* ******************** All States ************************* */

  const [showPassword, setShowPassword] = useState(false);

  /* ******************** All Functions ************************* */

  /* ******************** All UseEffects ************************* */

  if (type === "checkbox") {
    return (
      <label className="relative inline-block h-4 w-8 cursor-pointer rounded-full bg-gray-400 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500">
        <input
          className="peer sr-only"
          type="checkbox"
          value=""
          checked={value}
          onChange={onChange}
          id={id || name}
          name={name}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        <span className="absolute -inset-y-[1.5px] start-0 m-1 size-2.5 rounded-full bg-white ring-inset ring-white transition-all peer-checked:start-3.5 peer-checked:bg-white peer-checked:ring-transparent"></span>
      </label>
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
          name={name}
          className={`w-full ${customClasses ? customClasses : "border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"} ${appendClasses}  pl-10 `}
          placeholder={placeholder || "you@company.com"}
          autoComplete="email"
          value={value}
          onChange={onChange}
          disabled={disabled}
          regexPattern={regexPattern}
          id={id}
          autoFocus={autoFocus}
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
          name={name}
          id={id || name}
          autoFocus={autoFocus}

          // className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
        <Button
          type="icon"
          variant="none"
          onClick={() => setShowPassword((p) => !p)}
          customClasses="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        {iconStart && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconStart}
          </div>
        )}
        <input
          type={type}
          className={`${customClasses ? customClasses : baseClasses} ${iconStart && "!pl-9 !pr-3"} ${iconEnd && "!pr-9"} ${appendClasses} hide-input-arrow`}
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={onChange}
          disabled={disabled}
          regexPattern={regexPattern}
          min={min}
          max={max}
          name={name}
          id={id}
        />
        {iconEnd && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {iconEnd}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {iconStart && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {iconStart}
        </div>
      )}
      <input
        type={type}
        className={`${customClasses ? customClasses : baseClasses} ${iconStart && "!pl-9 !pr-3"} ${iconEnd && "!pr-9"} ${appendClasses}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        regexPattern={regexPattern}
        autoFocus={autoFocus}
        name={name}
        id={id}
      />
      {iconEnd && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {iconEnd}
        </div>
      )}
    </div>
  );
}
