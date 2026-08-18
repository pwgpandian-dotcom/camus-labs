import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { SiteContentForm } from "@/components/admin/SiteContentForm";

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: sections, error } = await supabase
    .from("site_content")
    .select("id, section_key, content, updated_at")
    .order("section_key");

  return (
    <div>
      <PageHeader
        title="Website Content"
        description="A small CMS for copy that doesn't belong in code — nothing here is wired into the public pages yet, but the storage layer is real."
      />

      <div className="mb-8">
        <p className="mb-2 text-xs font-mono uppercase tracking-[0.08em] text-slate-400">
          Add a new section
        </p>
        <SiteContentForm />
      </div>

      {error && <EmptyState title="Couldn't load content" description={error.message} />}

      {!error && (!sections || sections.length === 0) && (
        <EmptyState
          title="No content sections yet"
          description="Add one above — e.g. a key like home.hero with a JSON body."
        />
      )}

      {sections && sections.length > 0 && (
        <div className="flex flex-col gap-6">
          <p className="text-xs font-mono uppercase tracking-[0.08em] text-slate-400">
            Existing sections
          </p>
          {sections.map((s) => (
            <SiteContentForm
              key={s.id}
              sectionKey={s.section_key}
              initialContent={JSON.stringify(s.content, null, 2)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
