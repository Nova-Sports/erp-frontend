import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const SidebarContext = createContext();

const LG = 1024;
const isMobile = () => window.innerWidth < LG;

// Custom hook for consuming the Sidebar context
export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

// Provider component to wrap the app and provide the Sidebar context
export const SidebarProvider = ({ children }) => {
  // 3 modes: 'expanded' | 'icons' | 'closed'
  // Desktop toggles: expanded ↔ icons
  // Mobile  toggles: expanded ↔ closed
  const [mode, setMode] = useState(() => (isMobile() ? "closed" : "expanded"));

  // On resize: if user shrinks to mobile while in icon mode, collapse
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < LG) {
        setMode((m) => (m === "icons" ? "closed" : m));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggle = () => {
    const mobile = isMobile();
    setMode((m) => {
      if (mobile) return m === "closed" ? "expanded" : "closed";
      return m === "expanded" ? "icons" : "expanded";
    });
  };

  return (
    <SidebarContext value={{ mode, setMode, toggle }}>
      {children}
    </SidebarContext>
  );
};
