import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { createContext, useContext, useState, useEffect } from "react";
// Create Context
const ModalContext = createContext();

// Helper Function to use the Modal Context
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) return console.error("Use Modal component within Modal");
  return context;
};

/*=======================================
    Custom Classes    
========================================= */
const defaultModalClass =
  "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

const defaultContentClass = "bg-white rounded-lg p-6 w-full max-w-md mx-auto";

// Modal Provider Component
export const Modal = ({ children, open, onHide, customClass, appendClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openModal = (modalContent) => {
    setContent(modalContent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  const contextValue = {
    isOpen,
    content,
    openModal,
    closeModal,
  };

  useEffect(() => {
    if (open) {
      openModal(children);
    } else {
      closeModal();
    }

    // ESC key listener for closing modal only when it's open
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("ran close");
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${customClass ? customClass : defaultModalClass} ${appendClass}`}
          onClick={closeModal}
        >
          <ModalContext value={contextValue}>{content}</ModalContext>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root"),
  );
};
