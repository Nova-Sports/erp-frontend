import React, { useState } from "react";
import EmployeeManagement from "./employee-management/EmployeeManagement";

let settingsNavItems = [
  {
    id: "employee",
    label: "Employee Management",
  },
  {
    id: "locations",
    label: "Locations",
  },
];

let contentById = {
  employee: <EmployeeManagement />,
};

export default function SettingsLayout() {
  /* ========================= All States ========================= */

  const [selected, setSelected] = useState("employee");

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="h-full flex">
      {/* =============================== Nav ======================================= */}
      <div className="bg-white shadow-lg h-full w-64 px-6 py-2">
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <nav className="flex flex-col gap-2">
          {settingsNavItems?.map((item) => (
            <a
              key={item.id}
              className={`block px-3 py-2 transition-colors duration-100 cursor-pointer rounded-md text-sm font-medium shadow-gray-300 shadow-sm ${
                selected === item.id
                  ? "bg-primary text-white "
                  : "text-gray-700 bg-page"
              }`}
              onClick={() => setSelected(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {/* =============================== Content ======================================= */}
      <div className="flex-1 p-3">{contentById[selected]}</div>
    </div>
  );
}
