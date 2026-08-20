# Scope

## Product

VeilPass is a selective-disclosure credential prototype for Midnight. A user supplies a private birth year and chooses an issuer and policy. The product returns only an eligibility result, policy identifier and issuer-verification result.

## Wave 1 Goal

Deliver a focused proof of concept that demonstrates Midnight's dual-state model through a compiling Compact contract and a polished browser workflow.

## In Scope

- Create an age-eligibility proof from private local input
- Show the public receipt without retaining the birth year
- Copy and authenticate a local receipt link within the current session
- Keep a local activity log containing only public proof data
- Compile a Compact contract that writes only the public receipt to the ledger
- Test eligibility, privacy boundaries and verification-link parsing

## Out of Scope

- Production identity issuance
- Live government or KYC integrations
- Mainnet deployment
- Real wallet authorization in the browser prototype
- Legal assurance about age verification
