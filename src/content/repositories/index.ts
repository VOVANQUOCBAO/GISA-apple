import { FixtureContentRepository } from './fixture-content-repository';
import { HttpContentRepository } from './http-content-repository';
import { HttpNewsRepository } from './http-news-repository';
import { LocalAdminContentRepository } from './local-admin-repository';
import { SanityNewsRepository } from './sanity-news-repository';
import type { ContentRepository } from './content-repository';

export type { ContentRepository } from './content-repository';
export { FixtureContentRepository } from './fixture-content-repository';
export {
  ContentSourceError,
  HttpContentRepository,
} from './http-content-repository';
export { HttpNewsRepository } from './http-news-repository';
export { LocalAdminContentRepository } from './local-admin-repository';

const fixtureContentRepository = new FixtureContentRepository();
const sanityContentRepository = new SanityNewsRepository(fixtureContentRepository);
let phpNewsRepository: ContentRepository | null = null;
let localAdminRepository: ContentRepository | null = null;

function newsRepository(): ContentRepository {
  const source = process.env.NEWS_SOURCE?.trim().toLowerCase();

  if (source === 'admin') {
    localAdminRepository ??= new LocalAdminContentRepository(fixtureContentRepository);
    return localAdminRepository;
  }

  if (source === 'php') {
    if (phpNewsRepository) return phpNewsRepository;

    const baseUrl = process.env.NEWS_API_BASE_URL?.trim();
    if (!baseUrl) {
      throw new Error('NEWS_API_BASE_URL is required when NEWS_SOURCE=php.');
    }

    phpNewsRepository = new HttpNewsRepository(fixtureContentRepository, baseUrl);
    return phpNewsRepository;
  }

  return sanityContentRepository;
}

export function getContentRepository(): ContentRepository {
  const source = process.env.CONTENT_SOURCE?.trim() || 'fixture';

  if (source === 'fixture') return newsRepository();

  if (source === 'http') {
    const baseUrl = process.env.CONTENT_API_BASE_URL?.trim();
    if (!baseUrl) {
      throw new Error(
        'CONTENT_API_BASE_URL is required when CONTENT_SOURCE=http.',
      );
    }

    try {
      const parsedUrl = new URL(baseUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
    } catch {
      throw new Error(
        'CONTENT_API_BASE_URL must be a valid absolute http(s) URL when CONTENT_SOURCE=http.',
      );
    }

    return new HttpContentRepository(baseUrl);
  }

  throw new Error(
    `Unsupported CONTENT_SOURCE "${source}". Expected "fixture" or "http".`,
  );
}
