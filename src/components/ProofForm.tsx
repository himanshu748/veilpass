import { useId, useState } from 'react'
import { validateBirthYear } from '../lib/proof'
import { Icon } from './Icon'

interface ProofFormProps {
  isCreating: boolean
  birthYear: string
  onBirthYearChange: (value: string) => void
  onSubmit: () => void
}

export function ProofForm({ isCreating, birthYear, onBirthYearChange, onSubmit }: ProofFormProps) {
  const errorId = useId()
  const [touched, setTouched] = useState(false)
  const currentYear = new Date().getUTCFullYear()
  const parsedYear = Number(birthYear)
  const validationError = birthYear ? validateBirthYear(parsedYear, currentYear) : 'Enter a birth year.'
  const visibleError = touched ? validationError : null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)
    if (!validationError) onSubmit()
  }

  return (
    <form className="credential-panel" onSubmit={handleSubmit} noValidate>
      <div className="panel-kicker private-color">
        <Icon name="lock" />
        <span>Private credential</span>
      </div>

      <label htmlFor="credential">Private credential</label>
      <div className="field-with-icon">
        <Icon name="credential" />
        <select id="credential" defaultValue="national-id" disabled={isCreating}>
          <option value="national-id">National ID (Civic)</option>
        </select>
      </div>

      <label htmlFor="birth-year">Birth year</label>
      <input
        id="birth-year"
        className={visibleError ? 'field-error' : ''}
        type="text"
        inputMode="numeric"
        pattern="[0-9]{4}"
        maxLength={4}
        value={birthYear}
        disabled={isCreating}
        aria-describedby={visibleError ? errorId : undefined}
        aria-invalid={Boolean(visibleError)}
        onChange={(event) => onBirthYearChange(event.target.value.replace(/\D/g, '').slice(0, 4))}
        onBlur={() => setTouched(true)}
      />
      <span id={errorId} className="field-message" aria-live="polite">
        {visibleError ?? 'Used locally to evaluate the policy.'}
      </span>

      <label htmlFor="issuer">Issuer</label>
      <div className="field-with-icon">
        <Icon name="shield" />
        <select id="issuer" defaultValue="civic" disabled={isCreating}>
          <option value="civic">Civic Registry</option>
        </select>
      </div>

      <label htmlFor="policy">Proof policy</label>
      <div className="field-with-icon">
        <Icon name="verify" />
        <select id="policy" defaultValue="age-18" disabled={isCreating}>
          <option value="age-18">Age is 18 or older</option>
        </select>
      </div>

      <button className="primary-action" type="submit" disabled={isCreating}>
        <Icon name={isCreating ? 'lock' : 'shield'} />
        <span>{isCreating ? 'Sealing private inputs…' : 'Create eligibility proof'}</span>
      </button>

      <div className="privacy-note">
        <Icon name="lock" />
        <span>Your data stays on this device</span>
      </div>
    </form>
  )
}
