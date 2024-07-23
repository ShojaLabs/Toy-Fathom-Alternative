import IntegrationCard from "./_components/integrationCard";
import db from "@/services/db";
import {
  Installation,
  InstallationTable,
} from "@/services/db/schema/installation";
import { Integration } from "@/services/db/schema/integration";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq } from "drizzle-orm";

export default async function IntegrationsPage() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  const integrations = await db.select().from(Integration);
  const installations = await db
    .select()
    .from(Installation)
    .where(eq(Installation.userId, userId!));

  let installationMap: {
    [key: string]: InstallationTable;
  } = {};
  installations.forEach((installation) => {
    installationMap[installation.integrationId] = installation;
  });

  return (
    <div className="flex flex-wrap gap-2">
      {integrations.map((intg) => {
        return (
          <IntegrationCard
            key={intg.id}
            {...intg}
            installed={!!installationMap[intg.id]}
          />
        );
      })}
    </div>
  );
}
