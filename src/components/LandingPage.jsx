import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";
import {
  Users,
  Package,
  DollarSign,
  Box,
  Settings,
  ShoppingCart,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    icon: Users,
    name: "HRM",
    description:
      "Manage employees, payroll, attendance, and performance reviews seamlessly.",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    icon: Package,
    name: "Inventory",
    description:
      "Real-time stock tracking, warehouse management, and automated reorder points.",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    icon: DollarSign,
    name: "Financial",
    description:
      "Complete accounting suite with invoicing, budgeting, and financial reporting.",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    icon: Box,
    name: "Production",
    description:
      "Plan and monitor manufacturing from raw materials to finished sportswear goods.",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  {
    icon: Settings,
    name: "Service",
    description:
      "Handle customer service requests, warranties, and after-sales support efficiently.",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    icon: ShoppingCart,
    name: "Purchasing",
    description:
      "Streamline procurement with vendor management, RFQs, and purchase orders.",
    iconColor: "text-brand",
    iconBg: "bg-brand-light",
  },
];

const highlights = [
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Zap, text: "Real-time data sync" },
  { icon: BarChart3, text: "Advanced analytics" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <header className="bg-brand sticky top-0 z-50 shadow-md shadow-brand/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center">
            <AppLogo height="h-9" />
          </div>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-brand py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block border border-white/30 text-white bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium tracking-wide mb-6">
            CRM&nbsp;+&nbsp;ERP · All-in-One Platform
          </span>
          <h1 className="text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
            Run Your Sportswear
            <br />
            <span className="text-white/80 font-light">Business Smarter</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            SportswearERP combines powerful CRM and ERP capabilities — from
            production to sales, HRM to financials — all in one unified
            platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-brand font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-xl text-base"
            >
              Start Free Trial <ChevronRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
            >
              Sign In
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {highlights.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-white/70 text-sm"
              >
                <Icon size={16} className="text-white" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules Grid ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-brand-dark text-4xl font-bold mb-4">
              Six Integrated Modules
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every tool you need to manage your sportswear business — all
              connected and working together.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(
              ({ icon: Icon, name, description, iconColor, iconBg }) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-brand/25 hover:shadow-lg transition-all group cursor-default"
                >
                  <div
                    className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <h3 className="text-brand-dark font-bold text-lg mb-2">
                    {name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-brand">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join sportswear businesses already using SportswearERP to streamline
            every operation.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-brand font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl"
          >
            Create Free Account <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <AppLogo height="h-8" />
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 SportswearERP. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-500 text-sm cursor-default">
              Privacy
            </span>
            <span className="text-gray-500 text-sm cursor-default">Terms</span>
            <span className="text-gray-500 text-sm cursor-default">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
