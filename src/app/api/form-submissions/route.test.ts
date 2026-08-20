import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { POST } from './route';

const validContact = {
  consent: true,
  email: 'an@example.com',
  fullName: 'Nguyễn An',
  industry: 'Giáo dục',
  jobTitle: 'Giám đốc',
  kind: 'lien-he',
  message: 'Tôi muốn trao đổi thêm với GISA.',
  organization: 'Công ty An Việt',
  phone: '0818711799',
  website: '',
};

function request(body: unknown) {
  return new Request('http://localhost/api/form-submissions', {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}

describe('POST /api/form-submissions', () => {
  beforeEach(() => {
    delete process.env.GISA_FORM_WEBHOOK_SECRET;
    delete process.env.GISA_FORM_WEBHOOK_URL;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('returns a clear unavailable response when no receiver is configured', async () => {
    const response = await POST(request(validContact));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining('chưa được cấu hình'),
    });
  });

  test('accepts a course enquiry without professional profile fields', async () => {
    const response = await POST(
      request({
        consent: true,
        email: 'hocvien@example.com',
        fullName: 'Học Viên',
        kind: 'khoa-hoc',
        phone: '0818711799',
        website: '',
      }),
    );

    expect(response.status).toBe(503);
  });

  test('forwards validated data only when the webhook succeeds', async () => {
    process.env.GISA_FORM_WEBHOOK_SECRET = 'test-secret';
    process.env.GISA_FORM_WEBHOOK_URL = 'https://receiver.example/forms';
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request(validContact));

    expect(response.status).toBe(202);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe('https://receiver.example/forms');
    expect(init.headers).toMatchObject({
      'X-GISA-Webhook-Secret': 'test-secret',
    });
    expect(JSON.parse(String(init.body))).toMatchObject({
      source: 'gisa.edu.vn',
      submission: { email: 'an@example.com', kind: 'lien-he' },
    });
  });

  test('does not report success when the receiver rejects the submission', async () => {
    process.env.GISA_FORM_WEBHOOK_URL = 'https://receiver.example/forms';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );

    const response = await POST(request(validContact));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining('chưa phản hồi thành công'),
    });
  });
});
