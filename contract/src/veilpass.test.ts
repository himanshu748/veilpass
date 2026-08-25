import {
  createCircuitContext,
  createConstructorContext,
  dummyContractAddress,
} from '@midnight-ntwrk/compact-runtime'
import { describe, expect, it } from 'vitest'
import { Contract, ledger } from './managed/veilpass/contract/index.js'

const execute = (issuerVerified: boolean) => {
  const credential = {
    birthYear: 1990n,
    issuerVerified,
    nonce: new Uint8Array(32).fill(7),
  }
  const contract = new Contract({
    getPrivateCredential: (context) => [context.privateState, credential],
  })
  const initial = contract.initialState(
    createConstructorContext(null, { bytes: new Uint8Array(32) }),
  )
  const context = createCircuitContext(
    dummyContractAddress(),
    initial.currentZswapLocalState,
    initial.currentContractState,
    initial.currentPrivateState,
  )
  return { contract, context }
}

describe('VeilPass generated Compact contract', () => {
  it('binds the policy identifier into distinct proof identifiers', () => {
    const { contract, context } = execute(true)
    const first = contract.circuits.createEligibilityProof(context, 2026n, 18n, 1n)
    const second = contract.circuits.createEligibilityProof(first.context, 2026n, 18n, 2n)
    const receipts = [...ledger(second.context.currentQueryContext.state).proofs]

    expect(receipts).toHaveLength(2)
    expect(receipts.map(([, receipt]) => receipt.policyId).sort()).toEqual([1n, 2n])
  })

  it('publishes only the eligibility, policy and issuer result', () => {
    const { contract, context } = execute(false)
    const result = contract.circuits.createEligibilityProof(context, 2026n, 18n, 1n)
    const [[, receipt]] = [...ledger(result.context.currentQueryContext.state).proofs]

    expect(receipt).toEqual({ eligible: false, policyId: 1n, issuerVerified: false })
    expect(Object.keys(receipt).sort()).toEqual(['eligible', 'issuerVerified', 'policyId'])
  })
})
