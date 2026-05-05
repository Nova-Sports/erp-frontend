import Button from "@/components/buttons/Button";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTemplateApiPayloadList } from "./LocationEmailTemplateFields";
import LocationEmailTemplates from "./LocationEmailTemplates";
import LocationForm from "./LocationForm";

export default function LocationAddUpdate({
  setShowAddUpdatePage,
  refreshFunc,
  getDataByIdApi,
  addDataApi,
  updateDataApi,
  RenderFilterTabs,
}) {
  const [searchParam] = useSearchParams();
  const updateParam = useUpdateParams();
  const { notify } = useNotification();

  let isUpdateMode = searchParam.get("location-id") ? true : false;

  const [locationData, setLocationData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    pdfLogo: "",
  });
  const [templateFormData, setTemplateFormData] = useState(() =>
    getTemplateApiPayloadList({}),
  );

  /*  ========================= All Functions ========================= */

  const getLocationById = async () => {
    try {
      const id = searchParam.get("location-id");

      if (!id) {
        notify("Invalid location ID", "error", 3000);
        return;
      }

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

  const handleSubmit = async (_prevState, _e) => {
    try {
      let response;
      if (isUpdateMode) {
        response = await updateLocation();
      } else {
        response = await addLocation();
      }

      if (response.success) {
        notify(
          isUpdateMode
            ? "Location updated successfully"
            : "Location added successfully",
          "success",
          3000,
        );
        updateParam("location-id", response.data.id);
        if (refreshFunc) refreshFunc();

        // if (handleBack) handleBack();
        return { error: null };
      } else {
        notify(response.message || "An error occurred", "error", 3000);
        return { error: response.message || "An error occurred" };
      }
    } catch (err) {
      notify(err.message, "error", 3000);
      return { error: err.message };
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  const addLocation = async () => {
    try {
      const { data } = await API.post(
        addDataApi,
        {
          formData,
          templateFormData: templateFormData,
        },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateLocation = async () => {
    try {
      const { data } = await API.patch(
        updateDataApi,
        { formData, templateFormData, id: locationData.id },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode) {
      getLocationById();
    }
  }, [isUpdateMode]);

  return (
    <div className="flex flex-col overflow-y-hidden  ">
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
        <div className="flex items-center gap-2">
          <Button
            title="Save"
            variant="success"
            appendClasses="py-1.5"
            size="sm"
            onClick={handleSubmit}
          />

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
      <div className="bg-white p-4 lg:p-6 max-md:m-3 rounded-lg grid grid-cols-1 lg:grid-cols-5 gap-5 h-[84svh] lg:h-[86svh] overflow-y-auto">
        <form
          autoComplete="off"
          action={formAction}
          noValidate
          className="lg:col-span-2"
        >
          <LocationForm
            isUpdateMode={isUpdateMode}
            locationData={locationData}
            formData={formData}
            state={state}
            setFormData={setFormData}
          />
        </form>
        <div className="flex-1 flex flex-col lg:col-span-3">
          <LocationEmailTemplates
            isUpdateMode={isUpdateMode}
            templateFormData={templateFormData}
            setTemplateFormData={setTemplateFormData}
          />
        </div>
      </div>
      <div className="lg:hidden flex justify-between items-center px-3 h-full gap-3">
        <div className="bg-white shadow-sm py-2 rounded-lg flex-1 px-3 flex items-center justify-between">
          <div className="flex items-center justify-between gap-2 w-full">
            <Button
              title="Save"
              variant="success"
              appendClasses="py-1.5"
              size="sm"
              onClick={handleSubmit}
            />

            <Button
              onClick={handleBack}
              size="sm"
              title="Back"
              variant="outlineDanger"
            />
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg w-fit">
          <RenderFilterTabs />
        </div>
      </div>
    </div>
  );
}
