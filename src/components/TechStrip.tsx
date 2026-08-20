import { shortenProofId } from '../lib/proof'
import type { PublicProof } from '../types'
import { Icon } from './Icon'

interface TechStripProps {
  proof: PublicProof | null
}

export function TechStrip({ proof }: TechStripProps) {
  return (
    <section className="tech-strip" aria-label="Technical proof details">
      <div className="tech-item">
        <Icon name="code" />
        <span><small>Contract</small><strong className="mono">Compiled · 1 circuit</strong></span>
      </div>
      <div className="tech-item">
        <Icon name="hash" />
        <span><small>Proof ID</small><strong className="mono">{proof ? shortenProofId(proof.id) : 'Pending'}</strong></span>
      </div>
      <div className="tech-item">
        <Icon name="globe" />
        <span><small>Network</small><strong className="mono">Midnight Preprod target</strong></span>
      </div>
    </section>
  )
}
