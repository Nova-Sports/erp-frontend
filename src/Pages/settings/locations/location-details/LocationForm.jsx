import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";
import { useNotification } from "@/contexts/NotificationContext";
import { useUpdateParams } from "@/custom-hooks/useUpdateParams";
import authHeader from "@/services/auth-header";
import API from "@/services/axios";
import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ isUpdateMode = false }) => {
  const { pending } = useFormStatus();

  let title = isUpdateMode ? "Save Location" : "Add Location";
  if (pending) {
    title = isUpdateMode ? "Saving..." : "Adding...";
  }

  return (
    <>
      <Button type="submit" title={title} size="sm" disabled={pending} />
    </>
  );
};

/**
 * Location Form Component
 *   name
 *   companyName
 *   pdfLogo
 */
export default function LocationForm({
  isUpdateMode,
  locationData,
  refreshFunc,
  handleBack,
  addDataApi,
  updateDataApi,
}) {
  /* ========================= All States ========================= */
  const { notify } = useNotification();

  const updateParam = useUpdateParams();

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    pdfLogo: "",
  });

  /*  ========================= All Functions ========================= */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (refreshFunc) refreshFunc();
        if (handleBack) handleBack();
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

  const addLocation = async () => {
    try {
      const { data } = await API.post(
        addDataApi,
        { ...formData },
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
        { ...formData, id: locationData.id },
        { headers: authHeader() },
      );
      return data;
    } catch (err) {
      throw err;
    }
  };

  const [state, formAction] = useActionState(handleSubmit, { error: null });

  /* ========================= All UseEffects ========================= */

  useEffect(() => {
    if (isUpdateMode && locationData?.id) {
      setFormData({
        name: locationData?.name || "",
        companyName: locationData?.companyName || "",
        pdfLogo: locationData?.pdfLogo || "",
      });
    }
  }, [locationData]);

  return (
    <form autoComplete="off" action={formAction} noValidate className="">
      {state && state.error && (
        <p className="text-sm text-red-500 mb-3">{state.error}</p>
      )}
      <div className="border-b-2 flex items-baseline justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600 mb-2">
          {isUpdateMode ? "Update Location" : "Add Location"}
        </h3>
        <SubmitButton isUpdateMode={isUpdateMode} />
      </div>
      <div className="my-3">
        {/* Name */}
        <div className="mb-3">
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormInput
            id="name"
            name="name"
            type="text"
            placeholder="Enter location name"
            value={formData.name || ""}
            onChange={onChange}
          />
        </div>

        {/* Company Name */}
        <div className="mb-3">
          <FormLabel htmlFor="companyName">Company Name</FormLabel>
          <FormInput
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Enter company name"
            value={formData.companyName || ""}
            onChange={onChange}
          />
        </div>

        {/* PDF Logo */}
        <div className="mb-3">
          <FormLabel htmlFor="pdfLogo">PDF Logo</FormLabel>
          <FormInput
            id="pdfLogo"
            name="pdfLogo"
            type="text"
            placeholder="Enter PDF logo URL"
            value={formData.pdfLogo || ""}
            onChange={onChange}
          />
        </div>
      </div>
    </form>
  );
}
