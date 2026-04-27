const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  special: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

export function generatePassword(length, opts) {
  let useOptions = opts || getPasswordOptions();
  let useLength = length || useOptions.length || 15;

  let chars = "";
  if (useOptions.lower) chars += CHAR_SETS.lower;
  if (useOptions.upper) chars += CHAR_SETS.upper;
  if (useOptions.number) chars += CHAR_SETS.number;
  if (useOptions.special) chars += CHAR_SETS.special;
  if (!chars) return "";
  let password = "";
  for (let i = 0; i < useLength; i++) {
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
  return options
    ? JSON.parse(options)
    : { lower: true, upper: true, number: true, special: true, length: 15 };
}
