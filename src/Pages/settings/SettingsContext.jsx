import { createContext, useContext } from "react";
import { useState } from "react";

const SettingsContext = createContext();

// Context Helper Function to use the context in child components
export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider",
    );
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  /* ========================= All States ========================= */
  const [selected, setSelected] = useState("employee");

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  let exportedValue = {
    selected,
    setSelected,
  };

  return (
    <SettingsContext.Provider value={exportedValue}>
      {children}
    </SettingsContext.Provider>
  );
};
