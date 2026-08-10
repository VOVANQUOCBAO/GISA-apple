/**
 * Line-glyph library for the six "TRI THỨC TẠO CHUYỂN BIẾN" plates.
 *
 * Every glyph is authored around the origin inside a ±20 box, so a plate can
 * drop one anywhere with `<JourneyGlyph name x y size />` and keep its own
 * stroke colour by styling the wrapping group. Nothing here carries colour:
 * the plates own the palette, the glyphs own the shape.
 */

import type { ReactNode } from 'react';

export type JourneyGlyphName =
  | 'atom'
  | 'bank'
  | 'barsArrow'
  | 'book'
  | 'brain'
  | 'checklist'
  | 'cloudNodes'
  | 'coin'
  | 'dna'
  | 'docDollar'
  | 'erlenmeyer'
  | 'field'
  | 'flask'
  | 'flaskLeaf'
  | 'funnel'
  | 'gear'
  | 'globe'
  | 'globeLeaf'
  | 'gradCap'
  | 'handLeaf'
  | 'handPlant'
  | 'handshake'
  | 'leaf'
  | 'lineChart'
  | 'microscope'
  | 'molecule'
  | 'monitorChart'
  | 'people'
  | 'peopleHeart'
  | 'petri'
  | 'plantPot'
  | 'target'
  | 'testTubes'
  | 'trophy'
  | 'tubePlant'
  | 'tubeRack';

const GLYPHS: Record<JourneyGlyphName, ReactNode> = {
  atom: (
    <>
      <circle cx="0" cy="0" r="4.2" />
      <ellipse cx="0" cy="0" rx="17" ry="6.6" />
      <ellipse cx="0" cy="0" rx="17" ry="6.6" transform="rotate(60)" />
      <ellipse cx="0" cy="0" rx="17" ry="6.6" transform="rotate(120)" />
    </>
  ),
  bank: (
    <>
      <path d="M0-17-18-6h36ZM-19 15h38M-16 11h32" />
      <path d="M-12-4v14M-4-4v14M4-4v14M12-4v14M-17-6v2h34v-2" />
    </>
  ),
  barsArrow: (
    <>
      <path d="M-16 16h32M-12 12V1M-3 12V-4M6 12v-9" />
      <path d="M-12-3 -3-10 6-4 16-15M10-15h6v6" />
    </>
  ),
  book: (
    <>
      <path d="M-16-12h13a4 4 0 0 1 3 3v20a4 4 0 0 0-3-3h-13ZM16-12H3a4 4 0 0 0-3 3v20a4 4 0 0 1 3-3h13Z" />
      <path d="M0-9v20" />
    </>
  ),
  brain: (
    <>
      <path d="M-2-16c-6-4-14-1-14 5-5 2-5 9 0 11-2 6 4 10 9 7 2 3 5 3 5-1V-14a3 3 0 0 0-4-2Z" />
      <path d="M2-16c6-4 14-1 14 5 5 2 5 9 0 11 2 6-4 10-9 7-2 3-5 3-5-1V-14a3 3 0 0 1 4-2Z" />
      <path d="M-9-6h4M9-6h-4M-8 4h5M8 4h-5" />
    </>
  ),
  checklist: (
    <>
      <path d="M-14-17h28v34h-28Z" />
      <path d="M-8-7-4-3 3-11M-8 5-4 9 3 1M7-7h4M7 5h4" />
    </>
  ),
  cloudNodes: (
    <>
      <path d="M-13 1c-4-8 3-15 10-11 3-8 15-6 15 3 7 0 8 10 1 11h-24c-6 0-7-3-2-3Z" />
      <path d="M0 4v10M-11 6v6M11 6v6M-11 16a2.4 2.4 0 1 0 .1 0M0 18a2.4 2.4 0 1 0 .1 0M11 16a2.4 2.4 0 1 0 .1 0" />
    </>
  ),
  coin: (
    <>
      <circle cx="0" cy="0" r="15" />
      <path d="M0-9v18M-4-6h6a3.4 3.4 0 0 1 0 7h-4a3.4 3.4 0 0 0 0 7h6" />
    </>
  ),
  dna: (
    <>
      <path d="M-9-19C-9-8 9-6 9 5s-18 9-18 20M9-19C9-8-9-6-9 5s18 9 18 20" />
      <path d="M-7-12h14M-8-4h16M-8 6h16M-7 14h14" />
    </>
  ),
  docDollar: (
    <>
      <path d="M-11-16h14l9 9v23h-23ZM3-16v9h9" />
      <path d="M0 0v12M-3 2h4a2.4 2.4 0 0 1 0 5h-2a2.4 2.4 0 0 0 0 5h4" />
    </>
  ),
  erlenmeyer: (
    <>
      <path d="M-7-18h14M-5-18v11l-11 21a4 4 0 0 0 4 6h24a4 4 0 0 0 4-6L9-7v-11" />
      <path d="M-11 3h22" />
      <path d="M-4 9a2 2 0 1 0 .1 0M5 12a2.6 2.6 0 1 0 .1 0" />
    </>
  ),
  field: (
    <>
      <path d="M0 8V-4M0-2c-8-1-11-7-11-12 7 0 11 5 11 12M0-4c4-8 11-10 14-10-1 7-6 11-14 10" />
      <path d="M-18 12c6-3 12-3 18 0s12 3 18 0M-18 18c6-3 12-3 18 0s12 3 18 0" />
    </>
  ),
  flask: (
    <>
      <path d="M-6-18h12M-4-18v12l-11 17a5 5 0 0 0 4 8h22a5 5 0 0 0 4-8L4-6v-12" />
      <path d="M-3 4a2.2 2.2 0 1 0 .1 0M5 9a2.6 2.6 0 1 0 .1 0M-7 12a1.8 1.8 0 1 0 .1 0" />
    </>
  ),
  flaskLeaf: (
    <>
      <path d="M-9-16h10M-7-16v11l-9 15a5 5 0 0 0 4 8h18a5 5 0 0 0 4-8l-9-15v-11" />
      <path d="M2-11c5-4 12-4 16-3-1 6-6 10-13 9" />
    </>
  ),
  funnel: (
    <>
      <path d="M-17-14h34L4 2v11l-8 6V2Z" />
      <path d="M-2 19v-4M-2 15c-6 0-9-4-9-8 5 0 9 3 9 8M-2 15c2-5 7-7 11-7-1 5-5 8-11 7" />
    </>
  ),
  gear: (
    <>
      <circle cx="0" cy="0" r="7" />
      <path d="M0-19v6M0 19v-6M-19 0h6M19 0h-6M-13.4-13.4l4.2 4.2M13.4 13.4l-4.2-4.2M13.4-13.4l-4.2 4.2M-13.4 13.4l4.2-4.2" />
      <circle cx="0" cy="0" r="15" />
    </>
  ),
  globe: (
    <>
      <circle cx="0" cy="0" r="17" />
      <path d="M0-17v34M-17 0h34M-9-13c6 6 6 20 0 26M9-13c-6 6-6 20 0 26" />
    </>
  ),
  globeLeaf: (
    <>
      <circle cx="-2" cy="0" r="15" />
      <path d="M-2-15v30M-17 0h30M-9-11c5 5 5 17 0 22M5-11c-5 5-5 17 0 22" />
      <path d="M6-6c6-5 13-4 16-3-1 6-6 10-12 9" />
    </>
  ),
  gradCap: (
    <>
      <path d="M0-12-18-5 0 2l18-7Z" />
      <path d="M-11-2v9c0 4 22 4 22 0v-9M16-4v9" />
    </>
  ),
  handLeaf: (
    <>
      <path d="M-18 6c5-3 10-3 14 0h7a3 3 0 0 1 0 6h-8M-18 6v10c8 4 20 4 27 0l9-6" />
      <path d="M-1-4c-7-1-10-6-10-11 6 0 11 4 10 11M-1-4c3-7 10-9 14-9-1 6-6 10-14 9" />
    </>
  ),
  handPlant: (
    <>
      <path d="M-18 8c5-3 10-3 14 0h7a3 3 0 0 1 0 6h-8M-18 8v9c8 4 20 4 27 0l9-6" />
      <path d="M-2 0v-9M-2-5c-6-1-9-5-9-10 6 0 10 4 9 10M-2-5c3-6 9-8 13-8-1 6-5 9-13 8" />
    </>
  ),
  handshake: (
    <>
      <path d="M-19-3 -9-9l6 4h7l7-4 8 6" />
      <path d="M-9-5 -1 2l-4 4-6-5M-1 2l5 4M3 6l4 4M-19-3v9l7 6 5-4M19 3v-6l-7 9-4-3" />
    </>
  ),
  leaf: (
    <>
      <path d="M0 18V-1M0 2C-12-1-17-10-17-18-5-17 1-9 0 2M0-1C6-13 15-16 18-16 16-6 10 0 0 2" />
    </>
  ),
  lineChart: (
    <>
      <path d="M-16-16v32h32" />
      <path d="M-11 8 -3-3 3 3 13-12" />
      <path d="M8-12h6v6" />
    </>
  ),
  microscope: (
    <>
      <path d="M-16 18h32M-10 18c-6-4-8-11-6-17 2-6 8-9 13-8" />
      <path d="M2-17 12-11 4 3-6-3ZM-1 5 6 9M-4 18v-6h14v6" />
    </>
  ),
  molecule: (
    <>
      <path d="M0-2-13 9M0-2 13 9M0-2v-11M0-2-11-8M0-2 11-8" />
      <circle cx="0" cy="-2" r="4" />
      <circle cx="0" cy="-15" r="3.4" />
      <circle cx="-14" cy="11" r="3.4" />
      <circle cx="14" cy="11" r="3.4" />
      <circle cx="-13" cy="-10" r="3.4" />
      <circle cx="13" cy="-10" r="3.4" />
    </>
  ),
  monitorChart: (
    <>
      <path d="M-18-15h36v22h-36ZM-6 7v7M6 7v7M-11 14h22" />
      <path d="M-13 2v-6M-7 2v-10M-1 2v-4M5 2v-9M11 2v-5" />
    </>
  ),
  people: (
    <>
      <path d="M-4-9a6.5 6.5 0 1 0 13 0 6.5 6.5 0 1 0-13 0M-8 16v-6a9 9 0 0 1 9-9h3a9 9 0 0 1 9 9v6" />
      <path d="M-19 16v-5a7 7 0 0 1 7-7M-16-6a5 5 0 1 0 10 0 5 5 0 1 0-10 0" />
    </>
  ),
  peopleHeart: (
    <>
      <path d="M-14 14v-4a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v4M-12-4a5 5 0 1 0 10 0 5 5 0 1 0-10 0" />
      <path d="M11-11c3-3 8-1 8 3 0 4-8 9-8 9s-8-5-8-9c0-4 5-6 8-3Z" />
    </>
  ),
  petri: (
    <>
      <circle cx="0" cy="0" r="17" />
      <circle cx="0" cy="0" r="12.5" />
      <path d="M-6-6a2.6 2.6 0 1 0 .1 0M4-3a3.2 3.2 0 1 0 .1 0M-2 6a2.4 2.4 0 1 0 .1 0M7 6a2 2 0 1 0 .1 0" />
    </>
  ),
  plantPot: (
    <>
      <path d="M-11 2h22l-3 16h-16Z" />
      <path d="M0 2v-10M0-6c-7-1-10-6-10-11 6 0 11 4 10 11M0-6c3-7 10-9 14-9-1 6-6 10-14 9" />
    </>
  ),
  target: (
    <>
      <circle cx="-2" cy="2" r="16" />
      <circle cx="-2" cy="2" r="8.5" />
      <path d="M-2 2 16-16M9-16h7v7" />
    </>
  ),
  testTubes: (
    <>
      <path d="M-15-18v27a5 5 0 0 0 10 0v-27M-17-18h14M5-18v27a5 5 0 0 0 10 0v-27M3-18h14" />
      <path d="M-15 0h10M5 3h10" />
    </>
  ),
  trophy: (
    <>
      <path d="M-11-17h22v10c0 8-5 13-11 15-6-2-11-7-11-15Z" />
      <path d="M-11-13h-6c0 7 3 10 6 11M11-13h6c0 7-3 10-6 11M-6 18h12M0 8v6" />
      <path d="m0-10 2 4 4 .6-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.6Z" />
    </>
  ),
  tubePlant: (
    <>
      <path d="M-7-16v22a7 7 0 0 0 14 0v-22M-10-16h20M-7-2h14" />
      <path d="M0-16v-6M0-19c-6-1-8-5-8-9 5 0 9 4 8 9M0-19c2-5 8-7 11-7-1 5-4 8-11 7" />
    </>
  ),
  tubeRack: (
    <>
      <path d="M-15-16v22a4.5 4.5 0 0 0 9 0v-22M-5-16v22a4.5 4.5 0 0 0 9 0v-22M5-16v22a4.5 4.5 0 0 0 9 0v-22" />
      <path d="M-18-16h36M-15-2h9M-5-4h9M5-1h9" />
    </>
  ),
};

export function JourneyGlyph({
  className,
  name,
  size = 1,
  x,
  y,
}: {
  className?: string;
  name: JourneyGlyphName;
  size?: number;
  x: number;
  y: number;
}) {
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${size})`}>
      {GLYPHS[name]}
    </g>
  );
}
