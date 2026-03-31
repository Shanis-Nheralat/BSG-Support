const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

interface DeepLTranslation {
  detected_source_language: string;
  text: string;
}

interface DeepLResponse {
  translations: DeepLTranslation[];
}

/**
 * Translate a single text string using the DeepL Free API.
 * Supports HTML content via tag_handling.
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = 'EN'
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPL_API_KEY environment variable is not set');
  }

  if (!text.trim()) return text;

  const params = new URLSearchParams({
    text,
    source_lang: sourceLang.toUpperCase(),
    target_lang: targetLang.toUpperCase(),
    tag_handling: 'html',
  });

  const res = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${body}`);
  }

  const data: DeepLResponse = await res.json();
  return data.translations[0].text;
}

/**
 * Translate multiple fields at once. Sends each non-empty value
 * as a separate request to DeepL. Returns an object with the same
 * keys but translated values.
 */
export async function translateFields(
  fields: Record<string, string | null | undefined>,
  targetLang: string,
  sourceLang = 'EN'
): Promise<Record<string, string>> {
  const entries = Object.entries(fields).filter(
    (entry): entry is [string, string] =>
      typeof entry[1] === 'string' && entry[1].trim().length > 0
  );

  if (entries.length === 0) return {};

  const results = await Promise.all(
    entries.map(async ([key, value]) => {
      const translated = await translateText(value, targetLang, sourceLang);
      return [key, translated] as const;
    })
  );

  return Object.fromEntries(results);
}

/**
 * Generate a URL-safe slug from a translated title.
 * Lowercases, replaces non-alphanumeric chars with hyphens,
 * collapses consecutive hyphens, and trims leading/trailing hyphens.
 */
export function generateLocalizedSlug(translatedTitle: string): string {
  return translatedTitle
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
