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
    description: 'Chia sẻ nhu cầu để GISA hiểu bối cảnh và chuẩn bị hướng trao đổi phù hợp.',
    title: 'Đăng ký tư vấn',
  },
  'khoa-hoc': {
    description: 'Chia sẻ mục tiêu học tập và khóa học bạn đang quan tâm.',
    title: 'Đăng ký khóa học',
  },
  'hop-tac': {
    description: 'Giới thiệu nhu cầu và định hướng hợp tác của tổ chức bạn.',
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
