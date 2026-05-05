import Button from "@/components/buttons/Button";
import React, { useEffect, useState } from "react";
import UserInfo from "./user-ino/UserInfo";
import UserSmtp from "./user-smtp/UserSmtp";
import { useSearchParams } from "react-router-dom";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";
import { useNotification } from "@/contexts/NotificationContext";
import Spinner from "@/components/spinner/Spinner";

let Tabs = [
  { id: 1, name: "User Info" },
  { id: 2, name: "Smtp" },
];
const activeTabClass = "bg-primary text-white";
const inactiveTabClass = "bg-white !text-gray-600 hover:!text-white";
const commonTabClasses = "rounded-none border border-primary shadow-none";

export default function EmAddUpdate({ setShowAddUpdatePage, refreshFunc }) {
  /* ========================= All States ========================= */
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  const [isUpdateMode, setIsUpdateMode] = useState(
    searchParam.get("user-id") ? true : false,
  );

  const [loading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState(1);

  const [userData, setUserData] = useState(null);

  /*  ========================= All Functions ========================= */

  const getUserById = async () => {
    try {
      setLoading(true);
      const id = searchParam.get("user-id");
      const { data } = await API.get(`/employee/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        setUserData(data.data);
      } else {
        notify(data.message || "Failed to fetch employee data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Employee By Id Error: ", error);
      notify(error.message || "Failed to fetch employee data", "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowAddUpdatePage(false);
    updateParam("user-id", null);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode) {
      getUserById();
    }
  }, [isUpdateMode]);

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
      <Spinner loading={loading} />
      {/*=======================================
          Content Tabs    
      ========================================= */}
      <div className="flex-1">
        {selectedTab === 1 && (
          <UserInfo
            isUpdateMode={isUpdateMode}
            setIsUpdateMode={setIsUpdateMode}
            refreshFunc={refreshFunc}
            handleBack={handleBack}
            userData={userData}
            setUserData={setUserData}
          />
        )}
        {selectedTab === 2 && (
          <UserSmtp
            isUpdateMode={isUpdateMode}
            setIsUpdateMode={setIsUpdateMode}
            handleBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
