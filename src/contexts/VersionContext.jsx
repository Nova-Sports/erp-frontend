import { createContext, useContext } from "react";

const VersionContext = createContext({});

export const VersionProvider = ({ children }) => {
  /* *************  States  **************** */
  let version = "Version : 0.0.1";

  const versionValues = {
    version,
  };

  return <VersionContext value={versionValues}>{children}</VersionContext>;
};

export default function useVersion() {
  return useContext(VersionContext);
}
