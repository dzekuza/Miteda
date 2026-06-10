import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, StatusBadge } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'

const ST = MD.contractStatuses

export default function Sutartys() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  function ContractCard({ c, onSign }) {
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
          <IconButton icon="ph ph-dots-three" variant="outline" ariaLabel="Daugiau" />
        </div>
      </Card>
    )
  }

  const [contractsData, refresh] = useRepo('listContracts')
  const contracts = contractsData || []
  const sign = (svc) => repo.signContract(svc).then(refresh)
  const pending = contracts.filter((c) => c.status !== 'signed').length
  const monthly = contracts.reduce((s, c) => s + (parseFloat(String(c.sum).replace(/[^\d.,]/g, '').replace(',', '.')) || 0), 0)

  return (
    <Shell role="gyventojas" nav="sutartys"
      title="Paslaugų sutartys" subtitle="Su jūsų butu susietos komunalinių paslaugų sutartys.">
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-file-text" label="Sutartys" value={contracts.length} />
          <Stat icon="ph ph-clock" label="Laukia veiksmo" value={pending} />
          <Stat icon="ph ph-wallet" label="Iš viso per mėn." value={'€' + monthly.toFixed(2)} />
        </div>
        <Card>
          <PanelHead title="Sutartys" subtitle="Pasirašykite arba patvirtinkite susitarimus" />
          <div className="grid-2">
            {contracts.map((c, i) => <ContractCard key={i} c={c} onSign={sign} />)}
          </div>
        </Card>
      </div>
    </Shell>
  )
}
