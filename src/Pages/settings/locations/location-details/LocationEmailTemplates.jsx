import React, { use, useEffect, useState } from "react";
import LocationEmailTemplateFields, {
  getTemplateApiPayloadList,
} from "./LocationEmailTemplateFields";
import Button from "@/components/buttons/Button";
import API from "@/services/axios";
import authHeader from "@/services/auth-header";
import { useNotification } from "@/contexts/NotificationContext";
import { useSearchParams } from "react-router-dom";

export default function LocationEmailTemplates({ isUpdateMode }) {
  const { notify } = useNotification();

  const [searchParam] = useSearchParams();

  /* ========================= All States ========================= */
  const [templateFormData, setTemplateFormData] = useState(() =>
    getTemplateApiPayloadList({}),
  );
  const [dataKey, setDataKey] = useState(0);

  /*  ========================= All Functions ========================= */

  // Get Templates List By Location Id
  const getTemplatesByLocationId = async () => {
    try {
      let locationId = searchParam.get("location-id");
      if (!locationId) {
        notify("Location ID is missing", "error", 3000);
        return;
      }

      const { data } = await API.get(`/location-template/${locationId}`, {
        headers: authHeader(),
      });
      if (data?.success) {
        setTemplateFormData(data.data);
        setDataKey((k) => k + 1);
      } else {
        notify(data.message || "Failed to fetch template data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Templates By Location Id Error: ", error);
      notify(error.message || "Failed to fetch template data", "error", 3000);
    }
  };

  const saveTemplate = async () => {
    try {
      let locationId = searchParam.get("location-id");
      if (!locationId) {
        notify("Location ID is missing", "error", 3000);
        return;
      }

      // Append locationId to each template data
      const payload = templateFormData.map((template) => ({
        ...template,
        locationId: parseInt(locationId),
      }));

      const { data } = await API.post(`/location-template`, payload, {
        headers: authHeader(),
      });
      if (data?.success) {
        notify(data.message || "Template saved successfully", "success", 3000);
        // setLocationData(data.data);
      } else {
        notify(data.message || "Failed to fetch location data", "error", 3000);
      }
    } catch (error) {
      console.log("Get Location By Id Error: ", error);
      notify(error.message || "Failed to fetch location data", "error", 3000);
    }
  };

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (isUpdateMode) {
        getTemplatesByLocationId();
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [isUpdateMode]);

  return (
    <div>
      <div className="border-b-2 flex items-baseline justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600 mb-2">
          Email Template Fields
        </h3>
        <div>
          <Button onClick={saveTemplate} title="Save Template" size="sm" />
        </div>
      </div>
      <div className="flex-1">
        <LocationEmailTemplateFields
          key={dataKey}
          formData={templateFormData}
          setFormData={setTemplateFormData}
        />
      </div>
    </div>
  );
}
