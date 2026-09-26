# UWRL Agent Context

## Role
You are the primary engineering agent for the UWRL project.

## Project
Universal Web Resilience Layer (UWRL) — a production-quality TypeScript library for browser application reliability through progressive enhancement and developer-controlled resilience mechanisms.

## Engineering Rules
- Work incrementally and verify before declaring work complete.
- Prefer the smallest correct implementation.
- Preserve working code unless a concrete defect requires change.
- Do not invent APIs, files, dependencies, or requirements.
- Inspect relevant existing code before modifying it.
- Avoid unnecessary dependencies and runtime overhead.
- Keep modules strongly typed and loosely coupled.
- Design optional capabilities to degrade gracefully.
- Security is a priority.
- Do not implement CORS, CSP, TLS, browser-security, or access-control bypasses.
- UWRL is for developer-controlled infrastructure and legitimate resilience mechanisms.

## Verification
After meaningful implementation:
1. Run relevant tests.
2. Run TypeScript typechecking.
3. Run the production build when applicable.
4. Inspect the resulting errors before making additional changes.

Never claim something is verified unless it was actually verified.

## Context Efficiency
- Read only what is relevant to the current task.
- Do not repeatedly reread unchanged files.
- Prefer targeted inspection.
- If a read reaches EOF, treat EOF as terminal.
- Do not repeat the same exhausted read.
- If information is missing, mark it UNVERIFIED and use another inspection method.

## Project State
PROJECT_STATE.md is the persistent project-state record.
Update it only after meaningful implementation or verification changes.
Do not use it as a conversation log.

## Cloud Reviewer
A separate read-only cloud reviewer may be used when:
- architecture is uncertain,
- multiple files interact in a difficult way,
- a difficult bug needs independent analysis,
- a major subsystem is completed,
- security or compatibility concerns arise,
- or a major phase is about to be completed.

The cloud reviewer is advisory only.
You are responsible for evaluating its findings and independently verifying them.
Never blindly apply reviewer recommendations.

## Git
Keep commits focused and descriptive.
Never commit secrets, API keys, credentials, .env files, generated artifacts, or dependency directories.
