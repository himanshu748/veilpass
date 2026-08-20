# Technical Specification

## Architecture

- React 19 and Vite 7 frontend
- Browser-native Web Crypto for demo receipt identifiers
- In-memory trusted registry for public proof activity only
- Compact 0.31.1 contract with a private credential witness
- Midnight Preprod as the intended live network target

## Privacy Boundary

Private: birth year and proof nonce.

Public: eligibility boolean, policy identifier, issuer-verification boolean and proof identifier.

The browser demo mirrors this boundary. It never writes the birth year to storage or the receipt link. The Compact circuit receives the private credential through a witness and discloses only the receipt.

## UI States

- Empty: form ready, no receipt yet
- Loading: proof aperture seals while the proof is calculated
- Success: public receipt and copy action
- Error: accessible inline validation with recovery guidance
- Verify: authenticate public fields against a receipt sealed in the current session
- Activity: list public proof receipts from this browser session

## Honest Integration State

The current browser build uses a local proof simulator. Its verifier fails closed when no exact in-memory receipt record exists. The Compact contract compiles separately. A live Midnight adapter requires a proof server, wallet and deployed contract address.
