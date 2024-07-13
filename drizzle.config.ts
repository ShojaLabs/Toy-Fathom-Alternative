import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/schema/*",
  out: "./drizzle",
  dbCredentials: {
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // host: "127.0.0.1",
    // port: 5432,
    // database: process.env.APP_DB!,
    url: process.env.APP_DB_URL!,
  },
});
