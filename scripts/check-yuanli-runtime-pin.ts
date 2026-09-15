import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

type Patch = {
  id: string;
  production_commit: string;
  audited_main_equivalent_commit: string | null;
  load_bearing: boolean;
};
type Manifest = {
  schema_version: string;
  authority: { knowledge_canon: boolean; decision_authority: boolean; action_authority: boolean };
  production: { version: string; commit: string };
  comparison: { audited_main_commit: string; relationship: string };
  required_patches: Patch[];
  replay_gate: { activation_is_automatic: boolean };
};

function git(...args: string[]) {
  return Bun.spawnSync(['git', ...args], { stdout: 'pipe', stderr: 'pipe' });
}
function isAncestor(ancestor: string, candidate: string): boolean {
  return git('merge-base', '--is-ancestor', ancestor, candidate).exitCode === 0;
}
function assertManifest(value: unknown): asserts value is Manifest {
  const m = value as Partial<Manifest>;
  if (m.schema_version !== 'yuanli-gbrain-runtime-pin/v1') throw new Error('runtime_pin_schema_invalid');
  if (!m.production?.commit || !m.production?.version) throw new Error('runtime_pin_production_identity_missing');
  if (m.authority?.knowledge_canon !== false || m.authority?.decision_authority !== false || m.authority?.action_authority !== false) {
    throw new Error('runtime_pin_authority_boundary_invalid');
  }
  if (!Array.isArray(m.required_patches) || m.required_patches.length === 0) throw new Error('runtime_pin_required_patches_missing');
  if (m.replay_gate?.activation_is_automatic !== false) throw new Error('runtime_pin_must_require_human_activation');
}

const argv = process.argv.slice(2);
const candidateIdx = argv.indexOf('--candidate');
const candidate = candidateIdx >= 0 ? argv[candidateIdx + 1] : null;
const manifest = yaml.load(await readFile('.yuanli/runtime-pin.yaml', 'utf8'));
assertManifest(manifest);

if (git('cat-file', '-e', `${manifest.production.commit}^{commit}`).exitCode !== 0) {
  throw new Error(`production_pin_commit_unavailable:${manifest.production.commit}`);
}
if (await readFile('VERSION', 'utf8').then((s) => s.trim()) !== manifest.production.version) {
  throw new Error('runtime_pin_version_mismatch');
}

if (!candidate) {
  console.log(`runtime pin manifest: PASS (${manifest.production.version} @ ${manifest.production.commit.slice(0, 12)})`);
  process.exit(0);
}
if (git('cat-file', '-e', `${candidate}^{commit}`).exitCode !== 0) {
  console.error(`runtime replay admission: BLOCKED candidate_not_found=${candidate}`);
  process.exit(2);
}
if (isAncestor(manifest.production.commit, candidate)) {
  console.log(`runtime replay admission: PASS direct-lineage candidate=${candidate}`);
  process.exit(0);
}

const missing = manifest.required_patches.filter((patch) => {
  if (!patch.load_bearing) return false;
  if (isAncestor(patch.production_commit, candidate)) return false;
  return !(patch.audited_main_equivalent_commit && isAncestor(patch.audited_main_equivalent_commit, candidate));
});
if (missing.length > 0) {
  console.error(`runtime replay admission: BLOCKED divergent-lineage candidate=${candidate}`);
  for (const patch of missing) console.error(`- missing ${patch.id} (production=${patch.production_commit}, equivalent=${patch.audited_main_equivalent_commit ?? 'NONE'})`);
  process.exit(3);
}
console.log(`runtime replay admission: PASS equivalent-lineage candidate=${candidate}`);
