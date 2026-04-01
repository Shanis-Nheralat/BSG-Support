import path from "path";
import fs from "fs";

const VALID_LOCALES = ["en", "de"];

type TranslationParams = Record<string, string | number>;
export type TranslationFn = (key: string, params?: TranslationParams) => string;

/** Resolve locale from body param > cookie > default "en" */
export function resolveLocale(bodyLocale?: string, cookieLocale?: string): string {
  if (bodyLocale && VALID_LOCALES.includes(bodyLocale)) return bodyLocale;
  if (cookieLocale && VALID_LOCALES.includes(cookieLocale)) return cookieLocale;
  return "en";
}

// Cache loaded messages to avoid repeated file reads
const messagesCache: Record<string, Record<string, unknown>> = {};

async function loadMessages(locale: string): Promise<Record<string, unknown>> {
  const safeLocale = VALID_LOCALES.includes(locale) ? locale : "en";
  if (messagesCache[safeLocale]) return messagesCache[safeLocale];

  const filePath = path.join(process.cwd(), "messages", `${safeLocale}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const messages = JSON.parse(raw) as Record<string, unknown>;
  messagesCache[safeLocale] = messages;
  return messages;
}

/** Navigate a nested object using dot-notation key, e.g. "Emails.common.greeting" */
function getNestedValue(obj: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

/** Substitute {paramName} placeholders with values */
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, paramName) => {
    const value = params[paramName];
    return value !== undefined ? String(value) : `{${paramName}}`;
  });
}

/**
 * Load email translations for a given locale.
 * Returns a t(key, params?) function that resolves dot-notation keys
 * from the messages JSON and substitutes {param} placeholders.
 */
export async function loadEmailTranslations(locale: string): Promise<TranslationFn> {
  const messages = await loadMessages(locale);

  return function t(key: string, params?: TranslationParams): string {
    const value = getNestedValue(messages, key);
    if (value === undefined) return key; // fallback: return key for debugging
    return interpolate(value, params);
  };
}
