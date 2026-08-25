import { useEffect, useState } from 'react'
import { formatTimestamp, parseVerificationLink, shortenProofId } from '../lib/proof'
import type { PublicProof } from '../types'
import { Icon } from './Icon'

interface VerifyPanelProps {
  trustedProofs: readonly PublicProof[]
  initialValue: string
}

export function VerifyPanel({ trustedProofs, initialValue }: VerifyPanelProps) {
  const [value, setValue] = useState(initialValue)
  const [proof, setProof] = useState<PublicProof | null>(null)
  const [error, setError] = useState('')

  const authenticate = (candidate: string) => {
    try {
      setProof(parseVerificationLink(candidate, trustedProofs))
      setError('')
    } catch (reason) {
      setProof(null)
      setError(reason instanceof Error ? reason.message : 'The receipt could not be authenticated.')
    }
  }

  useEffect(() => {
    setValue(initialValue)
    if (initialValue) authenticate(initialValue)
  }, [initialValue])

  const verify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    authenticate(value)
  }

  const updateValue = (nextValue: string) => {
    setValue(nextValue)
    setProof(null)
    setError('')
  }

  return (
    <main className="secondary-view">
      <div className="secondary-heading">
        <h1>Authenticate the receipt. Learn nothing else.</h1>
        <p>VeilPass matches the disclosed fields to a receipt written by the generated Compact circuit in this browser session.</p>
      </div>
      <div className="verify-layout">
        <form className="verify-form" onSubmit={verify}>
          <div className="panel-kicker private-color"><Icon name="link" /><span>Public receipt link</span></div>
          <label htmlFor="verification-link">Receipt link</label>
          <textarea
            id="verification-link"
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            placeholder="veilpass://proof/v1/…"
            aria-describedby={error ? 'verify-error' : 'verify-help'}
            aria-invalid={Boolean(error)}
          />
          <span id={error ? 'verify-error' : 'verify-help'} className={error ? 'field-message is-error' : 'field-message'} aria-live="polite">
            {error || 'Authentication fails closed if any public field was changed.'}
          </span>
          <button className="primary-action" type="submit" disabled={!value.trim()}><Icon name="verify" />Authenticate receipt</button>
        </form>

        <section className={proof ? 'verification-result is-ready' : error ? 'verification-result is-error' : 'verification-result'} aria-live="polite">
          {proof ? (
            <>
              <span className="result-icon is-positive"><Icon name="check" /></span>
              <h2>Receipt authenticated</h2>
              <p>Every disclosed field matches the trusted Compact ledger entry from this session.</p>
              <dl className="receipt-facts">
                <div><dt>Result</dt><dd>{proof.eligible ? 'Eligible' : 'Not eligible'}</dd></div>
                <div><dt>Policy</dt><dd>{proof.policyLabel}</dd></div>
                <div><dt>Issuer</dt><dd>{proof.issuer}</dd></div>
                <div><dt>Proof ID</dt><dd className="mono">{shortenProofId(proof.id)}</dd></div>
                <div><dt>Created</dt><dd>{formatTimestamp(proof.createdAt)}</dd></div>
              </dl>
              <div className="demo-disclaimer"><Icon name="code" /><span>Authenticated against the local Compact ledger. Preprod ledger lookup is the next network milestone.</span></div>
            </>
          ) : error ? (
            <>
              <span className="result-icon is-negative"><Icon name="lock" /></span>
              <h2>Receipt rejected</h2>
              <p>{error}</p>
              <div className="demo-disclaimer"><Icon name="shield" /><span>Unknown, modified or cross-session receipts are never treated as verified.</span></div>
            </>
          ) : (
            <>
              <div className="empty-seal"><Icon name="verify" /></div>
              <h2>Waiting for a receipt</h2>
              <p>Create a receipt in this session or paste one to test the fail-closed verifier.</p>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
