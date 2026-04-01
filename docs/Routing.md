# Routing

All routing lives in `src/App.jsx`. The app uses **React Router v6** with nested routes.

---

## Route Map

| Path                  | Component         | Access                                                    |
| --------------------- | ----------------- | --------------------------------------------------------- |
| `/`                   | `LandingPage`     | Public                                                    |
| `/login`              | `LoginPage`       | Public only (redirects to `/dashboard` if logged in)      |
| `/register`           | `RegisterPage`    | Public only (redirects to `/dashboard` if logged in)      |
| `/dashboard`          | `Dashboard` shell | Protected (redirects to `/login` if not logged in)        |
| `/dashboard/password` | `Password`        | Protected (nested inside Dashboard)                       |
| `/dashboard/*`        | `NotFound`        | Protected — unknown paths stay inside the dashboard shell |
| `*` (outer)           | `RootFallback`    | Redirects: logged in → `/dashboard`, logged out → `/`     |

---

## Route Guards

### `ProtectedRoute`

Wraps any route that requires authentication.  
If `user` is `null`, redirects to `/login`.

```jsx
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
```

**Usage:**

```jsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
```

### `PublicRoute`

Wraps login and register so authenticated users can't access them.  
If `user` exists, redirects to `/dashboard`.

```jsx
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}
```

---

## Nested Routes — The Dashboard Shell

`Dashboard` uses React Router's `<Outlet>` to render child routes inside the sidebar+topbar shell.

```
/dashboard         → renders Dashboard.jsx (shell) + redirects index to /dashboard/password
/dashboard/password → renders Password.jsx inside the shell's <Outlet>
/dashboard/*       → renders NotFound.jsx inside the shell (404 stays in shell, sidebar visible)
```

This means adding a new page to the dashboard only requires:

1. Creating the component file in `src/components/modules/`
2. Adding a `<Route>` inside the `/dashboard` route in `App.jsx`
3. Adding an entry to the `NAV` array in `Sidebar.jsx`

---

## How to Add a New Route

### 1. Simple dashboard page

```jsx
// In App.jsx — add import at the top
import Customers from "./components/modules/Customers";

// Inside the /dashboard <Route> block
<Route path="customers" element={<Customers />} />;
```

This makes the page available at `/dashboard/customers`.

### 2. Nested page (e.g. `/dashboard/sales/customers`)

```jsx
// In App.jsx
import SalesCustomers from "./components/modules/sales/Customers";

// Nest under a sales group route
<Route path="sales">
  <Route path="customers" element={<SalesCustomers />} />
</Route>;
```

> **Important:** After adding the route, also add the corresponding entry to the `NAV`
> in `Sidebar.jsx` so users can navigate to it. See [Sidebar.md](./Sidebar.md).

### 3. Standalone public page (outside dashboard)

```jsx
// In AppRoutes()
<Route path="/about" element={<AboutPage />} />
```

---

## `RootFallback` — Smart Outer Catch-All

Any URL that doesn't match any defined route hits `RootFallback`:

```jsx
function RootFallback() {
  const { user } = useAuth();
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
}
```

This prevents blank pages for unknown URLs while respecting auth state.

---

## Context Dependency

Routes rendered inside `AppRoutes` have access to:

- `useAuth()` — via `AuthProvider` (wraps `AppRoutes`)
- `useNotification()` — via `NotificationProvider`
- `useAnimations()` — via `AnimationProvider`

The provider nesting order in `App.jsx` is:

```
AnimationProvider → NotificationProvider → AuthProvider → BrowserRouter → AppRoutes
```

`AnimationProvider` is outermost because it has no router dependency and should be available everywhere including future route-level animations.
