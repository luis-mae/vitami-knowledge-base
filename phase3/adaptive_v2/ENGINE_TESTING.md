# VITAMI v2 navigation engine — testing

The code in `adaptiveEngine.mjs` is a **prototype for question navigation only**. It cannot prescribe supplements or calculate doses.

## Local test

Use Node.js 22+ (JSON import attributes). From repository root:

```sh
node phase3/adaptive_v2/adaptiveEngine.test.mjs
```

The test file contains 12 assertions covering ranking, question deduplication, safety, vegan screening and unresolved questions.

**Execution status:** Not yet run in a Node.js runtime. Do not claim these tests passed until a real run succeeds. The GitHub connector writes files but does not execute them; the working container could not retrieve this repository due to network DNS restrictions.

## Current limitations

- Canonical question IDs are reconciled only partially; unresolved questions are returned explicitly.
- The existing questionnaire and engine remain unchanged.
- All personalized-dose outputs are intentionally disabled.
- Ingredient-specific safety gating, user-facing wording and clinical validation are pending.
- The navigation code assumes JSON module import support and is not yet wired to the app.
