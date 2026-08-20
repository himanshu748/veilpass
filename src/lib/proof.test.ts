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
    const parsed = parseVerificationLink(created.verificationLink, [created])

    expect(parsed.id).toBe(created.id)
    expect(parsed.policyLabel).toBe('Age ≥ 18')
    expect(parsed.issuerVerified).toBe(true)
  })

  it('rejects fabricated eligibility claims without a trusted receipt record', () => {
    const fabricated =
      `veilpass://proof/v1/${'0'.repeat(64)}` +
      '?eligible=1&policy=age-18&issuer=civic-registry&verified=1&created=2026-08-20T00%3A00%3A00.000Z'

    expect(() => parseVerificationLink(fabricated, [])).toThrow(
      'No trusted proof record matches this receipt.',
    )
  })

  it('rejects tampering with a trusted receipt result', async () => {
    const created = await createEligibilityProof(
      { birthYear: 2009, issuer: 'Civic Registry', currentYear: 2026 },
      nonce,
    )
    const tampered = created.verificationLink.replace('eligible=0', 'eligible=1')

    expect(() => parseVerificationLink(tampered, [created])).toThrow(
      'Receipt fields do not match the trusted proof record.',
    )
  })

  it('rejects ambiguous or unexpected receipt fields', async () => {
    const created = await createEligibilityProof(
      { birthYear: 2009, issuer: 'Civic Registry', currentYear: 2026 },
      nonce,
    )

    expect(() => parseVerificationLink(`${created.verificationLink}&eligible=1`, [created])).toThrow(
      'The receipt fields are malformed.',
    )
    expect(() => parseVerificationLink(`${created.verificationLink}&redirect=https://example.com`, [created])).toThrow(
      'The receipt fields are malformed.',
    )
    expect(() => parseVerificationLink(created.verificationLink.replace('/v1/', '/v1/extra/'), [created])).toThrow(
      'This link is not a VeilPass v1 proof.',
    )
    expect(() => parseVerificationLink(`${created.verificationLink}#unexpected`, [created])).toThrow(
      'This link is not a VeilPass v1 proof.',
    )
  })

  it('rejects invalid years and unsupported links', () => {
    expect(validateBirthYear(2027, 2026)).toBe('Birth year cannot be in the future.')
    expect(() => parseVerificationLink('https://example.com', [])).toThrow(
      'This link is not a VeilPass v1 proof.',
    )
  })
})
