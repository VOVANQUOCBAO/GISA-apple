'use client';

import { ArrowDown, ArrowUp, Copy, Eye, EyeSlash, LockSimple, Trash, UploadSimple } from '@phosphor-icons/react';
import { useState } from 'react';

import { ICON_LIST } from './element-library';
import styles from './studio.module.css';
import { CANVAS_WIDTH, type StudioDoc, type StudioElement } from './types';

interface Props {
  doc: StudioDoc;
  element: StudioElement | null;
  onPatch: (patch: Partial<StudioElement>) => void;
  onBackground: (color: string) => void;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onFitText: (id: string) => void;
  onOrder: (id: string, direction: 'up' | 'down') => void;
  onToggle: (id: 'hidden' | 'locked') => void;
  onReplaceImage: (id: string) => void;
  onClose?: () => void;
  sourcePath?: string | null;
}

const SWATCHES = ['#14211c', '#005f69', '#004424', '#f26f33', '#19486a', '#007bff', '#ffffff', '#f4f7f4', '#e2e8e2', '#fdf1d8'];

const KIND_LABEL: Record<StudioElement['kind'], string> = {
  text: 'Chữ',
  image: 'Ảnh',
  shape: 'Hình khối',
  icon: 'Biểu tượng',
  button: 'Nút',
  video: 'Video',
};

export function StudioInspector(props: Props) {
  const { doc, element, onClose } = props;
  const [tab, setTab] = useState<'design' | 'layers'>('design');

  return (
    <aside className={styles.inspector}>
      <div className={styles.inspectorTabs}>
        <button data-active={tab === 'design'} onClick={() => setTab('design')} type="button">
          Thiết kế
        </button>
        <button data-active={tab === 'layers'} onClick={() => setTab('layers')} type="button">
          Lớp <span>{doc.elements.length}</span>
        </button>
        {onClose ? (
          <button className={`${styles.iconButton} ${styles.mobileOnly}`} onClick={onClose} title="Đóng" type="button">
            ×
          </button>
        ) : null}
      </div>

      <div className={styles.inspectorScroll}>
        {tab === 'layers' ? (
          <Layers {...props} />
        ) : element ? (
          <Design {...props} element={element} />
        ) : (
          <PageSettings
            background={doc.background}
            count={doc.elements.length}
            onBackground={props.onBackground}
            sourcePath={props.sourcePath ?? null}
          />
        )}
      </div>
    </aside>
  );
}

function PageSettings({
  background,
  onBackground,
  count,
  sourcePath,
}: {
  background: string;
  onBackground: (color: string) => void;
  count: number;
  sourcePath: string | null;
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h3>Trang</h3>
        <span className={styles.badge}>1200px</span>
      </div>
      <p className={styles.hint}>
        Trang rộng cố định 1200px và tự thu nhỏ theo màn hình. Chọn một khối trên trang để sửa
        riêng khối đó.
      </p>

      {sourcePath ? (
        <a className={styles.settingsLink} href={sourcePath} rel="noreferrer" target="_blank">
          Mở trang gốc {sourcePath}
        </a>
      ) : null}

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Màu nền</span>
        <ColorRow value={background} onChange={onBackground} />
      </div>

      <div className={styles.statRow}>
        <div>
          <strong>{count}</strong>
          <span>khối trên trang</span>
        </div>
        <div>
          <strong>1200</strong>
          <span>pixel bề rộng</span>
        </div>
      </div>

      <div className={styles.tipCard}>
        <strong>Mẹo nhanh</strong>
        <ul>
          <li>Kéo khối bằng chuột, giữ <kbd>Alt</kbd> để tắt bám lưới.</li>
          <li>Bấm đúp vào chữ để viết, vào ảnh để đổi ảnh.</li>
          <li><kbd>Ctrl</kbd> + <kbd>D</kbd> nhân bản, <kbd>Delete</kbd> để xoá.</li>
          <li>Phím mũi tên dịch 1px, giữ <kbd>Shift</kbd> dịch 10px.</li>
        </ul>
      </div>
    </div>
  );
}

function Design({ element, ...props }: Props & { element: StudioElement }) {
  const { onPatch, onDelete, onDuplicate, onFitText, onOrder, onToggle, onReplaceImage } = props;
  const locked = element.locked;

  return (
    <div>
      <div className={styles.section}>
        <div className={styles.elementHead}>
          <span className={styles.elementKind}>{KIND_LABEL[element.kind]}</span>
          <div className={styles.elementActions}>
            <button
              disabled={locked}
              onClick={() => onDuplicate(element.id)}
              title={locked ? 'Mở khoá trước khi nhân bản' : 'Nhân bản'}
              type="button"
            >
              <Copy aria-hidden size={16} />
            </button>
            <button
              disabled={locked}
              onClick={() => onDelete(element.id)}
              title={locked ? 'Mở khoá trước khi xoá' : 'Xoá'}
              type="button"
            >
              <Trash aria-hidden size={16} />
            </button>
          </div>
        </div>

        <div className={styles.inlineRow}>
          <button
            className={styles.pillButton}
            data-active={element.locked}
            onClick={() => onToggle('locked')}
            type="button"
          >
            <LockSimple aria-hidden size={14} /> {element.locked ? 'Đang khoá' : 'Khoá'}
          </button>
          <button
            className={styles.pillButton}
            data-active={element.hidden}
            onClick={() => onToggle('hidden')}
            type="button"
          >
            {element.hidden ? <EyeSlash aria-hidden size={14} /> : <Eye aria-hidden size={14} />}
            {element.hidden ? 'Đang ẩn' : 'Ẩn'}
          </button>
        </div>

        {locked ? (
          <p className={styles.lockNotice}>
            <LockSimple aria-hidden size={15} />
            Khối đang khoá. Bấm “Đang khoá” để mở rồi sửa, xoá hoặc di chuyển.
          </p>
        ) : null}

        <fieldset className={styles.designFields} disabled={locked}>
          <div className={styles.grid2}>
            <NumberField
              label="X"
              max={Math.max(0, CANVAS_WIDTH - element.w)}
              min={0}
              onChange={(x) => onPatch({ x })}
              value={Math.round(element.x)}
            />
            <NumberField label="Y" min={0} onChange={(y) => onPatch({ y })} value={Math.round(element.y)} />
            <NumberField
              label="Rộng"
              max={Math.max(24, CANVAS_WIDTH - element.x)}
              min={24}
              onChange={(w) => onPatch({ w })}
              value={Math.round(element.w)}
            />
            <NumberField
              label="Cao"
              min={2}
              onChange={(h) => onPatch({ h })}
              value={Math.round(element.h)}
            />
          </div>

          <div className={styles.inlineRow}>
            <button className={styles.pillButton} onClick={() => onOrder(element.id, 'up')} type="button">
              <ArrowUp aria-hidden size={14} /> Lên trên
            </button>
            <button className={styles.pillButton} onClick={() => onOrder(element.id, 'down')} type="button">
              <ArrowDown aria-hidden size={14} /> Xuống dưới
            </button>
          </div>

          <Slider
            label="Độ mờ"
            max={100}
            min={10}
            onChange={(value) => onPatch({ opacity: value / 100 })}
            value={Math.round(element.opacity * 100)}
          />
          <Slider
            label="Xoay"
            max={180}
            min={-180}
            onChange={(rotation) => onPatch({ rotation })}
            value={element.rotation}
          />
        </fieldset>
      </div>

      <fieldset className={styles.designFields} disabled={locked}>

      {element.kind === 'text' ? (
        <div className={styles.section}>
          <h3>Kiểu chữ</h3>
          <div className={styles.segmented}>
            {(['serif', 'sans'] as const).map((font) => (
              <button data-active={element.font === font} key={font} onClick={() => onPatch({ font })} type="button">
                {font === 'serif' ? 'Serif' : 'Sans'}
              </button>
            ))}
          </div>

          <div className={styles.grid2}>
            <NumberField
              label="Cỡ chữ"
              max={200}
              min={8}
              onChange={(fontSize) => onPatch({ fontSize })}
              value={element.fontSize}
            />
            <SelectField
              label="Độ đậm"
              onChange={(value) => onPatch({ weight: Number(value) })}
              options={[
                ['300', 'Mảnh'],
                ['400', 'Thường'],
                ['500', 'Vừa'],
                ['600', 'Đậm'],
                ['700', 'Rất đậm'],
              ]}
              value={String(element.weight)}
            />
          </div>

          <div className={styles.segmented}>
            {(['left', 'center', 'right'] as const).map((align) => (
              <button data-active={element.align === align} key={align} onClick={() => onPatch({ align })} type="button">
                {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
              </button>
            ))}
            <button data-active={element.italic} onClick={() => onPatch({ italic: !element.italic })} type="button">
              <i>Italic</i>
            </button>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Màu chữ</span>
            <ColorRow value={element.color} onChange={(color) => onPatch({ color })} />
          </div>

          <Slider
            label="Giãn dòng"
            max={220}
            min={90}
            onChange={(value) => onPatch({ lineHeight: value / 100 })}
            value={Math.round(element.lineHeight * 100)}
          />
          <Slider
            label="Giãn chữ"
            max={30}
            min={-5}
            onChange={(value) => onPatch({ letterSpacing: value / 100 })}
            value={Math.round(element.letterSpacing * 100)}
          />
          <button className={styles.fitButton} onClick={() => onFitText(element.id)} type="button">
            Vừa chiều cao với nội dung
          </button>
        </div>
      ) : null}

      {element.kind === 'image' ? (
        <div className={styles.section}>
          <h3>Ảnh</h3>
          <button className={styles.wideButton} onClick={() => onReplaceImage(element.id)} type="button">
            <UploadSimple aria-hidden size={16} /> Tải ảnh lên
          </button>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Đường dẫn ảnh</span>
            <input
              onChange={(event) => onPatch({ src: event.target.value })}
              placeholder="/media/…"
              type="text"
              value={element.src}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Mô tả ảnh (alt)</span>
            <input
              onChange={(event) => onPatch({ alt: event.target.value })}
              placeholder="Mô tả nội dung ảnh cho người đọc bằng trình đọc màn hình"
              type="text"
              value={element.alt}
            />
          </div>
          <div className={styles.segmented}>
            {(['cover', 'contain'] as const).map((fit) => (
              <button data-active={element.fit === fit} key={fit} onClick={() => onPatch({ fit })} type="button">
                {fit === 'cover' ? 'Lấp đầy' : 'Vừa khung'}
              </button>
            ))}
          </div>
          <Slider
            label="Bo góc"
            max={80}
            min={0}
            onChange={(radius) => onPatch({ radius })}
            value={element.radius}
          />
        </div>
      ) : null}

      {element.kind === 'shape' ? (
        <div className={styles.section}>
          <h3>Hình khối</h3>
          <div className={styles.segmented}>
            {(['rect', 'ellipse', 'line'] as const).map((shape) => (
              <button data-active={element.shape === shape} key={shape} onClick={() => onPatch({ shape })} type="button">
                {shape === 'rect' ? 'Chữ nhật' : shape === 'ellipse' ? 'Tròn' : 'Đường'}
              </button>
            ))}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Màu tô</span>
            <ColorRow value={element.fill} onChange={(fill) => onPatch({ fill })} />
          </div>
          {element.shape !== 'line' ? (
            <>
              <Slider
                label="Bo góc"
                max={80}
                min={0}
                onChange={(radius) => onPatch({ radius })}
                value={element.radius}
              />
              <div className={styles.grid2}>
                <NumberField
                  label="Viền"
                  max={20}
                  min={0}
                  onChange={(strokeWidth) => onPatch({ strokeWidth })}
                  value={element.strokeWidth}
                />
                <ColorField label="Màu viền" onChange={(stroke) => onPatch({ stroke })} value={element.stroke} />
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {element.kind === 'button' ? (
        <div className={styles.section}>
          <h3>Nút bấm</h3>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Nhãn</span>
            <input onChange={(event) => onPatch({ label: event.target.value })} type="text" value={element.label} />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Liên kết</span>
            <input
              onChange={(event) => onPatch({ href: event.target.value })}
              placeholder="https://…"
              type="text"
              value={element.href}
            />
          </label>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Màu nền</span>
            <ColorRow value={element.fill} onChange={(fill) => onPatch({ fill })} />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Màu chữ</span>
            <ColorRow value={element.color} onChange={(color) => onPatch({ color })} />
          </div>
          <Slider
            label="Bo góc"
            max={999}
            min={0}
            onChange={(radius) => onPatch({ radius })}
            value={element.radius}
          />
        </div>
      ) : null}

      {element.kind === 'icon' ? (
        <div className={styles.section}>
          <h3>Biểu tượng</h3>
          <div className={styles.iconPicker}>
            {ICON_LIST.map((icon) => (
              <button
                data-active={element.name === icon.name}
                key={icon.name}
                onClick={() => onPatch({ name: icon.name })}
                title={icon.label}
                type="button"
              >
                <icon.icon aria-hidden size={20} />
              </button>
            ))}
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Màu</span>
            <ColorRow value={element.color} onChange={(color) => onPatch({ color })} />
          </div>
        </div>
      ) : null}

      {element.kind === 'video' ? (
        <div className={styles.section}>
          <h3>Video</h3>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Liên kết YouTube</span>
            <input
              onChange={(event) => onPatch({ url: event.target.value })}
              placeholder="https://youtube.com/watch?v=…"
              type="text"
              value={element.url}
            />
          </label>
        </div>
      ) : null}
      </fieldset>
    </div>
  );
}

function Layers({ doc, element, onSelect, onToggle }: Props) {
  if (!doc.elements.length) {
    return (
      <div className={styles.section}>
        <h3>Lớp</h3>
        <p className={styles.hint}>Chưa có khối nào. Thả một khối vào trang để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h3>Lớp</h3>
      <ul className={styles.layerList}>
        {[...doc.elements].reverse().map((item) => (
          <li data-active={element?.id === item.id} key={item.id}>
            <button className={styles.layerMain} onClick={() => onSelect(item.id)} type="button">
              <span className={styles.layerKind}>{KIND_LABEL[item.kind]}</span>
              <span className={styles.layerText}>
                {item.kind === 'text' ? item.text.slice(0, 40) : item.kind === 'button' ? item.label : KIND_LABEL[item.kind]}
              </span>
            </button>
            <button
              aria-label={item.hidden ? 'Hiện' : 'Ẩn'}
              className={styles.layerAction}
              onClick={() => {
                onSelect(item.id);
                onToggle('hidden');
              }}
              title={item.hidden ? 'Hiện' : 'Ẩn'}
              type="button"
            >
              {item.hidden ? <EyeSlash aria-hidden size={15} /> : <Eye aria-hidden size={15} />}
            </button>
            <button
              aria-label={item.locked ? 'Mở khoá' : 'Khoá'}
              className={styles.layerAction}
              onClick={() => {
                onSelect(item.id);
                onToggle('locked');
              }}
              title={item.locked ? 'Mở khoá' : 'Khoá'}
              type="button"
            >
              <LockSimple aria-hidden size={15} data-locked={item.locked} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft === null) return;
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) {
      const next = Math.min(Math.max(parsed, min ?? -100000), max ?? 100000);
      onChange(next);
      setDraft(String(Math.round(next)));
    } else {
      setDraft(null);
    }
  };

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        max={max}
        min={min}
        onBlur={() => {
          commit();
          setDraft(null);
        }}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
          if (event.key === 'Escape') {
            setDraft(null);
            event.currentTarget.blur();
          }
        }}
        type="number"
        value={draft ?? String(value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.sliderRow}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <span className={styles.sliderValue}>{value}</span>
    </label>
  );
}

function ColorRow({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className={styles.colorRow}>
      <div className={styles.swatches}>
        {SWATCHES.map((color) => (
          <button
            aria-label={color}
            data-active={value.toLowerCase() === color}
            key={color}
            onClick={() => onChange(color)}
            style={{ background: color }}
            type="button"
          />
        ))}
      </div>
      <label className={styles.colorInput}>
        <input onChange={(event) => onChange(event.target.value)} type="color" value={normalizeHex(value)} />
        <span>{value}</span>
      </label>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input onChange={(event) => onChange(event.target.value)} type="color" value={normalizeHex(value)} />
    </label>
  );
}

function normalizeHex(value: string): string {
  return /^#[0-9a-f]{6}$/iu.test(value) ? value : '#000000';
}
