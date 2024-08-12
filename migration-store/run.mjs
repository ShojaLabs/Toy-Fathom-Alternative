import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from "postgres";

const DATABASE_URL = process.env.APP_DB_URL;

console.log("DB : ", DATABASE_URL);

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = postgres(DATABASE_URL, { max: 1, connect_timeout: 20 });

sql`SELECT 1`.then(() => {
  console.log('Connection successful!');
}).catch(err => {
  console.error('Connection error:', err);
});

const db = drizzle(sql, {
  logger: true
});

const main = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "/app/migration-store/migrations" }); // Specify the migrations folder
  await sql.end();
  console.log("Database migrated successfully!");
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
