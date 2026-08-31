import { describe, expect, it } from 'bun:test';
import {
  indexResolverTriggers,
  normalizeText,
  structuralRouteMatch,
} from '../src/core/routing-eval.ts';

describe('routing eval Unicode normalization', () => {
  it('preserves CJK letters while stripping punctuation', () => {
    expect(normalizeText('调用原力叙事2.0，帮我写宫崎骏')).toBe('调用原力叙事2 0 帮我写宫崎骏');
    expect(normalizeText('人物命运叙事')).toBe('人物命运叙事');
  });

  it('routes a Chinese-only trigger without relying on accidental ASCII digits', () => {
    const resolver = [
      '# RESOLVER',
      '',
      '## Narrative & storytelling',
      '| Trigger | Skill |',
      '|---------|-------|',
      '| "原力叙事", "人物命运叙事" | `skills/yuanli-narrative/SKILL.md` |',
      '',
    ].join('\n');

    const index = indexResolverTriggers(resolver);
    expect(index.skillPhrases.get('yuanli-narrative')).toEqual(['原力叙事', '人物命运叙事']);

    const result = structuralRouteMatch('请用原力叙事帮我写这个人物', index);
    expect(result.matched).toEqual(['yuanli-narrative']);
    expect(result.ambiguous).toBe(false);
  });
});
