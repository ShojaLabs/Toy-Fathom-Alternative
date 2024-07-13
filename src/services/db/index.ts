import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as zoom from "./schema/zoom";

// for query purposes
const queryClient = postgres(process.env.APP_DB_URL!);
const db = drizzle(queryClient, {
  schema: {
    ...zoom,
  },
});

export default db;
