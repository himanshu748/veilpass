import type { ProofState, PublicProof } from '../types'
import { shortenProofId } from '../lib/proof'
import { Icon } from './Icon'

interface ProofReceiptProps {
  proof: PublicProof | null
  state: ProofState
  errorMessage: string
  copyStatus: 'idle' | 'copied' | 'error'
  onCopy: () => void
  onVerify: () => void
}

export function ProofReceipt({ proof, state, errorMessage, copyStatus, onCopy, onVerify }: ProofReceiptProps) {
  if (state === 'creating') {
    return (
      <section className="receipt-panel receipt-loading" aria-live="polite">
        <div className="panel-kicker public-color"><Icon name="shield" /><span>Eligibility proof</span></div>
        <div className="loading-orbit"><Icon name="lock" /></div>
        <h2>Executing Compact circuit</h2>
        <p>The generated contract runtime is evaluating the private witness and updating its public ledger.</p>
        <div className="loading-line"><span /></div>
      </section>
    )
  }

  if (state === 'error') {
    return (
      <section className="receipt-panel receipt-empty receipt-error" aria-live="assertive">
        <div className="panel-kicker private-color"><Icon name="question" /><span>Circuit execution failed</span></div>
        <div className="empty-seal"><Icon name="question" /></div>
        <h2>No receipt was written</h2>
        <p>{errorMessage || 'The Compact runtime stopped before the public ledger could be updated.'}</p>
        <div className="empty-boundary"><Icon name="lock" /><span>Private input was not retained</span></div>
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
        <div><dt>Compact ledger</dt><dd>Entry {proof.ledgerEntry}</dd></div>
        <div><dt>Proof ID</dt><dd className="mono">{shortenProofId(proof.id)}</dd></div>
      </dl>
      <div className="private-confirmation"><Icon name="eyeOff" /><span>Birth year stays private</span></div>
      <div className="receipt-actions">
        <button className="primary-action" type="button" onClick={onVerify}>
          <Icon name="verify" />
          <span>Authenticate this receipt</span>
        </button>
        <button className="secondary-action" type="button" onClick={onCopy}>
          <Icon name={copyStatus === 'copied' ? 'check' : 'link'} />
          <span>{copyStatus === 'copied' ? 'Receipt link copied' : copyStatus === 'error' ? 'Select the link below' : 'Copy receipt link'}</span>
        </button>
      </div>
      {copyStatus === 'error' && (
        <div className="copy-fallback">
          <label htmlFor="manual-proof-link">Receipt link fallback</label>
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
