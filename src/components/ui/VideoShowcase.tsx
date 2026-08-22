"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";

export function VideoShowcase({
  src,
  poster,
  caption,
  className,
}: {
  src: string;
  poster?: string;
  caption?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className={cn("mx-auto w-full max-w-[560px]", className)}>
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_48px_-12px_rgba(10,15,26,0.18)]">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          muted
          loop
          preload="metadata"
          onClick={toggle}
          onEnded={() => setPlaying(false)}
          className="block w-full cursor-pointer"
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg ring-1 ring-slate-900/5 backdrop-blur transition-transform duration-200 group-hover:scale-105">
            {playing ? (
              <Pause size={20} strokeWidth={2} className="text-ink" />
            ) : (
              <Play size={20} strokeWidth={2} className="ml-0.5 text-ink" fill="currentColor" />
            )}
          </span>
        </button>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-sm leading-relaxed text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
