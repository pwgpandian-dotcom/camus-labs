import {
  BookOpen,
  Bot,
  Briefcase,
  CreditCard,
  FileText,
  GraduationCap,
  Hammer,
  Home,
  LayoutGrid,
  Lightbulb,
  Map,
  MessageSquareText,
  Mic,
  Rocket,
  Settings,
  Sparkles,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { MessageKey } from "@/lib/learn/i18n";

export interface NavItem {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
  exact?: boolean;
}

export const NAV_SECTIONS: { titleKey: MessageKey | null; items: NavItem[] }[] = [
  {
    titleKey: null,
    items: [
      { href: "/app", labelKey: "nav.home", icon: Home, exact: true },
      { href: "/app/assistant", labelKey: "nav.assistant", icon: Sparkles },
    ],
  },
  {
    titleKey: "section.learn",
    items: [
      { href: "/app/study", labelKey: "nav.study", icon: BookOpen },
      { href: "/app/exams", labelKey: "nav.exams", icon: GraduationCap },
      { href: "/app/academy", labelKey: "nav.academy", icon: Bot },
    ],
  },
  {
    titleKey: "section.career",
    items: [
      { href: "/app/careers", labelKey: "nav.careers", icon: Map },
      { href: "/app/roadmaps", labelKey: "nav.roadmaps", icon: Target },
      { href: "/app/resume", labelKey: "nav.resume", icon: FileText },
      { href: "/app/jobs", labelKey: "nav.jobs", icon: Briefcase },
      { href: "/app/interview", labelKey: "nav.interview", icon: Mic },
    ],
  },
  {
    titleKey: "section.build",
    items: [
      { href: "/app/projects", labelKey: "nav.projects", icon: Hammer },
      { href: "/app/founder", labelKey: "nav.founder", icon: Rocket },
    ],
  },
  {
    titleKey: "section.account",
    items: [
      { href: "/app/profile", labelKey: "nav.profile", icon: UserRound },
      { href: "/app/billing", labelKey: "nav.billing", icon: CreditCard },
      { href: "/app/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];

/** Mobile bottom navigation — five thumb-reachable destinations. */
export const BOTTOM_NAV: NavItem[] = [
  { href: "/app", labelKey: "nav.home", icon: Home, exact: true },
  { href: "/app/study", labelKey: "nav.learn", icon: BookOpen },
  { href: "/app/assistant", labelKey: "nav.assistant", icon: MessageSquareText },
  { href: "/app/careers", labelKey: "nav.career", icon: Lightbulb },
  { href: "/app/more", labelKey: "nav.more", icon: LayoutGrid },
];

export function isActive(pathname: string, item: Pick<NavItem, "href" | "exact">) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
}
