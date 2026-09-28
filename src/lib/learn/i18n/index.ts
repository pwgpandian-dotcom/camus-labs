import { en, type MessageKey, type Messages } from "./en";

/**
 * Supported UI locales. Only English ships translated today; the others are
 * registered so routing, the language picker and fallbacks already work —
 * adding a translation file is all that's needed to light one up.
 */
export const LOCALES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "hi", label: "हिन्दी", dir: "ltr" },
  { code: "ta", label: "தமிழ்", dir: "ltr" },
  { code: "te", label: "తెలుగు", dir: "ltr" },
  { code: "kn", label: "ಕನ್ನಡ", dir: "ltr" },
  { code: "ml", label: "മലയാളം", dir: "ltr" },
  { code: "bn", label: "বাংলা", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "ja", label: "日本語", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

const dictionaries: Partial<Record<LocaleCode, Partial<Messages>>> = { en };

export function isLocale(v: string | undefined | null): v is LocaleCode {
  return !!v && LOCALES.some((l) => l.code === v);
}

export function getTranslator(locale: string | undefined | null) {
  const dict = (isLocale(locale) && dictionaries[locale]) || {};
  return function t(key: MessageKey): string {
    return dict[key] ?? en[key];
  };
}

export function localeDir(locale: string | undefined | null) {
  return LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
}

/** Whether the locale has its own translation (vs falling back to English). */
export function isTranslated(locale: LocaleCode) {
  return Boolean(dictionaries[locale]);
}

export type { MessageKey };
