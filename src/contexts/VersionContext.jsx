import { createContext, useContext } from "react";

const VersionContext = createContext({});

export const VersionProvider = ({ children }) => {
  /* *************  States  **************** */
  let version = "Version : 0.0.1";

  const versionValues = {
    version,
  };

  return (
    <VersionContext.Provider value={versionValues}>
      {children}
    </VersionContext.Provider>
  );
};

export default function useVersion() {
  return useContext(VersionContext);
}
