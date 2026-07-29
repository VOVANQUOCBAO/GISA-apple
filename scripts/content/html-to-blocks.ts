import { load } from 'cheerio';

import type { ContentBlock } from '../../src/content/types';

export interface HtmlToBlocksOptions {
  canonicalPaths?: ReadonlyMap<string, string>;
  documentTitle?: string;
  sourceUrl: string;
}

export interface HtmlImageCandidate {
  alt: string;
  assetId: string;
  sourceUrl: string;
}

export interface HtmlToBlocksResult {
  blocks: ContentBlock[];
  images: HtmlImageCandidate[];
  issues: string[];
}

function cleanText(value: string): string {
  return value.replace(/\s+/gu, ' ').trim();
}

function safeLink(
  href: string,
  label: string,
  options: HtmlToBlocksOptions,
): { label: string; href: string } | undefined {
  if (/^(?:javascript|data|vbscript):/iu.test(href.trim())) return undefined;
  let url: URL;
  try {
    url = new URL(href, options.sourceUrl);
  } catch {
    return undefined;
  }
  if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return undefined;
  if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
    return { href: url.href, label };
  }
  const sourceOrigin = new URL(options.sourceUrl).origin;
  url.hash = '';
  const absolute = url.href;
  const mapped = url.origin === sourceOrigin ? options.canonicalPaths?.get(absolute) : undefined;
  return {
    href: mapped ?? absolute,
    label: url.origin === sourceOrigin ? label : `${label} (liên kết ngoài)`,
  };
}

function assetIdFromSource(source: string): string {
  const name = source.split('/').pop()?.split('?')[0] ?? 'image';
  return `legacy-${name.toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '') || 'image'}`;
}

function hasOnePixelStyle(style: string, property: 'width' | 'height'): boolean {
  const dimension = new RegExp(
    `(?:^|;)\\s*${property}\\s*:\\s*1(?:\\.0+)?px\\s*(?:!important)?\\s*(?:;|$)`,
    'iu',
  );
  return dimension.test(style);
}

export function htmlToBlocks(
  html: string,
  options: HtmlToBlocksOptions,
): HtmlToBlocksResult {
  const $ = load(`<main id="content-root">${html}</main>`);
  const blocks: ContentBlock[] = [];
  const images: HtmlImageCandidate[] = [];
  const issues = new Set<string>();
  const headings = new Set<string>();
  const trackingPixels = new Set<object>();
  const normalizedTitle = cleanText(options.documentTitle ?? '').toLocaleLowerCase('vi');

  $('#content-root script, #content-root style, #content-root noscript, #content-root object, #content-root embed').remove();
  $('#content-root img').each((_index, element) => {
    const image = $(element);
    const width = Number(image.attr('width') ?? 0);
    const height = Number(image.attr('height') ?? 0);
    const inlineStyle = image.attr('style') ?? '';
    const attributePixel =
      (width > 0 && width <= 1) || (height > 0 && height <= 1);
    const styledPixel =
      hasOnePixelStyle(inlineStyle, 'width') &&
      hasOnePixelStyle(inlineStyle, 'height');
    if (
      element &&
      typeof element === 'object' &&
      (attributePixel || styledPixel)
    ) {
      trackingPixels.add(element);
    }
  });
  $('#content-root *').each((_index, element) => {
    for (const attribute of Object.keys(element.attribs ?? {})) {
      if (attribute === 'style' || attribute.toLowerCase().startsWith('on')) {
        $(element).removeAttr(attribute);
      }
    }
  });

  const appendElement = (element: Parameters<typeof $>[0]): void => {
    const node = $(element);
    const tag = element && typeof element === 'object' && 'tagName' in element
      ? String(element.tagName).toLowerCase()
      : '';
    if (['h1', 'h2', 'h3'].includes(tag)) {
      const text = cleanText(node.text());
      const key = text.toLocaleLowerCase('vi');
      if (!text || key === normalizedTitle || headings.has(key)) return;
      headings.add(key);
      blocks.push({ type: 'heading', level: tag === 'h3' ? 3 : 2, text });
      return;
    }
    if (tag === 'p') {
      const links: Array<{ label: string; href: string }> = [];
      const videos: Array<Extract<ContentBlock, { type: 'video' }>> = [];
      node.find('a[href]').each((_index, anchor) => {
        const label = cleanText($(anchor).text());
        const link = safeLink($(anchor).attr('href') ?? '', label, options);
        if (link && /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\//iu.test(link.href)) {
          videos.push({
            type: 'video',
            provider: 'youtube',
            externalUrl: link.href,
            title: label || 'Video',
          });
        } else if (link) links.push(link);
        else {
          issues.add('unsafe_link_removed');
          $(anchor).replaceWith(label);
        }
      });
      const text = cleanText(node.clone().find('a').remove().end().text());
      if (text) blocks.push({ type: 'paragraph', text });
      if (links.length) blocks.push({ type: 'linkGroup', links });
      blocks.push(...videos);
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = node.children('li').map((_index, item) => cleanText($(item).text())).get().filter(Boolean);
      if (items.length) blocks.push({ type: 'list', ordered: tag === 'ol', items });
      return;
    }
    if (tag === 'blockquote') {
      const attribution = cleanText(node.find('cite').first().text());
      const clone = node.clone();
      clone.find('cite').remove();
      const text = cleanText(clone.text());
      if (text) blocks.push({ type: 'quote', text, ...(attribution ? { attribution } : {}) });
      return;
    }
    if (tag === 'img') {
      if (
        element &&
        typeof element === 'object' &&
        trackingPixels.has(element)
      ) {
        issues.add('tracking_pixel_removed');
        return;
      }
      const width = Number(node.attr('width') ?? 0);
      const height = Number(node.attr('height') ?? 0);
      if ((width > 0 && width <= 1) || (height > 0 && height <= 1)) {
        issues.add('tracking_pixel_removed');
        return;
      }
      const source = node.attr('src');
      if (!source || /^(?:javascript|data|vbscript):/iu.test(source)) {
        issues.add('unsafe_image_removed');
        return;
      }
      let sourceUrl: string;
      try {
        sourceUrl = new URL(source, options.sourceUrl).href;
      } catch {
        issues.add('unsafe_image_removed');
        return;
      }
      if (!['http:', 'https:'].includes(new URL(sourceUrl).protocol)) {
        issues.add('unsafe_image_removed');
        return;
      }
      const caption = cleanText(node.attr('title') ?? '');
      const assetId = node.attr('data-asset-id') ?? assetIdFromSource(source);
      blocks.push({
        type: 'image',
        assetId,
        ...(caption ? { caption } : {}),
      });
      images.push({
        alt: cleanText(node.attr('alt') ?? ''),
        assetId,
        sourceUrl,
      });
      return;
    }
    if (tag === 'table') {
      const headers = node.find('thead th').map((_index, cell) => cleanText($(cell).text())).get();
      const rows = node.find('tbody tr').map((_index, row) => [$(row).find('th,td').map((_cellIndex, cell) => cleanText($(cell).text())).get()]).get();
      if (headers.length || rows.length) blocks.push({ type: 'table', headers, rows });
      return;
    }
    if (tag === 'iframe') {
      const source = node.attr('src') ?? '';
      if (/^(?:https?:)?\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//iu.test(source)) {
        const externalUrl = new URL(source, options.sourceUrl).href;
        blocks.push({ type: 'video', provider: 'youtube', externalUrl, title: cleanText(node.attr('title') ?? 'Video') });
      }
      return;
    }
    node.children().each((_index, child) => appendElement(child));
  };

  $('#content-root').children().each((_index, child) => appendElement(child));
  return { blocks, images, issues: [...issues].sort() };
}
