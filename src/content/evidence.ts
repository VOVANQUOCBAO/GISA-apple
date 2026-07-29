import type { EvidenceStatus } from './types';

export function isPublishableEvidence(status: EvidenceStatus): boolean {
  return status === 'verified' || status === 'provided_by_gisa';
}
