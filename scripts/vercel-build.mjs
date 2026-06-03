import { execSync } from "node:child_process";

import { ensureDirectDatabaseUrl } from "./prisma-env.mjs";

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

ensureDirectDatabaseUrl();
run("npx prisma generate");
run("npx next build");
