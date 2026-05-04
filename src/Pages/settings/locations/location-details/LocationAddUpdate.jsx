import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LocationForm from "./LocationForm";
import LocationEmailTemplateFields from "./LocationEmailTemplateFields";
import LocationEmailTemplates from "./LocationEmailTemplates";

export default function LocationAddUpdate({
  setShowAddUpdatePage,
  refreshFunc,
  getDataByIdApi,
  addDataApi,
  updateDataApi,
}) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  let isUpdateMode = searchParam.get("location-id") ? true : false;

  const [locationData, setLocationData] = useState(null);

  /*  ========================= All Functions ========================= */

  const getLocationById = async () => {
    try {
      const id = searchParam.get("location-id");
      const { data } = await API.get(`${getDataByIdApi}/${id}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        setLocationData(data.data);
      } else {
        notify(data.message || "Failed to fetch location data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Location By Id Error: ", error);
      notify(error.message || "Failed to fetch location data", "error", 3000);
    }
  };

  const handleBack = () => {
    setShowAddUpdatePage(false);
    updateParam("location-id", null);
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode) {
      getLocationById();
    }
  }, [isUpdateMode]);

  return (
    <div className="h-[92svh] flex flex-col overflow-y-auto">
      {/*=======================================
               Location Tabs    
           ========================================= */}
      <div
        className={`mb-3 hidden lg:flex lg:flex-row flex-col items-center  justify-between rounded-xl`}
      >
        <div>
          <div className="hidden lg:flex text-2xl text-gray-500 font-bold ">
            Locations
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
      {/* <div className="grid h-full grid-cols-1 md:grid-cols-5 gap-8 bg-white p-6 rounded-lg"> */}
      <div className="flex-1 flex  gap-8 bg-white p-6 rounded-lg ">
        <div className="lg:w-2/5">
          <LocationForm
            isUpdateMode={isUpdateMode}
            locationData={locationData}
            refreshFunc={refreshFunc}
            handleBack={handleBack}
            addDataApi={addDataApi}
            updateDataApi={updateDataApi}
          />
        </div>
        <div className="flex-1 flex flex-col ">
          <LocationEmailTemplates />
        </div>
      </div>
    </div>
  );
}
