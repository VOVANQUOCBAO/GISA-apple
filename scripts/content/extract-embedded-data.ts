import { load } from 'cheerio';

export interface LegacyCmsObject {
  id: string | number;
  name: string;
  desc?: string;
  content?: string;
  image_url?: string;
  seo_name?: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  date_update?: string | number;
  date_created_format?: string | number;
  tags?: string | string[];
  seo_title?: string;
  seo_description?: string;
  title_page?: string;
  category_id?: string | number;
  count_view?: string | number;
  doi?: string;
  [key: string]: unknown;
}

const pageSpecificFields = [
  'category_id',
  'content',
  'count_view',
  'created_at',
  'date',
  'date_update',
  'date_created_format',
  'desc',
  'doi',
  'image_url',
  'seo_description',
  'seo_name',
  'seo_title',
  'tags',
  'title_page',
  'updated_at',
] as const;

function isCmsObject(value: unknown): value is LegacyCmsObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const object = value as Record<string, unknown>;
  return (
    (typeof object.id === 'string' || typeof object.id === 'number') &&
    typeof object.name === 'string' &&
    object.name.trim().length > 0 &&
    pageSpecificFields.some((field) => Object.hasOwn(object, field))
  );
}

function findCmsObject(value: unknown): LegacyCmsObject | undefined {
  if (isCmsObject(value)) return value;
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = findCmsObject(entry);
      if (found) return found;
    }
  } else if (value && typeof value === 'object') {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      const found = findCmsObject(entry);
      if (found) return found;
    }
  }
  return undefined;
}

function parseJson(text: string, nested = true): LegacyCmsObject | undefined {
  try {
    const parsed = JSON.parse(text);
    return nested ? findCmsObject(parsed) : isCmsObject(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function assignedObject(script: string): string | undefined {
  const assignment = /(?:__CMS_PAGE__|pageData|page_data|detailData)\s*=\s*/giu;
  const match = assignment.exec(script);
  if (!match) return undefined;
  const start = script.indexOf('{', match.index + match[0].length);
  if (start < 0) return undefined;
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < script.length; index += 1) {
    const character = script[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
    if (depth === 0) return script.slice(start, index + 1);
  }
  return undefined;
}

export function extractEmbeddedCmsObject(html: string): LegacyCmsObject | undefined {
  const $ = load(html);
  for (const element of $('textarea.w30s-content-data-page').toArray()) {
    const parsed = parseJson($(element).text().trim(), false);
    if (parsed) return parsed;
  }
  for (const element of $('script[data-cms-page]').toArray()) {
    const parsed = parseJson($(element).text().trim());
    if (parsed) return parsed;
  }
  for (const element of $('script:not([src])').toArray()) {
    const objectText = assignedObject($(element).text());
    const parsed = objectText ? parseJson(objectText) : undefined;
    if (parsed) return parsed;
  }
  for (const element of $('script[type="application/json"]:not([data-cms-page])').toArray()) {
    const parsed = parseJson($(element).text().trim());
    if (parsed) return parsed;
  }
  return undefined;
}
