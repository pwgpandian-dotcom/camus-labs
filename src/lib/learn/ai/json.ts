/**
 * Pull the first JSON object/array out of a model response. Models sometimes
 * wrap JSON in ```json fences or add a stray sentence; this is tolerant of
 * that without being tolerant of genuinely malformed output.
 */
export function extractJSON(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    // fall through to bracket scanning
  }
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in model output");
  const open = candidate[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return JSON.parse(candidate.slice(start, i + 1));
    }
  }
  throw new Error("Unterminated JSON in model output");
}
