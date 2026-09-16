import { readFile } from 'node:fs/promises';
import yaml from 'js-yaml';

type Manifest = {
  schema_version: string;
  state: string;
  authority: { human_principal_required: boolean; activation_is_automatic: boolean; knowledge_canon: boolean; decision_authority: boolean };
  last_known_good: { runtime_commit: string; runtime_version: string; engine: string; port: number };
  candidate: { governance_main_commit: string; engine: string; database_name: string; postgres_major: number; pgvector_min_version: string; embedding_model: string; embedding_dimensions: number; vector_shape: string; search_contract: { hnsw_iterative_scan: string; hnsw_ef_search: number } };
  rehearsal: { evidence_id: string; migration_passed: boolean; golden_passed: string; top1_parity: string; jaccard_at_10: number; restore_golden_passed: string; dump_sha256: string };
  hub_bridge_governance?: { repository: string; commit: string; ci_run_id: number; ci_conclusion: string; provenance_schema: string };
  gates: Record<string, boolean>;
  rollback: { last_known_good_engine: string; require_pre_cutover_snapshot: boolean; require_post_rollback_golden: boolean; rollback_on: string[] };
  observation: { windows: string[]; required_checks: string[] };
};

function assertManifest(value: unknown): asserts value is Manifest {
  const m = value as Partial<Manifest>;
  if (m.schema_version !== 'yuanli-gbrain-cutover/v1') throw new Error('cutover_schema_invalid');
  if (m.authority?.human_principal_required !== true || m.authority?.activation_is_automatic !== false) throw new Error('cutover_human_gate_invalid');
  if (m.authority?.knowledge_canon !== false || m.authority?.decision_authority !== false) throw new Error('cutover_authority_boundary_invalid');
  if (m.last_known_good?.engine !== 'pglite' || !m.last_known_good.runtime_commit) throw new Error('cutover_last_known_good_invalid');
  if (m.candidate?.engine !== 'postgres' || m.candidate.database_name !== 'yuanli_gbrain') throw new Error('cutover_candidate_invalid');
  if (m.candidate.postgres_major < 17 || m.candidate.pgvector_min_version !== '0.8.0') throw new Error('cutover_postgres_contract_invalid');
  if (m.candidate.embedding_dimensions !== 1024 || m.candidate.vector_shape !== 'vector(1024)' || m.candidate.embedding_model !== 'ollama:bge-m3') throw new Error('cutover_embedding_contract_invalid');
  if (m.candidate.search_contract?.hnsw_iterative_scan !== 'strict_order' || m.candidate.search_contract?.hnsw_ef_search !== 200) throw new Error('cutover_search_contract_invalid');
  if (m.rehearsal?.migration_passed !== true || m.rehearsal?.golden_passed !== '20/20' || m.rehearsal?.top1_parity !== '20/20' || m.rehearsal?.jaccard_at_10 !== 1 || m.rehearsal?.restore_golden_passed !== '20/20') throw new Error('cutover_rehearsal_evidence_invalid');
  if (!/^[0-9a-f]{64}$/.test(m.rehearsal.dump_sha256)) throw new Error('cutover_dump_hash_invalid');
  if (m.gates?.hub_bridge_governed === true) {
    const h = m.hub_bridge_governance;
    if (h?.repository !== 'moonstachain/gbrain-hub-yuanli') throw new Error('cutover_hub_governance_repo_invalid');
    if (!/^[0-9a-f]{40}$/.test(h?.commit ?? '')) throw new Error('cutover_hub_governance_commit_invalid');
    if (!Number.isSafeInteger(h?.ci_run_id) || (h?.ci_run_id ?? 0) <= 0 || h?.ci_conclusion !== 'success') throw new Error('cutover_hub_governance_ci_invalid');
    if (h?.provenance_schema !== 'yuanli-gbrain-hub-governance-provenance/v1') throw new Error('cutover_hub_governance_provenance_invalid');
  }
  if (m.rollback?.last_known_good_engine !== 'pglite' || m.rollback?.require_pre_cutover_snapshot !== true || m.rollback?.require_post_rollback_golden !== true) throw new Error('cutover_rollback_contract_invalid');
  if (!Array.isArray(m.observation?.windows) || !['1h','6h','24h'].every((x) => m.observation!.windows.includes(x))) throw new Error('cutover_observation_windows_invalid');
}

const argv = process.argv.slice(2);
const manifestIdx = argv.indexOf('--manifest');
const manifestPath = manifestIdx >= 0 ? argv[manifestIdx + 1] : '.yuanli/cutover.yaml';
if (!manifestPath) throw new Error('cutover_manifest_path_missing');
const manifest = yaml.load(await readFile(manifestPath, 'utf8'));
assertManifest(manifest);

if (argv.includes('--validate-only')) {
  console.log(`cutover constitution: PASS ${manifest.state}`);
  process.exit(0);
}
const blockers = Object.entries(manifest.gates).filter(([, passed]) => passed !== true).map(([name]) => name);
if (blockers.length > 0) {
  console.error('cutover activation: BLOCKED');
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exit(3);
}
console.log('cutover activation: READY_FOR_HUMAN_EXECUTION');
