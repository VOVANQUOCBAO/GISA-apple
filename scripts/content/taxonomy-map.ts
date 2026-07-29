import type {
  Collection,
  NormalizedContentKind,
} from '../../src/content/types';

export interface TaxonomyInput {
  categoryId?: string | number;
  sourceUrl: string;
  titlePage?: string;
}

export interface CanonicalTaxonomy {
  kind: NormalizedContentKind;
  collection: Collection;
  routePrefix: string;
  classified: boolean;
}

function searchable(value: string | number | undefined): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replaceAll('đ', 'd')
    .toLowerCase();
}

const mappings: Array<{
  matches: (haystack: string, categoryId: string) => boolean;
  result: Omit<CanonicalTaxonomy, 'classified'>;
}> = [
  {
    matches: (value) => /bai-bao-ung-dung|bai bao ung dung/u.test(value),
    result: { kind: 'publication', collection: 'publications', routePrefix: '/nghien-cuu/bai-bao-ung-dung' },
  },
  {
    matches: (value, id) => /bai-bao-khoa-hoc|bai bao khoa hoc/u.test(value) || id === '12',
    result: { kind: 'publication', collection: 'publications', routePrefix: '/nghien-cuu/bai-bao-khoa-hoc' },
  },
  {
    matches: (value) => /nghien-cuu\/du-an|du an nghien cuu/u.test(value),
    result: { kind: 'project', collection: 'projects', routePrefix: '/nghien-cuu/du-an' },
  },
  {
    matches: (value) => /tu-van\/cong-cu|cong cu/u.test(value),
    result: { kind: 'tool', collection: 'tools', routePrefix: '/tu-van/cong-cu' },
  },
  {
    matches: (value) => /tu-van\/du-an|du an tu van/u.test(value),
    result: { kind: 'project', collection: 'projects', routePrefix: '/tu-van/du-an' },
  },
  {
    matches: (value, id) => /khoa hoc|dao-tao|san pham/u.test(value) || id === '31',
    result: { kind: 'course', collection: 'courses', routePrefix: '/khoa-hoc' },
  },
  {
    matches: (value) => /thong-bao-lich|thong bao lich/u.test(value),
    result: { kind: 'notice', collection: 'notices', routePrefix: '/tin-tuc/thong-bao-lich' },
  },
  {
    matches: (value) => /tin[- ]tuc/u.test(value),
    result: { kind: 'news', collection: 'news', routePrefix: '/tin-tuc' },
  },
  {
    matches: (value) => /chuyen-gia|chuyen gia/u.test(value),
    result: { kind: 'expert', collection: 'experts', routePrefix: '/chuyen-gia' },
  },
  {
    matches: (value) => /thu-vien-anh|thu vien anh|gallery/u.test(value),
    result: { kind: 'gallery', collection: 'galleries', routePrefix: '/thu-vien-anh' },
  },
  {
    matches: (value) => /video|videos/u.test(value),
    result: { kind: 'video', collection: 'videos', routePrefix: '/video' },
  },
  {
    matches: (value) => /nguon-luc|nguon luc|tai lieu/u.test(value),
    result: { kind: 'resource', collection: 'resources', routePrefix: '/nguon-luc' },
  },
  {
    matches: (value) => /cong-dong|cong dong/u.test(value),
    result: { kind: 'community', collection: 'community', routePrefix: '/cong-dong' },
  },
  {
    matches: (value) => /ung-dung|ung dung/u.test(value),
    result: { kind: 'application', collection: 'applications', routePrefix: '/ung-dung' },
  },
];

export function mapLegacyTaxonomy(input: TaxonomyInput): CanonicalTaxonomy {
  const haystack = searchable(`${input.titlePage ?? ''} ${new URL(input.sourceUrl).pathname}`);
  const categoryId = searchable(input.categoryId);
  for (const mapping of mappings) {
    if (mapping.matches(haystack, categoryId)) {
      return { ...mapping.result, classified: true };
    }
  }
  return {
    kind: 'archive',
    collection: 'archive',
    routePrefix: '/luu-tru',
    classified: false,
  };
}
