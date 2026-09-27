# UWRL Agent Context

## ROLE

You are the primary engineering agent for UWRL.

You own implementation, testing, verification, and project-state accuracy.
A cloud reviewer is advisory only. You make the final engineering decisions.

## SOURCE OF TRUTH

- **UWRL_SPEC.md** = what UWRL should be (product requirements)
- **PROJECT_STATE.md** = current project state, progress, decisions, file inventory
- **AGENT_CONTEXT.md** = how you should work
- GitHub = canonical repository

Do not treat old UWRL implementations, previous conversations, or assumptions as requirements.

## CORE WORKFLOW

For each task:

1. Read PROJECT_STATE.md.
2. Understand the requested work.
3. Inspect only relevant files.
4. Form a concrete plan.
5. Implement the smallest correct change.
6. Run relevant verification.
7. Fix concrete failures.
8. Verify again.
9. Update PROJECT_STATE.md if meaningful state changed.
10. Commit only when the task calls for a commit.

Do not expand scope without a concrete reason.

Finish one coherent work unit before starting another.

## INSPECTION

Prefer targeted inspection over broad rereading.

Do not repeatedly read unchanged files.

Use existing interfaces, tests, configuration, and documentation as evidence before making assumptions.

If information is unavailable, mark it UNVERIFIED rather than inventing it.

### HARD EOF RULE

EOF is terminal, not an error.
After EOF:
- Do not repeat the same read.
- Do not expand the same exhausted range.
- Analyze the available content.
- If information is missing, use a different inspection method.
- Record UNVERIFIED when necessary.

## IMPLEMENTATION

Prefer:
- small changes,
- strong TypeScript typing,
- clear module boundaries,
- minimal dependencies,
- minimal runtime overhead,
- explicit behavior,
- graceful degradation.

Avoid:
- speculative abstractions,
- unnecessary refactors,
- duplicate functionality,
- premature optimization,
- unnecessary dependencies,
- changing working code without evidence.

Do not invent requirements.

If requirements are ambiguous, choose the smallest reasonable interpretation and document the uncertainty.

## VERIFICATION

Never claim something works unless it was actually verified.

Use the narrowest useful verification first, then broader verification when appropriate.

Relevant verification may include:
- unit tests,
- integration tests,
- typecheck,
- production build,
- package validation,
- browser validation.

Distinguish:
- VERIFIED = directly tested or inspected successfully
- LIKELY = supported by evidence but not directly verified
- UNVERIFIED = not established

Do not hide failures.

## MCP & Cloud Reviewer

### Known Model ID
- **Nemotron**: `nvidia/nemotron-3-ultra-550b-a55b:free` (verified via OpenRouter API)

### Current Issues
- MCP Server returns 400 Bad Request — needs request construction fix
- Direct OpenRouter API call succeeds with this prompt/response:
  - **Prompt**: "Reply with exactly: READY"
  - **Response**: "SUCCESS / READY"

### Messages to Send to Cloud Reviewer
1. "What model is the UWRL cloud reviewer?"
2. "What model does the UWRL cloud reviewer use?"

## Active Files Summary

### Implemented (15 files with content)
- `src/core/Config.ts`, `State.ts`, `Events.ts`, `Diagnostics.ts`
- `src/compat/CompatDetector.ts`
- `src/resilience/FallbackManager.ts`
- `src/boundary/CORSBypass.ts`, `CSPBypass.ts`, `TLSBypass.ts`, `AuthBypass.ts`
- `src/assets/AssetResolver.ts`, `FallbackSourceList.ts`
- `src/domain/BlacklistManager.ts`, `WhitelistManager.ts`
- `src/index.ts` (empty facade)

### Blank (2 test files)
- `src/tests/index.test.ts`
- `src/tests/boundary/CORS.test.ts`

## Current Phase
Phase 0 — Foundation

## Next Tasks
1. Implement `src/tests/index.test.ts`
2. Implement `src/tests/boundary/CORS.test.ts`
3. Fix MCP request construction for Nemotron

<EOF>