import Button from "@/components/buttons/Button";
import Spinner from "@/components/spinner/Spinner";
import { useNotification } from "@/contexts/NotificationContext";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LocationEmailTemplateFields from "./LocationEmailTemplateFields";

export default function LocationEmailTemplates({
  isUpdateMode,
  templateFormData,
  setTemplateFormData,
}) {
  const { notify } = useNotification();
  const [searchParam] = useSearchParams();
  /* ========================= All States ========================= */

  const [loading, setLoading] = useState(false);
  const [dataKey, setDataKey] = useState(0);

  /*  ========================= All Functions ========================= */

  // Get Templates List By Location Id
  const getTemplatesByLocationId = async () => {
    try {
      setLoading(true);
      let locationId = searchParam.get("location-id");
      if (!locationId) {
        notify("Location ID is missing", "error", 3000);
        setLoading(false);
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
    } finally {
      setLoading(false);
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
    <div className="">
      <div className="border-b-2 flex items-baseline justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600 mb-2">
          Email Template Fields
        </h3>
      </div>
      <div className="flex-1">
        <Spinner loading={loading} />
        <LocationEmailTemplateFields
          key={dataKey}
          formData={templateFormData}
          setFormData={setTemplateFormData}
        />
      </div>
    </div>
  );
}
