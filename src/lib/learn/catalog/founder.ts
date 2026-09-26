/** Founder Mode stages — each becomes an editable workspace section. */
export const FOUNDER_STAGES = [
  { key: "idea", title: "Idea", prompt: "Describe the idea in one or two sentences." },
  { key: "problem", title: "Problem", prompt: "What painful problem does it solve? How do people cope today?" },
  { key: "customer", title: "Customer", prompt: "Who exactly has this problem? Be specific about the first customer segment." },
  { key: "research", title: "Market research", prompt: "What evidence do you have? Interviews, search trends, communities, existing spending." },
  { key: "competitors", title: "Competitors", prompt: "Direct competitors, alternatives and the 'do nothing' option." },
  { key: "value", title: "Value proposition", prompt: "Why would your customer choose you? One sentence." },
  { key: "mvp", title: "MVP", prompt: "The smallest product that tests your riskiest assumption." },
  { key: "architecture", title: "Product architecture", prompt: "Core components, data, integrations and tech choices." },
  { key: "landing", title: "Landing page", prompt: "Headline, sub-headline, three benefits and a call to action." },
  { key: "pricing", title: "Pricing", prompt: "Pricing model, tiers and the reasoning behind them." },
  { key: "launch", title: "Launch plan", prompt: "Where will the first 100 users come from? Week-by-week plan." },
  { key: "marketing", title: "Marketing", prompt: "Channels, messages and what you'll measure." },
  { key: "iteration", title: "Iteration", prompt: "What will you learn in the first month and how will you decide what to change?" },
] as const;

export type FounderStageKey = (typeof FOUNDER_STAGES)[number]["key"];
