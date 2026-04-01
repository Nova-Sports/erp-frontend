import {
  Menu,
  Settings,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

const TYPE_STYLES = {
  success: {
    icon: CheckCircle,
    classes: "bg-success/10 text-success border border-success/25",
  },
  error: {
    icon: AlertCircle,
    classes: "bg-danger/10 text-danger border border-danger/25",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-warning/10 text-warning border border-warning/25",
  },
  info: {
    icon: Info,
    classes: "bg-accent/10 text-accent border border-accent/25",
  },
};

export default function TopBar({ onMenuToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notification, dismiss } = useNotification();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const style = notification
    ? (TYPE_STYLES[notification.type] ?? TYPE_STYLES.info)
    : null;
  const MsgIcon = style?.icon;

  return (
    <header className="h-12 flex-shrink-0 bg-white border-b border-gray-200 flex items-center px-3 gap-3 z-10 relative">
      {/* Left ── hamburger */}
      <button
        onClick={onMenuToggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
        aria-label="Toggle navigation"
      >
        <Menu size={18} />
      </button>

      {/* Center ── flash message */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        {notification && style && MsgIcon && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium max-w-xl ${style.classes}`}
          >
            <MsgIcon size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{notification.message}</span>
            <button
              onClick={dismiss}
              className="flex-shrink-0 ml-1 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Right ── settings + logout */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={17} />
        </button>
        <button
          onClick={handleLogout}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
