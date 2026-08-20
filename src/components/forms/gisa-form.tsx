'use client';

import { useEffect, useRef, useState } from 'react';

import { ApiFormAdapter } from './api-form-adapter';
import { createFormSchema, type FormErrors, type FormFieldName } from './form-schema';
import { FormField } from './form-field';
import type {
  FormKind,
  FormSubmissionAdapter,
  FormSubmissionResult,
} from './form-types';
import styles from './form.module.css';

interface GisaFormProps {
  adapter?: FormSubmissionAdapter;
  courseSlug?: string;
  kind: FormKind;
}
const errorMessage =
  'Không thể gửi thông tin lúc này. Dữ liệu vẫn còn trên biểu mẫu để bạn thử lại.';
const defaultAdapter = new ApiFormAdapter();

function describedBy(id: string, error?: string) {
  return error ? `${id}-error` : undefined;
}

export function GisaForm({
  adapter = defaultAdapter,
  courseSlug,
  kind,
}: GisaFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<FormSubmissionResult | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const requiresProfessionalDetails = kind !== 'khoa-hoc';
  const requiresMessage = kind !== 'khoa-hoc';

  useEffect(() => {
    if (Object.keys(errors).length > 0) summaryRef.current?.focus();
  }, [errors]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const parsed = createFormSchema(kind).safeParse({
      kind,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      organization: formData.get('organization'),
      jobTitle: formData.get('jobTitle'),
      industry: formData.get('industry'),
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
      setResult(await adapter.submit(parsed.data));
    } catch {
      setResult({ message: errorMessage, status: 'error' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
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
          label="Số điện thoại"
          required
        >
          <input
            aria-describedby={describedBy('phone', errors.phone)}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            id="phone"
            inputMode="tel"
            name="phone"
            required
          />
        </FormField>

        <FormField
          error={errors.organization}
          id="organization"
          label="Tổ chức"
          required={requiresProfessionalDetails}
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
            required={requiresProfessionalDetails}
          />
        </FormField>

        <FormField
          error={errors.jobTitle}
          id="jobTitle"
          label="Chức vụ"
          required={requiresProfessionalDetails}
        >
          <input
            aria-describedby={describedBy('jobTitle', errors.jobTitle)}
            aria-invalid={Boolean(errors.jobTitle)}
            autoComplete="organization-title"
            id="jobTitle"
            maxLength={120}
            name="jobTitle"
            required={requiresProfessionalDetails}
          />
        </FormField>

        <FormField
          error={errors.industry}
          id="industry"
          label="Ngành nghề"
          required={requiresProfessionalDetails}
        >
          <input
            aria-describedby={describedBy('industry', errors.industry)}
            aria-invalid={Boolean(errors.industry)}
            id="industry"
            maxLength={150}
            name="industry"
            required={requiresProfessionalDetails}
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
          required={requiresMessage}
        >
          <textarea
            aria-describedby={describedBy('message', errors.message)}
            aria-invalid={Boolean(errors.message)}
            id="message"
            maxLength={2000}
            name="message"
            required={requiresMessage}
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
            Tôi xác nhận thông tin đã cung cấp là chính xác và đồng ý để GISA
            tiếp nhận, phản hồi yêu cầu này.
          </label>
          {errors.consent ? (
            <p className={styles.fieldError} id="consent-error">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>

      <button className={styles.submitButton} disabled={isPending} type="submit">
        {isPending ? 'Đang gửi…' : 'Gửi thông tin'}
      </button>

      <div
        aria-live={result?.status === 'error' ? 'assertive' : 'polite'}
        className={styles.status}
        data-state={result?.status}
        role={result?.status === 'error' ? 'alert' : 'status'}
      >
        {result?.message ?? null}
      </div>
    </form>
  );
}
