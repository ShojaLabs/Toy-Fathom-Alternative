import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as user from "./schema/user";
import * as integration from "./schema/integration";
import * as installation from "./schema/installation";
import * as zoom_oauth from "./schema/zoom_oauth";

// for query purposes
const queryClient = postgres(process.env.APP_DB_URL!);
const db = drizzle(queryClient, {
  schema: {
    ...user,
    ...integration,
    ...installation,
    ...zoom_oauth,
  },
});

export default db;
