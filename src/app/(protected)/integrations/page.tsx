import { saasIntegrationList } from "./_saasIntegrations";
import IntegrationCard from "./_components/integrationCard";

export default function Integrations() {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(saasIntegrationList).map((ik) => {
        const saas = saasIntegrationList[ik];
        return <IntegrationCard key={ik} {...saas} />;
      })}
    </div>
  );
}
