import { FixtureContentRepository } from './fixture-content-repository';
import { HttpContentRepository } from './http-content-repository';
import { SanityNewsRepository } from './sanity-news-repository';
import type { ContentRepository } from './content-repository';

export type { ContentRepository } from './content-repository';
export { FixtureContentRepository } from './fixture-content-repository';
export {
  ContentSourceError,
  HttpContentRepository,
} from './http-content-repository';

const fixtureContentRepository = new FixtureContentRepository();
const sanityContentRepository = new SanityNewsRepository(fixtureContentRepository);

export function getContentRepository(): ContentRepository {
  const source = process.env.CONTENT_SOURCE?.trim() || 'fixture';

  if (source === 'fixture') return sanityContentRepository;

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
