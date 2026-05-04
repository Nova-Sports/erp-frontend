import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function TemplateAddUpdate({
  setShowAddUpdatePage,
  refreshFunc,
  getDataByIdApi,
  addDataApi,
  updateDataApi,
}) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  const [isUpdateMode, setIsUpdateMode] = useState(
    searchParam.get("template-id") ? true : false,
  );

  const [selectedTab, setSelectedTab] = useState(1);

  const [templateData, setTemplateData] = useState(null);

  /*  ========================= All Functions ========================= */

  const getTemplateById = async () => {
    try {
      const id = searchParam.get("template-id");
      const { data } = await API.get(`${getDataByIdApi}/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        setTemplateData(data.data);
      } else {
        notify(data.message || "Failed to fetch template data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Template By Id Error: ", error);
      notify(error.message || "Failed to fetch template data", "error", 3000);
    }
  };

  const handleBack = () => {
    setShowAddUpdatePage(false);
    updateParam("template-id", null);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode) {
      getTemplateById();
    }
  }, [isUpdateMode]);

  return (
    <div className="h-full flex flex-col">
      {/*=======================================
               Template Tabs    
           ========================================= */}
      <div
        className={`mb-3 hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
      >
        <div>
          <div className="hidden lg:flex items-center border border-primary rounded">
            Add Update Page
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
      <div className="flex-1"></div>
    </div>
  );
}
