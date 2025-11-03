import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const mainPath = "./src";
const assetsPath = "./src/assets";
const backendUrl = process.env.dev.VITE_BACKEND_URL || "https://localhost:8443";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
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
});
