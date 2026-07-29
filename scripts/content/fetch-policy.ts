import { createHash } from 'node:crypto';

export interface FetchResult {
  body: Uint8Array;
  contentType: string;
  fetchedAt: string;
  location?: string;
  sha256: string;
  status: number;
  url: string;
}

interface FetchPolicyOptions {
  concurrency?: number;
  fetchImpl?: typeof fetch;
  maxRetries?: number;
  minStartIntervalMs?: number;
  now?: () => number;
  retryDelayMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
  timeoutMs?: number;
  userAgent?: string;
}

export interface FetchPolicy {
  fetch(url: string): Promise<FetchResult>;
}

const TRANSIENT_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function createFetchPolicy(
  options: FetchPolicyOptions = {},
): FetchPolicy {
  const concurrency = options.concurrency ?? 2;
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxRetries = options.maxRetries ?? 3;
  const minStartIntervalMs = options.minStartIntervalMs ?? 500;
  const now = options.now ?? Date.now;
  const retryDelayMs = options.retryDelayMs ?? 500;
  const sleep = options.sleep ?? defaultSleep;
  const timeoutMs = options.timeoutMs ?? 20_000;
  const userAgent =
    options.userAgent ??
    'GISA-Content-Snapshot/1.0 (+https://gisa.edu.vn; production migration)';

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error('Fetch concurrency must be a positive integer.');
  }
  if (minStartIntervalMs < 0 || maxRetries < 0 || timeoutMs < 1) {
    throw new Error('Fetch timing and retry options must be non-negative.');
  }

  let active = 0;
  const capacityWaiters: Array<() => void> = [];
  let nextStartAt = 0;
  let startQueue = Promise.resolve();

  async function acquireCapacity(): Promise<void> {
    if (active < concurrency) {
      active += 1;
      return;
    }
    await new Promise<void>((resolve) => capacityWaiters.push(resolve));
  }

  function releaseCapacity(): void {
    const next = capacityWaiters.shift();
    if (next) {
      next();
      return;
    }
    active -= 1;
  }

  async function reserveStart(): Promise<void> {
    const previous = startQueue;
    let release = (): void => undefined;
    startQueue = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      const wait = Math.max(0, nextStartAt - now());
      if (wait > 0) await sleep(wait);
      nextStartAt = now() + minStartIntervalMs;
    } finally {
      release();
    }
  }

  async function request(url: string): Promise<FetchResult> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      await reserveStart();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(url, {
          headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'user-agent': userAgent,
          },
          redirect: 'manual',
          signal: controller.signal,
        });
        if (TRANSIENT_STATUSES.has(response.status) && attempt < maxRetries) {
          await response.arrayBuffer();
          await sleep(retryDelayMs * (attempt + 1));
          continue;
        }
        const body = new Uint8Array(await response.arrayBuffer());
        return {
          body,
          contentType: response.headers.get('content-type') ?? '',
          fetchedAt: new Date().toISOString(),
          location: response.headers.get('location') ?? undefined,
          sha256: createHash('sha256').update(body).digest('hex'),
          status: response.status,
          url,
        };
      } catch (error) {
        lastError = error;
        if (attempt >= maxRetries) break;
        await sleep(retryDelayMs * (attempt + 1));
      } finally {
        clearTimeout(timeout);
      }
    }
    const detail = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`Unable to fetch ${url}: ${detail}`);
  }

  return {
    async fetch(url: string): Promise<FetchResult> {
      await acquireCapacity();
      try {
        return await request(url);
      } finally {
        releaseCapacity();
      }
    },
  };
}
