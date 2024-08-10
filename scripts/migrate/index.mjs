import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import postgres from "postgres";

const migrationClient = postgres(process.env.APP_DB_URL, { max: 1 });
await migrate(drizzle(migrationClient), {
  migrationsFolder: "./migrations"
})
