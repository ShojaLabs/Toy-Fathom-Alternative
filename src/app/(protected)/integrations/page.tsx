import IntegrationCard from "./_components/integrationCard";
import db from "@/services/db";
import { Integration, IntegrationTable } from "@/services/db/schema/integration"

export default async function IntegrationsPage() {
  const integrations: IntegrationTable[] = await db.select().from(Integration);
  console.log({ integrations });
  return (
    <div className="flex flex-wrap gap-2">
      {integrations.map((intg) => {
        return <IntegrationCard key={intg.id} {...intg} />;
      })}
    </div>
  );
}
