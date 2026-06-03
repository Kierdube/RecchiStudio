import { execSync } from "node:child_process";

import { ensureDirectDatabaseUrl } from "./prisma-env.mjs";

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

function sleep(seconds) {
  execSync(`sleep ${seconds}`);
}

ensureDirectDatabaseUrl();

const maxAttempts = 3;
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    run("npx prisma migrate deploy");
    process.exit(0);
  } catch {
    if (attempt === maxAttempts) {
      console.error("prisma migrate deploy failed after 3 attempts");
      process.exit(1);
    }
    console.warn(`migrate deploy attempt ${attempt} failed, retrying in 5s…`);
    sleep(5);
  }
}
