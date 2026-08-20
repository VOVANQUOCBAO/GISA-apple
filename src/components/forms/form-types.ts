export type FormKind = 'tu-van' | 'khoa-hoc' | 'hop-tac' | 'lien-he';

export interface FormInput {
  kind: FormKind;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  jobTitle?: string;
  industry?: string;
  message?: string;
  consent: true;
  website: '';
  courseSlug?: string;
}

export type FormSubmissionResult =
  | { message: string; status: 'success' }
  | { message: string; status: 'error' };

export interface FormSubmissionAdapter {
  submit(input: FormInput): Promise<FormSubmissionResult>;
}
