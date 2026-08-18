import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTA() {
  return (
    <section className="border-t border-slate-200">
      <Container className="py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink px-8 py-14 md:flex-row md:items-center md:px-14">
          <div className="max-w-xl">
            <h2 className="text-balance text-3xl md:text-4xl font-medium tracking-tight leading-[1.1] text-paper">
              Have an idea? Let&rsquo;s make it real.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Tell us what you&rsquo;re building. We&rsquo;ll respond with next steps and a
              clear path forward.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-4">
            <Button href="/start-project" size="lg">
              Start Your Project
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="border-slate-600 text-paper hover:bg-slate-800 hover:border-slate-500"
            >
              Book a Consultation
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
