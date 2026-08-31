# YNS2-SK-B.G1｜Executable Bun Conformance — CI Gate Note

The repository default branch is `main`, but `.github/workflows/test.yml` currently
filters both `push` and `pull_request` events to `master` only.

This blocks normal Test CI on PR #5 even though the repository contains the required
Bun conformance tests.

A minimal CI branch-filter repair should be handled in a separate change from the
Yuanli Narrative methodology PR:

```yaml
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
```

Preserving `master` maintains compatibility with the stale legacy branch while adding
the repository's actual default branch, `main`.

No YNS2 Canon promotion should occur merely because this CI plumbing is repaired;
actual Bun test output remains the acceptance evidence.
