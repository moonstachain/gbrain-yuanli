import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

const manifestPath = '.yuanli/runtime-pin.yaml';

describe('Yuanli production runtime pin', () => {
  test('freezes the deployed runtime identity and authority boundary', () => {
    const doc = yaml.load(readFileSync(manifestPath, 'utf8')) as any;
    expect(doc.schema_version).toBe('yuanli-gbrain-runtime-pin/v1');
    expect(doc.production.version).toBe('0.42.57.0');
    expect(doc.production.commit).toBe('aa3cf709c5bb3a5944a9e28aa3b2bfbdf8fb06f5');
    expect(doc.authority.knowledge_canon).toBe(false);
    expect(doc.authority.decision_authority).toBe(false);
    expect(doc.authority.action_authority).toBe(false);
  });

  test('records the current main divergence and the load-bearing P5 gap', () => {
    const doc = yaml.load(readFileSync(manifestPath, 'utf8')) as any;
    expect(doc.comparison.audited_main_commit).toBe('4d7709d298932c131bed78af19ff379be83130c1');
    expect(doc.comparison.relationship).toBe('diverged');
    const p5 = doc.required_patches.find((p: any) => p.id === 'yuanli-p5-source-metadata-confinement');
    expect(p5.load_bearing).toBe(true);
    expect(p5.audited_main_equivalent_commit).toBeNull();
  });
});

describe('runtime replay admission CLI', () => {
  test('accepts the deployed production pin itself', () => {
    const r = Bun.spawnSync(['bun', 'scripts/check-yuanli-runtime-pin.ts', '--candidate', 'aa3cf709c5bb3a5944a9e28aa3b2bfbdf8fb06f5']);
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toContain('PASS');
  });

  test('blocks audited main while the load-bearing P5 patch is absent', () => {
    const r = Bun.spawnSync(['bun', 'scripts/check-yuanli-runtime-pin.ts', '--candidate', '4d7709d298932c131bed78af19ff379be83130c1']);
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toContain('yuanli-p5-source-metadata-confinement');
  });
});
