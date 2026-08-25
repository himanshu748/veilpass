# Technical Specification

## Architecture

- React 19 and Vite 7 frontend
- Generated Compact 0.31.1 JavaScript runtime executed in the browser
- In-memory public Compact ledger and same-session trusted receipt registry
- Compact contract with a private credential witness
- Midnight Preprod as the intended live network target

## Privacy Boundary

Private: birth year and proof nonce.

Public: eligibility boolean, policy identifier, issuer-verification boolean and proof identifier.

The browser follows this boundary directly. Generated contract code receives the birth year through a private witness and writes only the receipt to its local Compact ledger. The trusted registry stays in memory so a modified browser-storage value cannot become an authenticated receipt.

## UI States

- Empty: form ready, no receipt yet
- Loading: proof aperture seals while the proof is calculated
- Success: public receipt and copy action
- Error: accessible inline validation with recovery guidance
- Verify: parse and inspect a public verification link
- Activity: list public proof receipts from this browser session

## Honest Integration State

The current browser build executes the compiler-generated Compact contract locally and authenticates receipts against its in-memory ledger. It does not generate a zero-knowledge proof or submit a transaction to Midnight Preprod. That network path requires a proof server, Lace wallet and deployed contract address.
