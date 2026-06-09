import { execFileSync } from "node:child_process";

import { config } from "dotenv";

config({ path: ".env.local" });
config();

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (testDatabaseUrl) {
  process.env.DATABASE_URL = testDatabaseUrl;
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
  });
} else {
  process.env.DATABASE_URL ||= "postgresql://user:password@localhost:5432/primvet_test";
}
