import React, { useState } from "react";
import { RefreshCw, Copy, Shield } from "lucide-react";
import { generatePassword } from "./passwordUtils";
import FormInput from "@/components/form-input/FormInput";

export default function PsGenerator() {
  const [passwordOptions, setPasswordOptions] = useState({
    lower: true,
    upper: true,
    number: true,
    special: true,
    length: 15,
  });

  const [password, setPassword] = useState("");

  const handleToggle = (key) => {
    setPasswordOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGenerate = () => {
    setPassword(generatePassword(passwordOptions.length, passwordOptions));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="max-w-xl mx-auto md:p-4">
      <div className="bg-white rounded-2xl shadow-md border p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Shield className="text-indigo-600" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Password Generator</h2>
            <p className="text-sm text-gray-500">
              Create strong, secure passwords
            </p>
          </div>
        </div>

        {/* Password Output */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-sm truncate">
            {password || "Click generate..."}
          </div>

          <button
            onClick={handleCopy}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <Copy size={18} />
          </button>

          <button
            onClick={handleGenerate}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Length */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Length</span>
            <span className="font-medium">{passwordOptions.length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="50"
            value={passwordOptions.length}
            onChange={(e) =>
              setPasswordOptions((prev) => ({
                ...prev,
                length: Number(e.target.value),
              }))
            }
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Options */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            Include Characters
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "lower", label: "Lowercase", hint: "a,b,c" },
              { key: "upper", label: "Uppercase", hint: "A,B,C" },
              { key: "number", label: "Numbers", hint: "1,2,3" },
              { key: "special", label: "Symbols", hint: "@,!,$" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-gray-200/80 px-3 py-2 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.hint}</p>
                </div>

                <FormInput
                  type="checkbox"
                  value={passwordOptions[item.key]}
                  onChange={() => handleToggle(item.key)}
                />

                {/* <button
                  onClick={() => handleToggle(item.key)}
                  className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
                    passwordOptions[item.key] ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                      passwordOptions[item.key]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button> */}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium"
        >
          Generate Password
        </button>

        {/* Footer Note */}
        <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
          Your password is generated locally and never stored.
        </div>
      </div>
    </div>
  );
}
