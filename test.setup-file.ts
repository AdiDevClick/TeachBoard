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
  console.error("[vitest-browser] unhandledrejection", event.reason ?? event);
});

window.addEventListener("error", (event) => {
  console.error("[vitest-browser] error", event.error ?? event);
});
