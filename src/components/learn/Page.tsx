import { cn } from "@/lib/cn";

/** Standard content column inside the app shell. */
export function Page({ children, className, width = "default" }: { children: React.ReactNode; className?: string; width?: "default" | "narrow" | "wide" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 md:px-8 md:py-10 pl-safe pr-safe",
        width === "narrow" ? "max-w-3xl" : width === "wide" ? "max-w-[1400px]" : "max-w-6xl",
        className
      )}
    >
      {children}
    </div>
  );
}
