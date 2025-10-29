#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const workspace = process.cwd();
const vscodeDir = path.join(workspace, ".vscode");
const scriptDir = path.join(workspace, "scripts");
const templateFile = path.join(scriptDir, "launch.template.json");
const skipFile = path.join(scriptDir, "skipFiles.json");
const outFile = path.join(vscodeDir, "launch.json");

function main() {
  if (!fs.existsSync(templateFile)) {
    console.error("Template not found:", templateFile);
    process.exit(1);
  }

  const template = JSON.parse(fs.readFileSync(templateFile, "utf8"));
  const skip = fs.existsSync(skipFile)
    ? JSON.parse(fs.readFileSync(skipFile, "utf8"))
    : [];

  // Inject skipFiles into the first configuration (safe default)
  if (template.configurations && template.configurations.length > 0) {
    template.configurations[0].skipFiles = skip;
  }

  fs.writeFileSync(outFile, JSON.stringify(template, null, 2), "utf8");
  console.log("Generated", outFile);
}

main();
