import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyImportedSnapshot } from './report';

function parseArguments(values: readonly string[]): { snapshotId: string; stage: string } {
  const snapshotId = values.find((value) => value.startsWith('--snapshot-id='))?.slice('--snapshot-id='.length);
  const stage = values.find((value) => value.startsWith('--stage='))?.slice('--stage='.length);
  if (!snapshotId || stage !== 'imported') throw new Error('Usage: content:verify -- --snapshot-id=<YYYY-MM-DD> --stage=imported');
  return { snapshotId, stage };
}

async function main(): Promise<void> {
  const { snapshotId } = parseArguments(process.argv.slice(2));
  const summary = await verifyImportedSnapshot({ snapshotId });
  console.log(`Verified imported snapshot ${snapshotId}: ${summary.discoveredPublicUrls} URL(s), zero unresolved.`);
}

const isMain = process.argv[1] ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) : false;
if (isMain) main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
