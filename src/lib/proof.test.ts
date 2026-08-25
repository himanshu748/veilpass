import { describe, expect, it } from 'vitest'
import { VeilPassCompactRuntime } from './compact'
import {
  createEligibilityProof,
  parseVerificationLink,
  validateBirthYear,
} from './proof'

const nonce = new Uint8Array(32).fill(7)
const input = {
  birthYear: 1998,
  issuer: 'VeilPass Test Issuer' as const,
  issuerVerified: true,
  currentYear: 2026,
}

describe('VeilPass Compact proof flow', () => {
  it('executes the generated circuit and discloses no birth year', async () => {
    const proof = await createEligibilityProof(input, nonce, new VeilPassCompactRuntime())

    expect(proof.eligible).toBe(true)
    expect(proof.executionMode).toBe('compact-runtime')
    expect(proof.circuit).toBe('createEligibilityProof')
    expect(proof.verificationLink).not.toContain('1998')
    expect(JSON.stringify(proof)).not.toContain('birthYear')
  })

  it('returns ineligible at the age boundary', async () => {
    const proof = await createEligibilityProof(
      { ...input, birthYear: 2009 },
      nonce,
      new VeilPassCompactRuntime(),
    )
    expect(proof.eligible).toBe(false)
  })

  it('requires a verified issuer inside the Compact circuit', async () => {
    const proof = await createEligibilityProof(
      { ...input, issuerVerified: false },
      nonce,
      new VeilPassCompactRuntime(),
    )
    expect(proof.eligible).toBe(false)
    expect(proof.issuerVerified).toBe(false)
  })

  it('authenticates an unchanged receipt against the local ledger registry', async () => {
    const created = await createEligibilityProof(input, nonce, new VeilPassCompactRuntime())
    const parsed = parseVerificationLink(created.verificationLink, [created])

    expect(parsed).toBe(created)
  })

  it('rejects a fabricated eligibility claim', () => {
    const fabricated =
      `veilpass://proof/v1/${'0'.repeat(64)}` +
      '?eligible=1&policy=age-18&issuer=veilpass-test-issuer&verified=1&created=2026-08-20T00%3A00%3A00.000Z'

    expect(() => parseVerificationLink(fabricated, [])).toThrow(
      'No local Compact ledger entry matches this receipt.',
    )
  })

  it('rejects tampering with a trusted receipt', async () => {
    const created = await createEligibilityProof(
      { ...input, birthYear: 2009 },
      nonce,
      new VeilPassCompactRuntime(),
    )
    const tampered = created.verificationLink.replace('eligible=0', 'eligible=1')

    expect(() => parseVerificationLink(tampered, [created])).toThrow(
      'Receipt fields do not match the local Compact ledger entry.',
    )
  })

  it('rejects duplicate, unexpected and malformed fields', async () => {
    const created = await createEligibilityProof(input, nonce, new VeilPassCompactRuntime())

    expect(() => parseVerificationLink(`${created.verificationLink}&eligible=1`, [created])).toThrow(
      'The receipt fields are malformed.',
    )
    expect(() => parseVerificationLink(`${created.verificationLink}&redirect=https://example.com`, [created])).toThrow(
      'The receipt fields are malformed.',
    )
    expect(() => parseVerificationLink(created.verificationLink.replace('/v1/', '/v1/extra/'), [created])).toThrow(
      'This link is not a VeilPass v1 receipt.',
    )
  })

  it('rejects invalid years and unsupported links', () => {
    expect(validateBirthYear(2027, 2026)).toBe('Birth year cannot be in the future.')
    expect(() => parseVerificationLink('https://example.com', [])).toThrow(
      'This link is not a VeilPass v1 receipt.',
    )
  })
})
