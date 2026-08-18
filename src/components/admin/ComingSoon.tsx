import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";

export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <EmptyState
        title={`${title} is on the roadmap`}
        description={`This section is planned for ${phase}. The database tables it needs already exist — this screen just hasn't been built yet.`}
      />
    </div>
  );
}
