import { Icon, type IconName } from './Icon'
import { TaglineReveal } from './TaglineReveal'

interface LandingSectionsProps {
  onStartProof: () => void
}

const privateFields: Array<{ icon: IconName; label: string }> = [
  { icon: 'user', label: 'Name' },
  { icon: 'credential', label: 'Document number' },
  { icon: 'calendar', label: 'Date of birth' },
  { icon: 'credential', label: 'Full credential' },
]

const publicFields: Array<{ icon: IconName; label: string }> = [
  { icon: 'shield', label: 'Policy' },
  { icon: 'check', label: 'Result' },
  { icon: 'verify', label: 'Issuer verified' },
  { icon: 'hash', label: 'Proof ID' },
]

const steps = [
  {
    icon: 'user' as IconName,
    title: 'Enter a private fact',
    body: 'Choose a test credential, issuer state and policy. The birth year enters the private witness.',
  },
  {
    icon: 'shield' as IconName,
    title: 'Execute the Compact circuit',
    body: 'Generated contract code evaluates the witness and writes only the disclosed receipt fields.',
  },
  {
    icon: 'send' as IconName,
    title: 'Authenticate the minimum',
    body: 'The verifier matches the policy, result, issuer status and proof ID to the local Compact ledger.',
  },
]

const evidence = [
  { icon: 'code' as IconName, label: 'Compact toolchain', value: '0.31.1' },
  { icon: 'shield' as IconName, label: 'Generated circuit', value: 'Browser active' },
  { icon: 'check' as IconName, label: 'Verifier', value: 'Fail closed' },
  { icon: 'hash' as IconName, label: 'Ledger', value: 'Local Compact' },
]

const faqs = [
  {
    question: 'Is this connected to Midnight Preprod?',
    answer: 'Not yet. The browser executes the generated Compact 0.31.1 contract locally. Preprod still requires Lace, a proof server and a deployed contract address.',
  },
  {
    question: 'What stays private?',
    answer: 'The credential choice and birth year remain in the browser session and are never included in the public receipt.',
  },
  {
    question: 'What becomes public?',
    answer: 'Only the selected policy, its yes or no result, issuer verification status and the Compact-derived proof ID.',
  },
  {
    question: 'Does VeilPass upload my credential?',
    answer: 'No. The test credential is supplied to an in-memory Compact witness. This Wave 1 build has no account, backend or upload step.',
  },
  {
    question: 'What is needed for production?',
    answer: 'A funded Lace wallet, a deployed contract address, proof server infrastructure and the Midnight.js adapter.',
  },
  {
    question: 'Can the policy support more than age?',
    answer: 'Yes. The same pattern can express membership, jurisdiction or access rules with purpose built Compact circuits.',
  },
]

export function LandingSections({ onStartProof }: LandingSectionsProps) {
  return (
    <>
      <section className="comparison-section section-shell" data-reveal aria-labelledby="comparison-heading">
        <div className="section-intro">
          <h2 id="comparison-heading">Identity checks ask for too much.</h2>
          <p>A verifier usually needs one answer, not a copy of your identity. VeilPass separates the fact being checked from the data used to prove it.</p>
        </div>

        <div className="comparison-rail">
          <div className="comparison-column private-column">
            <h3><Icon name="shield" />Traditional check</h3>
            {privateFields.map((field) => <div className="comparison-row" key={field.label}><Icon name={field.icon} /><span>{field.label}</span></div>)}
            <p><span className="legend-dot private-dot" />Private fields, not shared</p>
          </div>
          <div className="boundary-marker" aria-hidden="true"><span>‹</span><span>›</span></div>
          <div className="comparison-column public-column">
            <h3><Icon name="shield" />VeilPass receipt</h3>
            {publicFields.map((field) => <div className="comparison-row" key={field.label}><Icon name={field.icon} /><span>{field.label}</span></div>)}
            <p><span className="legend-dot public-dot" />Public fields, shared</p>
          </div>
        </div>
      </section>

      <TaglineReveal />

      <section id="how-it-works" className="steps-section section-shell" data-reveal aria-labelledby="steps-heading">
        <h2 id="steps-heading">From private fact to public receipt.</h2>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="step-icon"><Icon name={step.icon} /></span>
              <span className="step-copy"><strong>{step.title}</strong><span>{step.body}</span></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="evidence-section section-shell" data-reveal aria-labelledby="evidence-heading">
        <h2 id="evidence-heading">Built so the boundary is visible.</h2>
        <div className="evidence-strip">
          {evidence.map((item) => (
            <div className="evidence-item" key={item.label}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        <p className="evidence-note">This is not a handwritten policy mock. The browser imports the compiler-generated contract binding, executes <span className="mono">createEligibilityProof</span> and reads the resulting public Compact ledger entry. Network proof generation remains the next milestone.</p>
      </section>

      <section className="faq-section section-shell" data-reveal aria-labelledby="faq-heading">
        <h2 id="faq-heading">Questions before you prove.</h2>
        <dl className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.question}>
              <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
              <dt>{faq.question}</dt>
              <dd>{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="final-cta" data-reveal aria-labelledby="final-cta-heading">
        <div>
          <h2 id="final-cta-heading">Prove only what matters.</h2>
          <p>Try the privacy boundary in your browser. No account. No upload.</p>
        </div>
        <button type="button" onClick={onStartProof}>Create a private proof</button>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span><img src="/veilpass-mark.png" alt="" width="40" height="40" />VEILPASS</span>
            <p>Selective disclosure for everyday eligibility.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#privacy-note">Privacy</a>
            <a href="#terms-note">Terms</a>
            <a href="https://github.com/himanshu748/veilpass" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG" target="_blank" rel="noreferrer">AKINDO submission</a>
          </nav>
        </div>
        <div className="legal-notes">
          <p id="privacy-note"><strong>Privacy:</strong> Private form values enter an in-memory Compact witness and are not written to the public receipt. VeilPass has no account, backend or upload step in this Wave 1 build.</p>
          <p id="terms-note"><strong>Terms:</strong> This is a Midnight Buildathon prototype for evaluation and is not a production identity service.</p>
        </div>
        <p className="footer-note">Midnight Buildathon prototype</p>
      </footer>
    </>
  )
}
