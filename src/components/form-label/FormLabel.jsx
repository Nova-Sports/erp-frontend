import React from "react";

export default function FormLabel({ htmlFor, children }) {
  return (
    <label
      className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
