# Scope

## Product

VeilPass is a selective-disclosure credential prototype for Midnight. A user supplies a private birth year and chooses an issuer and policy. The product returns only an eligibility result, policy identifier and issuer-verification result.

## Wave 1 Goal

Deliver a focused proof of concept that demonstrates Midnight's dual-state model through a compiling Compact contract and a polished browser workflow.

## In Scope

- Execute the generated Compact age-eligibility circuit from a private local witness
- Show the public receipt without retaining the birth year
- Authenticate a public receipt link against the local Compact ledger and reject tampering
- Keep a local activity log containing only public proof data
- Compile a Compact contract that writes only the public receipt to the ledger
- Test generated contract execution, ledger state, eligibility, privacy boundaries and receipt tampering

## Out of Scope

- Production identity issuance
- Live government or KYC integrations
- Mainnet deployment
- Real wallet authorization in the browser prototype
- Zero-knowledge proof generation and Preprod transaction submission
- Legal assurance about age verification
