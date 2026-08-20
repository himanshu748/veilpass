import { formatTimestamp, shortenProofId } from '../lib/proof'
import type { PublicProof } from '../types'
import { Icon } from './Icon'

interface ActivityPanelProps {
  proofs: PublicProof[]
  onCreate: () => void
}

export function ActivityPanel({ proofs, onCreate }: ActivityPanelProps) {
  return (
    <main className="secondary-view activity-view">
      <div className="secondary-heading">
        <h1>Public receipts from this session.</h1>
        <p>The activity log stores proof metadata only. Private inputs are deliberately absent.</p>
      </div>

      {proofs.length ? (
        <section className="activity-table-wrap">
          <table>
            <caption className="sr-only">Proofs created during this browser session</caption>
            <thead><tr><th>Proof</th><th>Result</th><th>Policy</th><th>Issuer</th><th>Created</th></tr></thead>
            <tbody>
              {proofs.map((proof) => (
                <tr key={proof.id}>
                  <td className="mono">{shortenProofId(proof.id)}</td>
                  <td><span className={proof.eligible ? 'table-status is-positive' : 'table-status'}>{proof.eligible ? 'Eligible' : 'Not eligible'}</span></td>
                  <td>{proof.policyLabel}</td>
                  <td>{proof.issuer}</td>
                  <td>{formatTimestamp(proof.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="activity-privacy"><Icon name="eyeOff" /><span>No birth years, credential payloads or nonces are stored here.</span></div>
        </section>
      ) : (
        <section className="activity-empty">
          <div className="empty-seal"><Icon name="activity" /></div>
          <h2>No receipts in this session</h2>
          <p>Create a proof to see its public metadata here.</p>
          <button className="secondary-action" type="button" onClick={onCreate}><Icon name="proof" />Create a proof</button>
        </section>
      )}
    </main>
  )
}
