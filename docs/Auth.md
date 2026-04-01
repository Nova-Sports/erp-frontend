# Auth

Authentication is handled by two files that work together:

| File                           | Role                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| `src/utils/auth.js`            | Pure functions — reads/writes localStorage, validates credentials    |
| `src/contexts/AuthContext.jsx` | React context — holds user state, exposes action hooks to components |

---

## How It Works

```
Component
  → calls useAuth().login(email, password)
    → AuthContext calls loginUser(email, password) from auth.js
      → auth.js checks TEST_CREDENTIALS
      → on match: saves user + token to localStorage, returns { success: true, user }
      → on fail: returns { success: false, error: "..." }
    → AuthContext updates user state
  → component reacts to new user state
```

---

## `auth.js` — Utility Functions

**File:** `src/utils/auth.js`

These are standalone functions with no React dependency. Replace these with real API calls when the backend is ready.

### `loginUser(email, password)`

Validates credentials against `TEST_CREDENTIALS`.

```js
const result = loginUser("admin@sportswear.erp", "Admin@123");
// result: { success: true, user: { userId, firstName, ... , token } }

const fail = loginUser("wrong@email.com", "badpass");
// fail: { success: false, error: "Invalid email or password." }
```

On success, saves to localStorage:

- `erp_user` — full user object (JSON)
- `erp_auth_token` — mock token string

### `registerUser({ firstName, lastName, phone, email })`

Creates a new user object. Does **not** check for duplicate emails (mock).

```js
const result = registerUser({
  firstName: "Jane",
  lastName: "Smith",
  phone: "+1-555-1234",
  email: "jane@example.com",
});
// result: { success: true, user: { userId, firstName, role: "owner", ... } }
```

New users get `role: "owner"` with limited permissions (`dashboard.view`, `password.view/edit`).

### `getCurrentUser()`

Reads the current user from localStorage. Returns `null` if not logged in or if the stored data is invalid.

```js
const user = getCurrentUser(); // user object or null
```

### `logoutUser()`

Clears both localStorage keys.

```js
logoutUser();
// localStorage.removeItem("erp_user")
// localStorage.removeItem("erp_auth_token")
```

### `isAuthenticated()` (if present)

Returns `true` if `getCurrentUser()` returns a non-null value.

---

## `AuthContext.jsx` — React State

**File:** `src/contexts/AuthContext.jsx`  
**Hook:** `useAuth()`

### Values

| Value                    | Type             | Description                                                 |
| ------------------------ | ---------------- | ----------------------------------------------------------- |
| `user`                   | `object \| null` | Currently authenticated user. `null` = not logged in.       |
| `login(email, password)` | `function`       | Returns `{ success, user? }` or `{ success: false, error }` |
| `register(data)`         | `function`       | Returns same shape as login                                 |
| `logout()`               | `function`       | Clears session and sets `user` to `null`                    |

### Session Persistence

```js
const [user, setUser] = useState(() => getCurrentUser());
```

`getCurrentUser()` is called **once** during initialisation (lazy state init). This means:

- Refreshing the page keeps the user logged in
- No loading state needed — user is known synchronously from localStorage

---

## User Object

```js
{
  userId: "usr_001",
  firstName: "Admin",
  lastName: "User",
  email: "admin@sportswear.erp",
  phone: "+1-555-0100",
  companyId: "comp_001",
  companyName: "SportswearERP Demo",
  role: "admin",           // "admin" | "owner"
  permissions: [
    "dashboard.view",
    "hrm.view", "hrm.edit",
    "inventory.view", "inventory.edit",
    "financial.view", "financial.edit",
    "production.view", "production.edit",
    "password.view", "password.edit",
    "users.view", "users.edit", "users.delete",
    "reports.view", "reports.export",
    "settings.view", "settings.edit",
    // ...
  ],
  token: "mock_token_1714000000000"
}
```

---

## Test Credentials

| Email                  | Password    | Role                      |
| ---------------------- | ----------- | ------------------------- |
| `admin@sportswear.erp` | `Admin@123` | `admin` (all permissions) |

Additional test users can be added to `TEST_CREDENTIALS` in `auth.js`.

---

## Replacing with a Real API

When the backend is ready, only `auth.js` needs to change — `AuthContext.jsx` and all components remain the same.

### Replace `loginUser`

```js
export async function loginUser(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message ?? "Login failed." };
    }

    const { user, token } = await response.json();
    const userData = { ...user, token };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { success: true, user: userData };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
```

### Replace `registerUser` similarly

Follow the same pattern — call your registration endpoint, then save to localStorage and return `{ success, user }`.

### Make `AuthContext` async-ready

If `loginUser` becomes async, update `AuthContext`:

```js
const login = async (email, password) => {
  const result = await loginUser(email, password);
  if (result.success) setUser(result.user);
  return result;
};
```

Components that call `login()` must then `await` it:

```js
const result = await login(email, password);
```

### Token usage in API requests

Store the token and attach it to all subsequent requests:

```js
const token = localStorage.getItem("erp_auth_token");

fetch("/api/some/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## Checking Permissions in Components

The `user.permissions` array can be used to conditionally render UI:

```jsx
const { user } = useAuth();

const canEdit = user?.permissions?.includes("hrm.edit");

return <div>{canEdit && <button>Edit Employee</button>}</div>;
```

For a scalable approach, create a `hasPermission(user, permission)` utility in `auth.js`.
