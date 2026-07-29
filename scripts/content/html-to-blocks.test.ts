import { describe, expect, test } from 'vitest';

import { htmlToBlocks } from './html-to-blocks';

describe('htmlToBlocks', () => {
  test('sanitizes controlled HTML and emits typed content blocks', () => {
    const result = htmlToBlocks(
      `<script>alert('x')</script>
       <h1 style="color:red">Record title</h1>
       <h2 onclick="evil()">Section</h2><h2>Section</h2>
       <p>Useful <strong>copy</strong>.</p><div><span></span></div>
       <ul><li>First</li><li>Second</li></ul>
       <blockquote>Quoted text <cite>GISA</cite></blockquote>
       <img src="https://gisa.edu.vn/pixel.gif" width="1" height="1">
       <img src="https://gisa.edu.vn/styled-pixel.gif" style="width: 1px; height: 1px">
       <img src="vbscript:msgbox(1)" alt="Unsafe image">
       <img src="/body-image.jpg" alt="Body image">
       <img data-asset-id="asset-hero" src="/hero.jpg" alt="Hero" title="Caption">
       <table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Value</td></tr></tbody></table>`,
      { documentTitle: 'Record title', sourceUrl: 'https://gisa.edu.vn/source' },
    );

    expect(result.blocks).toEqual([
      { type: 'heading', level: 2, text: 'Section' },
      { type: 'paragraph', text: 'Useful copy.' },
      { type: 'list', ordered: false, items: ['First', 'Second'] },
      { type: 'quote', text: 'Quoted text', attribution: 'GISA' },
      { type: 'image', assetId: 'legacy-body-image-jpg' },
      { type: 'image', assetId: 'asset-hero', caption: 'Caption' },
      { type: 'table', headers: ['Name'], rows: [['Value']] },
    ]);
    expect(result.images).toEqual([
      {
        alt: 'Body image',
        assetId: 'legacy-body-image-jpg',
        sourceUrl: 'https://gisa.edu.vn/body-image.jpg',
      },
      {
        alt: 'Hero',
        assetId: 'asset-hero',
        sourceUrl: 'https://gisa.edu.vn/hero.jpg',
      },
    ]);
    expect(result.issues).toContain('tracking_pixel_removed');
    expect(result.images).not.toContainEqual(
      expect.objectContaining({
        sourceUrl: 'https://gisa.edu.vn/styled-pixel.gif',
      }),
    );
    expect(result.issues).toContain('unsafe_image_removed');
    expect(JSON.stringify(result.blocks)).not.toMatch(/script|onclick|style=/i);
  });

  test('rewrites mapped same-origin links, labels external links, and drops unsafe protocols', () => {
    const result = htmlToBlocks(
      `<p><a href="https://gisa.edu.vn/old">Old record</a></p>
       <p><a href="https://example.org/paper">External paper</a></p>
       <p><a href="javascript:alert(1)">Unsafe</a></p>`,
      {
        canonicalPaths: new Map([
          ['https://gisa.edu.vn/old', '/tin-tuc/canonical-record'],
        ]),
        sourceUrl: 'https://gisa.edu.vn/source',
      },
    );

    expect(result.blocks).toEqual([
      {
        type: 'linkGroup',
        links: [{ label: 'Old record', href: '/tin-tuc/canonical-record' }],
      },
      {
        type: 'linkGroup',
        links: [
          {
            label: 'External paper (liên kết ngoài)',
            href: 'https://example.org/paper',
          },
        ],
      },
      { type: 'paragraph', text: 'Unsafe' },
    ]);
    expect(result.issues).toContain('unsafe_link_removed');
  });
});
