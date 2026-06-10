import React, { useState } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, FilterChips, StatusBadge, Modal } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

export default function Defektai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, KeyRow } = DS

  const ST = MD.defectStatuses

  const [b, setB] = useState('Visi')
  const [s, setS] = useState('Visos')
  const [selected, setSelected] = useState(null)
  const [adRaw] = useRepo('listAdminDefects')
  const adminDefects = adRaw || []
  const buildings = ['Visi', ...new Set(adminDefects.map((d) => d.building))]
  const SMAP = { 'Atviras': 'open', 'Vykdoma': 'progress', 'Išspręsta': 'resolved' }
  let rows = adminDefects
  if (b !== 'Visi') rows = rows.filter((d) => d.building === b)
  if (s !== 'Visos') rows = rows.filter((d) => d.status === SMAP[s])
  const counts = {
    open: adminDefects.filter((d) => d.status === 'open').length,
    progress: adminDefects.filter((d) => d.status === 'progress').length,
    resolved: adminDefects.filter((d) => d.status === 'resolved').length,
  }

  return (
    <Shell role="admin" nav="defektai"
      title="Defektai" subtitle="Visi pranešimai apie defektus iš visų objektų."
      headerActions={<Button variant="secondary" iconLeft="ph ph-export">Eksportuoti</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-warning-octagon" label="Atviri" value={counts.open} />
          <Stat icon="ph ph-spinner" label="Vykdoma" value={counts.progress} />
          <Stat icon="ph ph-check-circle" label="Išspręsta" value={counts.resolved} accent />
        </div>
        <Card>
          <PanelHead title="Visi defektai" subtitle="Filtruokite pagal objektą ir būseną"
            action={<FilterChips items={['Visos', 'Atviras', 'Vykdoma', 'Išspręsta']} value={s} onChange={setS} />} />
          <div style={{ marginBottom: 16 }}><FilterChips items={buildings} value={b} onChange={setB} /></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead><tr>
                <th>ID</th><th>Problema</th><th>Butas</th><th>Objektas</th><th>Pateikė</th><th>Data</th><th>Būsena</th><th></th>
              </tr></thead>
              <tbody>
                {rows.map((d, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(d)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(d)}
                    tabIndex={0}>
                    <td className="tbl__id">{d.id}</td>
                    <td style={{ color: 'var(--ink-900)' }}>{d.title}</td>
                    <td>{d.apt}</td>
                    <td>{d.building}</td>
                    <td>{d.author}</td>
                    <td className="muted">{d.date}</td>
                    <td><StatusBadge map={ST} value={d.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <IconButton icon="ph ph-arrow-up-right" variant="ghost" size="sm" ariaLabel="Atidaryti"
                        onClick={(e) => { e.stopPropagation(); setSelected(d) }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="sec-sub" style={{ padding: '16px' }}>Nėra defektų pagal pasirinktus filtrus.</p>}
          </div>
        </Card>
      </div>
      {selected && (
        <Modal title={selected.title} subtitle={selected.id} onClose={() => setSelected(null)} width={480}>
          <div className="stack" style={{ gap: 0 }}>
            {[
              { label: 'Objektas', value: selected.building },
              { label: 'Butas', value: selected.apt },
              { label: 'Pateikė', value: selected.author },
              { label: 'Data', value: selected.date },
              { label: 'Būsena', value: <StatusBadge map={ST} value={selected.status} /> },
              ...(selected.description ? [{ label: 'Aprašymas', value: selected.description }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line-100)' }}>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>{label}</span>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)', fontWeight: 'var(--fw-medium)' }}>{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </Shell>
  )
}
