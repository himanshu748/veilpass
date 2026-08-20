# VeilPass

VeilPass creates a public eligibility receipt from a private credential. The verifier learns whether a policy passed, which policy was evaluated and whether the issuer was trusted. The verifier does not receive the user's birth year.

Built for the [Midnight Buildathon on AKINDO](https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG).

Live demo: [veilpass-midnight.netlify.app](https://veilpass-midnight.netlify.app)

Source: [github.com/himanshu748/veilpass](https://github.com/himanshu748/veilpass)

## Why This Exists

Age gates and eligibility checks usually collect more identity data than a decision requires. A service may only need to know that someone is at least 18, but conventional workflows often expose and retain the full date of birth or identity document.

VeilPass demonstrates a narrower disclosure model:

```text
Private credential              Compact policy                 Public receipt
birth year + nonce  ───────▶  age ≥ 18 + trusted issuer  ───────▶  true / false
```

The private inputs stay with the prover. Only the policy result, policy identifier, issuer-verification state and proof identifier become public.

## What Works Today

- A conversion-focused landing page that explains the privacy boundary before asking for a proof
- A responsive React interface for creating an age-eligibility proof
- An honest Local proof mode that mirrors the Compact policy without retaining the birth year
- A local receipt-link format that contains only public fields
- A fail-closed verifier backed by a trusted in-memory receipt registry
- An in-memory activity log containing no private credential data
- A Compact contract with a private credential witness and public receipt ledger
- Eight tests covering age boundaries, privacy leakage, forged links and policy collisions
- A production Vite build

## Privacy Boundary

| Private | Public |
| --- | --- |
| Birth year | Eligibility result |
| Proof nonce | Policy identifier |
| Credential payload | Issuer-verification result |
|  | Proof identifier and timestamp |

The browser demo never writes a birth year or nonce into its public proof object, receipt link or in-memory activity log. The Compact circuit follows the same separation: `getPrivateCredential()` supplies private witness data while `proofs` stores only `ProofReceipt` values.

## Security Model

Local proof mode does not pretend that a formatted URL is a cryptographic proof. A receipt is accepted only when its identifier and every disclosed field match a record sealed in the current in-memory session. Fabricated, modified, duplicated-field and cross-session receipts fail closed.

The Compact contract derives each proof identifier from the private credential, public policy inputs and `policyId`. Two policies evaluated against the same credential therefore remain distinct ledger entries.

Production trust requires Midnight ledger reads and proof verification. The local registry is a transparent prototype boundary, not a replacement for that network integration.

## Project Structure

```text
veilpass/
├── contract/src/veilpass.compact       # Compact privacy contract
├── contract/src/veilpass.test.ts        # Ledger policy-collision regression test
├── docs/hackathon-build/               # Scope, spec, thesis and build journal
├── public/veilpass-mark.png             # Generated brand asset
├── src/components/                     # Focused product UI components
├── src/lib/proof.ts                    # Local proof and parser logic
├── src/lib/proof.test.ts               # Privacy-sensitive unit tests
└── src/App.tsx                         # View composition and session state
```

## Run the Browser Prototype

Prerequisites: Node.js 22+ and npm 10+.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

To exercise the complete flow:

1. Enter a birth year and create an eligibility proof.
2. Copy the local receipt link.
3. Open Verify without refreshing and paste the link.
4. Open Activity and confirm that no private credential fields appear.

Refreshing clears the trusted receipt registry. A receipt from an earlier or different session is intentionally rejected in local proof mode.

## Compile the Midnight Contract

The repository targets Compact compiler 0.31.1 and Compact language 0.22 to 0.23.

```bash
compact compile --version
npm run contract:compile
```

Expected result:

```text
Compiling 1 circuits:
```

Generated contract artifacts are written to `contract/src/managed/veilpass/`. The JavaScript and TypeScript contract bindings used by the regression test are committed, while proving keys, verification keys and intermediate compiler artifacts remain ignored.

## Verify the Build

```bash
npm test
npm run build
npm run contract:compile
```

## Midnight Integration

The Compact circuit is real and compiles locally. The browser currently uses an explicit Local proof mode because this machine does not have Docker, a running Midnight proof server or a connected Lace wallet.

A live Preprod integration requires:

1. A Midnight proof server
2. A funded Lace wallet configured for Preprod
3. A deployed VeilPass contract address
4. A Midnight.js adapter that maps the form to the generated `createEligibilityProof` circuit binding
5. Ledger reads for the resulting `ProofReceipt`

Midnight's current official examples use Compact 0.31.x with Midnight.js 4.1.x. Useful references include the [ZK loan example](https://github.com/midnightntwrk/example-zkloan), [bulletin-board template](https://github.com/midnightntwrk/example-bboard) and [Midnight documentation](https://docs.midnight.network/).

## Known Limitations

- The browser receipt is a local product simulation, not a cryptographic proof.
- The issuer is simulated as trusted. No production credential issuer is connected.
- Verification authenticates only against the current in-memory receipt registry and rejects cross-session links.
- The age policy uses the UTC calendar year rather than a full date of birth.
- The project has not been deployed to Midnight Preprod.

## Buildathon Compliance Notes

- The Midnight-related code is newly developed for this project.
- The Compact contract compiles successfully.
- The repository is licensed under Apache License 2.0.
- The public repository carries the required `midnightntwrk` topic.
- The responsive browser demo is deployed publicly on Netlify.
- The slide deck and final 52.4-second demo video are included in the submission kit.
- Final submission on AKINDO remains a manual confirmation step.

## License

Apache License 2.0. See [LICENSE](./LICENSE).
