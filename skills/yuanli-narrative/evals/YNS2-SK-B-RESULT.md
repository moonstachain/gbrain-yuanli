# YNS2-SK-B｜Conformance × Golden Invocation × Blind Narrative Benchmark

Status: `PARTIAL PASS / RUNTIME DEPENDENCY + INDEPENDENT BLIND GATES PENDING`

Date: 2026-08-31

## 1. Conformance settlement

### Structural skill registration — PASS

Verified on `feat/yns2-skill-a`:

- `skills/manifest.json` registers `yuanli-narrative` → `yuanli-narrative/SKILL.md`.
- `skills/RESOLVER.md` routes the Yuanli Narrative trigger family to the skill.
- `openclaw.plugin.json` exposes `skills/yuanli-narrative`.
- `SKILL.md` contains required frontmatter and literal conformance sections:
  `## Contract`, `## Output Format`, `## Anti-Patterns`.

### Unicode routing regression — DEFECT FOUND / ISOLATED FIX PR OPEN

Root cause discovered during B execution:

```ts
s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
```

The existing structural router removes CJK characters. Chinese-only triggers such as
`原力叙事` and `人物命运叙事` can collapse to an empty string; mixed triggers such as
`调用原力叙事2.0` can collapse to only `2 0`.

TDD remediation was developed during B:

1. Added a Unicode routing regression test first.
2. Replaced the normalizer with Unicode letter/number semantics:

```ts
s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
```

3. Targeted runtime reproduction with the candidate fix preserves Chinese routing phrases.

Because this is generic resolver infrastructure rather than Yuanli Narrative-specific
logic, the code/test change was removed from PR #5 and isolated into Draft PR #7:

`Fix: preserve Unicode in structural skill routing`

Therefore PR #5 should NOT claim that the runtime fix is already installed on `main`.
It currently depends on PR #7 (or an equivalent accepted Unicode-safe router fix) for
reliable Chinese-only structural invocation.

### Full Bun conformance suite — PENDING

Canonical command remains:

```bash
bun test test/skills-conformance.test.ts test/resolver.test.ts test/routing-eval-unicode.test.ts
```

The current connected environment cannot execute the repository's Bun suite. The
repo's default branch is `main`, while `.github/workflows/test.yml` currently gates
normal `push` and `pull_request` on the stale `master` branch.

A narrow main-branch conformance workflow has been isolated into Draft PR #6:

`CI: add main-branch skill conformance gate`

No merge is authorized by this result file. Actual test output, not the workflow file,
is the acceptance evidence.

Therefore: **do not call this FULL CONFORMANCE PASS yet.**

## 2. Golden Invocation

Frozen invocation:

> `调用原力叙事2.0，帮我深度写宫崎骏。`

### Resolver layer — FIX CANDIDATE VERIFIED / MAIN PENDING

With the Unicode candidate fix from PR #7, targeted routing reproduction resolves the
Chinese trigger family to `yuanli-narrative` instead of stripping CJK text.

Targeted checks with the candidate fix pass for:

- `调用原力叙事2.0...`
- `按YFN12写...`
- `用新版叙事风格...`
- `人物命运叙事...`
- `把这个商业案例讲成故事，用12-Block重写...`
- Chinese-only `请用原力叙事帮我写这个人物`
- negative generic media-summary intent does not match the skill.

Settlement:

- `UNICODE_ROUTING_FIX_CANDIDATE_PASS`
- `MAIN_RUNTIME_MERGE_PENDING`

### Fresh-agent render layer — PENDING

The current agent participated in designing the method and Golden Cases. It cannot
legitimately certify its own Miyazaki render as an independent no-context invocation.

Settlement:

- `FRESH_AGENT_RENDER_PENDING`

## 3. Blind transfer benchmark

### Pre-registration — DONE BEFORE SUBJECT RESEARCH

See `blind-benchmark-v1.yaml`.

Blind subject: **Yvon Chouinard / Patagonia**.

Selection rationale:

- not one of the two method-forming Golden Cases;
- no matching Yuanli Stars person page was found at registration time;
- founder/business/governance domain stresses transfer beyond film authorship;
- contains a real commercial contradiction and a late ownership-level Reality Settlement.

Frozen Mother Question:

> **How can a founder make a value survive the founder without pretending that values are stronger than incentives, ownership, and governance?**

### Source grounding

Primary/official evidence used:

- Patagonia ownership announcement and Chouinard first-person ownership letter;
- 1972 clean-climbing catalog history;
- 2011 `Don’t Buy This Jacket` explanation;
- Patagonia benefit-corporation reports.

Independent mechanism context:

- *Ecological Economics* analysis of the Patagonia Purpose Trust;
- American Bar Association purpose/stewardship-trust analysis.

### Candidate output

See `blind-output-yvon-chouinard.md`.

The narrative does NOT treat the case as a green-founder morality tale. Its causal spine is:

`harm discovered in product → controllable layer redesigned → growth/consumption contradiction retained → mission moved into legal structure → founder mortality exposes governance problem → control rights and economic rights separated → ownership becomes Reality Settlement`

Universal compression:

> **当一个创始人终于承认自己会消失，他开始把信念从人格，编译成制度。**

### Pre-registered hard negatives preserved

- Patagonia remains a commercial producer with material environmental impact.
- Anti-consumption messaging can also strengthen brand differentiation.
- Purpose Trust governance constrains but does not guarantee all future decisions.
- Company outcomes retain collective causality; Chouinard is not treated as sole cause.
- The 2022 transfer is not rewritten as a hidden 50-year master plan.

## 4. Self-review scorecard

This is explicitly **not independent blind judging**.

| Dimension | Score | Evidence |
|---|---:|---|
| Hook | 5/5 | Opens on the paradox of building value then making conventional sale/extraction harder. |
| Character | 4/5 | Repeated `identify harm → redesign controllable layer` choice pattern is visible; further cases could still strengthen predictive validity. |
| Causality | 5/5 | Product, consumption, benefit-corp, ownership, control rights and cash-flow direction are connected mechanistically. |
| Tension | 5/5 | Selling goods while criticizing consumption/growth is kept load-bearing rather than edited away. |
| Insight | 5/5 | Transfers from environmental branding to founder succession / institutional design. |
| Trust | 5/5 | Official claims, mechanism interpretation, collective causality, and unresolved limitations are separated in the ledger. |

Average self-review: `4.83 / 5`.

Vetoes fired: `0 / 6`.

Self-eval settlement: `PASS`.

## 5. Independent blind review readiness

`INDEPENDENT-BLIND-REVIEW-PACK.md` freezes reviewer isolation, allowed materials,
scoring dimensions, adversarial questions, output schema, and pass rule.

This means G2 is reproducible, but it has NOT been executed by an independent reviewer.

## 6. What B proved — and what it did not

### Evidence supports

1. The narrative kernel transfers structurally from artist/director cases into a founder/governance case.
2. The Truth Gate prevents the late ownership event from becoming a teleological hero myth.
3. The framework can hold a real contradiction instead of resolving it into virtue language.
4. B exposed a hidden ASCII-only routing defect and produced a separate TDD fix candidate.
5. The independent review gate is now packaged so a fresh reviewer can run it without seeing the self-score.

### Evidence does NOT yet support

1. `FULL_CONFORMANCE_PASS` — Bun suite has not run on the branch.
2. `MAIN_UNICODE_ROUTING_PASS` — PR #7 is not merged.
3. `INDEPENDENT_BLIND_PASS` — no isolated reviewer has frozen a verdict.
4. `CANON_ACCEPTED` — B remains candidate until the runtime + conformance + independent blind gates close.
5. Generalization across every narrative domain — one transfer case is evidence, not proof of universality.

## 7. Next legal state

Freeze current state as:

`YNS2-SK-B STRUCTURAL / SELF-EVAL PASS`

with three operational dependencies/gates:

0. `YNS2-SK-B.G0｜Unicode Routing Runtime Fix` → Draft PR #7
1. `YNS2-SK-B.G1｜Executable Bun Conformance` → Draft PR #6 enables the main-branch gate
2. `YNS2-SK-B.G2｜Independent Fresh-Agent Blind Review` → review pack ready, run pending

Only after G0 + G1 + G2 pass should `yuanli-narrative` be promoted from candidate to accepted callable capability.
