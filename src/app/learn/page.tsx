import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, Compass, FileText, Globe2, Hammer, Languages, Lock, Rocket, ShieldCheck, Smartphone, Sparkles, Target, UserRound } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CareerPreview, DashboardPreview, InterviewPreview, ProjectPreview, ResumePreviewCard, TutorPreview } from "@/components/learn/landing/Previews";
import { LandingPricing } from "@/components/learn/landing/LandingPricing";
import { InstallPrompt } from "@/components/learn/InstallPrompt";
import { createPublicClient } from "@/lib/supabase/public";
import { LOCALES } from "@/lib/learn/i18n";
import { IndiaFlag } from "@/components/learn/IndiaFlag";

const title = "Camus Learn — AI learning & career platform";
const description =
  "Learn subjects, discover career paths, build real projects, prepare for exams and interviews, create job-ready profiles and continuously grow your skills with AI.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn" },
  openGraph: { title, description, url: "/learn", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const START = "/login?redirect=/app&mode=sign-up";

// Static + revalidated: pricing/exams come from the DB; the viewer's currency is picked on the client.
export const revalidate = 600;

const JOURNEY = [
  { verb: "Learn", icon: BookOpen, body: "Subjects and skills with an AI tutor that teaches, not just answers." },
  { verb: "Discover", icon: Compass, body: "Careers compared against your own interests and goals." },
  { verb: "Build", icon: Hammer, body: "Scoped projects that prove what you can do." },
  { verb: "Prepare", icon: Target, body: "Exams and interviews with timed practice and feedback." },
  { verb: "Present", icon: FileText, body: "Truthful, ATS-friendly resumes and profiles." },
  { verb: "Apply", icon: Briefcase, body: "Job-description alignment and tailored preparation." },
  { verb: "Grow", icon: Sparkles, body: "Roadmaps, streaks and skills that compound." },
  { verb: "Create", icon: Rocket, body: "Turn ideas into products and businesses." },
];

const FAQ = [
  { q: "Is Camus Learn free?", a: "Yes. The Free plan includes the AI assistant with a daily limit, the career explorer, skill roadmaps and a resume. Paid plans add more AI usage and advanced tools, and start with a free trial." },
  { q: "Will Camus get me a job?", a: "No tool can honestly promise that. Camus measures and improves what you control — skills, projects, resume quality, job-description alignment and interview preparation — so you walk in ready." },
  { q: "Does the AI make things up on my resume?", a: "It's designed not to. The resume tools only rephrase what you've actually done and ask you for real results instead of inventing numbers, employers, degrees or certifications." },
  { q: "Can school students use it?", a: "Yes. Learners under 18 get an age-aware experience: we store an age range rather than a birth date, keep profiles minimal, and keep AI content age-appropriate. We recommend using Camus with a parent or guardian's knowledge." },
  { q: "Will the tutor just do my homework?", a: "The tutor explains concepts step by step, gives hints before answers and checks your working. It's built to help you understand — follow your school's rules for graded work." },
  { q: "Which countries and exams are supported?", a: "Camus is built for learners everywhere. It supports multiple countries, currencies and time zones, with exam preparation that's configurable per country — from NEET and JEE to SAT, GRE, GMAT, IELTS and TOEFL." },
  { q: "Can I install it on my phone?", a: "Yes. Camus Learn is an installable app on iPhone, iPad, Android, Windows, macOS and Linux — add it to your home screen or install it from your browser." },
  { q: "How is my data protected?", a: "Your data is private to your account, enforced with row-level security in the database. We don't sell personal data, and you can delete your Camus Learn data at any time from Settings." },
];

export default async function LearnLandingPage() {
  const supabase = createPublicClient();
  const [plans, prices, currencies, countries, exams] = await Promise.all([
    supabase.from("learn_plans").select("id, name, tagline, features, tier, trial_days, ai_messages_per_day").eq("is_active", true).order("sort"),
    supabase.from("learn_plan_prices").select("*"),
    supabase.from("learn_currencies").select("code, minor_units, name").eq("is_active", true),
    supabase.from("learn_countries").select("code, currency_code").eq("is_active", true),
    supabase.from("learn_exams").select("name").eq("is_active", true).order("name"),
  ]);
  const pricingOk = !plans.error && !prices.error && (plans.data ?? []).length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Camus Learn",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android, Windows, macOS, Linux",
        description,
        publisher: { "@type": "Organization", name: "CAMUS Labs" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <PublicChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--color-slate-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-100)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black_10%,transparent_75%)]" />
        <Container className="relative grid grid-cols-1 items-center gap-12 pb-16 pt-16 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-paper px-3.5 py-1.5 text-xs text-slate-500">
              <IndiaFlag className="h-3 w-[18px] rounded-[2px]" title="" /> Made in Bharat · for India&apos;s youth and learners worldwide
            </div>
            <h1 className="text-balance text-5xl font-medium leading-[1.02] tracking-tight text-ink md:text-6xl lg:text-[4.75rem]">
              Learn. Build.
              <br />
              Prepare. Grow.
            </h1>
            <p className="mt-5 text-xl font-medium text-ink md:text-2xl">Your AI-powered learning and career platform.</p>
            <p className="mt-4 max-w-[560px] text-lg leading-relaxed text-slate-500">{description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={START} size="lg">Start Free</Button>
              <Button href="#platform" variant="secondary" size="lg">Explore Platform</Button>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Already learning? <Link href="/login?redirect=/app" className="text-ink underline underline-offset-2">Sign in</Link>
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-[520px]">
            <DashboardPreview />
          </div>
        </Container>
      </section>

      {/* Journey */}
      <Section eyebrow="One journey" heading="From school to career to your own company" subheading="Every tool shares one Career Twin — your goals, skills, projects and progress — so you never have to explain yourself twice.">
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
          {JOURNEY.map((j, i) => (
            <li key={j.verb} className="bg-paper p-5 md:p-6">
              <div className="flex items-center justify-between">
                <j.icon size={20} strokeWidth={1.75} className="text-ink" />
                <span className="font-mono text-[11px] text-slate-400">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-4 text-lg font-medium tracking-tight text-ink">{j.verb}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{j.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Platform previews */}
      <section id="platform" className="scroll-mt-20 border-y border-slate-200 bg-mist py-16 md:py-24 lg:py-32">
        <Container>
          <div className="mb-12 max-w-[720px] md:mb-16">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-signal">The platform</p>
            <h2 className="text-balance text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">Serious tools, not another chatbot</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">Each workspace is built for one job and does it properly — with your progress saved and honest about what AI can and can&apos;t do.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            <Feature title="AI tutor" body="Study, career, resume, interview, project and founder modes. Streaming answers with maths, code and tables." preview={<TutorPreview />} />
            <Feature title="Career discovery" body="Explore roles across 19 fields, compare them side by side and see your real skill overlap." preview={<CareerPreview />} />
            <Feature title="Resume builder" body="ATS-friendly templates, version history, PDF and Word export — and wording help that never invents facts." preview={<ResumePreviewCard />} />
            <Feature title="Interview coach" body="HR, behavioural, technical, coding, system design and case interviews, one question at a time." preview={<InterviewPreview />} />
            <Feature title="Project builder" body="Beginner to advanced projects with architecture, milestones and tasks matched to your level." preview={<ProjectPreview />} />
            <div className="flex flex-col justify-center rounded-2xl border border-dashed border-slate-300 p-6">
              <p className="text-lg font-medium tracking-tight text-ink">And more</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                <li>Exam preparation with timed mock tests</li>
                <li>Job-description alignment reports</li>
                <li>Skill roadmaps with progress tracking</li>
                <li>AI Productivity Academy</li>
                <li>Founder Mode workspaces</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Journeys */}
      <Section eyebrow="Made for every stage" heading="A path for where you are today">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <JourneyCard
            icon={<BookOpen size={20} />}
            title="Student journey"
            steps={["Tell Camus your class, subjects and exams", "Learn each topic simply, then deeply", "Practise and take quizzes — weak topics are flagged for you", "Prepare for exams with timed mock tests", "Explore careers early, without pressure"]}
          />
          <JourneyCard
            icon={<UserRound size={20} />}
            title="Graduate & job-seeker journey"
            steps={["Pick a target role and see your skill gaps", "Follow a roadmap and build portfolio projects", "Create a truthful, ATS-friendly resume", "Check real job descriptions for alignment", "Practise interviews and get specific feedback"]}
          />
        </div>
      </Section>

      {/* Made in India */}
      <section aria-labelledby="bharat" className="border-t border-slate-200 py-16 md:py-24">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <IndiaFlag className="h-24 w-36 rounded-lg shadow-sm md:h-32 md:w-48" />
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-signal">Made in Bharat 🇮🇳</p>
            <h2 id="bharat" className="text-balance text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl">Built in India, for India&apos;s youth — and learners everywhere.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 md:text-lg">
              Camus Learn is designed and built in India by CAMUS Labs. It starts where millions of Indian students start — board exams, NEET, JEE, CAT, GATE and UPSC, first jobs and first projects — and is priced in rupees so it stays within reach. The same platform works for learners in every country.
            </p>
          </div>
        </Container>
      </section>

      {/* Global + install */}
      <section className="border-y border-slate-200 bg-mist py-16 md:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-signal">Global by design</p>
            <h2 className="text-balance text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl">Built for learners everywhere</h2>
            <ul className="mt-8 flex flex-col gap-5">
              <GlobalRow icon={<Globe2 size={18} />} title="Local education systems & exams" body={(exams.data ?? []).length ? `Preparation for ${(exams.data ?? []).map((e) => e.name).join(", ")} — and more added per country.` : "Exam preparation configurable per country."} />
              <GlobalRow icon={<BadgeCheck size={18} />} title="Pricing in your currency" body="Plans are priced per region and shown in your currency where available." />
              <GlobalRow icon={<Languages size={18} />} title="Multilingual foundation" body={`English today, with ${LOCALES.length - 1} more languages on the way — including Hindi, Tamil, Telugu, Spanish, Arabic and Japanese.`} />
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-signal">Every device</p>
            <h2 className="text-balance text-3xl font-medium leading-[1.1] tracking-tight text-ink md:text-4xl">An app on your phone, tablet and laptop</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">Install Camus Learn straight from your browser on iPhone, iPad, Android, Windows, macOS and Linux — full screen, fast to open, no app store needed.</p>
            <div className="mt-6 flex items-center gap-3 text-slate-500"><Smartphone size={18} /> <span className="text-sm">Designed mobile-first, with a dedicated tablet and desktop layout.</span></div>
            <InstallPrompt variant="inline" className="mt-6" />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <Section id="pricing" eyebrow="Pricing" heading="Start free. Upgrade when you're ready." subheading="Every paid plan starts with a free trial. Cancel any time." align="center">
        {pricingOk ? (
          <LandingPricing plans={plans.data ?? []} prices={prices.data ?? []} currencies={currencies.data ?? []} countries={countries.data ?? []} startHref={START} />
        ) : (
          <p className="text-center text-sm text-slate-500">Pricing is temporarily unavailable. <Link href={START} className="text-ink underline">Start free</Link> — no card needed.</p>
        )}
      </Section>

      {/* Trust */}
      <section className="border-y border-slate-200 bg-ink py-16 text-paper md:py-24">
        <Container>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-400">Trust & safety</p>
          <h2 className="max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">Honest AI. Private data. Safe for young learners.</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <TrustItem icon={<ShieldCheck size={20} />} title="Private by default" body="Your records are only visible to your account, enforced in the database with row-level security." />
            <TrustItem icon={<BadgeCheck size={20} />} title="No invented credentials" body="Resume and profile tools never fabricate experience, degrees, employers, certifications or results." />
            <TrustItem icon={<Lock size={20} />} title="Age-aware" body="Minimal data for under-18s — an age range, never a birth date — with age-appropriate AI." />
            <TrustItem icon={<Target size={20} />} title="No false promises" body="We measure readiness and progress. We never guarantee jobs, admissions or scores." />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Section eyebrow="FAQ" heading="Questions, answered">
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-medium text-ink">
                {f.q}
                <span aria-hidden className="text-xl text-slate-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 py-16 md:py-24">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-tight text-ink md:text-5xl">Your next step is one question away.</h2>
          <p className="mt-4 max-w-xl text-lg text-slate-500">Set up your Career Twin in about two minutes and get a personal learning and career plan.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={START} size="lg">Start Free <ArrowRight size={18} /></Button>
            <Button href="/learn/careers" variant="secondary" size="lg">Browse career guides</Button>
          </div>
        </Container>
      </section>
    </PublicChrome>
  );
}

function Feature({ title, body, preview }: { title: string; body: string; preview: React.ReactNode }) {
  return (
    <div>
      {preview}
      <h3 className="mt-5 text-lg font-medium tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{body}</p>
    </div>
  );
}

function JourneyCard({ icon, title, steps }: { icon: React.ReactNode; title: string; steps: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 md:p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper">{icon}</span>
      <h3 className="mt-5 text-xl font-medium tracking-tight text-ink">{title}</h3>
      <ol className="mt-5 flex flex-col gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[15px] text-slate-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs text-ink">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function GlobalRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-paper text-ink">{icon}</span>
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{body}</p>
      </div>
    </li>
  );
}

function TrustItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper/10">{icon}</span>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
