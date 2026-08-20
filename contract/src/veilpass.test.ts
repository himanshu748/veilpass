import {
  createCircuitContext,
  createConstructorContext,
  dummyContractAddress,
} from '@midnight-ntwrk/compact-runtime'
import { describe, expect, it } from 'vitest'
import { Contract, ledger } from './managed/veilpass/contract/index.js'

const credential = {
  birthYear: 1990n,
  issuerVerified: true,
  nonce: new Uint8Array(32).fill(7),
}

describe('VeilPass Compact contract', () => {
  it('stores different policies under different proof identifiers', () => {
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

    const first = contract.circuits.createEligibilityProof(context, 2026n, 18n, 1n)
    const second = contract.circuits.createEligibilityProof(first.context, 2026n, 18n, 2n)
    const receipts = [...ledger(second.context.currentQueryContext.state).proofs]

    expect(receipts).toHaveLength(2)
    expect(receipts.map(([, receipt]) => receipt.policyId).sort()).toEqual([1n, 2n])
  })
})
