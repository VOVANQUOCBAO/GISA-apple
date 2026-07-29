import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/components/seo/build-metadata';
import { PAGE_REGISTRY } from '@/content/pages';
import { OLD_ROUTE_REDIRECTS } from '@/content/redirects';
import { getContentRepository } from '@/content/repositories';

const excludedPrefixes = ['/dang-ky/', '/lien-he', '/tim-kiem'];

function isPublicRegistryPath(path: string): boolean {
  return !excludedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(prefix),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const redirectSources = new Set(
    OLD_ROUTE_REDIRECTS.map((redirect) => redirect.source),
  );
  const registryPaths = PAGE_REGISTRY.flatMap((definition) =>
    'path' in definition &&
    isPublicRegistryPath(definition.path) &&
    !redirectSources.has(definition.path)
      ? [definition.path]
      : [],
  );
  const detailPaths = await getContentRepository().listIndexablePaths();

  return [...new Set([...registryPaths, ...detailPaths])]
    .sort((left, right) => left.localeCompare(right))
    .map((path) => ({ url: absoluteUrl(path) }));
}
