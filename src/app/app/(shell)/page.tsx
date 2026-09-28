import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, FileText, Flame, Hammer, Map, Mic, Sparkles } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { ActionRow, Panel, Progress, StatCard } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { computeStreak, activeDaysThisWeek, daysAgoISO } from "@/lib/learn/streak";
import { nextAction } from "@/lib/learn/next-action";
import { matchCareer } from "@/lib/learn/profile-generator";
import { getCareer } from "@/lib/learn/catalog/careers";
import { isSchoolStage } from "@/lib/learn/catalog/onboarding";

export const metadata = { title: "Home" };

function greeting(tz: string | null) {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: tz || "UTC" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireLearner();
  const since = daysAgoISO(60);

  const [activity, progress, resumes, jobs, interviews, quizzes, projects, convos] = await Promise.all([
    supabase.from("learn_activity").select("created_at").eq("user_id", user.id).gte("created_at", since).order("created_at", { ascending: false }).limit(500),
    supabase.from("learn_skill_progress").select("roadmap_slug, step_key, status").eq("user_id", user.id),
    supabase.from("learn_resumes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("learn_job_analyses").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("learn_interviews").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("learn_quiz_attempts").select("subject, topic, score, total, completed_at").eq("user_id", user.id).not("completed_at", "is", null).order("completed_at", { ascending: false }).limit(20),
    supabase.from("learn_projects").select("id, title, status").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(5),
    supabase.from("learn_conversations").select("id, title, mode, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(4),
  ]);

  const tz = profile?.timezone ?? "UTC";
  const stamps = (activity.data ?? []).map((a) => a.created_at);
  const streak = computeStreak(stamps, new Date(), tz);
  const weekDays = activeDaysThisWeek(stamps, new Date(), tz);

  // Roadmap: the target role's roadmap, or whichever the learner has progress on.
  const matched = matchCareer(profile?.target_role);
  const progressRows = progress.data ?? [];
  const roadmapSlug = matched?.slug ?? progressRows[0]?.roadmap_slug ?? null;
  const roadmap = roadmapSlug ? getCareer(roadmapSlug) : undefined;
  const roadmapDone = roadmap ? progressRows.filter((p) => p.roadmap_slug === roadmap.slug && p.status === "done").length : 0;
  const roadmapTotal = roadmap?.roadmap.length ?? 0;

  const quizRows = quizzes.data ?? [];
  const weak = quizRows.find((q) => q.total > 0 && (q.score ?? 0) / q.total < 0.6);
  const avgQuiz = quizRows.length ? Math.round((quizRows.reduce((a, q) => a + (q.score ?? 0) / q.total, 0) / quizRows.length) * 100) : null;
  const activeProjects = (projects.data ?? []).filter((p) => p.status !== "completed");

  const action = nextAction({
    stage: profile?.stage ?? null,
    ageBand: profile?.age_band ?? null,
    roadmapSlug: roadmap?.slug ?? null,
    roadmapDone,
    roadmapTotal,
    resumes: resumes.count ?? 0,
    jobAnalyses: jobs.count ?? 0,
    interviews: interviews.count ?? 0,
    quizzes: quizRows.length,
    weakTopic: weak ? { subject: weak.subject, topic: weak.topic } : null,
    projectsActive: activeProjects.length,
    examGoals: profile?.exam_goals ?? [],
  });

  const school = isSchoolStage(profile?.stage);
  const minor = profile?.age_band === "under_13" || profile?.age_band === "13_17";
  const name = profile?.display_name?.split(" ")[0] ?? "there";

  return (
    <Page>
      <p className="text-sm text-slate-500">{greeting(tz)},</p>
      <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-ink md:text-3xl">{name}</h1>

      {/* Next step hero */}
      <section aria-labelledby="next-step" className="mt-6 overflow-hidden rounded-2xl bg-ink text-paper">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">Your next step</p>
            <h2 id="next-step" className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{action.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{action.description}</p>
          </div>
          <Link href={action.href} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-slate-100">
            {action.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Progress */}
      <section aria-label="Progress" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Learning streak" value={<span className="inline-flex items-center gap-1.5">{streak}<Flame size={18} className={streak > 0 ? "text-warning" : "text-slate-300"} aria-hidden /></span>} hint={streak === 1 ? "day" : "days"} />
        <StatCard label="Active this week" value={`${weekDays}/7`} hint="days with learning activity" />
        <StatCard label="Quiz accuracy" value={avgQuiz === null ? "—" : `${avgQuiz}%`} hint={avgQuiz === null ? "Take a quiz to see this" : `last ${quizRows.length} quizzes`} />
        {school || minor ? (
          <StatCard label="Quizzes completed" value={quizRows.length} hint="in total" />
        ) : (
          <StatCard label="Mock interviews" value={interviews.count ?? 0} hint="completed" />
        )}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {roadmap ? (
            <Panel>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] text-slate-500">Skill roadmap</p>
                  <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-ink">{roadmap.title}</h3>
                </div>
                <span className="text-sm tabular-nums text-slate-500">
                  {roadmapDone}/{roadmapTotal}
                </span>
              </div>
              <Progress value={(roadmapDone / Math.max(1, roadmapTotal)) * 100} label={`${roadmap.title} roadmap progress`} className="mt-4" />
              <ol className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {roadmap.roadmap.slice(0, 6).map((s, i) => {
                  const done = progressRows.some((p) => p.roadmap_slug === roadmap.slug && p.step_key === s.key && p.status === "done");
                  return (
                    <li key={s.key} className="flex items-center gap-3 text-sm">
                      <span className={done ? "flex h-6 w-6 items-center justify-center rounded-full bg-success text-[11px] font-semibold text-paper" : "flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] text-slate-500"}>
                        {done ? "✓" : i + 1}
                      </span>
                      <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>{s.title}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-5">
                <Button href={`/app/roadmaps/${roadmap.slug}`} variant="secondary" size="sm">
                  Open roadmap
                </Button>
              </div>
            </Panel>
          ) : (
            <Panel>
              <h3 className="text-lg font-semibold tracking-tight text-ink">Pick a direction</h3>
              <p className="mt-1 text-sm text-slate-500">You haven&apos;t chosen a target role yet. Explore careers to find one that fits your goals — you can always change it.</p>
              <div className="mt-4">
                <Button href="/app/careers" size="sm">Explore careers</Button>
              </div>
            </Panel>
          )}

          <Panel className="p-2 md:p-3">
            <h3 className="px-3 pt-2 text-[13px] font-medium text-slate-500">Jump back in</h3>
            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2">
              <ActionRow href="/app/assistant" icon={<Sparkles size={18} />} title="Ask the assistant" description="Any subject, career or project question" />
              <ActionRow href="/app/study" icon={<BookOpen size={18} />} title="Study tutor" description="Lessons, practice and quizzes" />
              <ActionRow href="/app/careers" icon={<Map size={18} />} title="Explore careers" description="Compare roles against your goals" />
              <ActionRow href="/app/projects" icon={<Hammer size={18} />} title="Build a project" description="Scoped to your level" />
              {!minor && <ActionRow href="/app/resume" icon={<FileText size={18} />} title="Resume builder" description="ATS-friendly and truthful" />}
              {!minor && <ActionRow href="/app/jobs" icon={<Briefcase size={18} />} title="Job match" description="Analyse a job description" />}
              {!minor && <ActionRow href="/app/interview" icon={<Mic size={18} />} title="Interview coach" description="Practise with feedback" />}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-ink">Recent conversations</h3>
              <Link href="/app/assistant" className="text-[13px] text-signal-dark hover:underline">New</Link>
            </div>
            {(convos.data ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No conversations yet. Ask anything — maths, careers, code or your next project.</p>
            ) : (
              <ul className="mt-3 flex flex-col">
                {(convos.data ?? []).map((c) => (
                  <li key={c.id}>
                    <Link href={`/app/assistant?c=${c.id}`} className="block rounded-lg px-2 py-2 hover:bg-slate-50">
                      <span className="block truncate text-sm text-ink">{c.title}</span>
                      <span className="text-xs capitalize text-slate-400">{c.mode} mode</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-ink">Projects</h3>
              <Link href="/app/projects" className="text-[13px] text-signal-dark hover:underline">All</Link>
            </div>
            {activeProjects.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No active projects. Generate one matched to your level.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-1">
                {activeProjects.map((p) => (
                  <li key={p.id}>
                    <Link href={`/app/projects/${p.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-slate-50">
                      <span className="truncate text-ink">{p.title}</span>
                      <span className="shrink-0 text-xs capitalize text-slate-400">{p.status.replace("_", " ")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </Page>
  );
}
