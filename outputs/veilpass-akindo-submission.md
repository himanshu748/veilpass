# VeilPass

Event: [Build Privacy-First Apps on Midnight](https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG)

Status: Submission kit prepared. Final entry must be submitted manually through the registered AKINDO account after Wave 1 opens.

## One-line Pitch

VeilPass proves that someone satisfies an eligibility policy without revealing the private credential used to reach the answer.

## Problem

Age gates and eligibility checks routinely collect more identity data than a decision requires. A verifier may only need a yes-or-no answer, but users are often asked to expose a full birth date or identity document. That creates unnecessary breach risk, retention obligations and user distrust.

## Solution

VeilPass turns a private credential into a minimal public receipt. A user supplies a birth year locally, selects a test issuer state and asks the policy “Age is 18 or older?” The generated Compact contract evaluates the private witness and writes only the result, policy identifier and issuer-verification state to its in-memory ledger. The verifier authenticates a receipt only when every disclosed field matches that trusted same-session ledger entry.

The product makes Midnight's private-to-public boundary visible. Private inputs enter a sealed proof aperture and emerge as a receipt that reveals the answer, not the source facts.

## Why It Matters

Selective disclosure lets businesses make policy decisions without building databases of sensitive user information. The same pattern can extend from age checks to membership, licensing, compliance and healthcare eligibility.

## Working Features

- Execute an age-eligibility policy through compiler-generated Compact code
- Copy a local receipt link that contains no birth year
- Authenticate the receipt against its trusted current-session record
- Reject fabricated, modified, duplicated-field and cross-session receipts
- Review public-only receipt activity from the current in-memory session
- Handle empty, loading, validation, success and clipboard-recovery states
- Explain the private-to-public boundary through a conversion-focused landing experience
- Compile a Compact contract that stores only the public receipt
- Run automated tests for privacy leakage, policy binding and verifier tampering

## How Midnight Is Used

The Compact contract receives a `PrivateCredential` through the `getPrivateCredential()` witness. The credential contains the private birth year, issuer-verification result and nonce. `createEligibilityProof` evaluates the age policy in the circuit then discloses only a `ProofReceipt` containing:

- `eligible`
- `policyId`
- `issuerVerified`

The Compact receipt is indexed by a proof identifier derived from the private credential, nonce and public policy inputs, including `currentYear`, `minimumAge` and `policyId`. The raw birth year is never written to the public ledger.

The current contract compiles with Compact 0.31.1. The browser imports the compiler-generated bindings, executes `createEligibilityProof` through `@midnight-ntwrk/compact-runtime` and reads the resulting in-memory Compact ledger. This is real Compact contract execution, not a handwritten policy simulator. It is not yet zero-knowledge proof generation or a Preprod transaction, which still require a proof server, Lace wallet and deployed contract.

## Engineering Evidence

- Compact contract: `contract/src/veilpass.compact`
- Compiler result: one circuit compiled successfully
- Test suite: ten passing contract, security and privacy tests
- Production frontend: React 19, TypeScript and Vite
- Responsive QA: desktop and mobile production layouts verified with no horizontal overflow
- Accessibility: semantic controls, associated labels, keyboard focus states and reduced-motion support

## Architecture

```text
Private form input
      │
      └── Private-state witness → generated Compact circuit → in-memory Compact ledger
                                                      │
                                                      └── exact-schema, fail-closed receipt verifier
```

## Testing Instructions

```bash
npm install
npm test
npm run contract:compile
npm run dev
```

Then open `http://127.0.0.1:5173`, create a proof, copy its local receipt link, open Verify without refreshing, paste the link and authenticate it. Modify any disclosed field and confirm that verification fails closed. Open Activity and confirm that it contains no birth year, credential payload or nonce.

## Demo Video Outline

- 0:00-0:12: Show why conventional age checks over-collect identity data and introduce VeilPass
- 0:12-0:20: Create a proof and show the private-to-public aperture
- 0:20-0:27: Authenticate the local receipt against its sealed session record
- 0:27-0:34: Show Activity and confirm the birth year, credential payload and nonce are absent
- 0:34-0:44: Show the Compact boundary and ten passing contract, security and privacy tests
- 0:44-0:54: State the Preprod integration roadmap

## Screenshot Shot List

1. Complete proof workspace before proof creation
2. Sealed proof with the eligible public receipt
3. Verify screen with an authenticated current-session receipt
4. Activity screen showing public-only history
5. Compact compilation output beside the contract source

## Business and Adoption Path

Initial adopters are event operators, age-restricted services and membership organizations that need a policy result but do not want to retain identity documents. A production version would integrate credential issuers and expose a small verifier SDK for existing checkout or access-control flows.

## Known Limitations

- The browser executes generated Compact code against an in-memory ledger, but does not generate a zero-knowledge proof
- No production issuer is connected
- No Lace wallet or Preprod deployment is included yet
- Verification authenticates only against the current in-memory receipt registry and rejects cross-session links
- The calendar-year policy should be replaced with a full date policy for production use

## Progress Completed in This Wave

- Defined the selective-disclosure product scope and privacy boundary
- Designed the product-specific technical-instrument interface
- Rebuilt the landing experience around the working proof lab, animated disclosure statement, honest runtime evidence and FAQ
- Replaced the handwritten browser simulator with compiler-generated Compact runtime execution
- Implemented the complete same-session browser workflow
- Added local receipt links, a trusted in-memory registry and fail-closed verification
- Wrote and compiled the Compact circuit
- Added automated privacy and boundary tests
- Verified responsive behavior and performed a visual fidelity pass

## Required Submission Links

- Public GitHub repository: https://github.com/himanshu748/veilpass
- Live demo: https://veilpass-midnight.netlify.app
- Slide deck: `VeilPass-AKINDO-Deck.pptx`
- Demo video: `VeilPass-demo.mp4` (43.5 seconds, 1920×1080, synchronized to the Compact runtime build)
- Narration disclosure: AI-generated voice clips, edited to remove obsolete claims and repeated wording

## Before Submitting

- [x] Publish the repository under Apache License 2.0
- [x] Add the `midnightntwrk` topic to the GitHub repository
- [x] Add the public repository URL
- [x] Deploy the browser demo and add its URL
- [x] Create the slide deck
- [x] Rerender the demo video from the generated Compact runtime build
- [x] Add three to five final screenshots
- [x] Verify the live demo at desktop and mobile sizes
- [x] Synchronize the deck, screenshots and video with the ten-test Compact runtime build
- [ ] Confirm the final AKINDO upload fields after Wave 1 opens
- [ ] Submit personally through the registered AKINDO account; automated entry tools are prohibited
