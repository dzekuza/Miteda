import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Tabs, PhotoTile, Modal, Composer } from '../../shared/UI.jsx'

const UNIT_STATUS = {
  sold: { label: 'Parduotas', tone: 'success' },
  reserved: { label: 'Rezervuotas', tone: 'event' },
  free: { label: 'Laisvas', tone: 'neutral' },
}

function makeUnits(P) {
  const list = []
  const floors = Math.ceil(P.units / 4)
  let n = 0
  for (let f = 1; f <= floors && n < P.units; f++) {
    for (let a = 1; a <= 4 && n < P.units; a++) {
      const st = n < P.sold ? 'sold' : (n < P.sold + 3 ? 'reserved' : 'free')
      list.push({ id: `${String.fromCharCode(64 + ((f - 1) % 3) + 1)}-${f}${a}`, floor: f, area: 42 + (a * 11), st })
      n++
    }
  }
  return list
}

function UnitsTab({ P }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Button, IconButton, Badge, Checkbox } = DS

  const [units, setUnits] = useState(() => makeUnits(P))
  const [sel, setSel] = useState({})
  const [editing, setEditing] = useState(null)

  const selCount = Object.values(sel).filter(Boolean).length
  const allSelected = units.length > 0 && selCount === units.length
  const toggleAll = () => {
    if (allSelected) {
      setSel({})
    } else {
      const all = {}
      units.forEach((_, i) => { all[i] = true })
      setSel(all)
    }
  }
  const markSold = () => { setUnits((us) => us.map((u, i) => sel[i] ? { ...u, st: 'sold' } : u)); setSel({}) }
  const saveEdit = (st) => { setUnits((us) => us.map((u, i) => i === editing.idx ? { ...u, st } : u)); setEditing(null) }

  return (
    <div>
      {selCount > 0 && (
        <div className="between" style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--brand-green-faint)' }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Pažymėta {selCount} butų</span>
          <div className="rowflex" style={{ gap: 8 }}>
            <Button variant="accent" size="sm" iconLeft="ph ph-check" onClick={markSold}>Pažymėti parduotais</Button>
            <Button variant="ghost" size="sm" onClick={() => setSel({})}>Atšaukti</Button>
          </div>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr>
            <th style={{ width: 36 }}><Checkbox checked={allSelected} onChange={toggleAll} /></th><th>Butas</th><th>Aukštas</th><th>Plotas</th><th>Būsena</th><th></th>
          </tr></thead>
          <tbody>
            {units.map((u, i) => (
              <tr key={i}>
                <td><Checkbox checked={!!sel[i]} onChange={(v) => setSel({ ...sel, [i]: v })} /></td>
                <td className="tbl__id">{u.id}</td>
                <td>{u.floor} a.</td>
                <td>{u.area} m²</td>
                <td><Badge tone={UNIT_STATUS[u.st].tone}>{UNIT_STATUS[u.st].label}</Badge></td>
                <td style={{ textAlign: 'right' }}><IconButton icon="ph ph-pencil-simple" variant="ghost" size="sm" ariaLabel="Redaguoti" onClick={() => setEditing({ idx: i, unit: u })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <Modal title={`Butas ${editing.unit.id}`} subtitle={`${editing.unit.floor} aukštas · ${editing.unit.area} m²`} onClose={() => setEditing(null)} width={360}>
          <div className="stack-sm" style={{ gap: 4 }}>
            {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
              <button key={key} onClick={() => saveEdit(key)} style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 4px',
                background: 'none', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                color: editing.unit.st === key ? 'var(--brand-green-strong)' : 'var(--ink-800)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', textAlign: 'left',
                fontWeight: editing.unit.st === key ? 'var(--fw-medium)' : undefined,
              }}>
                <Badge tone={tone}>{label}</Badge>
                {editing.unit.st === key && <i className="ph ph-check" style={{ marginLeft: 'auto', fontSize: 16 }} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  )
}

function ResidentsTab() {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, IconButton } = DS

  const residents = [
    { name: 'Lukas Petrauskas', apt: 'B-12', role: 'Savininkas', phone: '+370 612 34567' },
    { name: 'Greta Janušienė', apt: 'A-4', role: 'Savininkė', phone: '+370 600 22113' },
    { name: 'Mantas Šimkus', apt: 'C-21', role: 'Nuomininkas', phone: '+370 633 88221' },
    { name: 'Rūta Kazlauskaitė', apt: 'A-7', role: 'Savininkė', phone: '+370 644 55009' },
    { name: 'Tomas Petraitis', apt: 'B-9', role: 'Savininkas', phone: '+370 655 11447' },
  ]
  const [selected, setSelected] = useState(null)
  const actions = [
    { icon: 'ph ph-pencil-simple', label: 'Redaguoti gyventoją' },
    { icon: 'ph ph-chat-circle', label: 'Siųsti žinutę' },
    { icon: 'ph ph-phone', label: 'Skambinti' },
    { icon: 'ph ph-user-minus', label: 'Pašalinti iš pastato', danger: true },
  ]
  return (
    <>
      <div className="stack-sm" style={{ gap: 4 }}>
        {residents.map((r, i) => (
          <div key={i} className="row">
            <Avatar name={r.name} size={40} />
            <div className="row__main"><span className="row__title">{r.name}</span><span className="row__meta">Butas {r.apt}<span className="dot">·</span>{r.phone}</span></div>
            <Badge tone={r.role === 'Nuomininkas' ? 'neutral' : 'success'}>{r.role}</Badge>
            <IconButton icon="ph ph-dots-three" variant="ghost" size="sm" ariaLabel="Daugiau" onClick={() => setSelected(r)} />
          </div>
        ))}
      </div>
      {selected && (
        <Modal title={selected.name} subtitle={`Butas ${selected.apt} · ${selected.role}`} onClose={() => setSelected(null)} width={380}>
          <div className="stack-sm" style={{ gap: 4 }}>
            {actions.map((a) => (
              <button key={a.label} onClick={() => setSelected(null)} style={{
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
      )}
    </>
  )
}

function PhotosTab() {
  const cols = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b', '#aeb8a0', '#a0aeb8']
  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {Array.from({ length: 12 }).map((_, i) => <PhotoTile key={i} color={cols[i % cols.length]} />)}
    </div>
  )
}

function ContactsTab() {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, IconButton } = DS

  const [contactsData] = useRepo('listContacts')
  const contacts = contactsData || []
  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      {contacts.slice(0, 4).map((c, i) => (
        <div key={i} className="row">
          <Avatar name={c.name} size={40} />
          <div className="row__main"><span className="row__title">{c.name}</span><span className="row__meta">{c.role}<span className="dot">·</span>{c.company}</span></div>
          <IconButton icon="ph ph-phone" variant="solid" size="sm" ariaLabel="Skambinti" />
        </div>
      ))}
    </div>
  )
}

export default function Objektas() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button } = DS

  const [searchParams] = useSearchParams()
  const idx = +(searchParams.get('b') || 0)

  const [tab, setTab] = useState('units')
  const [propsData] = useRepo('listProperties')
  const props = propsData || []
  const P = props[idx] || props[0]
  if (!P) return null
  const pct = Math.round((P.sold / P.units) * 100)
  const tabs = [
    { key: 'units', label: 'Butai', count: P.units },
    { key: 'residents', label: 'Gyventojai' },
    { key: 'photos', label: 'Nuotraukos' },
    { key: 'contacts', label: 'Kontaktai' },
  ]

  return (
    <Shell role="admin" nav="objektai"
      title={P.name} subtitle={P.address}
      headerActions={<Link className="plain" to="/admin/objektai"><Button variant="secondary" iconLeft="ph ph-arrow-left">Į objektus</Button></Link>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-door" label="Butai" value={P.units} />
          <Stat icon="ph ph-check-circle" label="Parduota" value={P.sold + ' (' + pct + '%)'} accent />
          <Stat icon="ph ph-users-three" label="Gyventojai" value={P.sold} />
        </div>
        <Card>
          <PanelHead title="Pastato valdymas" action={<Tabs tabs={tabs} value={tab} onChange={setTab} />} />
          {tab === 'units' && <UnitsTab P={P} />}
          {tab === 'residents' && <ResidentsTab />}
          {tab === 'photos' && <PhotosTab />}
          {tab === 'contacts' && <ContactsTab />}
        </Card>
      </div>
    </Shell>
  )
}
