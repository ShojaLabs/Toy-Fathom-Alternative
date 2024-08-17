import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as user from "./schema/user";
import * as integration from "./schema/integration";
import * as installation from "./schema/installation";
import * as zoom_oauth from "./schema/zoom_oauth";
import * as meeting from "./schema/meeting";
import * as meeting_bot from "./schema/meeting_bot";
import * as calendar_oauth from "./schema/calendar_oauth";
import * as plugs_slack from "./schema/plugs_slack";

// for query purposes
const queryClient = postgres(process.env.APP_DB_URL!);
const db = drizzle(queryClient, {
  schema: {
    ...user,
    ...integration,
    ...installation,
    ...zoom_oauth,
    ...meeting,
    ...meeting_bot,
    ...calendar_oauth,
    ...plugs_slack,
  },
});

export default db;
