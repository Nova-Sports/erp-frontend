import FormInput from "@/components/form-input/FormInput";
import FormLabel from "@/components/form-label/FormLabel";
import { useEffect } from "react";

export default function LocationForm({
  isUpdateMode,
  locationData,
  state,
  formData,
  setFormData,
}) {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    <div className="">
      {state && state.error && (
        <p className="text-sm text-red-500 mb-3">{state.error}</p>
      )}
      <div className="border-b-2 flex items-baseline justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-600 mb-2">
          {isUpdateMode ? "Update Location" : "Add Location"}
        </h3>
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
    </div>
  );
}
