import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import TopBar from "./TopBar";
import { useSidebarContext } from "./sidebar/SidebarContext";

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

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={toggle} />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
