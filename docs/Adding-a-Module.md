# Adding a Module

This guide walks through every step needed to add a complete new ERP module to the app — from the nav item to the page component. Follow these steps in order.

We'll use **"HRM → Employees"** as the example.

---

## Step 1 — Create the Page Component

Create the file at `src/components/modules/hrm/Employees.jsx`.

```jsx
// src/components/modules/hrm/Employees.jsx
import { Users } from "lucide-react";

export default function Employees() {
  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-dark">Employees</h1>
            <p className="text-gray-500 text-sm">Manage your workforce</p>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* your content here */}
      </div>
    </div>
  );
}
```

> The `p-8` outer padding and the white card pattern (`bg-white rounded-2xl border border-gray-200`) are the standard layout for module pages.

---

## Step 2 — Add the Route in `App.jsx`

Open `src/App.jsx`. Add your import and a new `<Route>` inside the `/dashboard` route block.

```jsx
// 1. Import at the top
import Employees from "./components/modules/hrm/Employees";

// 2. Inside the /dashboard Route block
<Route
  path="dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="password" replace />} />
  <Route path="password" element={<Password />} />

  {/* Add nested group routes */}
  <Route path="hrm">
    <Route path="employees" element={<Employees />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Route>;
```

This registers `/dashboard/hrm/employees`.

For a flat (non-grouped) route like `/dashboard/reports`:

```jsx
<Route path="reports" element={<Reports />} />
```

---

## Step 3 — Add Nav Item in `Sidebar.jsx`

Open `src/components/dashboard/Sidebar.jsx`.

### 3a. Import the icon

```js
// At the top of the file with other lucide imports
import { Users } from "lucide-react";
```

### 3b. Add to the `NAV` array

For a new top-level group:

```js
const NAV = [
  // ... existing items ...
  {
    id: "hrm",
    label: "HRM",
    icon: Users,
    children: [
      {
        id: "employees",
        label: "Employees",
        icon: Users,
        to: "/dashboard/hrm/employees",
      },
    ],
  },
];
```

For a new leaf item added to an existing group (e.g. adding to Sales):

```js
{ id: "invoices", label: "Invoices", icon: Receipt, to: "/dashboard/sales/invoices" },
```

> The `to` path in the NAV **must exactly match** the route path registered in `App.jsx`.

---

## Step 4 — (Optional) Create a Context for the Module

If the module needs shared state across multiple sub-pages (e.g., a selected employee passed between a list and a detail view), create a context.

```jsx
// src/contexts/HrmContext.jsx
import { createContext, useContext, useState } from "react";

const HrmContext = createContext({});

export const HrmProvider = ({ children }) => {
  /* *************  States  **************** */
  const [employeeContextData, setEmployeeContextData] = useState(null);

  /* ******************** Employee ************************* */
  const setEmployeeData = ({ data, id }) => {
    setEmployeeContextData({ data, id });
  };

  const clearEmployeeData = () => {
    setEmployeeContextData(null);
  };

  const hrmValues = {
    employeeContextData,
    setEmployeeData,
    clearEmployeeData,
  };

  return (
    <HrmContext.Provider value={hrmValues}>{children}</HrmContext.Provider>
  );
};

export default function useHrm() {
  return useContext(HrmContext);
}
```

Then register it in `App.jsx` around the routes that need it, **or** wrap the module route element directly:

```jsx
// Option A — wrap globally in App.jsx
<HrmProvider>
  <AppRoutes />
</HrmProvider>

// Option B — wrap only the HRM section of the route tree
<Route path="hrm" element={<HrmProvider><Outlet /></HrmProvider>}>
  <Route path="employees" element={<Employees />} />
</Route>
```

See [Contexts.md](./Contexts.md) for the full context pattern.

---

## Step 5 — (Optional) Add to Auth Permissions

If the module requires a specific permission, check it on the page before rendering:

```jsx
import { useAuth } from "../../contexts/AuthContext";

export default function Employees() {
  const { user } = useAuth();
  const canView = user?.permissions?.includes("hrm.view");

  if (!canView) {
    return (
      <div className="p-8 text-gray-500">
        You do not have permission to access this module.
      </div>
    );
  }

  // ... rest of the page
}
```

To grant the permission to a user, add `"hrm.view"` to their `permissions` array in `src/utils/auth.js` under `TEST_CREDENTIALS`.

---

## Complete Checklist

```
[ ] 1. Created src/components/modules/{group}/{ModuleName}.jsx
[ ] 2. Added <Route> in App.jsx
[ ] 3. Added NAV item in Sidebar.jsx (with matching `to` path)
[ ] 4. Created src/contexts/{Module}Context.jsx  (if state needed)
[ ] 5. Registered context provider in App.jsx     (if context created)
[ ] 6. Added permission string to TEST_CREDENTIALS (if access-controlled)
[ ] 7. Added permission to user object            (if access-controlled)
```

---

## Quick Reference: File Locations

| What               | Path                                                        |
| ------------------ | ----------------------------------------------------------- |
| Module page        | `src/components/modules/{group}/{Name}.jsx`                 |
| Route definition   | `src/App.jsx` — inside `/dashboard` Route block             |
| Nav item           | `src/components/dashboard/Sidebar.jsx` — `NAV` array        |
| Module context     | `src/contexts/{Name}Context.jsx`                            |
| Permission strings | `src/utils/auth.js` — `TEST_CREDENTIALS[].user.permissions` |
