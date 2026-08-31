---
name: yuanli-narrative
version: 2.0.0
description: |
  Compile people, companies, historical cases, personal journeys, or raw research
  into evidence-grounded Yuanli Narrative 2.0 fate narratives. Uses Narrative
  Constitution, YFN12, 7-Beat, Truth Gate, Reality Settlement, and a final
  reader-facing cognitive return. Use when the user explicitly asks for 原力叙事,
  YFN12, the 新版叙事风格, a 人物命运叙事, or to turn a researched case into a
  compelling long-form story rather than a chronological summary.
triggers:
  - "原力叙事"
  - "原力叙事2.0"
  - "调用原力叙事2.0"
  - "按YFN12写"
  - "用新版叙事风格"
  - "人物命运叙事"
  - "把这个人物写成故事"
  - "把这个商业案例讲成故事"
  - "用12-Block重写"
tools:
  - search
  - list_pages
mutating: false
---

# Yuanli Narrative 2.0｜原力叙事

> **Read first:** `CANON.md` and `TRUTH-GATE.md`.

## Contract

This skill guarantees:

1. Freeze one Mother Question before drafting prose.
2. Organize the story around consequential choices and state changes, not chronology alone.
3. Model the subject as a behavior pattern / decision system rather than a list of adjectives.
4. Explain mechanisms and separate Person Alpha from Era Beta.
5. Preserve competing explanations, hard negatives, and collective causality where relevant.
6. Apply Truth Gate labels `[F] [R] [I] [H] [U]` to major causal claims during compilation.
7. Close the open loop: answer the opening question, then return the insight to the reader.

Design principle:

> **人物只是入口，命运才是结构，时代才是背景，选择才是内容，规律才是资产。**

## Scope and MECE boundary

Use `yuanli-narrative` when the desired output is a **causal fate narrative**.

Do NOT take over neighboring skills:

- `article-enrichment` → structure and enrich an existing raw article.
- `strategic-reading` → extract an applied playbook from a source through a strategic lens.
- `concept-synthesis` → merge concepts into a tiered intellectual map.
- `idea-lineage` → trace the evolution of one idea across the brain.
- `media-ingest` → ingest/summarize media into the brain.

Chain with those skills when needed, but this skill owns the final **narrative compilation**.

## Phases

### Phase 1｜Source Grounding

Before narrative work, inventory the evidence actually available.

Prefer, in order:

1. primary sources / original works / official records;
2. direct interviews and contemporaneous materials;
3. strong biographies, reporting, research, filings, data;
4. existing brain/GitHub person or company profiles;
5. secondary summaries only as navigation aids.

Build a claim ledger with `[F] [R] [I] [H] [U]`.

If the provided source pack is insufficient for an important claim, say so. Do not silently fill the gap.

### Phase 2｜Narrative Constitution

Use `templates/narrative-constitution.md`.

Freeze:

- Fate Paradox
- Mother Question
- Character Thesis
- Era Thesis
- Competing Explanation
- Truth Boundary

Then complete:

> **This is not a story about X. It is a story about Y.**

Stop and revise if this sentence is generic or could fit many unrelated subjects.

### Phase 3｜YFN12 Skeleton

Use `templates/yfn12-blocks.md`.

Compile:

**HOOK**
- B01 Fate Paradox
- B02 Mystery Contract
- B03 Origin Constraint
- B04 Genesis Case

**BUILD**
- B05 Character OS
- B06 Winning Machine
- B07 Era Amplifier
- B08 Hidden Crack

**FATE**
- B09 Counterintuitive Turn
- B10 Foil Fork
- B11 Reality Settlement
- B12 Universal Law

Not every output must visibly show twelve headings. The blocks are an internal causal architecture; rendering may merge them when prose benefits.

### Phase 4｜7-Beat Expansion

For every major narrative turn, use `templates/seven-beat.md`:

`Scene → Tension → Choice → Mechanism → Consequence → Compression → Bridge`

Do not move to the next block until the current block changes the reader's model of the subject.

### Phase 5｜Truth Gate

Read `TRUTH-GATE.md` and downgrade language when evidence is weaker than the story wants it to be.

Mandatory checks:

- no `[U]` claim carries the main causal load;
- later success/failure is not rewritten as proof of earlier foresight;
- private motives are not asserted without direct support;
- collective outcomes retain collective causality;
- at least one meaningful hard negative remains when the thesis is interpretive.

### Phase 6｜Render

Render the same kernel into the requested medium:

- long-form article;
- documentary / YouTube / Bilibili script;
- podcast outline;
- course case;
- company or investment case narrative;
- personal narrative;
- infographic content architecture.

Default prose behavior:

- start with an unresolved outcome or contradiction;
- use short scene-setting and judgment sentences to create cognitive rhythm;
- prefer concrete scenes before abstract principles;
- compress each major section into one memorable line;
- use bridges that open the next genuine question;
- avoid exposing template labels unless the user asks for the framework.

### Phase 7｜Benchmark

Score 1–5 on:

- Hook
- Character
- Causality
- Tension
- Insight
- Trust

Apply four vetoes:

1. no single Mother Question → FAIL;
2. chronology-only biography → FAIL;
3. key causality rests on unverified rumor → FAIL;
4. ending fails to answer opening question → FAIL.

Use `evals/golden-cases.yaml` and `evals/hard-negatives.yaml` as reference tests, not as templates to copy mechanically.

## Output Format

Unless the user asks for a visible blueprint, return the **finished narrative**, not a block-by-block worksheet.

For a long-form article, good output normally has:

1. a title built around a fate paradox or consequential question;
2. an opening open loop;
3. 5–9 natural sections organized by turning points;
4. concrete scenes before abstractions;
5. mechanism explanations at key choices;
6. explicit epistemic caution where needed;
7. a Reality Settlement section;
8. a final cognitive return from the subject to the reader.

When the user asks for the architecture first, output:

```text
Narrative Constitution
YFN12 Skeleton
Truth Ledger
Hard Negative / Competing Explanation
Render Plan
```

## Anti-Patterns

- ❌ Starting with birth date, schooling, and resume chronology when they do not drive causality.
- ❌ Calling someone "visionary", "brave", or "strategic" without showing the repeated choice pattern.
- ❌ Treating price, fame, scale, awards, or survival as proof of foresight.
- ❌ Using one spectacular anecdote as the whole causal explanation.
- ❌ Turning Era Beta into Person Alpha.
- ❌ Erasing partners, teams, institutions, luck, regulation, or historical constraints.
- ❌ Removing counterexamples just to make the thesis elegant.
- ❌ Writing twelve visible boxes instead of a readable story.
- ❌ Ending with generic success advice instead of answering the Mother Question.
- ❌ Making shallow content louder instead of making deep cognition traversable.

## Tools Used

- `search` — retrieve relevant brain/source material before compilation.
- `list_pages` — inspect available structured pages when the source pack spans multiple objects.

This skill is read-only by default. It does not publish or write back to the brain unless explicitly chained with an authorized writing skill.
