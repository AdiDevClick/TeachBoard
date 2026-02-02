/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import type { ConfigEnv } from "vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const mainPath = "./src";
const assetsPath = "./src/assets";
const bundlePath = "./dist";

const backendUrl = process.env.VITE_BACKEND_URL || "https://localhost:8443";

export default function viteConfig({ mode }: ConfigEnv) {
  const isProduction = mode === "production";
  const generateScopedName = isProduction
    ? "[hash:base64:8]"
    : "[name]__[local]___[hash:base64:5]";

  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      svgr(),
      tailwindcss(),
      // sassDts({
      //   // // Generate both in development and production so module declarations exist for editors and CI
      //   // enabledMode: ["development", "production"],
      //   // // Use legacy style declaration filenames (`*.module.scss.d.ts`) for best editor/TS compatibility
      //   legacyFileFormat: true,
      //   // esmExport: true,
      //   // // Generate named type (e.g., `EvaluationPageNames`) for per-file union typing
      //   useNamedExport: true,
      //   // typeName: {
      //   //   replacement: (fileName) => {
      //   //     const split = fileName.split(".");
      //   //     return `${split[0]}Names`;
      //   //   },
      //   // },
      //   // global: {
      //   //   generate: true,
      //   //   outputFilePath: path.resolve(__dirname, "./src/assets/css/style.d.ts"),
      //   // },
      //   sourceDir: path.resolve(__dirname, mainPath),
      //   outputDir: path.resolve(__dirname, bundlePath),
      // }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, mainPath),
        "@css": path.resolve(__dirname, `${assetsPath}/css`),
        "@modules": path.resolve(__dirname, `${assetsPath}/css/*.module.scss`),
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
      testTimeout: 12000,
      fileParallelism: false,
      maxConcurrency: 1,
      setupFiles: ["./test.setup-file.ts"],
      browser: {
        provider: playwright(),
        enabled: true,
        // at least one instance is required
        instances: [{ browser: "chromium" }],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@use "@/modules" as common;`,
          importer(...args) {
            if (args[0] !== "@/modules") {
              return;
            }

            return {
              file: `${path.resolve(__dirname, "./src/assets/css")}`,
            };
          },
        },
      },
      modules: {
        exportGlobals: false,
        localsConvention: "camelCaseOnly",
        generateScopedName: generateScopedName,
        //   // globalModulePaths: [/global\.scss$/],
      },
    },
  });
}
