import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/services/db/schema/*",
  out: "./migration-store/migrations",
  dbCredentials: {
    url: process.env.APP_DB_URL!,
  },
});
