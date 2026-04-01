import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const PERKS = [
  "Free to get started — no credit card required",
  "All 6 business modules included",
  "Real-time data and advanced analytics",
  "Enterprise-grade security",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register(form);
      if (result.success) {
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.error || "Registration failed. Please try again.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex flex-col w-[440px] xl:w-[480px] flex-shrink-0 bg-brand p-10 justify-between">
        <div>
          <Link to="/" className="flex items-center mb-14">
            <AppLogo height="h-10" />
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
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex lg:hidden items-center justify-center mb-8"
          >
            <AppLogo height="h-10" />
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-brand-dark mb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Fill in your details to get started
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      autoComplete="given-name"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
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
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      autoComplete="family-name"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
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
                  <Phone
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
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
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="reg-email"
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
                  htmlFor="reg-password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

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
