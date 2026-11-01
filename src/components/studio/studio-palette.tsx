'use client';

import { Article, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CATALOG, CATEGORY_LABEL, ICON_LIST, type CatalogCategory, type CatalogItem } from './element-library';
import styles from './studio.module.css';
import type { PageTemplateSummary } from './types';

interface Props {
  onInsert: (key: string) => void;
  onInsertIcon: (name: string) => void;
  onDragStart: (key: string, event: React.PointerEvent) => void;
  onOpenTemplate: (id: string, draftId?: string) => void;
  onClose?: () => void;
}

type PaletteTab = 'blocks' | 'pages';

const ORDER: CatalogCategory[] = ['text', 'media', 'shape', 'template'];

function formatDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('vi-VN');
}

export function StudioPalette({ onInsert, onInsertIcon, onDragStart, onOpenTemplate, onClose }: Props) {
  const [tab, setTab] = useState<PaletteTab>('blocks');
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<CatalogCategory | null>(null);
  const [templates, setTemplates] = useState<PageTemplateSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState('all');
  const requested = useRef(false);

  const search = query.trim().toLowerCase();

  const items = useMemo(
    () =>
      CATALOG.filter(
        (item) =>
          !search ||
          item.label.toLowerCase().includes(search) ||
          item.hint.toLowerCase().includes(search) ||
          CATEGORY_LABEL[item.category].toLowerCase().includes(search),
      ),
    [search],
  );

  const loadTemplates = useCallback(async () => {
    if (requested.current) return;
    requested.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/studio/templates');
      if (!response.ok) throw new Error('failed');
      const payload = (await response.json()) as { templates: PageTemplateSummary[] };
      setTemplates(payload.templates);
    } catch {
      requested.current = false;
      setError('Không tải được danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  }, []);

  const kinds = useMemo(() => {
    const map = new Map<string, { kind: string; label: string; count: number }>();
    for (const template of templates ?? []) {
      const entry = map.get(template.kind);
      if (entry) entry.count += 1;
      else map.set(template.kind, { kind: template.kind, label: template.kindLabel, count: 1 });
    }
    return [...map.values()];
  }, [templates]);

  const articles = useMemo(() => {
    return (templates ?? []).filter((template) => {
      if (kind !== 'all' && template.kind !== kind) return false;
      if (!search) return true;
      return (
        template.title.toLowerCase().includes(search) ||
        template.summary.toLowerCase().includes(search) ||
        template.kindLabel.toLowerCase().includes(search)
      );
    });
  }, [kind, search, templates]);

  const openPages = () => {
    setTab('pages');
    setQuery('');
    void loadTemplates();
  };

  return (
    <aside className={styles.palette}>
      <div className={styles.paletteHead}>
        <div>
          <h2>Thêm khối</h2>
          <p>{tab === 'blocks' ? 'Kéo vào trang hoặc bấm để chèn.' : 'Mở một trang có sẵn để dựng lại.'}</p>
        </div>
        {onClose ? (
          <button className={`${styles.iconButton} ${styles.mobileOnly}`} onClick={onClose} title="Đóng" type="button">
            ×
          </button>
        ) : null}
      </div>

      <div className={styles.searchBox}>
        <MagnifyingGlass aria-hidden size={16} />
        <input
          aria-label={tab === 'blocks' ? 'Tìm khối' : 'Tìm bài viết'}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === 'blocks' ? 'Tìm khối…' : 'Tìm bài viết trên web…'}
          type="search"
          value={query}
        />
      </div>

      <div className={styles.paletteTabs}>
        <button
          data-active={tab === 'blocks'}
          onClick={() => {
            setTab('blocks');
            setQuery('');
          }}
          type="button"
        >
          Khối
        </button>
        <button data-active={tab === 'pages'} onClick={openPages} type="button">
          Bài viết
          {templates ? <span>{templates.length}</span> : null}
        </button>
      </div>

      <div className={styles.paletteScroll}>
        {tab === 'blocks' ? (
          <>
            {ORDER.map((category) => {
              const list = items.filter((item) => item.category === category);
              if (!list.length && search) return null;
              const isOpen = collapsed !== category;

              return (
                <section className={styles.paletteSection} key={category}>
                  <button
                    className={styles.paletteSectionHead}
                    onClick={() => setCollapsed(isOpen ? category : null)}
                    type="button"
                  >
                    <span>{CATEGORY_LABEL[category]}</span>
                    <span aria-hidden className={styles.chevron} data-open={isOpen}>
                      ▾
                    </span>
                  </button>

                  {isOpen ? (
                    <div className={styles.catalogGrid}>
                      {list.map((item) => (
                        <CatalogButton
                          item={item}
                          key={item.key}
                          onDragStart={onDragStart}
                          onInsert={onInsert}
                        />
                      ))}
                    </div>
                  ) : null}

                  {category === 'media' && isOpen && !search ? (
                    <div className={styles.iconGrid}>
                      {ICON_LIST.map((icon) => (
                        <button
                          className={styles.iconTile}
                          key={icon.name}
                          onClick={() => onInsertIcon(icon.name)}
                          title={`Chèn biểu tượng ${icon.label}`}
                          type="button"
                        >
                          <icon.icon aria-hidden size={20} />
                          <span>{icon.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {category === 'template' && isOpen && !search ? (
                    <button className={styles.libraryCard} onClick={openPages} type="button">
                      <span className={styles.libraryIcon}>
                        <Article aria-hidden size={18} />
                      </span>
                      <span>
                        <strong>Bài viết trên web</strong>
                        <small>Mở một trang có sẵn để dựng lại</small>
                      </span>
                    </button>
                  ) : null}
                </section>
              );
            })}

            {!items.length ? <p className={styles.emptySearch}>Không tìm thấy khối nào khớp “{query}”.</p> : null}
          </>
        ) : (
          <div className={styles.articleLibrary}>
            <p className={styles.articleHint}>
              Mở bản dựng của một trang có sẵn rồi sửa bằng thanh công cụ. Trang gốc chỉ đổi khi bạn
              bấm <strong>Xuất bản</strong>.
            </p>

            <div className={styles.kindChips}>
              <button data-active={kind === 'all'} onClick={() => setKind('all')} type="button">
                Tất cả{templates ? ` · ${templates.length}` : ''}
              </button>
              {kinds.map((entry) => (
                <button
                  data-active={kind === entry.kind}
                  key={entry.kind}
                  onClick={() => setKind(entry.kind)}
                  type="button"
                >
                  {entry.label} · {entry.count}
                </button>
              ))}
            </div>

            {loading ? <p className={styles.articleStatus}>Đang tải danh sách bài viết…</p> : null}

            {error ? (
              <div className={styles.articleStatus}>
                <p>{error}</p>
                <button className={styles.retryButton} onClick={() => void loadTemplates()} type="button">
                  Thử lại
                </button>
              </div>
            ) : null}

            {!loading && !error ? (
              <div className={styles.articleList}>
                {articles.map((template) => (
                  <button
                    className={styles.articleRow}
                    key={template.id}
                    onClick={() => onOpenTemplate(template.id, template.studioDraftId)}
                    title={
                      template.studioDraftId
                        ? `Mở bản dựng đang có của “${template.title}”`
                        : `Mở “${template.title}” trong studio`
                    }
                    type="button"
                  >
                    <span className={styles.articleTop}>
                      <span className={styles.articleKind}>{template.kindLabel}</span>
                      <span className={styles.articleTopRight}>
                        {template.studioDraftId ? (
                          <span
                            className={styles.articleDraft}
                            data-status={template.studioStatus}
                            title={
                              template.studioStatus === 'published'
                                ? 'Bản dựng này đang thay giao diện trang gốc'
                                : 'Trang này đang có bản dựng chưa đăng'
                            }
                          >
                            {template.studioStatus === 'published' ? 'Đã đăng bản dựng' : 'Đang sửa'}
                          </span>
                        ) : null}
                        <span className={styles.articleDate}>{formatDate(template.publishedAt)}</span>
                      </span>
                    </span>
                    <span className={styles.articleTitle}>{template.title}</span>
                    <span className={styles.articleMeta}>
                      {template.blocks} khối · {template.path}
                    </span>
                  </button>
                ))}

                {!articles.length ? (
                  <p className={styles.articleStatus}>Không có bài nào khớp bộ lọc hiện tại.</p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}

function CatalogButton({
  item,
  onInsert,
  onDragStart,
}: {
  item: CatalogItem;
  onInsert: (key: string) => void;
  onDragStart: (key: string, event: React.PointerEvent) => void;
}) {
  const IconComponent = item.icon;

  return (
    <button
      className={styles.catalogItem}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onInsert(item.key);
        }
      }}
      onPointerDown={(event) => onDragStart(item.key, event)}
      title={item.hint}
      type="button"
    >
      <span className={styles.catalogIcon}>
        <IconComponent aria-hidden size={22} />
      </span>
      <span className={styles.catalogLabel}>{item.label}</span>
      <span className={styles.catalogAdd}>
        <Plus aria-hidden size={12} weight="bold" />
      </span>
    </button>
  );
}
