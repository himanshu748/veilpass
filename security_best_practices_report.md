# VeilPass security review

Review date: 2026-08-25

Scope: the React and Vite application, generated Compact integration, Compact source, Netlify configuration and tracked repository files. The `.worktrees/`, `node_modules/` and `dist/` directories were excluded from source-pattern scans. The secret scanner inspected tracked files because no staged diff was present.

## Outcome

No open Critical, High or Medium frontend security findings remain in the reviewed Wave 1 scope. The verifier now fails closed, receipts are trusted only when they match an in-memory Compact ledger entry from the current browser session and browser storage is not used as a source of trust.

This review does not claim network-grade proof verification. The current product executes compiler-generated Compact code against an in-memory Compact ledger. Lace integration, proof-server-backed zero-knowledge proof generation, deployed contract state and Preprod verification are still future milestones.

## Resolved findings

### VP-VERIFY-001

- Rule ID: REACT-URL-001, application trust boundary
- Severity before fix: High
- Location: `src/lib/proof.ts`, `parseVerificationLink`, lines 61-115
- Evidence: the parser now requires the exact `veilpass://proof/v1/<64-lowercase-hex>` route, rejects credentials, ports, fragments, duplicate fields, extra fields and malformed boolean values. It then requires an ID match in `trustedProofs` and compares every disclosed field to that trusted receipt.
- Impact before fix: a caller could edit self-asserted URL fields and have the old UI present them as verified.
- Fix: exact schema validation plus a same-session trusted receipt registry, implemented at lines 74-113.
- Mitigation: unknown, modified and cross-session receipts are rejected. Network verification will replace this local trust registry when the contract is deployed.
- False positive notes: none. The receipt link is intentionally treated as attacker-controlled input.

### VP-STORAGE-001

- Rule ID: JS-STORAGE-001, REACT-AUTH-001
- Severity before fix: High in the original verifier design
- Location: `src/App.tsx`, state ownership, lines 33-35 and 73-75
- Evidence: trusted receipts live in React memory only. Source scanning found no `localStorage` or `sessionStorage` access in application code.
- Impact before fix: attacker-edited browser storage could become an authentication source.
- Fix: remove persistent browser storage from the trust path and pass the in-memory receipt registry directly to `VerifyPanel` at line 175.
- Mitigation: a reload intentionally clears trust. The verifier fails closed until network ledger lookup exists.
- False positive notes: none.

### VP-PROOFID-001

- Rule ID: application cryptographic binding
- Severity before fix: Medium
- Location: `contract/src/veilpass.compact`, `deriveProofId`, lines 26-40
- Evidence: `policyId` is now part of the typed `persistentHash` tuple at lines 30 and 33-39. The circuit passes it at line 56.
- Impact before fix: one identifier could be reused across policy contexts that shared the same credential, year and minimum age.
- Fix: bind the policy identifier into the proof identifier derivation and regenerate the managed Compact bindings.
- Mitigation: contract tests assert that different policy IDs produce different proof IDs.
- False positive notes: none.

### VP-RUNTIME-001

- Rule ID: application integrity and claim accuracy
- Severity before fix: Medium
- Location: `src/lib/compact.ts`, `VeilPassCompactRuntime`, lines 29-89
- Evidence: the browser now imports the compiler-generated `Contract`, `ledger` and `pureCircuits` bindings. It supplies private input through the generated witness, executes `createEligibilityProof` and confirms that the expected receipt exists in the resulting Compact ledger at lines 64-81.
- Impact before fix: the previous handwritten browser simulator could drift from the submitted Compact contract while the interface appeared to demonstrate the contract.
- Fix: replace handwritten policy hashing with the generated Compact runtime path.
- Mitigation: UI copy explicitly distinguishes this local runtime from proof-server-backed zero-knowledge generation and Preprod submission.
- False positive notes: this is real generated Compact execution, but it is not a zero-knowledge proof or a network transaction.

### VP-HEADERS-001

- Rule ID: REACT-CSP-001, REACT-HEADERS-001
- Severity before fix: Medium
- Location: `netlify.toml`, lines 10-19
- Evidence: the Netlify response configuration now sets a self-only CSP without `unsafe-inline` or `unsafe-eval`, denies framing, enables `nosniff`, limits referrers and disables unused device capabilities. It also sets same-origin opener and resource policies.
- Impact before fix: the public app lacked repository-visible defense-in-depth headers.
- Fix: add production headers at the Netlify edge configuration.
- Mitigation: verify the deployed response headers after the next Netlify release because this review only confirms repository configuration.
- False positive notes: an older live deployment may still serve previous headers until redeployed.

## Open limitations

### VP-NETWORK-001

- Rule ID: product trust boundary
- Severity: Informational
- Location: `src/components/VerifyPanel.tsx`, lines 45-86
- Evidence: authentication is explicitly limited to receipts created in the same browser session. The interface states that Preprod ledger lookup is the next network milestone.
- Impact: a verifier on another device cannot authenticate a receipt yet. Reloading also clears local trust by design.
- Fix: deploy the Compact contract, integrate Lace and the proof provider, then verify against public network state.
- Mitigation: keep the current same-session fail-closed behavior and do not market it as portable ZK verification.
- False positive notes: this is an intentional Wave 1 boundary, not a hidden security control.

### VP-ISSUER-001

- Rule ID: product trust boundary
- Severity: Informational
- Location: `src/App.tsx`, lines 68-72
- Evidence: the credential issuer is labelled `VeilPass Test Issuer` and the user can select its verified or unverified fixture state.
- Impact: the current issuer flag is a test witness input, not an attestation from a production identity provider.
- Fix: integrate a real credential issuer and validate signed issuer claims before network deployment.
- Mitigation: retain the explicit test label in product and submission copy.
- False positive notes: the UI does not claim a production issuer.

## Verification evidence

- Repository secret scan: 0 findings, no `.env` files, tracked-file scope.
- High-signal frontend sink scan: no `dangerouslySetInnerHTML`, DOM HTML injection, dynamic code execution, unsafe `postMessage`, Web Storage trust, credentialed cross-origin fetch or dynamic third-party script insertion. The two `window.location` references only read a hash against a fixed view allowlist and compare the pathname to `/`.
- Production dependency audit: 0 vulnerabilities.
- Full dependency audit: 0 vulnerabilities.
- Contract and application tests cover policy binding, private-field non-disclosure, issuer behavior, age boundaries, fabricated receipts, tampered fields and malformed receipt schemas.
- The production build uses a committed npm lockfile and self-hosted fonts and icons. No third-party runtime scripts are loaded.

## Deployment check still required

After redeploying, inspect the live `https://veilpass-midnight.netlify.app/` response and confirm the CSP, framing, `nosniff`, referrer, permissions, COOP and CORP headers are present. Also confirm the new WASM asset is served with a compatible MIME type and the Compact runtime completes in the live browser.
