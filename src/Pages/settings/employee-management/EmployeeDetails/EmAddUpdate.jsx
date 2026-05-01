import Button from "@/components/buttons/Button";
import React, { useState } from "react";
import UserInfo from "./user-ino/UserInfo";
import UserSmtp from "./user-smtp/UserSmtp";
import { useSearchParams } from "react-router-dom";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";

let Tabs = [
  { id: 1, name: "User Info" },
  { id: 2, name: "Smtp" },
];
const activeTabClass = "bg-primary text-white";
const inactiveTabClass = "bg-white !text-gray-600 hover:!text-white";
const commonTabClasses = "rounded-none border border-primary shadow-none";

export default function EmAddUpdate({ setShowAddUpdatePage }) {
  /* ========================= All States ========================= */
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();

  const [isUpdateMode, setIsUpdateMode] = useState(
    searchParam.get("user-id") ? true : false,
  );

  const [selectedTab, setSelectedTab] = useState(1);

  /*  ========================= All Functions ========================= */

  const handleBack = () => {
    setShowAddUpdatePage(false);
    updateParam("user-id", null);
  };

  /* ========================= All UseEffects ========================= */

  return (
    <div className="h-full flex flex-col">
      {/*=======================================
            User Tabs    
        ========================================= */}
      <div
        className={`mb-3 hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
      >
        <div>
          <div className="hidden lg:flex items-center border border-primary rounded">
            {Tabs.map((tab, index) => (
              <Button
                key={tab.id}
                size="sm"
                title={tab.name}
                appendClasses={`${
                  index === 0
                    ? "rounded-l"
                    : index === Tabs.length - 1
                      ? "rounded-r"
                      : "border-x-0"
                } ${selectedTab === tab.id ? activeTabClass : inactiveTabClass} ${commonTabClasses}`}
                onClick={() => setSelectedTab(tab.id)}
              />
            ))}
          </div>
        </div>
        <div>
          <Button
            onClick={handleBack}
            size="sm"
            title="Back"
            variant="outlineDanger"
          />
        </div>
      </div>
      {/*=======================================
          Content Tabs    
      ========================================= */}
      <div className="flex-1">
        {selectedTab === 1 && <UserInfo isUpdateMode={isUpdateMode} />}
        {selectedTab === 2 && <UserSmtp isUpdateMode={isUpdateMode} />}
      </div>
    </div>
  );
}
