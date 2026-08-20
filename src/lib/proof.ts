import type { ProofInput, PublicProof } from '../types'

const MINIMUM_AGE = 18
const MINIMUM_BIRTH_YEAR = 1900
const RECEIPT_FIELDS = ['eligible', 'policy', 'issuer', 'verified', 'created'] as const
const RECEIPT_FIELD_SET = new Set<string>(RECEIPT_FIELDS)

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return toHex(new Uint8Array(digest))
}

export const validateBirthYear = (birthYear: number, currentYear: number) => {
  if (!Number.isInteger(birthYear)) return 'Enter a four-digit birth year.'
  if (birthYear < MINIMUM_BIRTH_YEAR) return `Birth year must be ${MINIMUM_BIRTH_YEAR} or later.`
  if (birthYear > currentYear) return 'Birth year cannot be in the future.'
  return null
}

export const createEligibilityProof = async (
  input: ProofInput,
  nonceOverride?: Uint8Array,
): Promise<PublicProof> => {
  const currentYear = input.currentYear ?? new Date().getUTCFullYear()
  const validationError = validateBirthYear(input.birthYear, currentYear)
  if (validationError) throw new Error(validationError)

  const nonce = nonceOverride ?? crypto.getRandomValues(new Uint8Array(32))
  const id = await sha256(
    `veilpass:proof:v1:${input.birthYear}:${input.issuer}:${currentYear}:${toHex(nonce)}`,
  )
  const createdAt = new Date().toISOString()
  const eligible = input.birthYear <= currentYear - MINIMUM_AGE
  const params = new URLSearchParams({
    eligible: eligible ? '1' : '0',
    policy: 'age-18',
    issuer: 'civic-registry',
    verified: '1',
    created: createdAt,
  })

  return {
    id,
    eligible,
    policyId: 'age-18',
    policyLabel: 'Age ≥ 18',
    issuer: 'Civic Registry',
    issuerVerified: true,
    createdAt,
    verificationLink: `veilpass://proof/v1/${id}?${params.toString()}`,
    executionMode: 'local-simulation',
  }
}

export const parseVerificationLink = (
  value: string,
  trustedProofs: readonly PublicProof[],
): PublicProof => {
  let link: URL
  try {
    link = new URL(value.trim())
  } catch {
    throw new Error('Paste a valid VeilPass verification link.')
  }

  const segments = link.pathname.split('/').filter(Boolean)
  const id = segments.at(-1) ?? ''
  const hasExactRoute =
    link.protocol === 'veilpass:' &&
    link.hostname === 'proof' &&
    !link.username &&
    !link.password &&
    !link.port &&
    !link.hash &&
    segments.length === 2 &&
    segments[0] === 'v1'
  if (!hasExactRoute) {
    throw new Error('This link is not a VeilPass v1 proof.')
  }
  if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('The proof identifier is malformed.')

  const queryKeys = [...link.searchParams.keys()]
  const fieldsAreExact =
    queryKeys.length === RECEIPT_FIELDS.length &&
    queryKeys.every((key) => RECEIPT_FIELD_SET.has(key)) &&
    RECEIPT_FIELDS.every((key) => link.searchParams.getAll(key).length === 1)
  if (!fieldsAreExact) throw new Error('The receipt fields are malformed.')

  const eligibleValue = link.searchParams.get('eligible')
  const verifiedValue = link.searchParams.get('verified')
  if (!['0', '1'].includes(eligibleValue ?? '') || !['0', '1'].includes(verifiedValue ?? '')) {
    throw new Error('The receipt fields are malformed.')
  }
  if (link.searchParams.get('policy') !== 'age-18') throw new Error('The proof policy is unsupported.')
  if (link.searchParams.get('issuer') !== 'civic-registry') throw new Error('The proof issuer is unsupported.')

  const createdAt = link.searchParams.get('created') ?? ''
  if (Number.isNaN(Date.parse(createdAt))) throw new Error('The proof timestamp is malformed.')

  const trustedProof = trustedProofs.find((proof) => proof.id === id)
  if (!trustedProof) throw new Error('No trusted proof record matches this receipt.')

  const fieldsMatch =
    (eligibleValue === '1') === trustedProof.eligible &&
    trustedProof.policyId === 'age-18' &&
    trustedProof.issuer === 'Civic Registry' &&
    (verifiedValue === '1') === trustedProof.issuerVerified &&
    createdAt === trustedProof.createdAt
  if (!fieldsMatch) throw new Error('Receipt fields do not match the trusted proof record.')

  return trustedProof
}

export const shortenProofId = (id: string) =>
  id ? `${id.slice(0, 6)}…${id.slice(-4)}` : 'Pending'

export const formatTimestamp = (iso: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
