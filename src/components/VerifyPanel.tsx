import { useState } from 'react'
import { formatTimestamp, parseVerificationLink, shortenProofId } from '../lib/proof'
import type { PublicProof } from '../types'
import { Icon } from './Icon'

interface VerifyPanelProps {
  proofs: readonly PublicProof[]
}

export function VerifyPanel({ proofs }: VerifyPanelProps) {
  const [value, setValue] = useState('')
  const [proof, setProof] = useState<PublicProof | null>(null)
  const [error, setError] = useState('')

  const verify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setProof(parseVerificationLink(value, proofs))
      setError('')
    } catch (reason) {
      setProof(null)
      setError(reason instanceof Error ? reason.message : 'The proof could not be verified.')
    }
  }

  return (
    <main className="secondary-view">
      <div className="secondary-heading">
        <h1>Verify the receipt. Learn nothing else.</h1>
        <p>Paste a VeilPass receipt created in this browser session. Every disclosed field must match its sealed in-memory record.</p>
      </div>
      <div className="verify-layout">
        <form className="verify-form" onSubmit={verify}>
          <div className="panel-kicker private-color"><Icon name="link" /><span>Public verification link</span></div>
          <label htmlFor="verification-link">Verification link</label>
          <textarea
            id="verification-link"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="veilpass://proof/v1/…"
            aria-describedby={error ? 'verify-error' : 'verify-help'}
            aria-invalid={Boolean(error)}
          />
          <span id={error ? 'verify-error' : 'verify-help'} className={error ? 'field-message is-error' : 'field-message'} aria-live="polite">
            {error || 'The verifier fails closed when no trusted local record exists.'}
          </span>
          <button className="primary-action" type="submit" disabled={!value.trim()}><Icon name="verify" />Verify trusted receipt</button>
        </form>

        <section className={proof ? 'verification-result is-ready' : error ? 'verification-result is-rejected' : 'verification-result'} aria-live="polite">
          {proof ? (
            <>
              <span className="result-icon is-positive"><Icon name="check" /></span>
              <h2>Receipt authenticated</h2>
              <p>Every disclosed field matches the sealed receipt created in this session.</p>
              <dl className="receipt-facts">
                <div><dt>Result</dt><dd>{proof.eligible ? 'Eligible' : 'Not eligible'}</dd></div>
                <div><dt>Policy</dt><dd>{proof.policyLabel}</dd></div>
                <div><dt>Issuer</dt><dd>{proof.issuer}</dd></div>
                <div><dt>Proof ID</dt><dd className="mono">{shortenProofId(proof.id)}</dd></div>
                <div><dt>Created</dt><dd>{formatTimestamp(proof.createdAt)}</dd></div>
              </dl>
              <div className="demo-disclaimer"><Icon name="code" /><span>Authenticated against this session's in-memory registry. Midnight network verification is next.</span></div>
            </>
          ) : error ? (
            <>
              <span className="result-icon is-negative"><Icon name="lock" /></span>
              <h2>Receipt not authenticated</h2>
              <p>{error}</p>
              <div className="demo-disclaimer"><Icon name="shield" /><span>No eligibility result was trusted or disclosed as valid.</span></div>
            </>
          ) : (
            <>
              <div className="empty-seal"><Icon name="verify" /></div>
              <h2>Waiting for a receipt</h2>
              <p>Paste a receipt created while this browser session remains open.</p>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
