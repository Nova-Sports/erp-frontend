// ─────────────────────────────────────────────────────────────────────────────
// Auth utilities — mock implementation (no API calls)
// Replace with real API calls when the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_USER_KEY = "erp_user";
const STORAGE_TOKEN_KEY = "erp_auth_token";

// Static test credentials — visible on the login page
const TEST_CREDENTIALS = [
  {
    email: "admin@sportswear.erp",
    password: "Admin@123",
    user: {
      userId: "usr_001",
      firstName: "Admin",
      lastName: "User",
      email: "admin@sportswear.erp",
      phone: "+1-555-0100",
      companyId: "comp_001",
      companyName: "SportswearERP Demo",
      role: "admin",
      permissions: [
        "dashboard.view",
        "hrm.view",
        "hrm.edit",
        "inventory.view",
        "inventory.edit",
        "financial.view",
        "financial.edit",
        "production.view",
        "production.edit",
        "service.view",
        "service.edit",
        "purchasing.view",
        "purchasing.edit",
        "password.view",
        "password.edit",
        "users.view",
        "users.edit",
        "users.delete",
        "reports.view",
        "reports.export",
        "settings.view",
        "settings.edit",
      ],
    },
  },
];

/**
 * Attempt login with email + password.
 * Returns { success: true, user } or { success: false, error }.
 * On success, persists user data and auth token to localStorage.
 */
export async function loginUser(email, password) {
  const match = TEST_CREDENTIALS.find(
    (cred) => cred.email === email && cred.password === password,
  );

  // mimic async API call delay
  await new Promise((r) => setTimeout(r, 500));

  if (!match) {
    return { success: false, error: "Invalid email or password." };
  }

  const token = "mock_token_" + Date.now();
  const userData = { ...match.user, token };

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
  localStorage.setItem(STORAGE_TOKEN_KEY, token);

  return { success: true, user: userData };
}

/**
 * Register a new user.
 * Returns { success: true, user } or { success: false, error }.
 * On success, persists user data and auth token to localStorage.
 */
export async function registerUser({ firstName, lastName, phone, email }) {
  const token = "mock_token_" + Date.now();
  const userData = {
    userId: "usr_" + Date.now(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    companyId: "comp_" + Date.now(),
    companyName: `${firstName.trim()}'s Company`,
    role: "owner",
    permissions: ["dashboard.view", "password.view", "password.edit"],
    token,
  };

  // mimic async API call delay
  await new Promise((r) => setTimeout(r, 500));

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
  localStorage.setItem(STORAGE_TOKEN_KEY, token);

  return { success: true, user: userData };
}

/**
 * Read the currently authenticated user from localStorage.
 * Returns the user object, or null if not logged in.
 * Synchronous — localStorage.getItem is a sync API.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear authentication data from localStorage (sign out).
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

/**
 * Returns true if an auth token exists in localStorage.
 */
export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_TOKEN_KEY);
}
