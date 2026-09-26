"use client";

import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Check, Copy } from "lucide-react";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/cn";

function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <div className="flex items-center justify-between rounded-t-xl bg-slate-800 px-4 py-1.5 font-mono text-[11px] text-slate-400">
        <span>{lang || "code"}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(children);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard blocked */
            }
          }}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-700 hover:text-slate-200"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Renders AI Markdown safely (no raw HTML) with GFM tables, code and KaTeX maths. */
export const Markdown = memo(function Markdown({ content, className, inline }: { content: string; className?: string; inline?: boolean }) {
  const Wrapper = inline ? "span" : "div";
  return (
    <Wrapper className={cn("prose-camus", inline && "block", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }]]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer nofollow">
              {children}
            </a>
          ),
          pre: ({ children }) => <>{children}</>,
          ...(inline ? { p: ({ children }: { children?: React.ReactNode }) => <span className="block">{children}</span> } : {}),
          code: ({ className: cls, children }) => {
            const text = String(children ?? "");
            const lang = /language-(\w+)/.exec(cls || "")?.[1];
            const isBlock = !!lang || text.includes("\n");
            if (!isBlock) return <code>{children}</code>;
            return <CodeBlock lang={lang}>{text.replace(/\n$/, "")}</CodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Wrapper>
  );
});
