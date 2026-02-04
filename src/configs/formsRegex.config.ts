export const formsRegex = {
  // Server-side patterns (kept as source of truth)
  serverEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // matches provided EMAIL_REGEX
  serverUsername: /^[a-zA-Z0-9._-]{3,}$/, // matches provided USERNAME_REGEX
  noSpecialCharsWithTwoCharMin: /^[a-zA-Z0-9 ]{2,}$/,
  skillId: /^[a-zA-Z0-9_-]{2,}$/, // For skill IDs like MAIN_2F90AB
  // Name fields (e.g. diploma names) should support Unicode letters and
  // common separators like spaces, hyphens and apostrophes. These patterns
  // are used server-side and for client-side immediate sanitization.
  // Accept commas, ampersand (&) and parentheses () in names as well.
  serverName: /^[\p{L}\p{M}0-9 ._'&,()/-]{1,100}$/u,
  serverDescription: /^[\p{L}\p{M}0-9 ._'&",()/-]{0,500}$/u,

  // Client-side patterns (for immediate input sanitization)
  allowedCharsNameRemove: /[^\p{L}\p{M}0-9 ._'&,()-]/gu,
  // Sanitizers / character classes used on the client for immediate feedback
  // Remove anything that is not ASCII letter/digit or the small set of allowed
  // punctuation for usernames
  allowedCharsUsernameRemove: /[^a-zA-Z0-9._-]/g,
  // For emails we allow @ in addition
  allowedCharsEmailRemove: /[^a-zA-Z0-9@._-]/g,

  // Single-character allowed tests (used for onBeforeInput checks)
  allowedCharUsernameTest: /^[a-zA-Z0-9._-]$/,
  // Single-character test for name fields to be used on input events
  // (allows accented letters through Unicode \p{L} property). Accepts comma, &, and parentheses.
  allowedCharNameTest: /^[\p{L}0-9 ._'&,()-]$/u,
  allowedCharDescriptionTest: /^[\p{L}\p{M}0-9'.,/;:!?"%&$€@#\n\r -]$/u,
  allowedCharEmailTest: /^[a-zA-Z0-9@._-]$/,
  viewYearRange: /^\d{4} - \d{4}$/,
  serverYearRange: /^\d{4}-\d{4}$/,
  serverSessionToken: /^[0-9a-f]{32}$/i,
  // Date in ISO 8601 format with timezone information
  // YYYY-MM-DDTHH:MM:SS.sssZ or YYYY-MM-DDTHH:MM:SS+HH:MM
  // ex: 2025-10-30T19:04:03.128+01:00
  dateISOTest:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/,
};
