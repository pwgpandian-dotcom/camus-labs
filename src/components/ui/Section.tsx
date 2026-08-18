import { cn } from "@/lib/cn";
import { Container } from "./Container";

export function Section({
  id,
  eyebrow,
  heading,
  subheading,
  align = "left",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24 lg:py-32", className)}>
      <Container>
        {(eyebrow || heading || subheading) && (
          <div
            className={cn(
              "mb-12 md:mb-16 max-w-[720px]",
              align === "center" && "mx-auto text-center"
            )}
          >
            {eyebrow && (
              <p className="mb-3 text-xs font-mono uppercase tracking-[0.14em] text-signal">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-balance text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight leading-[1.1] text-ink">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-4 text-base md:text-lg text-slate-500 leading-relaxed">
                {subheading}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
