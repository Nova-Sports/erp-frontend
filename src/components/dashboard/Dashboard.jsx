import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import { useSidebarContext } from "./sidebar/SidebarContext";
import TopBar from "./TopBar";

export default function Dashboard() {
  /* ========================= All States ========================= */
  const { mode, setMode, toggle } = useSidebarContext();

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

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

      <div className="flex flex-col h-screen flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={toggle} />
        <main className="flex-1 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
