import { AlertCircle, Phone, User } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AppLogo from "../../AppLogo";
import FormInput from "../../form-input/FormInput";
import RegisterUser from "./RegisterUser";
import RegisterCompany from "./RegisterCompany";

const PERKS = [
  "Free to get started — no credit card required",
  "All 6 business modules included",
  "Real-time data and advanced analytics",
  "Enterprise-grade security",
];

export default function RegisterPage() {
  /* ========================= All States ========================= */
  const [step, setStep] = useState(1);

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex flex-col w-[440px] xl:w-[480px] flex-shrink-0 bg-brand p-10 justify-between">
        <div>
          <Link to="/" className="flex items-center  mb-14">
            <AppLogo width={"mx-auto rounded-lg"} />
          </Link>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Start managing your
            <br />
            business today
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Create your SportswearERP account and unlock the full power of
            integrated CRM and ERP.
          </p>
          <div className="space-y-4">
            {PERKS.map((text) => (
              <div
                key={text}
                className="flex items-start gap-3 text-white/80 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-page p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex lg:hidden items-center justify-center mb-8"
          >
            <AppLogo height="h-10" />
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/*=======================================
                    Show Steps
            ========================================= */}

            <div className="flex items-center justify-between  gap-2">
              {/* ========== Step 1 : Register Company ==================== */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`${step === 1 ? "bg-primary relative" : "bg-gray-200 text-neutral-400"} rounded-full w-8 h-8 flex items-center justify-center text-white z-10`}
                >
                  1
                  {step === 1 && (
                    <div className="rounded-full w-6 h-6 bg-primary absolute -z-10  animate-ping [animation-duration:1.8s]"></div>
                  )}
                </div>
                <div className={step === 1 ? "font-bold" : ""}>
                  Register Company
                </div>
              </div>

              {/* ===== Divider ======== */}
              <div className="border-t border-gray-300 w-full"> </div>

              {/* ========== Step 2 : Register Admin User ==================== */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`${step === 2 ? "bg-primary relative" : "bg-gray-200 text-neutral-400"} rounded-full w-8 h-8 flex items-center justify-center text-white z-10`}
                >
                  2
                  {step === 2 && (
                    <div className="rounded-full w-6 h-6 bg-primary absolute -z-10 animate-ping [animation-duration:1.8s]"></div>
                  )}
                </div>
                <div className={step === 2 ? "font-bold" : ""}>
                  Register Admin User
                </div>
              </div>
            </div>

            {/* =================== Steps Components ================ */}
            <div className="mt-8">
              {step === 1 && <RegisterCompany />}
              {step === 2 && <RegisterUser />}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
