import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as zoom from "./schema/zoom";
import * as user from "./schema/user";

// for query purposes
const queryClient = postgres(process.env.APP_DB_URL!);
const db = drizzle(queryClient, {
  schema: {
    ...zoom,
    ...user,
  },
});

export default db;
