/**
 * Minimal Server-Sent-Events line parser shared by every provider adapter.
 * Yields the `data:` payload of each event (joined when multi-line).
 */
export async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep: number;
      // Events are separated by a blank line.
      while ((sep = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const raw = buffer.slice(0, sep);
        buffer = buffer.slice(sep).replace(/^\r?\n\r?\n/, "");
        const data = parseEvent(raw);
        if (data !== null) yield data;
      }
    }
    const tail = parseEvent(buffer);
    if (tail !== null) yield tail;
  } finally {
    reader.releaseLock();
  }
}

export function parseEvent(raw: string): string | null {
  const lines = raw.split(/\r?\n/).filter((l) => l.startsWith("data:"));
  if (lines.length === 0) return null;
  return lines.map((l) => l.slice(5).replace(/^ /, "")).join("\n");
}
