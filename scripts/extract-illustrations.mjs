// Regenerates public/icons/*.png by cropping the category illustrations out of the
// approved design boards in public/assets. Run from the repo root: node scripts/extract-illustrations.mjs
// sharp is not a direct dependency; it ships with Next's image optimizer, so under
// pnpm's strict layout it has to be looked up inside the virtual store.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);

function loadSharp() {
  try {
    return require('sharp');
  } catch {
    const store = new URL('../node_modules/.pnpm/', import.meta.url);
    const dir = readdirSync(store).find((entry) => entry.startsWith('sharp@'));
    if (!dir) throw new Error('sharp not found — run `pnpm install` first.');
    return require(fileURLToPath(new URL(`${dir}/node_modules/sharp/`, store)));
  }
}

const sharp = loadSharp();

const OUT = 'public/icons';
mkdirSync(OUT, { recursive: true });

// Boxes are expressed in the coordinate space of the screenshot I reviewed;
// `scale` maps them back onto the real pixels of the source PNG.
const sources = [
  {
    file: 'public/assets/gisa-category-navigation.png',
    scale: 2172 / 2000,
    boxes: [
      ['nav-nghien-cuu', 42, 285, 120, 155],
      ['nav-tu-van', 368, 285, 120, 155],
      ['nav-dao-tao', 692, 285, 120, 155],
      ['nav-ung-dung', 1006, 285, 122, 155],
      ['nav-mang-luoi', 1322, 285, 126, 155],
      ['nav-cong-dong', 1642, 285, 126, 155],
    ],
  },
  {
    file: 'public/assets/gisa-impact-cards.png',
    scale: 2125 / 2000,
    boxes: [
      ['impact-doi-moi', 40, 248, 155, 150],
      ['impact-cong-dong', 695, 248, 155, 150],
      ['impact-giao-duc', 1345, 248, 160, 150],
      ['impact-khi-hau', 40, 478, 155, 150],
      ['impact-hop-tac', 695, 478, 155, 150],
      ['impact-do-luong', 1345, 478, 160, 150],
    ],
  },
  {
    file: 'public/assets/gisa-service-cards.png',
    scale: 1,
    boxes: [
      ['service-nghien-cuu', 48, 33, 212, 212],
      ['service-tu-van', 813, 33, 212, 212],
      ['service-dao-tao', 48, 538, 212, 212],
      ['service-do-luong', 813, 538, 212, 212],
    ],
  },
  {
    file: 'public/assets/gisa-consulting-process.png',
    scale: 1,
    boxes: [
      ['process-1', 55, 340, 195, 190],
      ['process-2', 388, 340, 195, 190],
      ['process-3', 720, 340, 195, 190],
      ['process-4', 1053, 340, 195, 190],
      ['process-5', 1385, 340, 195, 190],
      ['chat-bubbles', 590, 800, 82, 72],
    ],
  },
  {
    file: 'public/assets/gisa-featured-research.png',
    scale: 1,
    // Dark navy cards, so the plate colour is sampled instead of assumed white.
    plate: 'sampled',
    boxes: [
      ['research-doc', 985, 100, 90, 80],
      ['research-trade4sd', 68, 288, 249, 198],
      ['research-valumics', 478, 356, 326, 106],
      ['research-strength2food', 890, 295, 245, 195],
      ['research-british-council', 1296, 340, 290, 146],
    ],
  },
];

// The illustrations sit on a flat plate; flood-filling from the border clears it
// without punching holes in the matching areas *inside* the drawing.
async function clearOuterPlate(buffer, mode) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const [pr, pg, pb] = [data[0], data[1], data[2]];
  const isPlate =
    mode === 'sampled'
      ? (i) =>
          Math.abs(data[i] - pr) <= 16 &&
          Math.abs(data[i + 1] - pg) <= 16 &&
          Math.abs(data[i + 2] - pb) <= 16
      : (i) => data[i] >= 246 && data[i + 1] >= 246 && data[i + 2] >= 246;
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x += 1) {
    stack.push(x, (height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    stack.push(y * width, y * width + width - 1);
  }
  while (stack.length > 0) {
    const p = stack.pop();
    if (seen[p]) continue;
    const i = p * channels;
    if (!isPlate(i)) continue;
    seen[p] = 1;
    data[i + 3] = 0;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }
  return sharp(data, { raw: { width, height, channels } }).png({ compressionLevel: 9 }).toBuffer();
}

// The drawings have wildly different aspect ratios (a tall microscope, a wide row of
// crates), so each file keeps its own shape and the sizes are handed to the component.
const sizes = {};

for (const { file, scale, plate, boxes } of sources) {
  for (const [name, x, y, w, h] of boxes) {
    const cropped = await sharp(file)
      .extract({
        left: Math.round(x * scale),
        top: Math.round(y * scale),
        width: Math.round(w * scale),
        height: Math.round(h * scale),
      })
      .png()
      .toBuffer();
    const info = await sharp(await clearOuterPlate(cropped, plate))
      .trim({ threshold: 0 })
      .resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10, palette: true, quality: 88 })
      .toFile(`${OUT}/${name}.png`);
    sizes[name] = [info.width, info.height];
    console.log(name, `${info.width}x${info.height}`);
  }
}

writeFileSync(
  'src/components/ui/illustration-sizes.json',
  `${JSON.stringify(sizes, null, 2)}\n`,
);
