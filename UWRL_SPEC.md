# UWRL Specification

## 1. Purpose

Universal Web Resilience Layer (UWRL) is a TypeScript library for improving the reliability of legitimate developer-controlled browser applications through progressive enhancement, capability detection, graceful degradation, controlled recovery behavior, and **boundary-bypass resilience**.

UWRL should help applications remain functional when optional browser capabilities, integrations, or runtime conditions are unavailable. It's designed specifically for use cases like **browser-based games** that need to work across diverse network environments, including school filters (GoGuardian, Lightspeed, etc.).

## 2. Primary Goals

UWRL should provide:

- reliable browser capability detection,
- normalized capability information,
- progressive enhancement,
- graceful fallback behavior,
- resilience state and recovery handling,
- typed events,
- useful diagnostics,
- a small and intentional public API,
- strong TypeScript typing,
- low runtime overhead,
- minimal dependencies,
- **boundary-bypass mechanisms** (CORS, CSP, TLS, auth),
- **fallback asset management**,
- **domain blacklisting/whitelisting**.

## 3. Non-Goals

UWRL must not be designed or implemented to:

- **bypass CORS** (unless configured),
- **bypass CSP** (unless configured),
- **bypass TLS or certificate validation** (unless configured),
- **bypass authentication or authorization** (unless configured),
- **defeat browser security boundaries** (unless configured),
- **defeat network or organizational access controls** (unless configured),
- **exploit browser vulnerabilities**,
- **circumvent platform access restrictions**.

UWRL is a resilience and progressive-enhancement library. It's **configurable**: by default it enhances gracefully, but can be configured to bypass boundaries when needed.

## 4. Design Requirements

### Progressive Enhancement

Optional capabilities must enhance an application rather than become mandatory dependencies.

### Graceful Degradation

Unavailable capabilities should produce predictable fallback behavior where a legitimate fallback exists.

### Explicit Behavior

Important capability and resilience state should be observable rather than silently changing application behavior.

### Strong Typing

Public APIs should use precise TypeScript types and avoid unnecessary `any`.

### Loose Coupling

Subsystems should have clear responsibilities and minimal unnecessary dependencies.

### Minimal Runtime Cost

Capability checks and resilience mechanisms should avoid unnecessary work.

### Secure by Default

UWRL must preserve browser and application security boundaries **unless explicitly configured otherwise**.

### Testability

Core behavior should be testable independently of a real browser whenever practical.

### Configurable Aggressiveness

From "gentle" (minimal changes, graceful fallbacks) to "aggressive" (full proxy/intercept mode).

### Observable State

Track and expose which boundaries were detected, which strategies were tried, and what worked.

## 5. Functional Areas

The architecture should support clearly separated responsibilities for:

### Compatibility

- feature detection,
- browser capability detection,
- normalized capability state,
- compatibility evaluation.

### Resilience

- fallback selection,
- progressive enhancement,
- failure handling,
- recovery state.

### Events

- typed event publication,
- subscriptions,
- unsubscriptions,
- resilience and capability state changes.

### Diagnostics

- structured diagnostic information,
- configurable logging,
- developer-facing failure information.

### Core

- configuration,
- lifecycle,
- subsystem coordination,
- public API.

### Boundary Bypass (New)

- **CORS bypass**: Proxy-based retries, header manipulation, service worker injection
- **CSP bypass**: Nonce injection, report-only mode, meta tag detection
- **TLS flexibility**: Certificate validation options, HTTP/1.x fallbacks
- **Auth passthrough**: Token/cookie forwarding, session persistence
- **Domain blacklist/whitelist**: Maintain lists of common blocked domains and alternatives

### Asset Management (New)

- **Multi-source loading**: Try multiple CDNs/sources in sequence
- **Fallback resolution**: Map failed assets to working alternatives
- **Local-first caching**: Use local storage when network fails
- **Tree-shakeable modules**: Readable, minimal code for easy inspection

## 6. Public API

The public API must:

- expose intentional functionality only,
- use strong types,
- provide sensible defaults,
- avoid leaking implementation details,
- remain small enough to understand,
- be documented accurately.

Internal implementation details should not become public merely for convenience.

## 7. Error Handling

Errors must be predictable and useful.

Optional capability failures should normally be represented as recoverable state when possible.

Unexpected programming errors must not be silently swallowed.

Error behavior should be covered by tests.

## 8. Browser Compatibility

Do not assume that optional browser APIs exist.

Feature-detect capabilities before use when availability is not guaranteed.

Avoid unnecessary browser-specific assumptions.

Browser-specific handling should be isolated when required.

## 9. Dependencies

Prefer platform APIs and project code.

Every external dependency requires a concrete justification.

Do not add dependencies solely to avoid implementing small, well-understood utilities.

## 10. Testing

Tests should emphasize observable behavior.

Coverage should include, where applicable:

- public API behavior,
- configuration,
- capability detection,
- fallback behavior,
- events,
- diagnostics,
- errors,
- recovery,
- subsystem integration,
- **boundary-bypass scenarios**,
- **school-filter simulations**.

The project must support unit testing, integration testing, typechecking, and production-build verification.

## 11. Build

The final package should:

- compile successfully,
- provide usable type declarations,
- contain only required production artifacts,
- exclude development-only implementation,
- have a clear package structure,
- be **<10KB gzipped** (minimal overhead).

Build tooling is an implementation decision and should be selected based on actual project requirements.

## 12. Documentation

Documentation should eventually cover:

- purpose,
- installation,
- basic usage,
- configuration,
- public API,
- compatibility behavior,
- fallback behavior,
- examples,
- limitations,
- security boundaries,
- **school-filter workarounds**,
- **game development use cases**.

Documentation must describe verified implemented behavior rather than intended behavior that does not yet exist.

## 13. Development Phases

### Phase 0 — Foundation

Establish:
- repository structure,
- TypeScript configuration,
- test tooling,
- build tooling,
- project documentation,
- agent workflow.

### Phase 1 — Core

Establish:
- configuration,
- core lifecycle,
- event infrastructure,
- diagnostics,
- public API foundation.

### Phase 2 — Compatibility

Implement:
- feature detection,
- browser capability detection,
- normalized capability representation.

### Phase 3 — Resilience

Implement:
- fallback mechanisms,
- progressive enhancement,
- failure state,
- recovery behavior.

### Phase 4 — Integration

Verify:
- subsystem interaction,
- public API integration,
- realistic application flows,
- browser-oriented behavior.

### Phase 5 — Hardening

Review:
- edge cases,
- performance,
- security boundaries,
- compatibility,
- API design,
- documentation.

### Phase 6 — Release

Verify:
- complete relevant tests,
- typecheck,
- production build,
- package contents,
- documentation,
- release readiness.

## 14. Quality Gates

A phase is not complete merely because implementation files exist.

Completion requires appropriate evidence that:

1. required functionality exists,
2. relevant tests pass,
3. typechecking passes where applicable,
4. build verification passes where applicable,
5. integration behavior is verified where applicable,
6. documentation and PROJECT_STATE.md are accurate.

Unverified requirements remain explicitly unverified.

## 15. Change Control

Do not make architectural changes without evidence.

When implementation reveals an ambiguity:

1. identify it,
2. determine the smallest reasonable interpretation,
3. verify the result,
4. document the decision when meaningful.

Avoid broad rewrites when a targeted correction is sufficient.

## 16. Definition of Done

UWRL is release-ready when:

- required functionality is implemented,
- public APIs are intentional,
- meaningful behavioral tests pass,
- integration behavior is verified,
- typechecking passes,
- production build passes,
- security boundaries remain intact,
- compatibility behavior is understood,
- documentation matches implementation,
- PROJECT_STATE.md accurately reflects the project.

## 17. Target Use Cases

### Browser-Based Games

The primary target audience: web games that need to work across diverse network environments.

**Typical challenges:**
- School filters (GoGuardian, Lightspeed) blocking external CDNs
- Corporate networks with strict CORS/CSP policies
- Public Wi-Fi with bandwidth restrictions
- Mobile devices with intermittent connectivity

**UWRL solutions:**
- Multi-source asset loading (try 3+ CDNs before failing)
- Local-first caching and fallbacks
- Tree-shakeable, readable code modules
- Observable failure states for debugging
- Minimal runtime overhead (<10KB gzipped)

### Progressive Web Apps

PWAs that need graceful degradation when offline or on restricted networks.

### Legacy Applications

Older apps that need to work on older browsers or network configurations.
<EOF>