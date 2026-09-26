import Link from "next/link";
import { Award, Briefcase, GraduationCap, Pencil, Sparkles, Trash2 } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { Chip, Field, Input, Notice, PageHeader, Panel, Textarea } from "@/components/learn/ui";
import { ActionForm, SubmitButton } from "@/components/learn/Forms";
import { Button } from "@/components/ui/Button";
import { addCertification, addEducation, addExperience, deleteTwinItem } from "@/app/actions/learn/profile";
import type { GeneratedProfile } from "@/lib/learn/schemas";
import { STAGES } from "@/lib/learn/catalog/onboarding";

export const metadata = { title: "Career Twin" };

export default async function ProfilePage({ searchParams }: PageProps<"/app/profile">) {
  const sp = await searchParams;
  const { supabase, user, profile } = await requireLearner();
  const [edu, exp, certs, countries] = await Promise.all([
    supabase.from("learn_education").select("*").eq("user_id", user.id).order("end_year", { ascending: false, nullsFirst: true }),
    supabase.from("learn_experience").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
    supabase.from("learn_certifications").select("*").eq("user_id", user.id).order("issued_on", { ascending: false }),
    supabase.from("learn_countries").select("code, name"),
  ]);
  const gp = profile?.generated_profile as (GeneratedProfile & { source?: string }) | null;
  const countryName = (code?: string | null) => countries.data?.find((c) => c.code === code)?.name ?? code;
  const minor = profile?.age_band === "under_13" || profile?.age_band === "13_17";

  return (
    <Page>
      {sp.welcome && (
        <Notice tone="success" className="mb-6">
          Your Career Twin is ready. Every feature — the assistant, resume builder, interview coach — now uses it, so you won&apos;t need to repeat yourself.
        </Notice>
      )}
      <PageHeader
        eyebrow="Career Twin"
        title={profile?.display_name ?? "Your profile"}
        description="Your structured learning and career profile. Keep it current and every recommendation gets better."
        actions={
          <Button href="/app/onboarding" variant="secondary" size="sm">
            <Pencil size={14} /> Edit answers
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {gp && (
            <Panel>
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
                  <Sparkles size={18} className="text-signal" /> Personal learning & career profile
                </h2>
                <span className="text-xs text-slate-400">{gp.source === "ai" ? "AI-generated from your answers" : "Built from your answers"}</span>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{gp.currentLevel}</p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <ProfileList title="Goals" items={gp.goals} />
                <ProfileList title="Strengths" items={gp.strengths} empty="Add skills and experience to surface strengths." />
                <ProfileList title="Skill gaps" items={gp.skillGaps} empty="Set a target role to see skill gaps." />
                <ProfileList title="Preparation" items={gp.preparation} />
              </div>
              {gp.learningPath.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[13px] font-medium text-slate-500">Recommended learning path</h3>
                  <ol className="mt-3 flex flex-col gap-3">
                    {gp.learningPath.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-ink">{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-ink">{s.title}</p>
                          <p className="text-[13px] text-slate-500">{s.why}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {gp.projects.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[13px] font-medium text-slate-500">Recommended projects</h3>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {gp.projects.map((p, i) => (
                      <li key={i} className="rounded-xl border border-slate-200 p-3">
                        <p className="text-sm font-medium text-ink">{p.title}</p>
                        <p className="mt-0.5 text-xs capitalize text-slate-400">{p.level}</p>
                        <p className="mt-1 text-[13px] text-slate-500">{p.why}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button href="/app/projects" size="sm">Build a project</Button>
                  </div>
                </div>
              )}
            </Panel>
          )}

          {/* Education */}
          <Panel as="section">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <GraduationCap size={18} /> Education
            </h2>
            <ul className="mt-3 flex flex-col divide-y divide-slate-100">
              {(edu.data ?? []).map((e) => (
                <TwinRow key={e.id} kind="education" id={e.id} title={`${e.qualification}${e.field ? `, ${e.field}` : ""}`} sub={`${e.institution}${e.start_year || e.end_year ? ` · ${e.start_year ?? ""}–${e.end_year ?? "present"}` : ""}${e.grade ? ` · ${e.grade}` : ""}`} />
              ))}
              {(edu.data ?? []).length === 0 && <li className="py-2 text-sm text-slate-500">No education added yet.</li>}
            </ul>
            <details className="group mt-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-signal-dark">+ Add education</summary>
              <ActionForm action={addEducation} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" successMessage="Education added">
                <Field label="Institution" htmlFor="institution"><Input id="institution" name="institution" required maxLength={160} /></Field>
                <Field label="Qualification" htmlFor="qualification"><Input id="qualification" name="qualification" required maxLength={160} placeholder="e.g. B.Sc, Class 12, MBA" /></Field>
                <Field label="Field (optional)" htmlFor="field"><Input id="field" name="field" maxLength={160} /></Field>
                <Field label="Grade (optional)" htmlFor="grade"><Input id="grade" name="grade" maxLength={40} /></Field>
                <Field label="Start year" htmlFor="start_year"><Input id="start_year" name="start_year" type="number" inputMode="numeric" min={1950} max={2100} /></Field>
                <Field label="End year (or expected)" htmlFor="end_year"><Input id="end_year" name="end_year" type="number" inputMode="numeric" min={1950} max={2100} /></Field>
                <div className="sm:col-span-2"><SubmitButton>Add education</SubmitButton></div>
              </ActionForm>
            </details>
          </Panel>

          {!minor && (
            <Panel as="section">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Briefcase size={18} /> Experience
              </h2>
              <ul className="mt-3 flex flex-col divide-y divide-slate-100">
                {(exp.data ?? []).map((e) => (
                  <TwinRow key={e.id} kind="experience" id={e.id} title={`${e.title} · ${e.company}`} sub={`${e.start_date?.slice(0, 7) ?? ""}${e.start_date ? " – " : ""}${e.end_date?.slice(0, 7) ?? (e.start_date ? "present" : "")}`} body={e.description} />
                ))}
                {(exp.data ?? []).length === 0 && <li className="py-2 text-sm text-slate-500">No experience added. Internships, part-time work and volunteering all count.</li>}
              </ul>
              <details className="mt-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-signal-dark">+ Add experience</summary>
                <ActionForm action={addExperience} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" successMessage="Experience added">
                  <Field label="Company / organisation" htmlFor="company"><Input id="company" name="company" required maxLength={160} /></Field>
                  <Field label="Title" htmlFor="title"><Input id="title" name="title" required maxLength={160} /></Field>
                  <Field label="Start (month)" htmlFor="start_date"><Input id="start_date" name="start_date" type="month" /></Field>
                  <Field label="End (leave blank if current)" htmlFor="end_date"><Input id="end_date" name="end_date" type="month" /></Field>
                  <Field label="What did you do? (optional)" htmlFor="description" className="sm:col-span-2"><Textarea id="description" name="description" maxLength={2000} placeholder="Describe what you actually did and any real results." /></Field>
                  <div className="sm:col-span-2"><SubmitButton>Add experience</SubmitButton></div>
                </ActionForm>
              </details>
            </Panel>
          )}

          <Panel as="section">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <Award size={18} /> Certifications
            </h2>
            <ul className="mt-3 flex flex-col divide-y divide-slate-100">
              {(certs.data ?? []).map((c) => (
                <TwinRow key={c.id} kind="certification" id={c.id} title={c.name} sub={[c.issuer, c.issued_on?.slice(0, 7)].filter(Boolean).join(" · ")} />
              ))}
              {(certs.data ?? []).length === 0 && <li className="py-2 text-sm text-slate-500">Only add certifications you have actually earned.</li>}
            </ul>
            <details className="mt-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-signal-dark">+ Add certification</summary>
              <ActionForm action={addCertification} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" successMessage="Certification added">
                <Field label="Name" htmlFor="cname"><Input id="cname" name="name" required maxLength={160} /></Field>
                <Field label="Issuer" htmlFor="issuer"><Input id="issuer" name="issuer" maxLength={160} /></Field>
                <Field label="Issued (month)" htmlFor="issued_on"><Input id="issued_on" name="issued_on" type="month" /></Field>
                <Field label="Credential URL (optional)" htmlFor="url"><Input id="url" name="url" type="url" inputMode="url" maxLength={300} /></Field>
                <div className="sm:col-span-2"><SubmitButton>Add certification</SubmitButton></div>
              </ActionForm>
            </details>
          </Panel>
        </div>

        <aside className="flex flex-col gap-6">
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Snapshot</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <Row label="Stage" value={STAGES.find((s) => s.value === profile?.stage)?.label} />
              <Row label="Country" value={countryName(profile?.country_code)} />
              <Row label="Studying" value={profile?.current_education} />
              <Row label="Target role" value={profile?.target_role} />
              <Row label="Target country" value={countryName(profile?.target_country)} />
            </dl>
          </Panel>
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">{(profile?.skills ?? []).length ? profile!.skills.map((s) => <Chip key={s}>{s}</Chip>) : <p className="text-sm text-slate-500">None yet.</p>}</div>
            <h2 className="mt-5 text-[15px] font-semibold text-ink">Interests</h2>
            <div className="mt-3 flex flex-wrap gap-2">{(profile?.interests ?? []).length ? profile!.interests.map((s) => <Chip key={s}>{s}</Chip>) : <p className="text-sm text-slate-500">None yet.</p>}</div>
            {(profile?.exam_goals ?? []).length > 0 && (
              <>
                <h2 className="mt-5 text-[15px] font-semibold text-ink">Exam goals</h2>
                <div className="mt-3 flex flex-wrap gap-2">{profile!.exam_goals.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              </>
            )}
            <Link href="/app/onboarding" className="mt-5 inline-block text-sm text-signal-dark hover:underline">Update skills & interests</Link>
          </Panel>
        </aside>
      </div>
    </Page>
  );
}

function ProfileList({ title, items, empty }: { title: string; items: string[]; empty?: string }) {
  return (
    <div>
      <h3 className="text-[13px] font-medium text-slate-500">{title}</h3>
      {items.length ? (
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map((i, k) => (
            <li key={k} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-400">{empty ?? "—"}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-ink">{value || "—"}</dd>
    </div>
  );
}

function TwinRow({ kind, id, title, sub, body }: { kind: "education" | "experience" | "certification"; id: string; title: string; sub?: string; body?: string | null }) {
  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{title}</p>
        {sub && <p className="text-[13px] text-slate-500">{sub}</p>}
        {body && <p className="mt-1 whitespace-pre-line text-[13px] text-slate-600">{body}</p>}
      </div>
      <form action={deleteTwinItem.bind(null, kind, id)}>
        <button type="submit" aria-label={`Delete ${title}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-danger">
          <Trash2 size={15} />
        </button>
      </form>
    </li>
  );
}
