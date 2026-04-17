import useAnimations from "@/contexts/AnimationContext";
import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";

const defaultAccordionClass =
  "border-b overflow-hidden border-secondary/30 rounded-sm";

const defaultHeaderClass =
  "flex items-center justify-between w-full py-3 px-4 hover:bg-white font-medium text-left cursor-pointer";

const defaultContentClass =
  "overflow-hidden border-t bg-white border-secondary py-3 px-4";

// Step 1: Create a private context — this is the hidden communication channel
const AccordionContext = createContext();

// Step 2: A custom hook so sub-components can tap into that channel
// (Also gives a clear error if someone uses Header/Content outside Accordion)
function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion sub-components must be used within <Accordion>");
  }
  return context;
}

// Step 3: The parent component — owns state, provides context
export function Accordion({
  children,
  defaultOpen = false,
  customClass,
  appendClasses,
}) {
  /* --------------------------- All States --------------------------- */
  const [isOpen, setIsOpen] = useState(defaultOpen);

  /*  --------------------------- All Functions --------------------------- */
  const toggle = () => setIsOpen((prev) => !prev);

  /* --------------------------- All UseEffects --------------------------- */

  // The Provider makes { isOpen, toggle } available to ALL descendants
  return (
    <AccordionContext value={{ isOpen, toggle }}>
      <div
        className={`${customClass ? customClass : defaultAccordionClass} ${appendClasses}`}
      >
        {children}
      </div>
    </AccordionContext>
  );
}

// Step 4: Sub-components — they read from context, no props needed from consumer
function Header({ children, customClass, activeClass, appendClasses }) {
  const { isOpen, toggle } = useAccordionContext();
  return (
    <div
      onClick={toggle}
      className={`${customClass ? customClass : defaultHeaderClass}  ${isOpen && activeClass ? activeClass : isOpen && !activeClass ? "bg-white/75" : ""} ${appendClasses}`}
    >
      {children}
      <span
        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      >
        ▼
      </span>
    </div>
  );
}

function Content({ children, customClass, appendClasses }) {
  const { isOpen } = useAccordionContext();
  const { easing, duration } = useAnimations();

  /* ========================= All States ========================= */

  const animationVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: duration.normal, ease: easing.easeOut },
        opacity: { duration: duration.normal, ease: easing.easeOut },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: duration.fast, ease: easing.easeIn },
        opacity: { duration: duration.fast, ease: easing.easeIn },
      },
    },
  };

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={animationVariants}
      className={"overflow-hidden"}
    >
      <div
        className={`${customClass ? customClass : defaultContentClass} ${appendClasses}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

// Step 5: Attach sub-components as properties of Accordion
// This is what enables the Accordion.Header / Accordion.Content syntax
Accordion.Header = Header;
Accordion.Content = Content;
