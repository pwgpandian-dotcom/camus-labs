import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { DocumentUploadForm } from "@/components/admin/DocumentUploadForm";
import { DocumentLink } from "@/components/admin/DocumentLink";

export default async function DocumentsPage() {
  const supabase = await createClient();

  const [{ data: documents, error }, { data: clients }] = await Promise.all([
    supabase
      .from("documents")
      .select("id, title, category, file_url, created_at, clients(company_name)")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, company_name").order("company_name"),
  ]);

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Contracts, requirements, design files and reports — stored in a private Supabase Storage bucket."
      />

      <DocumentUploadForm
        clients={(clients || []).map((c) => ({ id: c.id, label: c.company_name }))}
      />

      {error && (
        <div className="mt-6">
          <EmptyState title="Couldn't load documents" description={error.message} />
        </div>
      )}

      {!error && (!documents || documents.length === 0) && (
        <div className="mt-6">
          <EmptyState
            title="No documents yet"
            description="Upload the first one above — it'll show up here immediately."
          />
        </div>
      )}

      {documents && documents.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Uploaded</th>
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
                  <td className="px-5 py-3 text-slate-500">{d.clients?.company_name || "—"}</td>
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
      )}
    </div>
  );
}
