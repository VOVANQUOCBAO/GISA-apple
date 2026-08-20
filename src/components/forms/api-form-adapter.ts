import type {
  FormInput,
  FormSubmissionAdapter,
  FormSubmissionResult,
} from './form-types';

const fallbackError =
  'Không thể gửi thông tin lúc này. Dữ liệu vẫn còn trên biểu mẫu để bạn thử lại.';

interface SubmissionResponse {
  message?: unknown;
}

async function readMessage(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as SubmissionResponse;
    return typeof body.message === 'string' ? body.message : undefined;
  } catch {
    return undefined;
  }
}

export class ApiFormAdapter implements FormSubmissionAdapter {
  async submit(input: FormInput): Promise<FormSubmissionResult> {
    try {
      const response = await fetch('/api/form-submissions', {
        body: JSON.stringify(input),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const message = await readMessage(response);

      return response.ok
        ? {
            message: message ?? 'GISA đã tiếp nhận thông tin của bạn.',
            status: 'success',
          }
        : { message: message ?? fallbackError, status: 'error' };
    } catch {
      return { message: fallbackError, status: 'error' };
    }
  }
}
