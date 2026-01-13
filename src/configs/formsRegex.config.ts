export const formsRegex = {
  // Server-side patterns (kept as source of truth)
  serverEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // matches provided EMAIL_REGEX
  serverUsername: /^[a-zA-Z0-9._-]{3,}$/, // matches provided USERNAME_REGEX
  noSpecialCharsWithTwoCharMin: /^[a-zA-Z0-9 ]{2,}$/,
  skillId: /^[a-zA-Z0-9_-]{2,}$/, // For skill IDs like MAIN_2F90AB
  // Name fields (e.g. diploma names) should support Unicode letters and
  // common separators like spaces, hyphens and apostrophes. These patterns
  // are used server-side and for client-side immediate sanitization.
  serverName: /^[\p{L}0-9 ._'-]{1,255}$/u,
  allowedCharsNameRemove: /[^\p{L}0-9 ._'-]/gu,
  // Sanitizers / character classes used on the client for immediate feedback
  // Remove anything that is not ASCII letter/digit or the small set of allowed
  // punctuation for usernames
  allowedCharsUsernameRemove: /[^a-zA-Z0-9._-]/g,
  // For emails we allow @ in addition
  allowedCharsEmailRemove: /[^a-zA-Z0-9@._-]/g,

  // Single-character allowed tests (used for onBeforeInput checks)
  allowedCharUsernameTest: /^[a-zA-Z0-9._-]$/,
  // Single-character test for name fields to be used on input events
  // (allows accented letters through Unicode \p{L} property).
  allowedCharNameTest: /^[\p{L}0-9 ._'-]$/u,
  allowedCharEmailTest: /^[a-zA-Z0-9@._-]$/,
  viewYearRange: /^\d{4} - \d{4}$/,
  serverYearRange: /^\d{4}-\d{4}$/,
  serverSessionToken: /^[0-9a-f]{32}$/i,
};
