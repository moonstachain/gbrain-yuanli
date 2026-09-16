import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const manifestPath = '.yuanli/cutover.yaml';

describe('Yuanli GBrain cutover constitution', () => {
  test('freezes last-known-good, postgres candidate, and human authority', () => {
    const doc = yaml.load(readFileSync(manifestPath, 'utf8')) as any;
    expect(doc.schema_version).toBe('yuanli-gbrain-cutover/v1');
    expect(doc.authority.human_principal_required).toBe(true);
    expect(doc.authority.activation_is_automatic).toBe(false);
    expect(doc.last_known_good.engine).toBe('pglite');
    expect(doc.candidate.engine).toBe('postgres');
    expect(doc.candidate.search_contract.hnsw_iterative_scan).toBe('strict_order');
    expect(doc.candidate.search_contract.hnsw_ef_search).toBe(200);
  });

  test('records G1 proof but keeps activation blocked on unresolved production gates', () => {
    const doc = yaml.load(readFileSync(manifestPath, 'utf8')) as any;
    expect(doc.rehearsal.golden_passed).toBe('20/20');
    expect(doc.rehearsal.restore_golden_passed).toBe('20/20');
    expect(doc.gates.hub_bridge_governed).toBe(false);
    expect(doc.gates.production_credentials_bound).toBe(false);
    expect(doc.gates.fresh_pre_cutover_backup).toBe(false);
    expect(doc.gates.human_activation_approved).toBe(false);
  });

  test('validator accepts the constitution itself', () => {
    const r = Bun.spawnSync(['bun','scripts/check-yuanli-cutover.ts','--validate-only']);
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toContain('cutover constitution: PASS');
  });

  test('activation readiness remains fail-closed', () => {
    const r = Bun.spawnSync(['bun','scripts/check-yuanli-cutover.ts']);
    expect(r.exitCode).toBe(3);
    const text = r.stdout.toString() + r.stderr.toString();
    expect(text).toContain('hub_bridge_governed');
    expect(text).toContain('production_credentials_bound');
    expect(text).toContain('fresh_pre_cutover_backup');
    expect(text).toContain('human_activation_approved');
  });
});
