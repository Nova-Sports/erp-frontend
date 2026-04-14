import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSidebarContext } from "../dashboard/sidebar/SidebarContext";
// Create Context
const ModalContext = createContext();

// Helper Function to use the Modal Context
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) return console.error("Use Modal component within Modal");
  return context;
};

/*=======================================
    Position & Size System
    position: "center" | "top" | "bottom-right" | "top-left" etc.
    Format:  "y-x"  where y = top|center|bottom, x = left|center|right
    Single words are shortcuts: "center" → center-center, "right" → center-right
========================================= */

const BACKDROP_BASE = "fixed inset-0 bg-black/50 flex flex-col z-50";

const JUSTIFY_Y = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

const ALIGN_X = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

// Single-word shortcuts → [y, x]
const POSITION_SHORTCUTS = {
  center: ["center", "center"],
  right: ["center", "right"],
  left: ["center", "left"],
  top: ["top", "center"],
  bottom: ["bottom", "center"],
};

function parsePosition(position) {
  if (POSITION_SHORTCUTS[position]) return POSITION_SHORTCUTS[position];
  const [y, x] = position.split("-");
  return [y || "center", x || "center"];
}

// Content slide animation based on position
function getContentAnimation(y, x) {
  const initial = { opacity: 0 };
  if (x === "right") initial.x = 60;
  else if (x === "left") initial.x = -60;
  if (y === "top") initial.y = -60;
  else if (y === "bottom") initial.y = 60;
  // Center-center: subtle scale
  if (x === "center" && y === "center") initial.scale = 0.95;

  const animate = { opacity: 1, x: 0, y: 0, scale: 1 };
  const exit = { ...initial };
  return { initial, animate, exit };
}

const MODAL_BASE = "bg-white rounded-lg shadow-lg relative flex flex-col";

const MODAL_SIZE = {
  sm: "max-w-sm w-full",
  md: "w-[600px] max-w-full",
  lg: "w-[900px] max-w-full",
  xl: "w-[1200px] max-w-full",
};

/*=======================================
    Sub-component Classes
========================================= */

const defaultHeaderClass =
  "border-b border-secondary py-4 px-4 font-medium text-lg";

const defaultBodyClass = "bg-white rounded-lg p-6 w-full h-full";

const defaultFooterClass =
  "border-t border-secondary py-3 px-4 flex justify-end gap-2";

// Modal Provider Component
export const Modal = ({
  children,
  type = "standard",
  open,
  onHide,
  customClass,
  appendClass,
  position = "center",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mode } = useSidebarContext();

  const marginLeft =
    mode === "expanded"
      ? "ml-[240px]"
      : mode === "icons"
        ? "ml-[56px]"
        : "ml-0";

  // Parse position into [y, x] and build classes
  const [y, x] = parsePosition(position);
  const backdropClass = `${BACKDROP_BASE} ${JUSTIFY_Y[y]} ${ALIGN_X[x]}`;
  const contentAnimation = getContentAnimation(y, x);

  const closeModal = () => {
    if (onHide) onHide();
    setIsOpen(false);
  };

  const contextValue = {
    isOpen,
    closeModal,
  };

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    } else {
      setIsOpen(false); // don't call closeModal — parent already knows
    }

    if (!open) return;

    // ESC key listener for closing modal only when it's open
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${backdropClass} ${marginLeft}`}
          onClick={closeModal}
        >
          <ModalContext value={contextValue}>
            <motion.div
              {...contentAnimation}
              className={`relative ${customClass ? customClass : `${MODAL_BASE} ${MODAL_SIZE[size]}`} ${size === "full" && position === "bottom" ? "w-full" : ""} ${size === "full" && position === "right" ? "h-full" : ""} ${appendClass || ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              {position === "right" && size === "full" && (
                <div
                  className="absolute text-white px-3 py-2 rounded-l-full top-11 -left-0 -translate-x-full bg-black/50 cursor-pointer hover:bg-black transition-colors"
                  onClick={closeModal}
                >
                  <X size={18} />
                </div>
              )}

              {children}
            </motion.div>
          </ModalContext>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root"),
  );
};

// Modal Header
const Header = ({ children, customClass, appendClass }) => {
  return (
    <div
      className={`${customClass ? customClass : defaultHeaderClass} ${appendClass}`}
    >
      {children}
    </div>
  );
};

// Modal Body
const Body = ({ children, customClass, appendClass }) => {
  return (
    <div
      className={`${customClass ? customClass : defaultBodyClass} ${appendClass}`}
    >
      {children}
    </div>
  );
};

// Modal Footer
const Footer = ({ children, customClass, appendClass }) => {
  return (
    <div
      className={`${customClass ? customClass : defaultFooterClass} ${appendClass}`}
    >
      {children}
    </div>
  );
};

// Exporting Modal with its subcomponents
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
