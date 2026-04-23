import Button from "@/components/buttons/Button";
import FormInput from "@/components/form-input/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import API from "@/services/axios";
import { AlertCircle, Loader, Phone, User } from "lucide-react";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function RegisterUser({ companyInfo, setCompanyInfo, setStep }) {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  /* ========================= All States ========================= */

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [state, formAction] = useActionState(registerAction, { error: null });
  const [companyResetLoading, setCompanyResetLoading] = useState(false);

  /*  ========================= All Functions ========================= */

  function validate(data) {
    if (!data.firstName.trim()) return "First name is required.";
    if (!data.lastName.trim()) return "Last name is required.";
    if (!data.phone.trim()) return "Phone number is required.";
    if (!data.email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return "Please enter a valid email address.";
    if (data.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  }

  async function registerAction(_prevState, formData) {
    let companyId = companyInfo?.id;

    if (!companyId) {
      const storedCompany = localStorage.getItem("company");
      if (!storedCompany) {
        return {
          error:
            "Company information is missing. Please start by registering your company.",
        };
      }

      if (storedCompany) {
        const parsedCompany = JSON.parse(storedCompany);
        companyId = parsedCompany.id;
      }
    }

    const data = {
      firstName: formData.get("firstName") ?? "",
      lastName: formData.get("lastName") ?? "",
      phone: formData.get("phone") ?? "",
      email: formData.get("email") ?? "",
      password: formData.get("password") ?? "",
      companyId,
    };

    const validationError = validate(data);
    if (validationError) return { error: validationError };

    // Artificial delay to mimic async request
    // await new Promise((r) => setTimeout(r, 500));

    const result = await registerUser(data);

    if (result.success) {
      // remove company from localStorage since user is now registered and logged in
      localStorage.removeItem("company");
      navigate("/dashboard", { replace: true });
      return { error: null };
    }
    return { error: result.error || "Registration failed. Please try again." };
  }

  async function resetCompany() {
    try {
      setCompanyResetLoading(true);
      // get company from localStorage and delete it
      let companyInfo = localStorage.getItem("company");
      if (!companyInfo) {
        setCompanyResetLoading(false);
        return;
      }
      companyInfo = JSON.parse(companyInfo);

      const { data } = await API.post("/auth/reset-company", {
        id: companyInfo.id,
      });
      if (data.success) {
        setCompanyResetLoading(false);
        localStorage.removeItem("company");
        setCompanyInfo(null);
        setStep(1);
      } else {
        setCompanyResetLoading(false);
        console.log("Failed to reset company:", data.error);
      }
    } catch (err) {
      console.log(err.message);
      setCompanyResetLoading(false);
      alert(err.message || "Failed to reset company. Please try again.");
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Separate component so useFormStatus can read the pending state of the parent <form>
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold !py-2.5 rounded-lg text-sm transition-colors mt-1"
      >
        {pending ? "Creating account…" : "Create Account"}
      </button>
    );
  }

  /* ========================= All UseEffects ========================= */

  return (
    <div>
      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">
          <AlertCircle size={15} className="flex-shrink-0" />
          {state.error}
        </div>
      )}

      {/* Company Info */}
      {companyInfo && (
        <div className="mb-4 flex items-center gap-2 bg-success/20 border-2 border-success justify-between py-2 px-3 rounded-lg ">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-600">Company :</h3>
            <p className="font-bold text-success">{companyInfo.name}</p>
          </div>
          <div>
            <Button
              title="Reset Company"
              size="sm"
              onClick={resetCompany}
              disabled={companyResetLoading}
              afterTitle={() => {
                if (!companyResetLoading) return null;
                return (
                  <span className="animate-spin">
                    <Loader size={14} />
                  </span>
                );
              }}
            />
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-4" noValidate>
        {/* First / Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              First Name
            </label>
            <div className="relative">
              <FormInput
                id={"firstName"}
                value={form.firstName || ""}
                onChange={handleChange}
                name="firstName"
                type="text"
                placeholder="John"
                appendClasses="bg-gray-50 text-sm !py-2.5"
                autoComplete="given-name"
                iconStart={<User size={14} />}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Last Name
            </label>
            <div className="relative">
              <FormInput
                id={"lastName"}
                value={form.lastName || ""}
                onChange={handleChange}
                name="lastName"
                type="text"
                placeholder="Doe"
                appendClasses="bg-gray-50 text-sm !py-2.5"
                autoComplete="family-name"
                iconStart={<User size={14} />}
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Phone Number
          </label>
          <div className="relative">
            <FormInput
              id={"phone"}
              value={form.phone || ""}
              onChange={handleChange}
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              iconStart={<Phone size={14} />}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <FormInput
              id={"email"}
              value={form.email || ""}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="you@company.com"
              appendClasses="bg-gray-50 text-sm !py-2.5"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="reg-password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <FormInput
              id={"password"}
              value={form.password || ""}
              onChange={handleChange}
              name="password"
              type={"password"}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              appendClasses="bg-gray-50 text-sm !py-2.5"
            />
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
