import { z } from 'zod';

import type { FormKind } from './form-types';

const optionalText = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    schema.optional(),
  );

const phonePattern = /^[0-9 +().-]{8,20}$/;

export function createFormSchema(kind: FormKind) {
  return z
    .object({
      kind: z.literal(kind),
      fullName: z
        .string()
        .trim()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự.')
        .max(100, 'Họ tên không được vượt quá 100 ký tự.'),
      email: z
        .string()
        .trim()
        .email('Vui lòng nhập địa chỉ email hợp lệ.'),
      phone: optionalText(
        z
          .string()
          .trim()
          .regex(phonePattern, 'Số điện thoại phải có 8–20 ký tự hợp lệ.'),
      ),
      organization:
        kind === 'hop-tac'
          ? z
              .string()
              .trim()
              .min(1, 'Vui lòng nhập tên tổ chức.')
              .max(150, 'Tên tổ chức không được vượt quá 150 ký tự.')
          : optionalText(
              z
                .string()
                .trim()
                .max(150, 'Tên tổ chức không được vượt quá 150 ký tự.'),
            ),
      message: z
        .string()
        .trim()
        .min(10, 'Nội dung phải có ít nhất 10 ký tự.')
        .max(2000, 'Nội dung không được vượt quá 2.000 ký tự.'),
      consent: z.literal(true, {
        error: 'Bạn cần đồng ý với thông báo xử lý dữ liệu mô phỏng.',
      }),
      website: z.literal('', { error: 'Dữ liệu biểu mẫu không hợp lệ.' }),
      courseSlug: optionalText(z.string().trim().max(160)),
    });
}

export type FormFieldName =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'organization'
  | 'message'
  | 'consent'
  | 'website'
  | 'courseSlug';

export type FormErrors = Partial<Record<FormFieldName, string>>;
