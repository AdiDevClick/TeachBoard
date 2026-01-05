/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const mainPath = "./src";
const assetsPath = "./src/assets";
const backendUrl = process.env.VITE_BACKEND_URL || "https://localhost:8443";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    svgr(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, mainPath),
      "@css": path.resolve(__dirname, `${assetsPath}/css`),
      "@assets": path.resolve(__dirname, assetsPath),
      "@components": path.resolve(__dirname, `${mainPath}/components`),
      "@hooks": path.resolve(__dirname, `${mainPath}/hooks`),
      "@utils": path.resolve(__dirname, `${mainPath}/utils`),
      "@icons": path.resolve(__dirname, `${assetsPath}/icons`),
      "@data": path.resolve(__dirname, `${mainPath}/data`),
      "@images": path.resolve(__dirname, `${assetsPath}/images`),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ["vitest-browser-react/pure"],
  },
  test: {
    testTimeout: 5000,
    setupFiles: ["./test.setup-file.ts"],
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [{ browser: "chromium" }],
    },
  },
});
