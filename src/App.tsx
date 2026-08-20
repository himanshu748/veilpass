import { useEffect, useState } from 'react'
import { ActivityPanel } from './components/ActivityPanel'
import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { LandingSections } from './components/LandingSections'
import { PrivacyAperture } from './components/PrivacyAperture'
import { ProofForm } from './components/ProofForm'
import { ProofReceipt } from './components/ProofReceipt'
import { TechStrip } from './components/TechStrip'
import { VerifyPanel } from './components/VerifyPanel'
import { createEligibilityProof } from './lib/proof'
import type { AppView, ProofState, PublicProof } from './types'

function NotFound() {
  return (
    <main className="not-found">
      <a className="brand" href="/" aria-label="VeilPass home"><img src="/veilpass-mark.png" alt="" width="42" height="42" /><span>VEILPASS</span></a>
      <div>
        <span className="not-found-code">404</span>
        <h1>This proof path does not exist.</h1>
        <p>Return to VeilPass to create a private eligibility proof.</p>
        <a className="header-cta" href="/">Back to VeilPass</a>
      </div>
    </main>
  )
}

function App() {
  const [view, setView] = useState<AppView>('create')
  const [birthYear, setBirthYear] = useState('1998')
  const [proofState, setProofState] = useState<ProofState>('idle')
  const [proof, setProof] = useState<PublicProof | null>(null)
  const [proofs, setProofs] = useState<PublicProof[]>([])
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    const fromHash = window.location.hash.replace('#', '') as AppView
    if (['create', 'verify', 'activity'].includes(fromHash)) setView(fromHash)
  }, [])

  useEffect(() => {
    if (view !== 'create' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      }),
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [view])

  const changeView = (next: AppView) => {
    setView(next)
    window.history.replaceState(null, '', `#${next}`)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const scrollToSection = (id: string) => {
    if (view !== 'create') changeView('create')
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const startProof = () => {
    if (view !== 'create') changeView('create')
    window.setTimeout(() => {
      document.getElementById('proof-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => document.getElementById('birth-year')?.focus({ preventScroll: true }), 700)
    }, 0)
  }

  const createProof = async () => {
    setProofState('creating')
    setCopyStatus('idle')
    try {
      const [created] = await Promise.all([
        createEligibilityProof({ birthYear: Number(birthYear), issuer: 'Civic Registry' }),
        new Promise((resolve) => window.setTimeout(resolve, 780)),
      ])
      setProof(created)
      setProofs((current) => [created, ...current.filter((item) => item.id !== created.id)])
      setProofState('ready')
    } catch {
      setProofState('error')
    }
  }

  const copyVerificationLink = async () => {
    if (!proof) return
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable.')
      await Promise.race([
        navigator.clipboard.writeText(proof.verificationLink),
        new Promise((_, reject) =>
          window.setTimeout(() => reject(new Error('Clipboard access timed out.')), 700),
        ),
      ])
      setCopyStatus('copied')
      window.setTimeout(() => setCopyStatus('idle'), 2400)
    } catch {
      setCopyStatus('error')
    }
  }

  if (window.location.pathname !== '/') return <NotFound />

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header
        view={view}
        onChange={changeView}
        onStartProof={startProof}
        onHowItWorks={() => scrollToSection('how-it-works')}
      />

      {view === 'create' && (
        <main id="main-content" className="create-view">
          <section className="hero-section section-shell" aria-labelledby="hero-heading">
            <div className="hero-copy">
              <h1 id="hero-heading">Prove eligibility without giving away identity.</h1>
              <p>Turn a private credential into a locally sealed yes or no receipt. Your birth year stays on this device.</p>
              <div className="hero-actions">
                <button className="primary-action hero-primary" type="button" onClick={startProof}><Icon name="shield" />Create a private proof</button>
                <button className="text-action" type="button" onClick={() => scrollToSection('how-it-works')}>See how it works <Icon name="arrowRight" /></button>
              </div>
              <p className="proof-signal"><Icon name="shield" />Compact 0.31.1 <span>·</span> 1 compiled circuit <span>·</span> 8 security and privacy tests</p>
            </div>

            <div className="hero-aperture" aria-label="Private fields are converted into a public proof receipt">
              <div className="hero-private-fields">
                <span><Icon name="user" /><span><small>Birth year</small><strong>1998</strong></span></span>
                <span><Icon name="shield" /><span><small>Issuer</small><strong>Civic Registry</strong></span></span>
                <span><Icon name="verify" /><span><small>Policy</small><strong>Age is 18 or older</strong></span></span>
              </div>
              <div className="hero-seal"><Icon name="check" /><strong>PROOF SEALED</strong><span>PUBLIC RECEIPT READY</span></div>
              <div className="hero-public-flow"><span>PUBLIC PROOF</span><Icon name="arrowRight" /></div>
            </div>
          </section>

          <section id="proof-lab" className="proof-lab" data-reveal aria-labelledby="proof-lab-heading">
            <div className="proof-lab-heading section-shell">
              <h2 id="proof-lab-heading">A privacy boundary you can inspect.</h2>
              <p>Private facts enter on the left. Only the policy result leaves on the right.</p>
            </div>
            <div className="proof-workspace section-shell">
              <ProofForm
                isCreating={proofState === 'creating'}
                birthYear={birthYear}
                onBirthYearChange={setBirthYear}
                onSubmit={createProof}
              />
              <PrivacyAperture birthYear={birthYear} proof={proof} state={proofState} />
              <ProofReceipt
                proof={proof}
                state={proofState}
                copyStatus={copyStatus}
                onCopy={copyVerificationLink}
              />
            </div>

            <div className="section-shell"><TechStrip proof={proof} />
              <p className="prototype-note">The policy runs locally in this browser. Preprod proof generation still requires a wallet, deployed contract and proof server.</p>
            </div>
          </section>

          <LandingSections onStartProof={startProof} />
        </main>
      )}

      {view === 'verify' && <div id="main-content"><VerifyPanel proofs={proofs} /></div>}
      {view === 'activity' && <div id="main-content"><ActivityPanel proofs={proofs} onCreate={startProof} /></div>}
    </div>
  )
}

export default App
