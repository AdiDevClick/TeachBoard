export const formsRegex = {
  // Server-side patterns (kept as source of truth)
  serverEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // matches provided EMAIL_REGEX
  serverUsername: /^[a-zA-Z0-9._-]{3,}$/, // matches provided USERNAME_REGEX

  // Sanitizers / character classes used on the client for immediate feedback
  // Remove anything that is not ASCII letter/digit or the small set of allowed
  // punctuation for usernames
  allowedCharsUsernameRemove: /[^a-zA-Z0-9._-]/g,
  // For emails we allow @ in addition
  allowedCharsEmailRemove: /[^a-zA-Z0-9@._-]/g,

  // Single-character allowed tests (used for onBeforeInput checks)
  allowedCharUsernameTest: /^[a-zA-Z0-9._-]$/,
  allowedCharEmailTest: /^[a-zA-Z0-9@._-]$/,
};
