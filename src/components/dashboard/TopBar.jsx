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
import { Dropdown } from "../dropdown/Dropdown";
import { Modal } from "../modal/Modal";
import { useState } from "react";
import LockScreen from "./LockScreen";

const TYPE_STYLES = {
  primary: {
    icon: CheckCircle,
    classes: "bg-primary/10 text-primary border border-primary/25",
  },
  secondary: {
    icon: CheckCircle,
    classes: "bg-secondary/10 text-secondary border border-secondary/25",
  },
  success: {
    icon: CheckCircle,
    classes: "bg-success/10 text-success border border-success/25",
  },
  error: {
    icon: AlertCircle,
    classes: "bg-danger/10 text-danger border border-danger/25",
  },
  danger: {
    icon: AlertCircle,
    classes: "bg-danger/10 text-danger border border-danger/25",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-warning/10 text-warning border border-warning/25",
  },
  info: {
    icon: Info,
    classes: "bg-info/10 text-info border border-info/25",
  },
};

export default function TopBar({ onMenuToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notification, dismiss } = useNotification();

  const [accountsSettingsModal, setAccountsSettingsModal] = useState(false);

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
      <div className="flex-1 relative flex items-center justify-center min-w-0">
        {notification && style && MsgIcon && (
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium max-w-xl ${style.classes}`}
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
        {notification && style && MsgIcon && (
          <div
            className={`inline-flex absolute -top-4 md:hidden items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium max-w-xl ${style.classes}`}
          >
            <MsgIcon size={14} className="flex-shrink-0" aria-hidden="true" />
            <span className="text-wrap">{notification.message}</span>
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
        <Dropdown value={"settings"} onChange={() => {}}>
          <Dropdown.Trigger
            customClass={"border-0 flex-center"}
            renderIcon={false}
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Menu floating={true} appendClass={"w-48  px-2 py-0"}>
            <h5 className="text-xs border-b font-bold border-light px-3 py-2 mb-1">
              SETTINGS
            </h5>
            <Dropdown.Item
              appendClass={"py-0 my-0"}
              onClick={(e) => {
                e.stopPropagation();
                setAccountsSettingsModal(true);
              }}
            >
              <Settings size={14} className="mr-2" />
              Account Settings
            </Dropdown.Item>
            <Dropdown.Item appendClass={"p-0"}>
              <LockScreen />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <button
          onClick={handleLogout}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
      {/*=======================================
          Settings Page    
      ========================================= */}
      <Modal
        open={accountsSettingsModal}
        onHide={() => setAccountsSettingsModal(false)}
        position="right"
        size="full"
        appendClass={"w-2/5"}
      >
        <Modal.Header>Account Settings</Modal.Header>
        <Modal.Body>Accounts settings content goes here</Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setAccountsSettingsModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </header>
  );
}
