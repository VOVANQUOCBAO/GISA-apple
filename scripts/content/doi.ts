const DOI_PATTERN = /\b10\.\d{4,9}\/[-._;()/:a-z0-9]+/iu;

export function normalizeDoi(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let decodedValue: string;
  try {
    decodedValue = decodeURIComponent(value.trim());
  } catch {
    decodedValue = value.trim();
  }
  const decoded = decodedValue
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//iu, '')
    .replace(/^doi\s*:\s*/iu, '');
  const match = decoded.match(DOI_PATTERN)?.[0]
    .replace(/[.,;:)\]}]+$/u, '')
    .toLowerCase();
  return match ? `https://doi.org/${match}` : undefined;
}

export function extractDoi(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const doi = normalizeDoi(value);
    if (doi) return doi;
  }
  return undefined;
}
