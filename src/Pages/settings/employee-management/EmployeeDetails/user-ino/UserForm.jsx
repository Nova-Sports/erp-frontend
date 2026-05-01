import Button from "@/components/buttons/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";
import React, { useState } from "react";

function AllowedIps({ ips = [], onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const isValidIp = (ip) => {
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    if (!ipv4.test(ip) && !ipv6.test(ip)) return false;
    if (ipv4.test(ip)) {
      return ip.split(".").every((part) => parseInt(part) <= 255);
    }
    return true;
  };

  const addIp = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!isValidIp(trimmed)) {
      setError("Invalid IP address.");
      return;
    }
    if (ips.includes(trimmed)) {
      setError("IP already added.");
      return;
    }
    onChange([...ips, trimmed]);
    setInputValue("");
    setError("");
  };

  const removeIp = (ip) => {
    onChange(ips.filter((i) => i !== ip));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIp();
    }
  };

  return (
    <div className="w-full">
      <FormLabel>Allowed IPs</FormLabel>
      <div className="flex gap-2">
        <FormInput
          type="text"
          placeholder="e.g. 192.168.1.1"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          appendClasses="!flex-1 !w-full"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addIp}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Add IP
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {ips.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {ips.map((ip) => (
            <li
              key={ip}
              className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
            >
              <span>{ip}</span>
              <button
                type="button"
                onClick={() => removeIp(ip)}
                className="text-gray-400 hover:text-red-500 transition-colors leading-none"
                aria-label={`Remove ${ip}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * User Information Component
    em_firstName
    em_lastName
    em_phone
    em_email
    em_password
    em_timeZone
    em_allowedLocations
    em_defaultLocation
    em_enableSecurity
    em_allowIps
    em_emailSignature
 */

let locations = [
  { id: 1, name: "Location 1" },
  { id: 2, name: "Location 2" },
  { id: 3, name: "Location 3" },
];

export default function UserForm({ isUpdateMode }) {
  /* ========================= All States ========================= */
  const [formData, setFormData] = useState({});

  /*  ========================= All Functions ========================= */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ========================= All UseEffects ========================= */

  return (
    <form className="">
      <div className="border-b-2 flex items-baseline justify-between">
        <h3 className="text-lg font-bold  uppercase tracking-wider text-gray-600   mb-2">
          {isUpdateMode ? "Update User" : "Add User"}
        </h3>
        <Button
          title={isUpdateMode ? "Save User" : "Add User"}
          size="sm"
          variant="outlinePrimary"
        />
      </div>
      <div className="my-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* First Name */}
          <div className="mb-3">
            <FormLabel htmlFor="em_firstName">First Name</FormLabel>
            <FormInput
              id="em_firstName"
              name="em_firstName"
              type="text"
              placeholder="Enter first name"
              value={formData.em_firstName || ""}
              onChange={onChange}
            />
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <FormLabel htmlFor="em_lastName">Last Name</FormLabel>
            <FormInput
              id="em_lastName"
              name="em_lastName"
              type="text"
              value={formData.em_lastName || ""}
              onChange={onChange}
              placeholder="Enter last name"
            />
          </div>
        </div>
        {/* Phone */}
        <div className="mb-3">
          <FormLabel htmlFor="em_phone">Phone</FormLabel>
          <FormInput
            id="em_phone"
            name="em_phone"
            type="text"
            value={formData.em_phone || ""}
            onChange={onChange}
            placeholder="Enter phone number"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <FormLabel htmlFor="em_email">Email</FormLabel>
          <FormInput
            id="em_email"
            name="em_email"
            type="email"
            value={formData.em_email || ""}
            onChange={onChange}
            placeholder="Enter email"
          />
        </div>
        {/* Password */}
        <div className="mb-3">
          <FormLabel htmlFor="em_password">Password</FormLabel>
          <FormInput
            id="em_password"
            name="em_password"
            type="password"
            value={formData.em_password || ""}
            onChange={onChange}
            placeholder="Enter password"
          />
        </div>
        <hr className="my-8" />
        {/* Default Location */}
        <div>
          <FormLabel htmlFor="em_allowedLocations">Allowed Locations</FormLabel>
          <div className="flex-1">
            <Dropdown
              value={formData?.em_allowedLocations || []}
              onChange={(selected) => {
                setFormData((prev) => ({
                  ...prev,
                  em_allowedLocations: selected,
                }));
              }}
              mode="multi"
              placeholder="Pick locations"
              autoCloseOnChange={false}
            >
              <Dropdown.Trigger />
              <Dropdown.Menu floating={true} appendClass={"!w-full"}>
                {locations.map((location) => (
                  <Dropdown.Item
                    key={location.id}
                    value={`${location.id}-${location.name}`}
                  >
                    {location.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <p className="text-xs text-gray-400 mt-1">
              Selected:{" "}
              {formData?.em_allowedLocations?.length
                ? formData.em_allowedLocations
                    .map((loc) => loc.split("-")[1])
                    .join(", ")
                : "none"}
            </p>
          </div>
        </div>

        {/* Allowed IPs */}
        <div className="mb-3 mt-4">
          <AllowedIps
            ips={formData.em_allowIps || []}
            onChange={(ips) =>
              setFormData((prev) => ({ ...prev, em_allowIps: ips }))
            }
          />
        </div>
      </div>
    </form>
  );
}
