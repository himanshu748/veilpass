import { describe, expect, it } from 'vitest'
import {
  createEligibilityProof,
  parseVerificationLink,
  validateBirthYear,
} from './proof'

const nonce = new Uint8Array(32).fill(7)

describe('VeilPass proof logic', () => {
  it('returns eligible without disclosing the birth year', async () => {
    const proof = await createEligibilityProof(
      { birthYear: 1998, issuer: 'Civic Registry', currentYear: 2026 },
      nonce,
    )

    expect(proof.eligible).toBe(true)
    expect(proof.verificationLink).not.toContain('1998')
    expect(JSON.stringify(proof)).not.toContain('birthYear')
  })

  it('returns ineligible at the age boundary', async () => {
    const proof = await createEligibilityProof(
      { birthYear: 2009, issuer: 'Civic Registry', currentYear: 2026 },
      nonce,
    )
    expect(proof.eligible).toBe(false)
  })

  it('round-trips only public receipt data', async () => {
    const created = await createEligibilityProof(
      { birthYear: 1990, issuer: 'Civic Registry', currentYear: 2026 },
      nonce,
    )
    const parsed = parseVerificationLink(created.verificationLink)

    expect(parsed.id).toBe(created.id)
    expect(parsed.policyLabel).toBe('Age ≥ 18')
    expect(parsed.issuerVerified).toBe(true)
  })

  it('rejects invalid years and unsupported links', () => {
    expect(validateBirthYear(2027, 2026)).toBe('Birth year cannot be in the future.')
    expect(() => parseVerificationLink('https://example.com')).toThrow(
      'This link is not a VeilPass v1 proof.',
    )
  })
})
