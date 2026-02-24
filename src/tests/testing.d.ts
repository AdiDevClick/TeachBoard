/* eslint-disable no-unused-vars */

declare global {
  const render: typeof import("vitest-browser-react").render;
  const renderHook: typeof import("vitest-browser-react").renderHook;
  const cleanup: typeof import("vitest-browser-react").cleanup;
}

export {}; /* eslint-enable no-unused-vars */
