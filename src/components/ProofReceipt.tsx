import type { ProofState, PublicProof } from '../types'
import { shortenProofId } from '../lib/proof'
import { Icon } from './Icon'

interface ProofReceiptProps {
  proof: PublicProof | null
  state: ProofState
  copyStatus: 'idle' | 'copied' | 'error'
  onCopy: () => void
}

export function ProofReceipt({ proof, state, copyStatus, onCopy }: ProofReceiptProps) {
  if (state === 'creating') {
    return (
      <section className="receipt-panel receipt-loading" aria-live="polite">
        <div className="panel-kicker public-color"><Icon name="shield" /><span>Eligibility proof</span></div>
        <div className="loading-orbit"><Icon name="lock" /></div>
        <h2>Sealing proof</h2>
        <p>Private inputs are being evaluated locally. Only the receipt will leave the aperture.</p>
        <div className="loading-line"><span /></div>
      </section>
    )
  }

  if (!proof) {
    return (
      <section className="receipt-panel receipt-empty">
        <div className="panel-kicker public-color"><Icon name="shield" /><span>Eligibility proof</span></div>
        <div className="empty-seal"><Icon name="proof" /></div>
        <h2>No public receipt yet</h2>
        <p>Enter a private credential and create a proof. The birth year will not appear here.</p>
        <div className="empty-boundary"><Icon name="eyeOff" /><span>Private data remains hidden</span></div>
      </section>
    )
  }

  return (
    <section className="receipt-panel receipt-ready" aria-live="polite">
      <div className="panel-kicker public-color"><Icon name="shield" /><span>Eligibility proof</span></div>
      <div className="eligibility-result">
        <span className={proof.eligible ? 'result-icon is-positive' : 'result-icon is-negative'}>
          <Icon name={proof.eligible ? 'check' : 'lock'} />
        </span>
        <span><strong>{proof.eligible ? 'Eligible' : 'Not eligible'}</strong><small>{proof.eligible ? 'True' : 'False'}</small></span>
      </div>
      <dl className="receipt-facts">
        <div><dt>Policy</dt><dd>{proof.policyLabel}</dd></div>
        <div><dt>Issuer verified</dt><dd>{proof.issuerVerified ? 'Yes' : 'No'}</dd></div>
        <div><dt>Proof ID</dt><dd className="mono">{shortenProofId(proof.id)}</dd></div>
      </dl>
      <div className="private-confirmation"><Icon name="eyeOff" /><span>Birth year stays private</span></div>
      <button className="secondary-action" type="button" onClick={onCopy}>
        <Icon name={copyStatus === 'copied' ? 'check' : 'link'} />
        <span>{copyStatus === 'copied' ? 'Verification link copied' : copyStatus === 'error' ? 'Select the link below' : 'Copy verification link'}</span>
      </button>
      {copyStatus === 'error' && (
        <div className="copy-fallback">
          <label htmlFor="manual-proof-link">Verification link fallback</label>
          <textarea
            id="manual-proof-link"
            value={proof.verificationLink}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </section>
  )
}
