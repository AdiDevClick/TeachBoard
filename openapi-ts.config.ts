import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./src/api/types/openapi/openapi",
  output: {
    path: "./src/api/routes",
    postProcess: ["prettier", "eslint"],
  },
  plugins: [
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
  ],
});
