import { shortenProofId } from '../lib/proof'
import type { PublicProof } from '../types'
import { Icon } from './Icon'

interface TechStripProps {
  proof: PublicProof | null
  proofCount: number
}

export function TechStrip({ proof, proofCount }: TechStripProps) {
  return (
    <section className="tech-strip" aria-label="Technical proof details">
      <div className="tech-item">
        <Icon name="code" />
        <span><small>Circuit</small><strong className="mono">createEligibilityProof</strong></span>
      </div>
      <div className="tech-item">
        <Icon name="hash" />
        <span><small>Proof ID</small><strong className="mono">{proof ? shortenProofId(proof.id) : 'Pending'}</strong></span>
      </div>
      <div className="tech-item">
        <Icon name="activity" />
        <span><small>Local ledger</small><strong className="mono">{proofCount} {proofCount === 1 ? 'entry' : 'entries'}</strong></span>
      </div>
    </section>
  )
}
