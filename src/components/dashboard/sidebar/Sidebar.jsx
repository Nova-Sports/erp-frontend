import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  ShoppingCart,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  ShoppingBag,
  Briefcase,
  Wrench,
  Package,
  Factory,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import AppLogo from "../../AppLogo";
import { useAuth } from "../../../contexts/AuthContext";
import useAnimations from "../../../contexts/AnimationContext";
import useVersion from "../../../contexts/VersionContext";

const NAV = [
  { id: "password", label: "Password", icon: Lock, to: "/dashboard/password" },
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    children: [
      {
        id: "customers",
        label: "Customers",
        icon: Users,
        to: "/dashboard/sales/customers",
      },
      {
        id: "quotes",
        label: "Quotes",
        icon: FileText,
        to: "/dashboard/sales/quotes",
      },
      {
        id: "work-orders",
        label: "W - Orders",
        icon: ClipboardList,
        to: "/dashboard/sales/work-orders",
      },
      {
        id: "approvals",
        label: "Approvals",
        icon: CheckSquare,
        to: "/dashboard/sales/approvals",
      },
      {
        id: "purchasing",
        label: "Purchasing",
        icon: ShoppingBag,
        to: "/dashboard/sales/purchasing",
      },
      {
        id: "job-board",
        label: "Job Board",
        icon: Briefcase,
        to: "/dashboard/sales/job-board",
      },
      {
        id: "utilities",
        label: "Utilities",
        icon: Wrench,
        children: [
          {
            id: "products",
            label: "Products",
            icon: Package,
            to: "/dashboard/sales/utilities/products",
          },
        ],
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    to: "/dashboard/manufacturing",
  },
  {
    id: "ai-sublimation",
    label: "AI-Sublimation",
    icon: Sparkles,
    to: "/dashboard/ai-sublimation",
  },
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    icon: MoreHorizontal,
    to: "/dashboard/miscellaneous",
  },
  // Custom Components Page
  {
    id: "components",
    label: "Components",
    icon: MoreHorizontal,
    to: "/dashboard/components",
  },
  {
    id: "test-component",
    label: "Test Component",
    icon: MoreHorizontal,
    to: "/dashboard/test-component",
  },
];

function hasActiveDescendant(item, pathname) {
  if (item.to)
    return pathname === item.to || pathname.startsWith(item.to + "/");
  return item.children?.some((c) => hasActiveDescendant(c, pathname)) ?? false;
}

/** Returns the `to` of the first leaf descendant, or null if none. */
function firstLeaf(item) {
  if (item.to) return item.to;
  for (const child of item.children ?? []) {
    const found = firstLeaf(child);
    if (found) return found;
  }
  return null;
}

function NavItem({ item, depth, mode, onRequestExpand }) {
  const location = useLocation();
  const navigate = useNavigate();
  const Icon = item.icon;

  const isActive =
    Boolean(item.to) &&
    (location.pathname === item.to ||
      location.pathname.startsWith(item.to + "/"));

  const groupHasActive =
    !item.to && hasActiveDescendant(item, location.pathname);

  const [open, setOpen] = useState(() => groupHasActive);
  useEffect(() => {
    if (groupHasActive) setOpen(true);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── ICON-ONLY MODE ────────────────────────────────────────────────
  if (mode === "icons") {
    if (depth > 0) return null;

    const cls =
      isActive || groupHasActive
        ? "bg-white text-primary shadow-sm"
        : "text-white/75 hover:text-white hover:bg-white/20";

    if (item.to) {
      return (
        <li>
          <Link
            to={item.to}
            title={item.label}
            className={`flex items-center justify-center w-9 h-9 mx-auto rounded-lg transition-all ${cls}`}
          >
            <Icon size={17} aria-hidden="true" />
          </Link>
        </li>
      );
    }
    return (
      <li>
        <button
          title={item.label}
          onClick={() => {
            setOpen(true);
            onRequestExpand();
            const leaf = firstLeaf(item);
            if (leaf) navigate(leaf);
          }}
          className={`flex items-center justify-center w-9 h-9 mx-auto rounded-lg transition-all ${cls}`}
        >
          <Icon size={17} aria-hidden="true" />
        </button>
      </li>
    );
  }

  // ── EXPANDED MODE — leaf ──────────────────────────────────────────
  if (item.to) {
    return (
      <li>
        <Link
          to={item.to}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? "bg-white text-primary shadow-sm"
              : "text-white/75 hover:text-white hover:bg-white/20"
          }`}
        >
          <Icon size={15} className="flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </Link>
      </li>
    );
  }

  // ── EXPANDED MODE — group ─────────────────────────────────────────
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          groupHasActive
            ? "bg-white/15 text-white"
            : "text-white/75 hover:text-white hover:bg-white/20"
        }`}
      >
        <Icon size={15} className="flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.children?.length > 0 && (
          <ChevronDown
            size={13}
            className={`flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        )}
      </button>
      {open && item.children?.length > 0 && (
        <ul className="mt-0.5 ml-4 pl-2 border-l border-white/25 space-y-0.5">
          {item.children.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              depth={depth + 1}
              mode={mode}
              onRequestExpand={onRequestExpand}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar shell
// Mobile (<lg) : fixed overlay — slides in/out via translateX
// Desktop (≥lg): in-flow      — width transitions w-14 ↔ w-60
// ─────────────────────────────────────────────────────────────────────────────
export default function Sidebar({ mode, onRequestExpand }) {
  const { user } = useAuth();
  const { sidebarVariants } = useAnimations();
  const { version } = useVersion();
  const initials = (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");
  const isIcons = mode === "icons";

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={mode}
      initial={false}
      className="fixed lg:relative top-0 left-0 h-full z-30 lg:z-auto bg-primary flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div
        className={`border-b border-white/15 flex-shrink-0 flex items-center justify-center ${isIcons ? "py-3 px-1.5" : "px-3 py-4"}`}
      >
        {isIcons ? (
          <AppLogo height="h-7" className="mx-auto" />
        ) : (
          <AppLogo width="w-[85%] rounded-lg" centered />
        )}
      </div>
      {/* User info */}
      <div
        className={`border-b border-white/15 flex-shrink-0 ${isIcons ? "py-3 flex justify-center" : "px-4 py-3"}`}
      >
        {isIcons ? (
          <div
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            title={`${user?.firstName} ${user?.lastName} (${user?.role})`}
          >
            <span className="text-white text-xs font-bold uppercase">
              {initials}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold uppercase">
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-white/60 text-xs capitalize truncate">
                {user?.role}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2"
        aria-label="Main navigation"
      >
        {!isIcons && (
          <p className="text-white/50 text-xs uppercase tracking-wider px-3 mb-2 font-semibold select-none">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              depth={0}
              mode={mode}
              onRequestExpand={onRequestExpand}
            />
          ))}
        </ul>
      </nav>
      {/* Version */}
      <div
        className={`flex-shrink-0 text-center ${isIcons ? "py-2 flex justify-center" : "px-4 py-1 border-t border-white/15 "}`}
      >
        {isIcons ? (
          <span
            className="text-white/30 text-[9px] font-mono"
            title={version}
          ></span>
        ) : (
          <span className="text-white text-xs font-mono">{version}</span>
        )}
      </div>
    </motion.aside>
  );
}
