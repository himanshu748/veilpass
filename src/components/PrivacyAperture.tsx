import type { ProofState, PublicProof } from '../types'
import { Icon } from './Icon'

interface PrivacyApertureProps {
  birthYear: string
  proof: PublicProof | null
  state: ProofState
}

export function PrivacyAperture({ birthYear, proof, state }: PrivacyApertureProps) {
  const isActive = state === 'creating'
  const isReady = Boolean(proof) && state === 'ready'

  return (
    <section className={`aperture-stage${isActive ? ' is-active' : ''}${isReady ? ' is-ready' : ''}`} aria-label="Private proof transformation">
      <div className="private-data-column" aria-hidden="true">
        <span className="flow-label private-color">Private inputs</span>
        <div className="private-data-item">
          <span className="round-icon"><Icon name="user" /></span>
          <span><small>Birth year</small><strong>{birthYear || 'Private'}</strong></span>
        </div>
        <div className="private-data-item">
          <span className="round-icon"><Icon name="shield" /></span>
          <span><small>Issuer</small><strong>Civic Registry</strong></span>
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
          <Icon name={isReady ? 'check' : 'lock'} />
          <span>{isActive ? 'GENERATING' : isReady ? 'PROOF SEALED' : 'ZERO KNOWLEDGE'}</span>
          <small>{isReady ? 'PUBLIC RECEIPT READY' : 'PRIVATE CIRCUIT'}</small>
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
