import type {
  FormInput,
  FormSubmissionAdapter,
  FormSubmissionResult,
} from './form-types';

export class SimulatedFormAdapter implements FormSubmissionAdapter {
  constructor(private readonly delayMs = 300) {}

  async submit(input: FormInput): Promise<FormSubmissionResult> {
    await new Promise((resolve) => window.setTimeout(resolve, this.delayMs));

    return {
      status: input.email.endsWith('@simulate-error.invalid')
        ? 'simulated_error'
        : 'simulated_success',
    };
  }
}
