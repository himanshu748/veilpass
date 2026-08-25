import {
  createCircuitContext,
  createConstructorContext,
  dummyContractAddress,
  type CircuitContext,
} from '@midnight-ntwrk/compact-runtime'
import {
  Contract,
  ledger,
  pureCircuits,
  type ProofReceipt,
} from '../../contract/src/managed/veilpass/contract/index.js'

const MINIMUM_AGE = 18n
const AGE_POLICY_ID = 1n

interface PrivateCredential {
  birthYear: bigint
  issuerVerified: boolean
  nonce: Uint8Array
}

export interface CompactExecution {
  proofId: Uint8Array
  receipt: ProofReceipt
  ledgerEntryCount: number
}

export class VeilPassCompactRuntime {
  private pendingCredential: PrivateCredential | null = null
  private readonly contract = new Contract<null>({
    getPrivateCredential: (context) => {
      const credential = this.pendingCredential
      if (!credential) throw new Error('The Compact witness was requested without a private credential.')
      this.pendingCredential = null
      return [context.privateState, credential]
    },
  })
  private context: CircuitContext<null>

  constructor() {
    const initial = this.contract.initialState(
      createConstructorContext(null, { bytes: new Uint8Array(32) }),
    )
    this.context = createCircuitContext(
      dummyContractAddress(),
      initial.currentZswapLocalState,
      initial.currentContractState,
      initial.currentPrivateState,
    )
  }

  executeAgePolicy(credential: PrivateCredential, currentYear: number): CompactExecution {
    if (this.pendingCredential) throw new Error('A Compact circuit execution is already in progress.')

    this.pendingCredential = credential
    const proofId = pureCircuits.deriveProofId(
      credential,
      BigInt(currentYear),
      MINIMUM_AGE,
      AGE_POLICY_ID,
    )

    try {
      const result = this.contract.circuits.createEligibilityProof(
        this.context,
        BigInt(currentYear),
        MINIMUM_AGE,
        AGE_POLICY_ID,
      )
      this.context = result.context

      const publicLedger = ledger(this.context.currentQueryContext.state)
      if (!publicLedger.proofs.member(proofId)) {
        throw new Error('The Compact circuit did not write the expected public receipt.')
      }

      return {
        proofId,
        receipt: publicLedger.proofs.lookup(proofId),
        ledgerEntryCount: Number(publicLedger.proofs.size()),
      }
    } finally {
      this.pendingCredential = null
    }
  }
}

export const browserCompactRuntime = new VeilPassCompactRuntime()
