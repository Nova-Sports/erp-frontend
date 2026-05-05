import Button from "@/components/buttons/Button";
import { ArrowDown01, ArrowUp01 } from "lucide-react";
import React from "react";

export default function MainPermGroup({
  mainGroups,
  activeGroup,
  setActiveGroup,
}) {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {/* Main Group Buttons */}

          {mainGroups &&
            mainGroups.length > 0 &&
            mainGroups.map((group) => (
              <button
                key={group.id}
                className={`px-4 py-0 text-sm font-semibold uppercase transition-colors ${
                  activeGroup === group
                    ? "bg-blue-600 text-white"
                    : "bg-primary-light shadow-md text-gray-600 border-r border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveGroup(group)}
              >
                <div className="flex items-center justify-between gap-3 py-1">
                  <h4 className="m-0">{group.name}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        //   handleSortMainGroupUp(group);
                      }}
                    >
                      <Button
                        title=""
                        size="sm"
                        onClick={() => sortUp(row.id)}
                        appendClasses={`!px-1.5 py-1 ${activeGroup === group ? "bg-white hover:bg-primary-light" : ""}`}
                        afterTitle={() => {
                          return (
                            <ArrowUp01
                              className={`size-4 ${activeGroup === group ? "text-primary" : "text-white"}`}
                            />
                          );
                        }}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortMainGroupDown(group);
                      }}
                    >
                      <Button
                        title=""
                        size="sm"
                        onClick={() => sortDown(row.id)}
                        appendClasses={`!px-1.5 py-1 ${activeGroup === group ? "bg-white hover:bg-primary-light" : ""}`}
                        afterTitle={() => {
                          return (
                            <ArrowDown01
                              className={`size-4 ${activeGroup === group ? "text-primary" : "text-white"}`}
                            />
                          );
                        }}
                      />
                    </button>
                  </div>
                </div>
              </button>
            ))}
        </div>
        <div>
          <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <i className="mdi mdi-plus"></i> Add Main Group
          </button>
        </div>
      </div>
    </div>
  );
}
