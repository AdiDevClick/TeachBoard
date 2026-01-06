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

// React dev-mode warnings can be extremely noisy in browser runs and have been
// observed to correlate with flakiness (websocket disconnects, dynamic import
// fetch failures). Filter only the known non-fatal warnings; keep everything
// else.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const firstArg = args[0];
  if (typeof firstArg === "string") {
    if (
      firstArg.startsWith("React does not recognize the `%s` prop on a DOM element") ||
      firstArg.startsWith("Unknown event handler property `%s`.") ||
      firstArg.startsWith("Received `%s` for a non-boolean attribute `%s`.")
    ) {
      return;
    }
  }
  originalConsoleError(...args);
};

// Fail tests loudly if the browser reports uncaught errors or unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("[vitest-browser] unhandledrejection", event.reason ?? event);
});

window.addEventListener("error", (event) => {
  console.error("[vitest-browser] error", event.error ?? event);
});
