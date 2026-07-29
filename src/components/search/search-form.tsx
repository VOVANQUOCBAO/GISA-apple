import Link from 'next/link';

import type { Collection } from '@/content/types';

import styles from './search.module.css';

interface SearchFormProps {
  query: string;
  selectedCollection?: Collection;
}

export function SearchForm({ query, selectedCollection }: SearchFormProps) {
  return (
    <form action="/tim-kiem" className={styles.searchForm} method="get">
      <label htmlFor="site-search">Tìm kiếm trên website GISA</label>
      <div className={styles.searchControls}>
        <input
          defaultValue={query}
          id="site-search"
          maxLength={100}
          name="q"
          type="search"
        />
        {selectedCollection ? (
          <input name="type" type="hidden" value={selectedCollection} />
        ) : null}
        <button type="submit">Tìm kiếm</button>
        {query || selectedCollection ? <Link href="/tim-kiem">Xóa</Link> : null}
      </div>
    </form>
  );
}
