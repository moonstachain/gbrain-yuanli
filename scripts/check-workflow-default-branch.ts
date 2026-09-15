import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import yaml from 'js-yaml';

type Workflow = { on?: Record<string, unknown> };

function defaultBranch(contract: string): string {
  const parsed = yaml.load(contract) as { repository?: { default_branch?: unknown } };
  const value = parsed?.repository?.default_branch;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('repo-contract.yaml must declare repository.default_branch');
  }
  return value.trim();
}

function branchList(value: unknown): string[] | null {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return value as string[];
  return null;
}

const contract = await readFile('repo-contract.yaml', 'utf8');
const expected = defaultBranch(contract);
const workflowDir = '.github/workflows';
const files = (await readdir(workflowDir)).filter((name) => /\.ya?ml$/.test(name)).sort();
const drift: string[] = [];

for (const file of files) {
  const parsed = yaml.load(await readFile(join(workflowDir, file), 'utf8')) as Workflow | null;
  const triggers = parsed?.on;
  if (!triggers || typeof triggers !== 'object') continue;
  for (const event of ['push', 'pull_request'] as const) {
    const cfg = triggers[event];
    if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) continue;
    const branches = branchList((cfg as Record<string, unknown>).branches);
    if (branches && !branches.includes(expected)) {
      drift.push(`${basename(file)}: ${event}.branches=[${branches.join(', ')}], expected ${expected}`);
    }
  }
}

if (drift.length > 0) {
  console.error(`workflow default-branch drift detected (contract=${expected}):`);
  for (const line of drift) console.error(`- ${line}`);
  process.exit(1);
}
console.log(`workflow default-branch gate: PASS (${files.length} workflows, default=${expected})`);
