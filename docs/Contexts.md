# Contexts

The app has three global React contexts. All are registered in `src/App.jsx` as providers and are available throughout the component tree.

---

## Naming Convention

Contexts follow this pattern:

| File name                 | Provider export        | Hook export       |
| ------------------------- | ---------------------- | ----------------- |
| `AuthContext.jsx`         | `AuthProvider`         | `useAuth`         |
| `NotificationContext.jsx` | `NotificationProvider` | `useNotification` |
| `AnimationContext.jsx`    | `AnimationProvider`    | `useAnimations`   |

The hook is always the **default export**. The provider is a **named export**.

---

## 1. AuthContext

**File:** `src/contexts/AuthContext.jsx`  
**Hook:** `useAuth()`

Holds the currently authenticated user and exposes auth actions.

### Values

| Value                    | Type                | Description                                                                               |
| ------------------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `user`                   | `object \| null`    | The current user object, or `null` if not logged in                                       |
| `login(email, password)` | `function → result` | Attempts login, updates state. Returns `{ success, user }` or `{ success: false, error }` |
| `register(data)`         | `function → result` | Registers a user, updates state. Returns same shape as login                              |
| `logout()`               | `function`          | Clears session, sets `user` to `null`                                                     |

### User Object Shape

```js
{
  userId: "usr_001",
  firstName: "Admin",
  lastName: "User",
  email: "admin@sportswear.erp",
  phone: "+1-555-0100",
  companyId: "comp_001",
  companyName: "SportswearERP Demo",
  role: "admin",              // "admin" | "owner" | ...
  permissions: ["dashboard.view", "hrm.view", ...],
  token: "mock_token_1234"
}
```

### Usage in a Component

```jsx
import { useAuth } from "../../contexts/AuthContext";

function MyComponent() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Hello, {user?.firstName}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Session Persistence

`AuthContext` initialises from `localStorage` on mount:

```js
const [user, setUser] = useState(() => getCurrentUser());
```

This means the user stays logged in across page reloads without any server call.

---

## 2. NotificationContext

**File:** `src/contexts/NotificationContext.jsx`  
**Hook:** `useNotification()`

Drives the flash message shown in the centre of the `TopBar`.  
Only one notification is active at a time — calling `notify()` replaces the current one.

### Values

| Value                             | Type                        | Description                               |
| --------------------------------- | --------------------------- | ----------------------------------------- |
| `notification`                    | `{ message, type } \| null` | Currently active notification             |
| `notify(message, type, duration)` | `function`                  | Show a notification                       |
| `dismiss()`                       | `function`                  | Immediately hide the current notification |

### `notify()` Parameters

| Param      | Type                                          | Default  | Description                                               |
| ---------- | --------------------------------------------- | -------- | --------------------------------------------------------- |
| `message`  | `string`                                      | —        | The text to display                                       |
| `type`     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Controls colour and icon                                  |
| `duration` | `number` (ms)                                 | `4000`   | Auto-dismiss after this many ms. Pass `0` for persistent. |

### Usage in a Component

```jsx
import { useNotification } from "../../contexts/NotificationContext";

function SaveButton() {
  const { notify } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      notify("Record saved successfully.", "success");
    } catch (err) {
      notify("Failed to save. Please try again.", "error", 0); // persistent
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Notification Types & Colours

| Type      | Color token       | Icon            |
| --------- | ----------------- | --------------- |
| `success` | `success` (green) | `CheckCircle`   |
| `error`   | `danger` (red)    | `AlertCircle`   |
| `warning` | `warning` (amber) | `AlertTriangle` |
| `info`    | `accent` (cyan)   | `Info`          |

---

## 3. AnimationContext

**File:** `src/contexts/AnimationContext.jsx`  
**Hook:** `useAnimations()`

A library of reusable Framer Motion values — easing curves, durations, and component-specific variants.  
See [Animations.md](./Animations.md) for full detail.

### Values

| Value             | Type     | Description                                                           |
| ----------------- | -------- | --------------------------------------------------------------------- |
| `easing`          | `object` | Named cubic-bezier arrays (`easeIn`, `easeOut`, `easeInOut`, `sharp`) |
| `duration`        | `object` | Named durations in seconds (`fast`, `normal`, `slow`)                 |
| `sidebarVariants` | `object` | Framer Motion variants for the 3 sidebar modes                        |

---

## Creating a New Context

Follow this template (matching the project's style):

```jsx
// src/contexts/YourFeatureContext.jsx
import { createContext, useContext, useState } from "react";

const YourFeatureContext = createContext({});

export const YourFeatureProvider = ({ children }) => {
  /* *************  States  **************** */
  const [data, setData] = useState(null);

  /* ******************** Actions ************************* */
  const setFeatureData = ({ data }) => {
    if (data) setData({ data });
  };

  const clearFeatureData = () => setData(null);

  const yourFeatureValues = {
    data,
    setFeatureData,
    clearFeatureData,
  };

  return (
    <YourFeatureContext.Provider value={yourFeatureValues}>
      {children}
    </YourFeatureContext.Provider>
  );
};

export default function useYourFeature() {
  return useContext(YourFeatureContext);
}
```

Then register the provider in `App.jsx`:

```jsx
import { YourFeatureProvider } from "./contexts/YourFeatureContext";

// Inside App():
<YourFeatureProvider>{/* existing providers */}</YourFeatureProvider>;
```
