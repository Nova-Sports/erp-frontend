import React, { useState } from "react";
import EmployeeManagement from "./employee-management/EmployeeManagement";
import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsProvider, useSettingsContext } from "./SettingsContext";
import SettingsTemplate from "./settingsTemplate/SettingsTemplate";
import Locations from "./locations/Locations";
import Permissions from "./permissions/Permissions";

let settingsNavItems = [
  {
    id: "employee",
    label: "Employee Management",
  },
  {
    id: "locations",
    label: "Locations",
  },

  {
    id: "permissions",
    label: "Permissions",
  },

  {
    id: "templates",
    label: "Settings Templates",
  },
];

const RenderFilterTabs = ({}) => {
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const { selected, setSelected } = useSettingsContext();

  return (
    <div className="text-nowrap relative ">
      {/* Mobile Version */}
      <div className="lg:hidden flex-center ">
        {/* Horizontal scrollable tabs */}

        <button
          onClick={() => setShowMobileTabs(!showMobileTabs)}
          className="bg-white size-12 flex-center rounded-full "
        >
          <Settings
            size={30}
            className={`${showMobileTabs ? "rotate-45" : ""} transition-transform `}
          />
        </button>
      </div>
      <AnimatePresence>
        {showMobileTabs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{
              opacity: 0,
              y: 20,
              transition: { duration: 0.2 },
            }}
            onClick={(e) => {
              setShowMobileTabs(false);
            }}
            className="lg:hidden absolute  h-64 bottom-14 w-96 right-0 flex items-end  justify-end rounded"
          >
            <div className="bg-white center-box-shadow h-fit flex flex-col z-50 justify-center items-end rounded-md py-4 w-3/5 gap-2 px-4">
              {settingsNavItems?.map((tab) => (
                <button
                  onClick={() => {
                    setSelected(tab.id);
                  }}
                  key={tab.id}
                  className={`${selected === tab.id ? "bg-primary text-white " : "bg-page"} w-full  px-3 py-1 rounded`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DefaultContent = ({ message }) => {
  return (
    <div className="h-full flex flex-col items-center justify-between">
      <div className="flex-1 flex-center">
        <h1 className="text-2xl font-bold">{message}</h1>
      </div>
      <div className="mb-2 w-full flex justify-end pe-3 ">
        <RenderFilterTabs />
      </div>
    </div>
  );
};

let ContentById = () => {
  const { selected, setSelected } = useSettingsContext();

  switch (selected) {
    case "employee":
      return <EmployeeManagement RenderFilterTabs={RenderFilterTabs} />;
    case "locations":
      return <Locations RenderFilterTabs={RenderFilterTabs} />;

    case "permissions":
      return <Permissions RenderFilterTabs={RenderFilterTabs} />;

    case "templates":
      return <SettingsTemplate RenderFilterTabs={RenderFilterTabs} />;
    default:
      return <DefaultContent message={"Select a setting to view details"} />;
  }
};

const SettingsNav = () => {
  const { selected, setSelected } = useSettingsContext();

  return (
    <div className="hidden lg:block bg-white shadow-lg h-full w-64 px-6 py-2">
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
  );
};

export default function SettingsLayout() {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <SettingsProvider>
      <div className="h-full flex">
        {/* =============================== Nav ======================================= */}
        <SettingsNav />
        {/* =============================== Content ======================================= */}
        <div className="flex-1 lg:p-3 lg:pb-1 overflow-x-auto h-full">
          <ContentById />
        </div>
      </div>
    </SettingsProvider>
  );
}
