# VeilPass Security Hardening Report

Date: 2026-08-20

## Executive Summary

The review found two exploitable trust-boundary defects and one deployment-hardening gap. All three are fixed in this patch. The browser verifier now fails closed against a trusted in-memory receipt registry, Compact proof identifiers bind the policy and Netlify responses define a restrictive security-header policy.

The application remains an explicitly labelled local simulation. It does not claim cryptographic or on-chain verification until Midnight wallet, proof server and ledger integration is complete.

## Resolved Findings

### SEC-001: Forged receipt links were accepted as valid

Severity: High  
Status: Resolved

The old parser treated attacker-controlled query parameters as a verified result. A fabricated 64-character identifier and `eligible=1` value could therefore produce a success screen.

Resolution:

- `src/lib/proof.ts:58` requires an exact route and exact public field set.
- `src/lib/proof.ts:103` requires the identifier to exist in the current trusted registry.
- Every disclosed field must match its sealed record before the result is returned.
- `src/App.tsx:33` keeps the trusted registry in memory. It is not hydrated from attacker-modifiable browser storage.
- `src/components/VerifyPanel.tsx:50` presents distinct authenticated and rejected trust states.
- `src/lib/proof.test.ts` covers fabricated identifiers, modified results, duplicated fields, unknown fields, extra routes and fragments.

### SEC-002: Compact proof identifiers did not bind the policy

Severity: Medium  
Status: Resolved

Two policy evaluations using the same credential, year and minimum age derived the same map key. The later receipt could overwrite the earlier policy receipt.

Resolution:

- `contract/src/veilpass.compact:26` includes `policyId` in the proof identifier derivation.
- `contract/src/veilpass.test.ts` executes two policies against the same private credential and asserts that two ledger entries remain.

### SEC-003: Production responses lacked browser security headers

Severity: Medium  
Status: Resolved in configuration

Resolution:

- `netlify.toml:10` defines Content Security Policy, clickjacking protection, MIME sniffing protection, referrer controls, permissions controls and cross-origin resource controls.
- The Content Security Policy restricts scripts, styles, fonts and connections to the same origin. It disables plugins, framing and cross-origin form submission.

## Verification Evidence

- Eight automated security and privacy tests pass.
- The Compact 0.31.1 contract compiles successfully.
- The Vite production build completes successfully.
- `npm audit --audit-level=high` reports zero known vulnerabilities.
- Browser tests confirmed same-session authentication, modified-receipt rejection and cross-session rejection.
- Responsive checks at 360, 768, 1024 and 1440 pixels found no horizontal overflow.
- Browser console checks found no warnings or errors.

## Remaining Trust Limitations

- The browser receipt is a local simulation, not a cryptographic proof.
- The issuer trust decision is simulated.
- Receipt authentication is limited to the current in-memory browser session and intentionally fails after refresh.
- A production verifier still requires Midnight ledger reads, proof verification, a funded wallet, a deployed contract and proof server infrastructure.

These limitations are documented in the interface and README. They are product integration work, not hidden security claims.
