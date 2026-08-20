import { describe, expect, test } from 'vitest';

import { createFormSchema } from './form-schema';

const base = {
  consent: true,
  email: 'an@example.com',
  fullName: 'Nguyễn An',
  phone: '0818711799',
  website: '',
};

describe('createFormSchema', () => {
  test.each(['lien-he', 'hop-tac'] as const)(
    '%s requires organization, job title, and industry',
    (kind) => {
      const result = createFormSchema(kind).safeParse({ ...base, kind });

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.flatten().fieldErrors).toMatchObject({
        industry: ['Vui lòng nhập ngành nghề.'],
        jobTitle: ['Vui lòng nhập chức vụ.'],
        organization: ['Vui lòng nhập tên tổ chức.'],
      });
    },
  );

  test('course enquiry accepts omitted professional fields and message', () => {
    expect(
      createFormSchema('khoa-hoc').safeParse({ ...base, kind: 'khoa-hoc' }).success,
    ).toBe(true);
  });
});
