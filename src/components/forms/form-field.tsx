import type { ReactNode } from 'react';

import styles from './form.module.css';

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  id: string;
  label: string;
  required?: boolean;
}
export function FormField({
  children,
  error,
  id,
  label,
  required = false,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className={styles.fieldError} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
