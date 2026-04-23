import FormInput from "@/components/form-input/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader } from "lucide-react";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

/* DB Fields for company:
name
address1
address2
phone
email
city
state
zip
country
 */

export default function RegisterCompany({ setCompanyInfo, setStep }) {
  const { registerCompany } = useAuth();
  /* ========================= All States ========================= */
  const [formData, setFormData] = useState({
    name: "",
    address1: "",
    address2: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [state, formAction] = useActionState(registerCompanyAction, {
    error: null,
  });

  /*  ========================= All Functions ========================= */

  function validate(data) {
    if (!data.name.trim()) return "Company name is required.";
    if (!data.address1.trim()) return "Address Line 1 is required.";
    if (!data.city.trim()) return "City is required.";
    if (!data.state.trim()) return "State is required.";
    if (!data.zip.trim()) return "ZIP code is required.";
    if (!data.country.trim()) return "Country is required.";
    return null;
  }

  async function registerCompanyAction(_prevState, formData) {
    try {
      const data = {
        name: formData.get("name") ?? "",
        address1: formData.get("address1") ?? "",
        address2: formData.get("address2") ?? "",
        phone: formData.get("phone") ?? "",
        email: formData.get("email") ?? "",
        city: formData.get("city") ?? "",
        state: formData.get("state") ?? "",
        zip: formData.get("zip") ?? "",
        country: formData.get("country") ?? "",
      };

      const validationError = validate(data);
      if (validationError) return { error: validationError };

      // Artificial delay to mimic async request
      // await new Promise((r) => setTimeout(r, 500));

      // const result = await register(data);
      const result = await registerCompany(data);
      if (result.success) {
        setCompanyInfo(result.company);
        setStep(2);
        return { error: null };
      }
      return {
        error: result.error || "Registration failed. Please try again.",
      };
    } catch (err) {
      console.log(err.message);
      return { error: err.message || "An unexpected error occurred." };
    }
  }

  // Separate component so useFormStatus can read the pending state of the parent <form>
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold !py-2.5 rounded-lg text-sm transition-colors mt-1"
      >
        {pending ? (
          <span className="flex items-center gap-2 justify-center">
            Creating company…
            <span className="animate-spin">
              <Loader size={16} />
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2 justify-center">
            Create Company{" "}
          </span>
        )}
      </button>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ========================= All UseEffects ========================= */

  return (
    <div>
      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">
          <AlertCircle size={15} className="flex-shrink-0" />
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Company Name
          </label>
          <div className="relative">
            <FormInput
              id={"name"}
              value={formData.name || ""}
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="Company Name"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              autoComplete="organization"
            />
          </div>
        </div>
        {/* Address Line 1 */}
        <div>
          <label
            htmlFor="address1"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Address Line 1
          </label>
          <div className="relative">
            <FormInput
              id={"address1"}
              value={formData.address1 || ""}
              onChange={handleChange}
              name="address1"
              type="text"
              placeholder="Address Line 1"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              autoComplete="address-line1"
            />
          </div>
        </div>
        {/* Address Line 2 */}
        <div>
          <label
            htmlFor="address2"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Address Line 2
          </label>
          <div className="relative">
            <FormInput
              id={"address2"}
              value={formData.address2 || ""}
              onChange={handleChange}
              name="address2"
              type="text"
              placeholder="Address Line 2"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              autoComplete="address-line2"
            />
          </div>
        </div>
        {/* City State Zip */}
        <div className="grid grid-cols-3 gap-2">
          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              City
            </label>
            <div className="relative">
              <FormInput
                id={"city"}
                value={formData.city || ""}
                onChange={handleChange}
                name="city"
                type="text"
                placeholder="City"
                appendClasses="bg-gray-50 text-sm !py-2.5"
                autoComplete="address-level2"
              />
            </div>
          </div>
          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              State
            </label>
            <div className="relative">
              <FormInput
                id={"state"}
                value={formData.state || ""}
                onChange={handleChange}
                name="state"
                type="text"
                placeholder="State"
                appendClasses="bg-gray-50 text-sm !py-2.5"
                autoComplete="address-level1"
              />
            </div>
          </div>
          {/* Zip */}
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              ZIP Code
            </label>
            <div className="relative">
              <FormInput
                id={"zip"}
                value={formData.zip || ""}
                onChange={handleChange}
                name="zip"
                type="text"
                placeholder="ZIP Code"
                appendClasses="bg-gray-50 text-sm !py-2.5"
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>
        {/* Country */}
        <div>
          <label
            htmlFor="zip"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Country
          </label>
          <div className="relative">
            <FormInput
              id={"country"}
              value={formData.country || ""}
              onChange={handleChange}
              name="country"
              type="text"
              placeholder="Country"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              autoComplete="country-name"
            />
          </div>
        </div>
        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
