# Build Notes

## Direction

The event brief prioritizes working Compact code, private-state handling, tests and an end-to-end interface. VeilPass was chosen because selective disclosure makes Midnight's dual-ledger model understandable in one short demo.

## Design

The generated concept established a technical-instrument composition centered on a privacy aperture. The implementation may change the network status copy from "Ready on Midnight testnet" to an honest local-simulation state until a live wallet and proof server are connected.

## Verification Plan

- Compile with Compact 0.31.1
- Run unit tests and production build
- Exercise create, verify and activity flows
- Inspect at 360, 768, 1024 and 1440 pixels
- Compare the final render with `outputs/veilpass-concept.png`

## Build Result

- Compact 0.31.1 compiled one `createEligibilityProof` circuit successfully.
- Four Vitest cases passed for eligibility, age boundaries, public-link parsing and birth-year non-disclosure.
- The Vite production build completed successfully.
- Browser checks covered proof creation, sharing, verification and public-only activity.
- Responsive checks at 360, 768, 1024 and 1440 pixels found no horizontal overflow.

## Improvement Pass

The first rendered pass led to three material corrections:

1. Replaced the concept's live-testnet claim with an honest compiled-contract and demo-mode status.
2. Added empty, loading and validation states that the success-state concept did not show.
3. Added a manual verification-link fallback for embedded browsers that deny or stall clipboard access.
