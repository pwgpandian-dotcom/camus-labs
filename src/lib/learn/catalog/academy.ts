/**
 * AI Productivity Academy — practical, tool-agnostic courses on using AI
 * responsibly. Named products (e.g. Claude) are referenced as third-party
 * tools; nothing here implies an official partnership.
 */
export interface AcademyLesson {
  slug: string;
  title: string;
  minutes: number;
  body: string; // Markdown
  exercise: string;
}

export interface AcademyCourse {
  slug: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate";
  lessons: AcademyLesson[];
}

export const academy: AcademyCourse[] = [
  {
    slug: "prompting-fundamentals",
    title: "Prompting fundamentals",
    summary: "Get consistently useful answers by giving AI the right context, constraints and examples.",
    level: "Beginner",
    lessons: [
      {
        slug: "be-specific",
        title: "Be specific about the outcome",
        minutes: 6,
        body: `AI assistants respond to what you **actually** ask, not what you meant. Compare:

- *Weak:* "Explain photosynthesis."
- *Strong:* "Explain photosynthesis to a Class 10 student in under 150 words, then give one everyday analogy and one check-your-understanding question."

A strong prompt usually states:

1. **Audience** — who the answer is for.
2. **Goal** — what you'll do with it.
3. **Format** — length, structure, tone.
4. **Constraints** — what to avoid or include.`,
        exercise: "Rewrite a vague question you asked an AI recently using audience, goal, format and constraints.",
      },
      {
        slug: "give-context",
        title: "Give context, not just questions",
        minutes: 7,
        body: `The model only knows what's in the conversation. Paste the relevant material — the job description, the error message, the paragraph you're stuck on — and say what you've already tried.

**Tip:** Put long reference material first and your question last. Label sections clearly, e.g. \`<job_description>…</job_description>\`.`,
        exercise: "Ask the Camus assistant to review a paragraph you wrote. Include who it's for and what you want improved.",
      },
      {
        slug: "examples-and-iteration",
        title: "Use examples and iterate",
        minutes: 6,
        body: `Showing one or two examples of the output you want is often more effective than describing it. Then **iterate**: treat the first answer as a draft, point to exactly what to change, and ask again.

Always verify facts, numbers and citations yourself — AI can be confidently wrong.`,
        exercise: "Give the assistant two example flashcards in your preferred style and ask it to make ten more on a topic you're studying.",
      },
    ],
  },
  {
    slug: "ai-for-learning",
    title: "AI for learning (without cheating yourself)",
    summary: "Use AI as a tutor that builds real understanding, not a shortcut that skips it.",
    level: "Beginner",
    lessons: [
      {
        slug: "tutor-not-answer-key",
        title: "Tutor, not answer key",
        minutes: 5,
        body: `Copying an AI answer feels productive but skips the learning. Instead ask it to:

- Explain the concept, then **quiz you**.
- Give a **hint** before the full solution.
- Find the **mistake** in your own attempt.

Follow your school's or employer's rules on AI use for graded work.`,
        exercise: "Attempt a problem yourself, then ask the Study tutor to check your working and hint at the first error only.",
      },
      {
        slug: "active-recall",
        title: "Active recall and spaced repetition",
        minutes: 6,
        body: `Memory strengthens when you **retrieve** information, not when you re-read it. Use AI to generate short quizzes, then revisit weak topics after 1, 3 and 7 days. The Camus quiz history tracks weak topics for you.`,
        exercise: "Take a 5-question quiz on a topic, then schedule a follow-up quiz three days later.",
      },
    ],
  },
  {
    slug: "ai-assisted-coding",
    title: "AI-assisted coding",
    summary: "Plan, write, debug and review code with AI while staying in control of quality.",
    level: "Intermediate",
    lessons: [
      {
        slug: "plan-first",
        title: "Plan before you generate",
        minutes: 8,
        body: `Before asking for code, agree on a plan: inputs, outputs, edge cases and the files involved. Ask the AI to list assumptions. Small, reviewable steps beat one giant generated file.`,
        exercise: "Ask the assistant (Project mode) for a step-by-step plan for a feature, then implement step one yourself.",
      },
      {
        slug: "debugging",
        title: "Debugging with AI",
        minutes: 7,
        body: `Share the **exact error**, the **relevant code**, what you **expected**, and what you **tried**. Ask for the most likely causes ranked, and how to confirm each — rather than a blind fix.`,
        exercise: "Take a bug you hit recently and write the four-part debugging prompt.",
      },
      {
        slug: "review-and-test",
        title: "Review and test everything",
        minutes: 7,
        body: `Generated code must be read, understood and tested like any teammate's code. Ask the AI to write tests for its own code, then run them. Never paste secrets or private customer data into prompts.`,
        exercise: "Ask for unit tests for a function you wrote and run them locally.",
      },
    ],
  },
  {
    slug: "agents-and-mcp",
    title: "Agents, tools and MCP concepts",
    summary: "Understand how AI agents use tools and how the Model Context Protocol connects them to data.",
    level: "Intermediate",
    lessons: [
      {
        slug: "what-is-an-agent",
        title: "What is an AI agent?",
        minutes: 6,
        body: `An **agent** is a model running in a loop: it decides on an action, calls a **tool** (search, a database, a calendar), reads the result, and continues until the goal is met. Good agents have clear goals, limited permissions and a human check on risky actions.`,
        exercise: "List three tasks in your week an agent could help with, and which permissions it would need for each.",
      },
      {
        slug: "mcp",
        title: "The Model Context Protocol (MCP)",
        minutes: 7,
        body: `**MCP** is an open protocol for connecting AI applications to tools and data sources through a standard interface — like a universal adapter. A *server* exposes tools/resources; a *client* (the AI app) discovers and calls them.

Security basics: grant least privilege, review what each server can do, and never connect untrusted servers to sensitive accounts.`,
        exercise: "Read the MCP introduction at modelcontextprotocol.io and summarise client vs server in two sentences.",
      },
    ],
  },
  {
    slug: "responsible-ai",
    title: "Responsible AI use",
    summary: "Privacy, accuracy, bias and honesty when using AI at school and work.",
    level: "Beginner",
    lessons: [
      {
        slug: "privacy",
        title: "Protect private information",
        minutes: 5,
        body: `Don't paste passwords, ID numbers, other people's personal data or confidential work material into AI tools unless your organisation has approved that tool for it.`,
        exercise: "Check your school or employer's AI policy and note two rules.",
      },
      {
        slug: "honesty",
        title: "Honesty and attribution",
        minutes: 5,
        body: `Be transparent about AI assistance where it's expected. Never use AI to invent experience, credentials or results — on a resume or anywhere else.`,
        exercise: "Review your resume for any claim you couldn't back up in an interview.",
      },
    ],
  },
];

export function getCourse(slug: string) {
  return academy.find((c) => c.slug === slug);
}
