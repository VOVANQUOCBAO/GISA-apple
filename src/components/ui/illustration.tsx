import Image from 'next/image';

import sizes from './illustration-sizes.json';

/**
 * Hand-drawn category illustrations cropped out of the approved design boards in
 * /public/assets by scripts/extract-illustrations.mjs, which also writes the size map
 * next to this file. They replace the flat Phosphor glyphs in the sections those boards
 * cover; everything else keeps using <Icon>.
 */
export type IllustrationName = keyof typeof sizes;

/** `size` is the longest side in px — each drawing keeps its own aspect ratio. */
export function Illustration({ name, size }: { name: IllustrationName; size: number }) {
  const [width, height] = sizes[name];
  const scale = size / Math.max(width, height);

  return (
    <Image
      alt=""
      aria-hidden="true"
      height={Math.round(height * scale)}
      src={`/icons/${name}.png`}
      width={Math.round(width * scale)}
    />
  );
}
