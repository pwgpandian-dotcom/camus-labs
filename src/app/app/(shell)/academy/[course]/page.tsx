import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader } from "@/components/learn/ui";
import { getCourse } from "@/lib/learn/catalog/academy";
import { Markdown } from "@/components/learn/Markdown";
import { LessonDone } from "./LessonDone";

export async function generateMetadata({ params }: PageProps<"/app/academy/[course]">) {
  const { course } = await params;
  return { title: getCourse(course)?.title ?? "AI Academy" };
}

export default async function CoursePage({ params }: PageProps<"/app/academy/[course]">) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const { supabase, user } = await requireLearner();
  const { data: rows } = await supabase.from("learn_skill_progress").select("step_key, status").eq("user_id", user.id).eq("roadmap_slug", `academy:${slug}`);
  const done = new Set((rows ?? []).filter((r) => r.status === "done").map((r) => r.step_key));

  return (
    <Page width="narrow">
      <Link href="/app/academy" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> AI Academy
      </Link>
      <PageHeader eyebrow={`${course.level} course`} title={course.title} description={course.summary} />
      <ol className="flex flex-col gap-6">
        {course.lessons.map((l, i) => (
          <li key={l.slug} id={l.slug} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-paper p-5 md:p-6">
            <p className="text-xs text-slate-400">Lesson {i + 1} · {l.minutes} min</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">{l.title}</h2>
            <Markdown content={l.body} className="mt-3" />
            <div className="mt-5 rounded-xl bg-mist p-4">
              <p className="text-[13px] font-medium text-ink">Try it</p>
              <p className="mt-1 text-sm text-slate-600">{l.exercise}</p>
              <Link href={`/app/assistant?q=${encodeURIComponent(l.exercise)}`} className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-signal-dark hover:underline">
                <Sparkles size={13} /> Practise in the assistant
              </Link>
            </div>
            <LessonDone course={slug} lesson={l.slug} initialDone={done.has(l.slug)} />
          </li>
        ))}
      </ol>
    </Page>
  );
}
