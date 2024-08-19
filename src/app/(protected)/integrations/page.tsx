import IntegrationCard from "./_components/integrationCard";
import db from "@/services/db";
import {
  Installation,
  InstallationTable,
} from "@/services/db/schema/installation";
import { Integration } from "@/services/db/schema/integration";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq } from "drizzle-orm";
import { CloseButton } from "../meetings/[id]/closeButton";

export default async function IntegrationsPage() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  if (!userId) {
    // user is not unauthorised
    return null;
  }

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
    <div className="flex flex-wrap gap-4">
      <div className="absolute top-4 right-4">
        <CloseButton />
      </div>
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
