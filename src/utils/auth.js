// ─────────────────────────────────────────────────────────────────────────────
// Auth utilities — mock implementation (no API calls)
// Replace with real API calls when the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_USER_KEY = "erp_user";

/**
 * Attempt login with email + password.
 * Returns { success: true, user } or { success: false, error }.
 * On success, persists user data and auth token to localStorage.
 */
export function loginUser(user) {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

/**
 * Read the currently authenticated user from localStorage.
 * Returns the user object, or null if not logged in.
 * Synchronous — localStorage.getItem is a sync API.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);

    let user = raw ? JSON.parse(raw) : null;

    // parse permissions if they exist as a JSON string
    if (user && typeof user.permissions === "string") {
      try {
        user.permissions = JSON.parse(user.permissions);
      } catch {
        // If parsing fails, keep it as the original string
      }
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Clear authentication data from localStorage (sign out).
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_USER_KEY);
  window.location.href = "/login"; // Redirect to login page after logout
}

/**
 * Returns true if an auth token exists in localStorage.
 */
export function isAuthenticated() {
  // Get user from localStorage and check if token exists
  const user = getCurrentUser();
  const tokenExists = user && user.token;
  return !!tokenExists;
}
