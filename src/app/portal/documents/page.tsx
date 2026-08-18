import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { DocumentLink } from "@/components/admin/DocumentLink";

export default async function PortalDocumentsPage() {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, title, category, file_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <EmptyState title="Couldn't load your documents" description={error.message} />;
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        title="No documents yet"
        description="Contracts, requirements and reports shared with you will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Shared</th>
            <th className="px-5 py-3 font-medium">File</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((d) => (
            <tr key={d.id}>
              <td className="px-5 py-3 font-medium text-ink">{d.title}</td>
              <td className="px-5 py-3">
                <Badge tone="neutral">{d.category}</Badge>
              </td>
              <td className="px-5 py-3 text-slate-400">
                {new Date(d.created_at).toLocaleDateString()}
              </td>
              <td className="px-5 py-3">
                <DocumentLink path={d.file_url} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
