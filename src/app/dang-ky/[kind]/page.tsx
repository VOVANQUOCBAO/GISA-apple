import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormPage } from '@/components/forms/form-page';
import type { FormKind } from '@/components/forms/form-types';
import { buildMetadata } from '@/components/seo/build-metadata';

const allowedKinds = new Set<FormKind>(['tu-van', 'khoa-hoc', 'hop-tac']);
const formMetadata: Record<
  Exclude<FormKind, 'lien-he'>,
  { description: string; title: string }
> = {
  'tu-van': {
    description: 'Gửi yêu cầu tư vấn trong giao diện mô phỏng.',
    title: 'Đăng ký tư vấn',
  },
  'khoa-hoc': {
    description: 'Gửi quan tâm khóa học trong giao diện mô phỏng.',
    title: 'Đăng ký khóa học',
  },
  'hop-tac': {
    description: 'Gửi đề nghị hợp tác trong giao diện mô phỏng.',
    title: 'Đề nghị hợp tác',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string }>;
}): Promise<Metadata> {
  const { kind } = await params;
  if (!allowedKinds.has(kind as FormKind)) return {};
  const copy = formMetadata[kind as keyof typeof formMetadata];

  return buildMetadata({
    ...copy,
    indexable: false,
    path: `/dang-ky/${kind}`,
  });
}

export default async function RegistrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ course?: string | string[] }>;
}) {
  const [{ kind }, query] = await Promise.all([params, searchParams]);
  if (!allowedKinds.has(kind as FormKind)) notFound();

  const course = Array.isArray(query.course) ? query.course[0] : query.course;
  return (
    <FormPage
      courseSlug={course?.trim().slice(0, 160)}
      kind={kind as FormKind}
    />
  );
}
