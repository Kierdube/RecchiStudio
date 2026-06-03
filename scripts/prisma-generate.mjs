import { execSync } from "node:child_process";

import { ensureDirectDatabaseUrl } from "./prisma-env.mjs";

ensureDirectDatabaseUrl();
execSync("npx prisma generate", { stdio: "inherit", env: process.env });
