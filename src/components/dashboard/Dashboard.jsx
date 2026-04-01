import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const LG = 1024;
const isMobile = () => window.innerWidth < LG;

export default function Dashboard() {
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
    <div className="flex h-screen bg-page overflow-hidden">
      {/* Mobile backdrop — tap to close sidebar */}
      {mode === "expanded" && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMode("closed")}
          aria-hidden="true"
        />
      )}

      <Sidebar mode={mode} onRequestExpand={() => setMode("expanded")} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={toggle} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
