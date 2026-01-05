import { cleanup, render, renderHook } from "vitest-browser-react";
import { configure } from "vitest-browser-react/pure";

// Expose helpers globally so tests that expect auto-globals (e.g. `renderHook`) work
// Expose helpers globally so tests that expect auto-globals (e.g. `renderHook`) work
// Avoid TypeScript issues; tests are run in TS but this file may not be included for types.
(globalThis as any).renderHook = renderHook;
(globalThis as any).render = render;
(globalThis as any).cleanup = cleanup;

configure({
  reactStrictMode: true,
});

// Fail tests loudly if the browser reports uncaught errors or unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  // Re-throw the rejection so Vitest can treat it as a test failure
  throw event.reason ?? event;
});

window.addEventListener("error", (event) => {
  // Throw the underlying error if available
  throw (event.error ?? event) as any;
});
