"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  History,
  Paperclip,
  Plus,
  RotateCcw,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/learn/Markdown";
import { CamusMark } from "@/components/learn/Brand";
import { Notice } from "@/components/learn/ui";
import { deleteConversation, loadConversation, setMessageFeedback, toggleSaveConversation } from "@/app/actions/learn/assistant";
import type { AssistantMode } from "@/lib/learn/ai/prompts";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: -1 | 1 | null;
  pending?: boolean;
}

const MODES: { value: AssistantMode; label: string; hint: string; prompts: string[] }[] = [
  { value: "general", label: "General", hint: "Ask anything", prompts: ["Explain how compound interest works with an example", "What should I learn first to become a data analyst?", "Help me plan my week of study"] },
  { value: "study", label: "Study", hint: "Tutor for any subject", prompts: ["Explain Newton's second law simply, then quiz me", "Solve 2x² − 5x + 3 = 0 step by step", "What's the difference between mitosis and meiosis?"] },
  { value: "career", label: "Career", hint: "Explore & compare paths", prompts: ["Compare product manager vs business analyst for me", "What does a cloud engineer do day to day?", "I like biology and coding — what careers combine them?"] },
  { value: "resume", label: "Resume", hint: "Truthful improvements", prompts: ["Rewrite this bullet to show impact: 'Worked on the login page'", "What should a fresher's resume include?", "How do I describe a college project on my resume?"] },
  { value: "interview", label: "Interview", hint: "Prepare & practise", prompts: ["Help me answer 'Tell me about yourself'", "Give me 5 likely questions for a frontend role", "How do I use the STAR method?"] },
  { value: "project", label: "Project", hint: "Plan & build", prompts: ["Plan a beginner React project I can finish in 2 weeks", "How should I structure a REST API for a todo app?", "Review my project idea: a study-group finder"] },
  { value: "founder", label: "Founder", hint: "Idea to business", prompts: ["How do I validate a startup idea before building?", "Help me write a one-sentence value proposition", "What's a sensible pricing model for a tutoring app?"] },
];

const MAX_ATTACH_CHARS = 20000;

let tmpCounter = 0;
const tmpId = (prefix: string) => `tmp-${prefix}-${++tmpCounter}`;

/** Reads a streamed text body, calling onText with the accumulated text. */
async function readTextStream(body: ReadableStream<Uint8Array>, onText: (text: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    onText(acc);
  }
  return acc;
}
const TEXT_EXT = /\.(txt|md|csv|json|js|jsx|ts|tsx|py|java|c|cpp|cs|go|rb|php|html|css|sql|yml|yaml|xml|sh|kt|swift|rs)$/i;

export function Chat({
  aiReady,
  initialConversation,
  initialMessages,
  initialMode,
  prefill,
  conversations,
  dailyLimit,
  hideModes,
}: {
  aiReady: boolean;
  initialConversation: { id: string; title: string; isSaved: boolean } | null;
  initialMessages: Msg[];
  initialMode: AssistantMode;
  prefill: string;
  conversations: { id: string; title: string; mode: string; isSaved: boolean }[];
  dailyLimit: number;
  hideModes: string[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [conversation, setConversation] = useState(initialConversation);
  const [mode, setMode] = useState<AssistantMode>(initialMode);
  const [input, setInput] = useState(prefill);
  const [attachment, setAttachment] = useState<{ name: string; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stickToBottom = useRef(true);

  const modes = MODES.filter((m) => !hideModes.includes(m.value));
  const activeMode = modes.find((m) => m.value === mode) ?? modes[0];

  // Keep the composer above the on-screen keyboard (iOS Safari doesn't resize dvh reliably).
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const apply = () => document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
    apply();
    vv.addEventListener("resize", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      document.documentElement.style.removeProperty("--vvh");
    };
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (force || stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => scrollToBottom(true), [scrollToBottom]);
  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  async function send(opts: { regenerate?: boolean; text?: string } = {}) {
    const raw = (opts.text ?? input).trim();
    if (streaming) return;
    if (!opts.regenerate && !raw && !attachment) return;
    setError(null);

    const content = opts.regenerate
      ? ""
      : attachment
        ? `${raw || "Please look at the attached file."}\n\n---\nAttached file: ${attachment.name}\n\`\`\`\n${attachment.text}\n\`\`\``
        : raw;

    const assistantId = tmpId("a");
    setMessages((prev) => {
      let base = prev;
      if (opts.regenerate) {
        const lastIdx = base.length - 1;
        if (base[lastIdx]?.role === "assistant") base = base.slice(0, lastIdx);
      } else {
        base = [...base, { id: tmpId("u"), role: "user", content }];
      }
      return [...base, { id: assistantId, role: "assistant", content: "", pending: true }];
    });
    if (!opts.regenerate) {
      setInput("");
      setAttachment(null);
    }
    stickToBottom.current = true;
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/learn/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: conversation?.id ?? null, mode, message: content || "(regenerate)", regenerate: !!opts.regenerate }),
        signal: controller.signal,
      });
      const newId = res.headers.get("x-conversation-id");
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (data.conversationId && !conversation) setConversation({ id: data.conversationId, title: raw.slice(0, 80), isSaved: false });
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      if (newId && !conversation) {
        setConversation({ id: newId, title: raw.slice(0, 80) || "New conversation", isSaved: false });
        window.history.replaceState(null, "", `/app/assistant?c=${newId}`);
      }
      await readTextStream(res.body, (text) => setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m))));
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)));
      // Swap temporary ids for server ids so feedback works, then refresh history.
      const cid = conversation?.id ?? newId;
      if (cid) {
        const fresh = await loadConversation(cid);
        if (fresh) setMessages(fresh.messages.map((m) => ({ id: m.id, role: m.role as Msg["role"], content: m.content, feedback: m.feedback as Msg["feedback"] })));
      }
      if (!conversation) router.refresh();
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, pending: false, content: m.content || "_Stopped._" } : m)));
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError((e as Error).message);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  async function onFile(file: File) {
    setError(null);
    if (!TEXT_EXT.test(file.name) && !file.type.startsWith("text/")) {
      setError("For now you can attach text files — notes, code, CSV or Markdown. For PDFs or images, paste the relevant text instead.");
      return;
    }
    if (file.size > 2_000_000) {
      setError("That file is too large. Attach a file under 2 MB.");
      return;
    }
    const text = await file.text();
    setAttachment({ name: file.name, text: text.slice(0, MAX_ATTACH_CHARS) });
    if (text.length > MAX_ATTACH_CHARS) setError(`Only the first ${MAX_ATTACH_CHARS.toLocaleString()} characters of ${file.name} will be sent.`);
  }

  const empty = messages.length === 0;

  return (
    <div className="flex bg-paper" style={{ height: "var(--vvh, 100dvh)" }}>
      {/* History panel (desktop) */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-mist xl:flex">
        <HistoryList conversations={conversations} activeId={conversation?.id} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-paper/95 px-3 pt-safe backdrop-blur-md md:px-6">
          <div className="flex h-14 w-full items-center gap-2">
            <Link href="/app" aria-label="Back to home" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 md:hidden">
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-ink">{conversation?.title ?? "New conversation"}</p>
              <p className="text-xs text-slate-500">{activeMode.label} mode · {activeMode.hint}</p>
            </div>
            {conversation && (
              <button
                onClick={() => {
                  const next = !conversation.isSaved;
                  setConversation({ ...conversation, isSaved: next });
                  startTransition(() => void toggleSaveConversation(conversation.id, next));
                }}
                aria-label={conversation.isSaved ? "Unsave conversation" : "Save conversation"}
                aria-pressed={conversation.isSaved}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-ink"
              >
                {conversation.isSaved ? <BookmarkCheck size={18} className="text-signal" /> : <Bookmark size={18} />}
              </button>
            )}
            <button onClick={() => setHistoryOpen(true)} aria-label="Conversation history" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-ink xl:hidden">
              <History size={18} />
            </button>
            <Link href="/app/assistant" aria-label="New conversation" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-ink">
              <Plus size={20} />
            </Link>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
            {!aiReady && (
              <Notice tone="warning" className="mb-6">
                AI isn&apos;t switched on for this workspace yet — an administrator needs to add an AI provider key. Your messages won&apos;t get replies until then.
              </Notice>
            )}
            {empty ? (
              <div className="flex flex-col items-center pt-6 text-center md:pt-12">
                <CamusMark size={44} />
                <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink md:text-2xl">What would you like to learn today?</h1>
                <p className="mt-2 max-w-md text-sm text-slate-500">Choose a mode, then ask. I already know your goals from your Career Twin.</p>
                <div className="mt-6 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {modes.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      aria-pressed={mode === m.value}
                      className={cn(
                        "min-h-9 shrink-0 rounded-full border px-3.5 text-[13px]",
                        mode === m.value ? "border-ink bg-ink text-paper" : "border-slate-200 text-slate-600 hover:border-slate-400"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid w-full grid-cols-1 gap-2 text-left sm:grid-cols-3">
                  {activeMode.prompts.map((p) => (
                    <button key={p} onClick={() => send({ text: p })} disabled={streaming} className="rounded-xl border border-slate-200 p-3.5 text-sm leading-snug text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ol className="flex flex-col gap-6" aria-live="polite">
                {messages.map((m, i) => (
                  <MessageItem
                    key={m.id}
                    msg={m}
                    isLast={i === messages.length - 1}
                    streaming={streaming}
                    onRegenerate={() => send({ regenerate: true })}
                    onFollowUp={(t) => send({ text: t })}
                  />
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-slate-200 bg-paper px-3 pb-safe md:px-6">
          <div className="mx-auto w-full max-w-3xl py-3">
            {error && (
              <p role="alert" className="mb-2 rounded-lg bg-[#fdf3f1] px-3 py-2 text-[13px] text-danger">
                {error}
              </p>
            )}
            {attachment && (
              <div className="mb-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-mist px-3 py-1.5 text-[13px] text-slate-700">
                <Paperclip size={14} /> <span className="truncate">{attachment.name}</span>
                <button onClick={() => setAttachment(null)} aria-label="Remove attachment" className="rounded p-0.5 hover:bg-slate-200">
                  <X size={14} />
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-paper p-1.5 shadow-xs focus-within:border-slate-400"
            >
              <input ref={fileRef} type="file" className="hidden" accept=".txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cs,.go,.rb,.php,.html,.css,.sql,.yml,.yaml,.xml,.sh,.kt,.swift,.rs,text/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              <button type="button" onClick={() => fileRef.current?.click()} aria-label="Attach a text file" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 hover:text-ink">
                <Paperclip size={18} />
              </button>
              <label htmlFor="chat-input" className="sr-only">
                Message
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && window.matchMedia("(pointer: fine)").matches) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Message Camus · ${activeMode.label} mode`}
                maxLength={12000}
                className="max-h-[200px] min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-base leading-6 text-ink outline-none placeholder:text-slate-400 md:text-[15px]"
                enterKeyHint="send"
              />
              {streaming ? (
                <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop generating" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
                  <Square size={14} fill="currentColor" />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim() && !attachment} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper transition-opacity disabled:opacity-30">
                  <ArrowUp size={18} />
                </button>
              )}
            </form>
            <p className="mt-2 hidden text-center text-[11px] text-slate-400 md:block">
              Camus can make mistakes — check important facts. Up to {dailyLimit} AI requests per day on your plan.
            </p>
          </div>
        </div>
      </div>

      {/* History drawer (mobile/tablet) */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Conversation history">
          <button className="absolute inset-0 bg-ink/30" aria-label="Close history" onClick={() => setHistoryOpen(false)} />
          <div className="fade-in absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-mist pt-safe pb-safe shadow-md">
            <div className="flex h-14 items-center justify-between px-4">
              <p className="font-medium text-ink">History</p>
              <button onClick={() => setHistoryOpen(false)} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <HistoryList conversations={conversations} activeId={conversation?.id} onNavigate={() => setHistoryOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MessageItem({
  msg,
  isLast,
  streaming,
  onRegenerate,
  onFollowUp,
}: {
  msg: Msg;
  isLast: boolean;
  streaming: boolean;
  onRegenerate: () => void;
  onFollowUp: (t: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<-1 | 1 | null>(msg.feedback ?? null);
  const serverId = !msg.id.startsWith("tmp-");

  if (msg.role === "user") {
    return (
      <li className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-slate-100 px-4 py-2.5 text-[15px] leading-relaxed text-ink">
          {msg.content.length > 1500 ? msg.content.slice(0, 1500) + "…" : msg.content}
        </div>
      </li>
    );
  }

  return (
    <li className="flex gap-3">
      <CamusMark size={28} className="mt-0.5 hidden sm:block" />
      <div className="min-w-0 flex-1">
        {msg.pending && !msg.content ? (
          <div className="flex h-7 items-center gap-1" aria-label="Thinking">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
          </div>
        ) : (
          <Markdown content={msg.content} />
        )}
        {!msg.pending && (
          <div className="mt-2 flex items-center gap-0.5 text-slate-400">
            <IconBtn
              label={copied ? "Copied" : "Copy"}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(msg.content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {}
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </IconBtn>
            {serverId && (
              <>
                <IconBtn
                  label="Helpful"
                  pressed={feedback === 1}
                  onClick={() => {
                    const v = feedback === 1 ? null : 1;
                    setFeedback(v);
                    void setMessageFeedback(msg.id, v);
                  }}
                >
                  <ThumbsUp size={15} className={feedback === 1 ? "text-success" : ""} />
                </IconBtn>
                <IconBtn
                  label="Not helpful"
                  pressed={feedback === -1}
                  onClick={() => {
                    const v = feedback === -1 ? null : -1;
                    setFeedback(v);
                    void setMessageFeedback(msg.id, v);
                  }}
                >
                  <ThumbsDown size={15} className={feedback === -1 ? "text-danger" : ""} />
                </IconBtn>
              </>
            )}
            {isLast && !streaming && (
              <IconBtn label="Regenerate" onClick={onRegenerate}>
                <RotateCcw size={15} />
              </IconBtn>
            )}
          </div>
        )}
        {isLast && !streaming && !msg.pending && (
          <div className="mt-3 flex flex-wrap gap-2">
            {["Explain that more simply", "Give me an example", "Quiz me on this"].map((f) => (
              <button key={f} onClick={() => onFollowUp(f)} className="min-h-9 rounded-full border border-slate-200 px-3 text-[13px] text-slate-600 hover:border-slate-400 hover:text-ink">
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

function IconBtn({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: React.ReactNode; pressed?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} aria-pressed={pressed} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 hover:text-ink">
      {children}
    </button>
  );
}

function HistoryList({
  conversations,
  activeId,
  onNavigate,
}: {
  conversations: { id: string; title: string; mode: string; isSaved: boolean }[];
  activeId?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState(conversations);
  const [filter, setFilter] = useState<"all" | "saved">("all");
  const shown = filter === "saved" ? items.filter((c) => c.isSaved) : items;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex gap-1 px-3 pb-2 pt-3">
        {(["all", "saved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={cn("min-h-8 rounded-full px-3 text-[13px] capitalize", filter === f ? "bg-ink text-paper" : "text-slate-600 hover:bg-slate-100")}>
            {f}
          </button>
        ))}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {shown.length === 0 && <li className="px-3 py-4 text-sm text-slate-500">{filter === "saved" ? "No saved conversations yet." : "No conversations yet."}</li>}
        {shown.map((c) => (
          <li key={c.id} className="group relative">
            <Link
              href={`/app/assistant?c=${c.id}`}
              onClick={onNavigate}
              className={cn("block rounded-lg py-2 pl-3 pr-10 hover:bg-slate-100", activeId === c.id && "bg-paper shadow-xs ring-1 ring-slate-200")}
            >
              <span className="block truncate text-sm text-ink">{c.title}</span>
              <span className="text-xs capitalize text-slate-400">{c.mode}</span>
            </Link>
            <button
              onClick={async () => {
                setItems((xs) => xs.filter((x) => x.id !== c.id));
                await deleteConversation(c.id);
                if (activeId === c.id) router.push("/app/assistant");
              }}
              aria-label={`Delete ${c.title}`}
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 opacity-100 hover:bg-slate-200 hover:text-danger md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
