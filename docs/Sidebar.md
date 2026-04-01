# Sidebar

**File:** `src/components/dashboard/Sidebar.jsx`

The sidebar is a responsive navigation panel with three display modes. It reads from the `NAV` data array and renders items recursively.

---

## Three Modes

| Mode       | Width            | Behaviour                                                                                                |
| ---------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| `expanded` | `240px`          | Full labels, icons, collapsible subgroups                                                                |
| `icons`    | `56px`           | Icons only (top-level items). Clicking a group icon expands the sidebar and navigates to its first page. |
| `closed`   | `0` (off-screen) | Hidden. Used on mobile. Slides back in via hamburger.                                                    |

Mode is owned by `Dashboard.jsx` and passed down as the `mode` prop.  
See [Dashboard.md](./Dashboard.md) for how mode transitions work.

---

## The `NAV` Array

Defined as a constant at the top of `Sidebar.jsx`. This is the **single source of truth** for navigation — every item in the sidebar comes from here.

### Item Shape

#### Leaf item (navigates directly to a page)

```js
{
  id: "password",        // unique string — used as React key
  label: "Password",     // text shown in expanded mode
  icon: Lock,            // lucide-react icon component (not <Lock />, just Lock)
  to: "/dashboard/password",  // full path including /dashboard prefix
}
```

#### Group item (has children, no `to`)

```js
{
  id: "sales",
  label: "Sales",
  icon: ShoppingCart,
  children: [ /* array of leaf or group items */ ],
}
```

> A group **must not** have a `to` field.  
> A leaf **must not** have a `children` field.

---

## Current NAV Structure

```
Password                    → /dashboard/password
Sales (group)
  ├─ Customers              → /dashboard/sales/customers
  ├─ Quotes                 → /dashboard/sales/quotes
  ├─ W - Orders             → /dashboard/sales/work-orders
  ├─ Approvals              → /dashboard/sales/approvals
  ├─ Purchasing             → /dashboard/sales/purchasing
  ├─ Job Board              → /dashboard/sales/job-board
  └─ Utilities (group)
       └─ Products          → /dashboard/sales/utilities/products
Manufacturing               → /dashboard/manufacturing
AI-Sublimation              → /dashboard/ai-sublimation
Miscellaneous               → /dashboard/miscellaneous
```

---

## How to Add a Nav Item

### 1. Add a top-level leaf item

```js
// In the NAV array
{ id: "reports", label: "Reports", icon: BarChart2, to: "/dashboard/reports" },
```

Then import the icon at the top of `Sidebar.jsx`:

```js
import { BarChart2 } from "lucide-react";
```

Then add the route and component — see [Adding-a-Module.md](./Adding-a-Module.md).

---

### 2. Add a child to an existing group

```js
// Inside the Sales children array
{ id: "invoices", label: "Invoices", icon: Receipt, to: "/dashboard/sales/invoices" },
```

---

### 3. Add a new top-level group

```js
{
  id: "hrm",
  label: "HRM",
  icon: Users,
  children: [
    { id: "employees", label: "Employees", icon: User, to: "/dashboard/hrm/employees" },
    { id: "payroll",   label: "Payroll",   icon: DollarSign, to: "/dashboard/hrm/payroll" },
  ],
},
```

---

### 4. Add a nested sub-group (3rd level)

```js
{
  id: "reports",
  label: "Reports",
  icon: BarChart2,
  children: [
    {
      id: "sales-reports",
      label: "Sales Reports",
      icon: TrendingUp,
      children: [
        { id: "monthly", label: "Monthly", icon: Calendar, to: "/dashboard/reports/sales/monthly" },
      ],
    },
  ],
},
```

> Nesting works to any depth. The `NavItem` component is recursive — it calls itself for each child.

---

## Internal Functions

### `hasActiveDescendant(item, pathname)`

Recursively checks whether any descendant of a group item matches the current URL.  
Used to auto-highlight groups when a child page is active, and to auto-expand them on mount.

```js
hasActiveDescendant({ id: "sales", children: [...] }, "/dashboard/sales/customers")
// → true
```

### `firstLeaf(item)`

Recursively walks a subtree and returns the `to` path of the **first leaf node** encountered.  
Used when clicking a group icon in icon mode — the sidebar expands and navigates to the first page in the group.

```js
firstLeaf({ id: "sales", children: [{ id: "customers", to: "/dashboard/sales/customers" }, ...] })
// → "/dashboard/sales/customers"
```

---

## `NavItem` Component (internal)

Not exported. Renders a single navigation entry recursively.

### Props

| Prop              | Type                                | Description                                                                                |
| ----------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `item`            | `object`                            | A single entry from the `NAV` array                                                        |
| `depth`           | `number`                            | Nesting depth — `0` for top level, `1` for first child, etc.                               |
| `mode`            | `'expanded' \| 'icons' \| 'closed'` | Current sidebar mode                                                                       |
| `onRequestExpand` | `function`                          | Called when a group icon is clicked in icon mode — tells Dashboard to switch to `expanded` |

### Rendering Logic

```
mode === 'icons' && depth > 0  → render nothing (only top-level icons shown)
mode === 'icons' && item.to    → render icon <Link>
mode === 'icons' && item.children → render icon <button> that expands + navigates to firstLeaf
mode === 'expanded' && item.to → render full <Link> with icon + label
mode === 'expanded' && item.children → render collapsible <button> group + <ul> of children
```

### Active State

- **Leaf active**: `location.pathname === item.to` or `location.pathname` starts with `item.to + "/"`
- **Group active**: `groupHasActive` — any descendant's route is active
- Active leaf → white background, primary text
- Active group → semi-transparent white background, full white text

### Auto-expand on Load

When the page loads with a URL matching a child item, the parent group `open` state is initialised to `true`:

```js
const [open, setOpen] = useState(() => groupHasActive);
```

It also responds to URL changes (navigating via the browser):

```js
useEffect(() => {
  if (groupHasActive) setOpen(true);
}, [location.pathname]);
```

---

## `Sidebar` Component (default export)

### Props

| Prop              | Type                                | Description                                               |
| ----------------- | ----------------------------------- | --------------------------------------------------------- |
| `mode`            | `'expanded' \| 'icons' \| 'closed'` | Controls width and visibility                             |
| `onRequestExpand` | `function`                          | Called to request `Dashboard` to set mode to `'expanded'` |

### Layout Sections (top to bottom)

1. **Logo** — `<AppLogo />`, size adapts to mode
2. **User info** — avatar initials + name + role in expanded, initials only in icons
3. **Navigation** — the full `NAV` tree via `NavItem`
4. **Version** — `v0.1.0` at the bottom (replaces the logout button that was there before)

### Positioning

- `fixed` on mobile: overlays content, slides in from the left
- `lg:relative` on desktop: in-flow, adjusts main content width automatically

### Animation

Uses `motion.aside` from Framer Motion with `sidebarVariants` from `AnimationContext`:

```jsx
<motion.aside
  variants={sidebarVariants}
  animate={mode}     // "expanded" | "icons" | "closed"
  initial={false}    // no animation on first render
>
```

See [Animations.md](./Animations.md) for details on `sidebarVariants`.

---

## `APP_VERSION` Constant

```js
const APP_VERSION = "0.1.0";
```

Displayed at the bottom of the sidebar. Update this when releasing a new version.
