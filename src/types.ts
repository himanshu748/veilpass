export type AppView = 'create' | 'verify' | 'activity'

export type ProofState = 'idle' | 'creating' | 'ready' | 'error'

export interface PublicProof {
  id: string
  eligible: boolean
  policyId: 'age-18'
  policyLabel: 'Age ≥ 18'
  issuer: 'Civic Registry'
  issuerVerified: boolean
  createdAt: string
  verificationLink: string
  executionMode: 'local-simulation'
}

export interface ProofInput {
  birthYear: number
  issuer: PublicProof['issuer']
  currentYear?: number
}
