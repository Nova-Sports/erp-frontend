/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Semantic design tokens ────────────────────────────────────────────
        // Use these in new components for consistency.
        primary: {
          DEFAULT: "#5b6af8",
          hover: "#4a59f0",
          light: "#eef0ff",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#64748b",
          hover: "#475569",
          light: "#f1f5f9",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          light: "#ecfeff",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981",
          hover: "#059669",
          light: "#d1fae5",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
          light: "#fef3c7",
          foreground: "#ffffff",
        },
        danger: {
          DEFAULT: "#ef4444",
          hover: "#dc2626",
          light: "#fee2e2",
          foreground: "#ffffff",
        },
        // Page background — clearly distinct from white card surfaces
        page: "#e8eaf3",
        // ── Legacy alias (kept for backward compat) ───────────────────────────
        brand: {
          DEFAULT: "#5b6af8",
          hover: "#4a59f0",
          light: "#eef0ff",
          dark: "#2e2e35",
          darker: "#1e1e24",
        },
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
