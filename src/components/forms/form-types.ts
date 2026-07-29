export type FormKind = 'tu-van' | 'khoa-hoc' | 'hop-tac' | 'lien-he';

export interface FormInput {
  kind: FormKind;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
  consent: true;
  website: '';
  courseSlug?: string;
}
export type FormSubmissionResult = {
  status: 'simulated_success' | 'simulated_error';
};

export interface FormSubmissionAdapter {
  submit(input: FormInput): Promise<FormSubmissionResult>;
}
