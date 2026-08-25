export type AppView = 'create' | 'verify' | 'activity'

export type ProofState = 'idle' | 'creating' | 'ready' | 'error'

export interface PublicProof {
  id: string
  eligible: boolean
  policyId: 'age-18'
  policyLabel: 'Age ≥ 18'
  issuer: 'VeilPass Test Issuer'
  issuerVerified: boolean
  createdAt: string
  verificationLink: string
  executionMode: 'compact-runtime'
  circuit: 'createEligibilityProof'
  ledgerEntry: number
}

export interface ProofInput {
  birthYear: number
  issuer: PublicProof['issuer']
  issuerVerified: boolean
  currentYear?: number
}
