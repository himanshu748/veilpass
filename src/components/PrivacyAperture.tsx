import type { ProofState, PublicProof } from '../types'
import { Icon } from './Icon'

interface PrivacyApertureProps {
  birthYear: string
  issuerVerified: boolean
  proof: PublicProof | null
  state: ProofState
}

export function PrivacyAperture({ birthYear, issuerVerified, proof, state }: PrivacyApertureProps) {
  const isActive = state === 'creating'
  const isReady = Boolean(proof) && state === 'ready'
  const hasError = state === 'error'

  return (
    <section className={`aperture-stage${isActive ? ' is-active' : ''}${isReady ? ' is-ready' : ''}${hasError ? ' is-error' : ''}`} aria-label="Private Compact circuit execution">
      <div className="private-data-column" aria-hidden="true">
        <span className="flow-label private-color">Private inputs</span>
        <div className="private-data-item">
          <span className="round-icon"><Icon name="user" /></span>
          <span><small>Birth year</small><strong>{birthYear || 'Private'}</strong></span>
        </div>
        <div className="private-data-item">
          <span className="round-icon"><Icon name="shield" /></span>
          <span><small>Test issuer</small><strong>{issuerVerified ? 'Verified' : 'Unverified'}</strong></span>
        </div>
        <div className="private-data-item">
          <span className="round-icon"><Icon name="verify" /></span>
          <span><small>Policy</small><strong>Age is 18 or older</strong></span>
        </div>
      </div>

      <div className="aperture-column" aria-hidden="true">
        <div className="aperture-rail" />
        <div className="circuit-lines private-lines" />
        <div className="aperture-core">
          <div className="core-ticks" />
          <Icon name={isReady ? 'check' : hasError ? 'question' : 'lock'} />
          <span>{isActive ? 'EXECUTING' : isReady ? 'LEDGER UPDATED' : hasError ? 'CIRCUIT ERROR' : 'COMPACT CIRCUIT'}</span>
          <small>{isReady ? 'PUBLIC RECEIPT READY' : 'PRIVATE WITNESS'}</small>
        </div>
        <div className="circuit-lines public-lines" />
      </div>

      <div className="public-flow-label" aria-hidden="true">
        <span className="flow-label public-color">Public proof</span>
        <span className="flow-arrow">→</span>
      </div>
    </section>
  )
}
