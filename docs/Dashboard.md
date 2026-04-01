# Dashboard

**File:** `src/components/dashboard/Dashboard.jsx`

The Dashboard is the **authenticated shell** — it wraps all protected module pages. It renders the sidebar, the topbar, and an `<Outlet>` where child route pages appear.

---

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (fixed/relative)  │  TopBar (h-12)          │
│                             ├────────────────────────┤
│  [Logo]                     │                        │
│  [User]                     │   <Outlet />           │
│  [Nav items]                │   (module page)        │
│                             │                        │
│  [v0.1.0]                   │                        │
└─────────────────────────────┴────────────────────────┘
```

---

## Sidebar Modes

`Dashboard` owns the `mode` state and controls when and how it changes.

| Mode       | When set                                          | Sidebar appearance   |
| ---------- | ------------------------------------------------- | -------------------- |
| `expanded` | Initial on desktop; after hamburger tap on mobile | Full sidebar (240px) |
| `icons`    | After hamburger click on desktop                  | Icon strip (56px)    |
| `closed`   | Initial on mobile; after hamburger tap on mobile  | Hidden (off-screen)  |

### Mode Logic

```js
const LG = 1024; // breakpoint in px

// Initial state
const [mode, setMode] = useState(() => isMobile() ? "closed" : "expanded");

// toggle() — called by TopBar hamburger
toggle():
  mobile → "closed" ↔ "expanded"
  desktop → "expanded" ↔ "icons"

// Resize handler — if user shrinks window to mobile while icons mode is active
if (width < LG && mode === "icons") setMode("closed")
```

### `onRequestExpand`

Passed to `Sidebar` so it can request a mode change from `'icons'` → `'expanded'` when a group icon is clicked in icon mode:

```jsx
<Sidebar mode={mode} onRequestExpand={() => setMode("expanded")} />
```

---

## Mobile Backdrop

When the sidebar is in `expanded` mode on mobile, a semi-transparent overlay appears behind the sidebar.  
Tapping it closes the sidebar:

```jsx
{
  mode === "expanded" && (
    <div
      className="fixed inset-0 bg-black/40 z-20 lg:hidden"
      onClick={() => setMode("closed")}
    />
  );
}
```

---

## Z-Index Layers

| Element  | z-index                              | Notes                               |
| -------- | ------------------------------------ | ----------------------------------- |
| Sidebar  | `z-30` (mobile) / `z-auto` (desktop) | Overlays content on mobile          |
| Backdrop | `z-20`                               | Below sidebar, above content        |
| TopBar   | `z-10`                               | Stays above page scrollable content |

---

## TopBar

Rendered inside the main column (right of sidebar). Receives the `toggle` function as `onMenuToggle`.

```jsx
<TopBar onMenuToggle={toggle} />
```

See [TopBar section below](#topbar) and the Contexts doc for `useNotification`.

---

## `<Outlet />`

The `<main>` tag renders `<Outlet />` from React Router — it shows whichever child route is currently matched.

```jsx
<main className="flex-1 overflow-y-auto">
  <Outlet />
</main>
```

Each module page (e.g., `Password.jsx`) is responsible for its own internal padding and layout.

---

## TopBar

**File:** `src/components/dashboard/TopBar.jsx`

A fixed-height (`h-12`) header bar with three zones:

```
┌─────────────────────────────────────────────────────────┐
│ [☰ Hamburger]  [Flash notification message]  [⚙][↪️]  │
└─────────────────────────────────────────────────────────┘
```

### Zones

| Zone   | Contents                    | Notes                                                        |
| ------ | --------------------------- | ------------------------------------------------------------ |
| Left   | `<Menu>` icon button        | Calls `onMenuToggle` → toggles sidebar mode                  |
| Center | Flash notification pill     | Driven by `NotificationContext`. Empty when no notification. |
| Right  | Settings icon + Logout icon | Logout calls `auth.logout()` then navigates to `/`           |

### Notification Pill

Displayed when `notification` from `useNotification()` is non-null.  
Color and icon are determined by `notification.type`:

```js
const TYPE_STYLES = {
  success: { icon: CheckCircle, classes: "bg-success/10 text-success ..." },
  error: { icon: AlertCircle, classes: "bg-danger/10 text-danger ..." },
  warning: { icon: AlertTriangle, classes: "bg-warning/10 text-warning ..." },
  info: { icon: Info, classes: "bg-accent/10 text-accent ..." },
};
```

The `×` button on the pill calls `dismiss()` directly.

### Props

| Prop           | Type       | Description                                 |
| -------------- | ---------- | ------------------------------------------- |
| `onMenuToggle` | `function` | Called when the hamburger button is clicked |

---

## How to Add Content to the TopBar

Open `TopBar.jsx` and add to the appropriate zone.

**Example — add a user avatar to the right zone:**

```jsx
// In the right zone div
<div className="flex items-center gap-1 flex-shrink-0">
  <button /* your avatar button */>
    <img src={user.avatarUrl} className="w-7 h-7 rounded-full" />
  </button>
  {/* existing Settings + Logout buttons */}
</div>
```

**Example — add a search bar to the center zone** (replaces notification center when idle):

The center zone is a `flex-1` container — place any content there alongside the existing notification logic.
