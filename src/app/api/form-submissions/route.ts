import { createFormSchema } from '@/components/forms/form-schema';
import type { FormKind } from '@/components/forms/form-types';

const formKinds = new Set<FormKind>(['tu-van', 'khoa-hoc', 'hop-tac', 'lien-he']);
const maxRequestBytes = 32_768;
const webhookTimeoutMs = 10_000;

function json(message: string, status: number) {
  return Response.json(
    { message },
    { headers: { 'Cache-Control': 'no-store' }, status },
  );
}

function isFormKind(value: unknown): value is FormKind {
  return typeof value === 'string' && formKinds.has(value as FormKind);
}

function configuredWebhook(): URL | null {
  const value = process.env.GISA_FORM_WEBHOOK_URL?.trim();
  if (!value) return null;

  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Unsupported webhook protocol.');
  }
  return url;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxRequestBytes) {
    return json('Dữ liệu biểu mẫu vượt quá giới hạn cho phép.', 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json('Dữ liệu biểu mẫu không hợp lệ.', 400);
  }

  if (!body || typeof body !== 'object' || !isFormKind(Reflect.get(body, 'kind'))) {
    return json('Loại biểu mẫu không hợp lệ.', 400);
  }

  const kind = Reflect.get(body, 'kind') as FormKind;
  const parsed = createFormSchema(kind).safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        errors: parsed.error.flatten().fieldErrors,
        message: 'Vui lòng kiểm tra lại thông tin biểu mẫu.',
      },
      { headers: { 'Cache-Control': 'no-store' }, status: 400 },
    );
  }

  let webhook: URL | null;
  try {
    webhook = configuredWebhook();
  } catch {
    return json('Kênh tiếp nhận đang được cấu hình chưa hợp lệ.', 500);
  }

  if (!webhook) {
    return json(
      'Kênh tiếp nhận trực tuyến chưa được cấu hình. Dữ liệu vẫn còn trên biểu mẫu; vui lòng liên hệ 0818 711 799 hoặc info@gisa.edu.vn.',
      503,
    );
  }

  const submission = { ...parsed.data, website: undefined };
  const secret = process.env.GISA_FORM_WEBHOOK_SECRET?.trim();

  try {
    const response = await fetch(webhook, {
      body: JSON.stringify({
        source: 'gisa.edu.vn',
        submission,
        submittedAt: new Date().toISOString(),
      }),
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-GISA-Webhook-Secret': secret } : {}),
      },
      method: 'POST',
      signal: AbortSignal.timeout(webhookTimeoutMs),
    });

    if (!response.ok) {
      return json(
        'Kênh tiếp nhận chưa phản hồi thành công. Dữ liệu vẫn còn trên biểu mẫu để bạn thử lại.',
        502,
      );
    }
  } catch {
    return json(
      'Không thể kết nối kênh tiếp nhận. Dữ liệu vẫn còn trên biểu mẫu để bạn thử lại.',
      502,
    );
  }

  return json('GISA đã tiếp nhận thông tin của bạn.', 202);
}
