import type { AppView } from '../types'
import { Icon, type IconName } from './Icon'

const navItems: Array<{ id: AppView; label: string; icon: IconName }> = [
  { id: 'verify', label: 'Verify', icon: 'verify' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
]

interface HeaderProps {
  view: AppView
  onChange: (view: AppView) => void
  onStartProof: () => void
  onHowItWorks: () => void
}

export function Header({ view, onChange, onStartProof, onHowItWorks }: HeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="#create" onClick={() => onChange('create')} aria-label="VeilPass home">
        <img src="/veilpass-mark.png" alt="" width="42" height="42" />
        <span>VEILPASS</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <button className="nav-item" type="button" onClick={onHowItWorks} aria-label="How it works" title="How it works">
          <Icon name="proof" />
          <span>How it works</span>
        </button>
        {navItems.map((item) => (
          <button
            className={view === item.id ? 'nav-item is-active' : 'nav-item'}
            type="button"
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-current={view === item.id ? 'page' : undefined}
            aria-label={item.label}
            title={item.label}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="runtime-status" title="The generated Compact 0.31.1 contract executes locally and writes to an in-memory Compact ledger.">
          <span className="status-dot" />
          <span>Compact runtime active</span>
        </div>
        <button className="header-cta" type="button" onClick={onStartProof}>Create a private proof</button>
      </div>
    </header>
  )
}
