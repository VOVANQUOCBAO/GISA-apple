import { describe, expect, test } from 'vitest';

import {
  auditDuplicateCopy,
  auditVietnameseSource,
  auditVietnameseSources,
  extractTextCandidates,
  isAuditedSourcePath,
} from './audit-vietnamese-content';

function codes(source: string): string[] {
  return auditVietnameseSource(source, 'sample.tsx').map((issue) => issue.code);
}

describe('Vietnamese content checker', () => {
  test.each([
    'fixture',
    'prototype',
    'production',
    'collection',
    'cổng bằng chứng',
    'chờ xác minh',
    'trang nguồn chưa công bố',
    'được phép công bố',
  ])('flags exposed internal term: %s', (term) => {
    expect(codes(`export const summary = 'Nội dung ${term} dành cho người đọc.'`)).toContain(
      'INTERNAL_TERM_EXPOSED',
    );
  });

  test('flags an internal status used as the complete visible label', () => {
    expect(codes(`export const status = 'Chờ xác minh';`)).toContain(
      'INTERNAL_TERM_EXPOSED',
    );
  });

  test('flags a dependent phrase split into a standalone text block', () => {
    expect(codes(`export function Intro() { return <p>Nhằm nâng cao năng lực.</p>; }`)).toContain(
      'DEPENDENT_FRAGMENT',
    );
    expect(codes(`export const lead = 'Thông qua mạng lưới chuyên gia.'`)).toContain(
      'DEPENDENT_FRAGMENT',
    );
    expect(codes(`export const lead = 'Không chỉ cung cấp kiến thức.'`)).toContain(
      'DEPENDENT_FRAGMENT',
    );
  });

  test('allows a subordinating opening followed by a complete main clause', () => {
    expect(
      codes(
        `export const lead = 'Thông qua mạng lưới đối tác, GISA kết nối chuyên gia với doanh nghiệp địa phương.'`,
      ),
    ).not.toContain('DEPENDENT_FRAGMENT');
    expect(
      codes(
        `export const lead = 'Thông qua chuyên đề, đối thoại và trải nghiệm, người học phát triển tư duy lãnh đạo dài hạn.'`,
      ),
    ).not.toContain('DEPENDENT_FRAGMENT');
  });

  test('flags prose serialized as a list of full sentences', () => {
    const source = `
      export const items = [
        'GISA kết nối chuyên gia với doanh nghiệp để cùng xác định nhu cầu và xây dựng giải pháp phù hợp.',
        'Nhóm nghiên cứu đồng hành cùng đối tác trong quá trình thử nghiệm và đánh giá kết quả thực tế.',
        'Kết quả được chia sẻ bằng ngôn ngữ rõ ràng để các bên có thể tiếp tục ứng dụng trong công việc.',
        'Chương trình tạo không gian trao đổi để người học liên hệ kiến thức với bối cảnh nghề nghiệp.',
        'Mỗi chuyên đề được xây dựng từ tình huống thực tế và có mục tiêu học tập cụ thể.',
        'Người tham gia nhận phản hồi để điều chỉnh cách tiếp cận và hoàn thiện phương án hành động.',
        'Tài liệu tổng kết giúp đội ngũ tiếp tục áp dụng kết quả sau khi chương trình kết thúc.',
      ];
    `;
    expect(codes(source)).toContain('PROSE_SERIALIZED_AS_LIST');
  });

  test('allows a short semantic list of complete statements', () => {
    const source = `
      export const items = [
        'GISA kết nối chuyên gia với doanh nghiệp để cùng xác định nhu cầu và xây dựng giải pháp phù hợp.',
        'Nhóm nghiên cứu đồng hành cùng đối tác trong quá trình thử nghiệm và đánh giá kết quả thực tế.',
        'Kết quả được chia sẻ bằng ngôn ngữ rõ ràng để các bên có thể tiếp tục ứng dụng trong công việc.',
      ];
    `;
    expect(codes(source)).not.toContain('PROSE_SERIALIZED_AS_LIST');
  });

  test('does not treat a generic data array as rendered list content', () => {
    const source = `
      export const records = [
        'GISA kết nối chuyên gia với doanh nghiệp để cùng xác định nhu cầu và xây dựng giải pháp phù hợp.',
        'Nhóm nghiên cứu đồng hành cùng đối tác trong quá trình thử nghiệm và đánh giá kết quả thực tế.',
        'Kết quả được chia sẻ bằng ngôn ngữ rõ ràng để các bên có thể tiếp tục ứng dụng trong công việc.',
      ];
    `;
    expect(codes(source)).not.toContain('PROSE_SERIALIZED_AS_LIST');
  });

  test('warns when more than eight visible items have no grouping', () => {
    const items = Array.from(
      { length: 9 },
      (_, index) => `'Nội dung giới thiệu mục số ${index + 1}'`,
    ).join(',\n');
    expect(codes(`export const items = [${items}];`)).toContain(
      'UNGROUPED_LONG_LIST',
    );
  });

  test('flags forced JSX breaks and block display inside a phrase', () => {
    const source = `
      export function Intro() {
        return <p>Kiến thức cho hôm nay<br />Năng lực cho ngày mai.</p>;
      }
      export function SplitPhrase() {
        return <p>GISA <span className="block">kết nối tri thức</span> với thực tiễn.</p>;
      }
    `;
    expect(codes(source)).toEqual(
      expect.arrayContaining(['JSX_BREAK_IN_SENTENCE', 'BLOCK_INSIDE_PHRASE']),
    );
  });

  test('finds exact repeated summaries and shared long passages', () => {
    const exact =
      'GISA kết nối nghiên cứu với thực tiễn để kiến thức được chuyển hóa thành năng lực và giá trị bền vững.';
    const shared =
      'GISA đồng hành cùng các tổ chức để chuyển hóa tri thức thành giải pháp có thể ứng dụng trong bối cảnh địa phương';
    const result = auditVietnameseSources([
      { file: 'a.ts', source: `export const summary = '${exact}'` },
      { file: 'b.ts', source: `export const summary = '${exact}'` },
      {
        file: 'c.ts',
        source: `export const summary = '${shared}, đồng thời tạo nền tảng học hỏi lâu dài cho đội ngũ.'`,
      },
      {
        file: 'd.ts',
        source: `export const summary = '${shared}, từ đó mở rộng cơ hội hợp tác giữa các bên liên quan.'`,
      },
    ]);

    expect(result.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['DUPLICATE_LONG_COPY', 'DUPLICATE_COPY_NGRAM']),
    );
  });

  test('duplicate helper remains pure and reports the later location', () => {
    const value =
      'Một lời giới thiệu chuyên nghiệp cần cho biết chương trình dành cho ai, giải quyết điều gì và bước tiếp theo là gì.';
    const candidates = extractTextCandidates(
      `export const first = '${value}';\nexport const second = '${value}';`,
      'copy.ts',
    );
    const result = auditDuplicateCopy(candidates);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      code: 'DUPLICATE_LONG_COPY',
      file: 'copy.ts',
      line: 2,
      severity: 'P2',
    });
  });

  test('accepts a clean, meaningful Vietnamese introduction', () => {
    const source = `
      export const page = {
        title: 'Nghiên cứu gắn với thực tiễn',
        summary: 'GISA kết nối nhà nghiên cứu, doanh nghiệp và cộng đồng để cùng phát triển những giải pháp phù hợp với nhu cầu địa phương.',
        nextStep: 'Khám phá các dự án đang được triển khai',
        groups: [
          { group: 'Nghiên cứu', title: 'Phát triển tri thức có khả năng ứng dụng' },
          { group: 'Hợp tác', title: 'Kết nối năng lực từ nhiều lĩnh vực' },
        ],
      };
      export function Intro() {
        return <p>{page.summary}</p>;
      }
    `;

    expect(auditVietnameseSource(source, 'clean.tsx')).toEqual([]);
  });

  test('limits the default repository scan to child-page content', () => {
    expect(isAuditedSourcePath('src/content/static-blocks/dao-tao.ts')).toBe(true);
    expect(isAuditedSourcePath('src/components/forms/form-page.tsx')).toBe(true);
    expect(isAuditedSourcePath('src/components/templates/home-template.tsx')).toBe(false);
    expect(isAuditedSourcePath('src/app/landing-bdt/data.ts')).toBe(false);
  });
});
