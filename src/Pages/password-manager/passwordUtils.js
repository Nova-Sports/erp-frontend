const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  special: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

export function generatePassword(length, opts) {
  let chars = "";
  if (opts.lower) chars += CHAR_SETS.lower;
  if (opts.upper) chars += CHAR_SETS.upper;
  if (opts.number) chars += CHAR_SETS.number;
  if (opts.special) chars += CHAR_SETS.special;
  if (!chars) return "";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Save password options to localStorage
 * @param {Object} options - The password options to save
 */
export function savePasswordOptions(options) {
  localStorage.setItem("passwordOptions", JSON.stringify(options));
}

/**
 * Retrieve password options from localStorage
 * @returns {Object|null} The retrieved options or null if not found
 */
export function getPasswordOptions() {
  const options = localStorage.getItem("passwordOptions");
  return options ? JSON.parse(options) : null;
}
