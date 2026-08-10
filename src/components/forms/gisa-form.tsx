'use client';

import { useEffect, useRef, useState } from 'react';

import { createFormSchema, type FormErrors, type FormFieldName } from './form-schema';
import { FormField } from './form-field';
import { SimulatedFormAdapter } from './simulated-form-adapter';
import type { FormKind, FormSubmissionAdapter } from './form-types';
import styles from './form.module.css';

interface GisaFormProps {
  adapter?: FormSubmissionAdapter;
  courseSlug?: string;
  kind: FormKind;
}
const successMessage =
  'Thông tin vẫn ở trong trình duyệt và chưa được gửi tới GISA. Kênh tiếp nhận đang được hoàn thiện.';
const errorMessage =
  'Không thể hoàn tất thao tác. Thông tin vẫn ở trong trình duyệt; bạn có thể kiểm tra và thử lại.';

function describedBy(id: string, error?: string) {
  return error ? `${id}-error` : undefined;
}

export function GisaForm({
  adapter = new SimulatedFormAdapter(),
  courseSlug,
  kind,
}: GisaFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0) summaryRef.current?.focus();
  }, [errors]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');

    const formData = new FormData(event.currentTarget);
    const parsed = createFormSchema(kind).safeParse({
      kind,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      organization: formData.get('organization'),
      message: formData.get('message'),
      consent: formData.get('consent') === 'on',
      website: formData.get('website'),
      courseSlug: formData.get('courseSlug'),
    });

    if (!parsed.success) {
      const nextErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FormFieldName | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsPending(true);
    try {
      const result = await adapter.submit(parsed.data);
      setStatus(result.status === 'simulated_success' ? 'success' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <p className={styles.disclosure}>
        Kênh tiếp nhận trực tuyến đang được hoàn thiện. Thông tin bạn nhập chỉ
        được xử lý trong trình duyệt và chưa được gửi đến GISA.
      </p>

      {Object.keys(errors).length > 0 ? (
        <div
          className={styles.errorSummary}
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
        >
          <h2>Vui lòng kiểm tra các trường sau</h2>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.fields}>
        <FormField
          error={errors.fullName}
          id="fullName"
          label="Họ và tên"
          required
        >
          <input
            aria-describedby={describedBy('fullName', errors.fullName)}
            aria-invalid={Boolean(errors.fullName)}
            autoComplete="name"
            id="fullName"
            maxLength={100}
            name="fullName"
            required
          />
        </FormField>

        <FormField error={errors.email} id="email" label="Email" required>
          <input
            aria-describedby={describedBy('email', errors.email)}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id="email"
            name="email"
            required
            type="email"
          />
        </FormField>

        <FormField
          error={errors.phone}
          id="phone"
          label="Số điện thoại (không bắt buộc)"
        >
          <input
            aria-describedby={describedBy('phone', errors.phone)}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id="phone"
            inputMode="tel"
            name="phone"
          />
        </FormField>

        <FormField
          error={errors.organization}
          id="organization"
          label={`Tổ chức${kind === 'hop-tac' ? '' : ' (không bắt buộc)'}`}
          required={kind === 'hop-tac'}
        >
          <input
            aria-describedby={describedBy(
              'organization',
              errors.organization,
            )}
            aria-invalid={Boolean(errors.organization)}
            autoComplete="organization"
            id="organization"
            maxLength={150}
            name="organization"
            required={kind === 'hop-tac'}
          />
        </FormField>

        {kind === 'khoa-hoc' ? (
          <FormField id="courseSlug" label="Khóa học quan tâm">
            <input
              defaultValue={courseSlug}
              id="courseSlug"
              maxLength={160}
              name="courseSlug"
              readOnly={Boolean(courseSlug)}
            />
          </FormField>
        ) : null}

        <FormField
          error={errors.message}
          id="message"
          label="Nội dung"
          required
        >
          <textarea
            aria-describedby={describedBy('message', errors.message)}
            aria-invalid={Boolean(errors.message)}
            id="message"
            maxLength={2000}
            name="message"
            required
            rows={7}
          />
        </FormField>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input autoComplete="off" id="website" name="website" tabIndex={-1} />
        </div>

        <div className={styles.consentField}>
          <input
            aria-describedby={describedBy('consent', errors.consent)}
            aria-invalid={Boolean(errors.consent)}
            id="consent"
            name="consent"
            type="checkbox"
          />
          <label htmlFor="consent">
            Tôi hiểu thông tin chưa được gửi đến GISA và đồng ý để trình duyệt
            xử lý dữ liệu khi kiểm tra thông tin.
          </label>
          {errors.consent ? (
            <p className={styles.fieldError} id="consent-error">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>

      <button className={styles.submitButton} disabled={isPending} type="submit">
        {isPending ? 'Đang kiểm tra…' : 'Kiểm tra thông tin'}
      </button>

      <div aria-live="polite" className={styles.status} role="status">
        {status === 'success'
          ? successMessage
          : status === 'error'
            ? errorMessage
            : null}
      </div>
    </form>
  );
}
