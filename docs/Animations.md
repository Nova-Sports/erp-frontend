# Animations

**File:** `src/contexts/AnimationContext.jsx`  
**Library:** [Framer Motion](https://www.framer.com/motion/) v12  
**Hook:** `useAnimations()`

All animation configuration lives in `AnimationContext`. Components consume values from the context via `useAnimations()` and pass them to Framer Motion's `motion.*` elements.

---

## Core Concepts

### Easing Curves

```js
const easing = {
  easeIn: [0.4, 0.0, 1.0, 1.0], // accelerates — exits, closing
  easeOut: [0.0, 0.0, 0.2, 1.0], // decelerates — entrances, opening
  easeInOut: [0.4, 0.0, 0.2, 1.0], // both sides  — positional shifts
  sharp: [0.4, 0.0, 0.6, 1.0], // faster/snappier version of easeInOut
};
```

These are standard cubic-bezier arrays that Framer Motion's `ease` option accepts directly.

**Rule of thumb:**

- Use `easeOut` when something **enters** or **opens** (decelerates into place — feels natural)
- Use `easeIn` when something **exits** or **closes** (accelerates away — doesn't linger)
- Use `easeInOut` for things that **move from A to B** (e.g. width resize)

### Durations (in seconds)

```js
const duration = {
  fast: 0.15, // micro-interactions: hover states, button presses
  normal: 0.22, // standard component transitions
  slow: 0.35, // large layout shifts, page entrance animations
};
```

---

## Variants

Framer Motion **variants** are named states (e.g. `"expanded"`, `"closed"`).  
Each variant defines the CSS/transform properties **for that state** plus the `transition` to apply **when animating into** that state.

### `sidebarVariants`

Controls the sidebar's `x` (slide) and `width` (resize) properties as the mode changes.

```js
const sidebarVariants = {
  expanded: {
    x: 0,
    width: 240,
    transition: {
      x: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1.0] }, // easeOut
      width: { duration: 0.22, ease: [0.4, 0.0, 0.2, 1.0] }, // easeInOut
    },
  },
  icons: {
    x: 0,
    width: 56,
    transition: {
      x: { duration: 0.22, ease: [0.0, 0.0, 0.2, 1.0] }, // easeOut
      width: { duration: 0.22, ease: [0.4, 0.0, 0.2, 1.0] }, // easeInOut
    },
  },
  closed: {
    x: "-100%",
    width: 240, // width kept stable while hidden (irrelevant visually)
    transition: {
      x: { duration: 0.15, ease: [0.4, 0.0, 1.0, 1.0] }, // easeIn — snappy exit
      width: { duration: 0 }, // instant
    },
  },
};
```

**How it is used in Sidebar.jsx:**

```jsx
import { motion } from "framer-motion";
import useAnimations from "../../contexts/AnimationContext";

const { sidebarVariants } = useAnimations();

<motion.aside
  variants={sidebarVariants}
  animate={mode}      // "expanded" | "icons" | "closed"
  initial={false}     // skip animation on first render
>
```

When `mode` changes in `Dashboard.jsx`, Framer Motion automatically picks the matching variant and animates to it using that variant's own `transition`.

---

## How to Add a New Animation

### Step 1 — Define the variants in `AnimationContext.jsx`

Open `src/contexts/AnimationContext.jsx` and add a new variants object inside the provider:

```js
// Example: modal entrance/exit
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.easeIn },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};
```

Then add it to the exported values:

```js
const animationValues = {
  easing,
  duration,
  sidebarVariants,
  modalVariants, // ← add here
};
```

### Step 2 — Use it in your component

```jsx
import { motion, AnimatePresence } from "framer-motion";
import useAnimations from "../../contexts/AnimationContext";

function MyModal({ isOpen, children }) {
  const { modalVariants } = useAnimations();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Common Framer Motion Patterns

### Fade in on mount

```jsx
const { duration, easing } = useAnimations();

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: duration.normal, ease: easing.easeOut }}
>
```

### Slide in from bottom

```jsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: duration.normal, ease: easing.easeOut }}
>
```

### Staggered list items

```jsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { ease: easing.easeOut } },
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.label}
    </motion.li>
  ))}
</motion.ul>;
```

### Animate on condition change (`animate` prop)

```jsx
// The variant to animate to changes based on state
const { myVariants } = useAnimations();

<motion.div
  variants={myVariants}
  animate={isError ? "error" : "normal"}
  initial={false}
>
```

---

## `initial={false}`

Used on the `Sidebar` to prevent the entrance animation on first render (the sidebar should just appear at the correct position when the page loads, not animate in).

Use `initial={false}` for elements that are **always mounted** and just change state.  
Omit it (or use `initial="hidden"`) for elements that **mount/unmount** and need an entrance animation.

---

## `AnimatePresence`

Required when you want exit animations for elements that are conditionally rendered (`{condition && <Component />}`).

```jsx
import { AnimatePresence } from "framer-motion";

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>;
```

Without `AnimatePresence`, the element is removed from the DOM instantly with no exit animation.
