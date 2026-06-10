import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, StatusBadge, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'

const ST = MD.contractStatuses

export default function Sutartys() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  function ContractCard({ c, onSign, onMore }) {
    const needsAction = c.status === 'pending' || c.status === 'action'
    return (
      <Card tone="flat" style={{ display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 'var(--radius-md)' }}>
        <div className="between">
          <div className="rowflex">
            <span className="tile lg tile--green"><i className={c.icon} aria-hidden="true" /></span>
            <div>
              <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.svc}</div>
              <div className="muted" style={{ fontSize: 'var(--text-body)' }}>{c.provider}</div>
            </div>
          </div>
          <StatusBadge map={ST} value={c.status} />
        </div>
        <div className="between" style={{ paddingTop: 14, borderTop: '1px solid var(--line-100)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="muted" style={{ fontSize: 'var(--text-small)' }}>Sutarties Nr.</span>
            <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.num}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
            <span className="muted" style={{ fontSize: 'var(--text-small)' }}>Mėnesio mokestis</span>
            <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.sum}</span>
          </div>
        </div>
        <div className="rowflex" style={{ gap: 8 }}>
          {needsAction
            ? <Button variant="accent" iconLeft="ph ph-signature" onClick={() => onSign(c.svc)} fullWidth>{c.status === 'action' ? 'Patvirtinti' : 'Pasirašyti'}</Button>
            : <Button variant="secondary" iconLeft="ph ph-file-arrow-down" fullWidth>Peržiūrėti sutartį</Button>}
          <IconButton icon="ph ph-dots-three" variant="outline" ariaLabel="Daugiau" onClick={() => onMore(c)} />
        </div>
      </Card>
    )
  }

  function ContractMoreModal({ c, onClose }) {
    const actions = [
      { icon: 'ph ph-file-arrow-down', label: 'Atsisiųsti sutartį' },
      { icon: 'ph ph-phone', label: 'Skambinti tiekėjui' },
      { icon: 'ph ph-envelope', label: 'Rašyti tiekėjui' },
      { icon: 'ph ph-x-circle', label: 'Nutraukti sutartį', danger: true },
    ]
    return (
      <Modal title={c.svc} subtitle={c.provider + ' · ' + c.num} onClose={onClose} width={400}>
        <div className="stack-sm" style={{ gap: 4 }}>
          {actions.map((a) => (
            <button key={a.label} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 4px',
              background: 'none', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: a.danger ? 'var(--orange)' : 'var(--ink-800)', fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-body)', textAlign: 'left',
            }}>
              <i className={a.icon} style={{ fontSize: 20, width: 24, flexShrink: 0 }} aria-hidden="true" />
              {a.label}
            </button>
          ))}
        </div>
      </Modal>
    )
  }

  const [contractsData, refresh] = useRepo('listContracts')
  const contracts = contractsData || []
  const [more, setMore] = React.useState(null)
  const sign = (svc) => repo.signContract(svc).then(refresh)
  const pending = contracts.filter((c) => c.status !== 'signed').length
  const monthly = contracts.reduce((s, c) => s + (parseFloat(String(c.sum).replace(/[^\d.,]/g, '').replace(',', '.')) || 0), 0)

  return (
    <Shell role="gyventojas" nav="sutartys"
      title="Paslaugų sutartys" subtitle="Su jūsų butu susietos komunalinių paslaugų sutartys.">
      <div className="content stack">
        <div className="grid-3">
          <Stat label="Sutartys" value={contracts.length} />
          <Stat label="Laukia veiksmo" value={pending} />
          <Stat label="Iš viso per mėn." value={'€' + monthly.toFixed(2)} />
        </div>
        <Card>
          <PanelHead title="Sutartys" subtitle="Pasirašykite arba patvirtinkite susitarimus" />
          <div className="grid-2">
            {contracts.map((c, i) => <ContractCard key={i} c={c} onSign={sign} onMore={setMore} />)}
          </div>
        </Card>
      </div>
      {more && <ContractMoreModal c={more} onClose={() => setMore(null)} />}
    </Shell>
  )
}
