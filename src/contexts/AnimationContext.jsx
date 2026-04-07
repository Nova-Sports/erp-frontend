import { createContext, useContext } from "react";

const AnimationContext = createContext({});

export const AnimationProvider = ({ children }) => {
  /* *************  Easing Curves  **************** */
  // Standard cubic-bezier presets (material-design inspired)
  const easing = {
    easeIn: [0.4, 0.0, 1.0, 1.0], // accelerates — good for exits / closing
    easeOut: [0.0, 0.0, 0.2, 1.0], // decelerates — good for entrances / opening
    easeInOut: [0.4, 0.0, 0.2, 1.0], // both        — good for positional shifts
    sharp: [0.4, 0.0, 0.6, 1.0], // sharper curve for quick snappy moves
  };

  /* *************  Durations (seconds)  **************** */
  const duration = {
    fast: 0.15,
    normal: 0.22,
    slow: 0.35,
  };

  /* *************  Sidebar  **************** */
  // Each variant defines HOW to animate INTO that state (transition lives in the target).
  // - Opening  (→ expanded / → icons)  : ease-out (decelerates → feels like it lands)
  // - Closing  (→ closed)              : ease-in  (accelerates → feels like it leaves)
  // - Resizing (expanded ↔ icons)      : ease-in-out for the width
  const sidebarVariants = {
    expanded: {
      x: 0,
      width: 240,
      transition: {
        x: { duration: duration.normal, ease: easing.easeOut },
        width: { duration: duration.normal, ease: easing.easeInOut },
      },
    },
    icons: {
      x: 0,
      width: 56,
      transition: {
        x: { duration: duration.normal, ease: easing.easeOut },
        width: { duration: duration.normal, ease: easing.easeInOut },
      },
    },
    closed: {
      x: "-100%",
      width: 240, // keep width stable while off-screen
      transition: {
        x: { duration: duration.fast, ease: easing.easeIn },
        width: { duration: 0 }, // instant — irrelevant while hidden
      },
    },
  };

  /* *************  Values  **************** */
  const animationValues = {
    easing,
    duration,
    sidebarVariants,
  };

  return (
    <AnimationContext value={animationValues}>{children}</AnimationContext>
  );
};

export default function useAnimations() {
  return useContext(AnimationContext);
}
