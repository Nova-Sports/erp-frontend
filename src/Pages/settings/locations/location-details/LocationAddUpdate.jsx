import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LocationForm from "../../setttingsTemplate/templateDetails/LocationForm";

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
    <div className="h-full flex flex-col">
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
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg h-full">
          <div>
            <LocationForm
              isUpdateMode={isUpdateMode}
              locationData={locationData}
              refreshFunc={refreshFunc}
              handleBack={handleBack}
              addDataApi={addDataApi}
              updateDataApi={updateDataApi}
            />
          </div>
          <div>Templates</div>
        </div>
      </div>
    </div>
  );
}
