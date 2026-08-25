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
- Generated Compact contract code executed directly in the browser
- An in-memory Compact ledger containing only public receipt fields
- A same-session receipt-link format with fail-closed authentication
- A verifier that rejects fabricated, modified and cross-session receipts
- A session activity log containing no private credential data
- A Compact contract with a private credential witness and public receipt ledger
- Ten tests covering generated contract execution, ledger state, age boundaries, privacy leakage and receipt tampering
- A production Vite build

## Privacy Boundary

| Private | Public |
| --- | --- |
| Birth year | Eligibility result |
| Proof nonce | Policy identifier |
| Credential payload | Issuer-verification result |
|  | Proof identifier and timestamp |

The browser never writes a birth year or nonce into its public receipt object, receipt link or session activity log. It calls the generated Compact binding directly: `getPrivateCredential()` supplies private witness data while `proofs` stores only `ProofReceipt` values.

## Project Structure

```text
veilpass/
├── contract/src/veilpass.compact       # Compact privacy contract
├── docs/hackathon-build/               # Scope, spec, thesis and build journal
├── public/veilpass-mark.png             # Generated brand asset
├── src/components/                     # Focused product UI components
├── src/lib/compact.ts                  # Generated Compact runtime adapter
├── src/lib/proof.ts                    # Receipt creation and fail-closed parser
├── src/lib/proof.test.ts               # Privacy and tamper-resistance tests
└── src/App.tsx                         # View composition and trusted session state
```

## Run the Browser Prototype

Prerequisites: Node.js 22+ and npm 10+.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

To exercise the complete flow:

1. Enter a birth year, choose an issuer state and execute the eligibility circuit.
2. Inspect the public receipt written to the local Compact ledger.
3. Select **Authenticate this receipt** to run the same-session verifier.
4. Modify any receipt field and confirm that authentication fails closed.
5. Open Activity and confirm that no private credential fields appear.

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

Generated contract artifacts are written to `contract/src/managed/veilpass/` and intentionally ignored by Git.

## Verify the Build

```bash
npm test
npm run build
npm run contract:compile
```

## Midnight Integration

The browser imports the compiler-generated Compact binding and executes `createEligibilityProof` against an in-memory Compact ledger. The eligibility result and proof identifier come from the contract runtime rather than duplicated TypeScript policy logic.

This Wave 1 path is a real Compact execution, but it is not a generated zero-knowledge proof or a Preprod transaction. Network deployment requires:

A live Preprod integration requires:

1. A Midnight proof server
2. A funded Lace wallet configured for Preprod
3. A deployed VeilPass contract address
4. A Midnight.js provider adapter that submits the existing generated `createEligibilityProof` binding
5. Ledger reads for the resulting `ProofReceipt`

Midnight's current official examples use Compact 0.31.x with Midnight.js 4.1.x. Useful references include the [ZK loan example](https://github.com/midnightntwrk/example-zkloan), [bulletin-board template](https://github.com/midnightntwrk/example-bboard) and [Midnight documentation](https://docs.midnight.network/).

## Known Limitations

- The browser executes the generated contract locally, but does not generate a zero-knowledge proof.
- The selectable issuer state is a transparent test fixture. No production credential issuer is connected.
- Authentication is scoped to the in-memory Compact ledger for the current browser session, not a Preprod ledger lookup.
- The age policy uses the UTC calendar year rather than a full date of birth.
- The project has not been deployed to Midnight Preprod.

## Buildathon Compliance Notes

- The Midnight-related code is newly developed for this project.
- The Compact contract compiles successfully.
- The repository is licensed under Apache License 2.0.
- The public repository carries the required `midnightntwrk` topic.
- The responsive browser demo is deployed publicly on Netlify and is ready for a runtime refresh.
- The slide deck and demo-video source are included in the submission kit.
- Final submission on AKINDO remains a manual confirmation step.

## License

Apache License 2.0. See [LICENSE](./LICENSE).
