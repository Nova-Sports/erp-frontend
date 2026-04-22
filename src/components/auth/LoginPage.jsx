import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import AppLogo from "../AppLogo";
import { useAuth } from "../../contexts/AuthContext";
import useVersion from "../../contexts/VersionContext";

const MODULE_BULLETS = [
  "HRM",
  "Inventory",
  "Financial",
  "Production",
  "Service",
  "Purchasing",
];

// Separate component so useFormStatus can read the pending state of the parent <form>
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { version } = useVersion();
  const navigate = useNavigate();

  async function loginAction(_prevState, formData) {
    const email = formData.get("email")?.trim().toLowerCase() ?? "";
    const password = formData.get("password") ?? "";

    if (!email || !password) {
      return { error: "Please fill in all fields." };
    }

    // Artificial delay to mimic async request
    await new Promise((r) => setTimeout(r, 500));

    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard", { replace: true });
      return { error: null };
    }
    return { error: result.error };
  }

  const [state, formAction] = useActionState(loginAction, { error: null });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillTestCredentials = () => {
    setForm({ email: "admin@sportswear.erp", password: "Admin@123" });
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex flex-col w-[440px] xl:w-[480px] flex-shrink-0 bg-brand p-10 justify-between">
        <div>
          <Link to="/" className="flex items-center mb-14">
            <AppLogo width={"mx-auto rounded-lg"} />
          </Link>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Welcome back to
            <br />
            your business hub
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-10">
            Manage your entire sportswear operation from one unified platform.
          </p>
          <div className="space-y-3">
            {MODULE_BULLETS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 text-white/80 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Test credentials box */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
            Test Credentials
          </p>
          <p className="text-white/80 text-sm font-mono">
            admin@sportswear.erp
          </p>
          <p className="text-white/80 text-sm font-mono">Admin@123</p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-page p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex lg:hidden items-center justify-center mb-8"
          >
            <AppLogo height="h-10" />
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-brand-dark mb-1">Sign In</h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter your credentials to access your account
            </p>

            {state.error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">
                <AlertCircle size={15} className="flex-shrink-0" />
                {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <SubmitButton />
            </form>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="text-xs text-brand hover:underline"
              >
                Fill test credentials
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-brand font-medium hover:underline"
              >
                Create account
              </Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-4">
              Current {version}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
