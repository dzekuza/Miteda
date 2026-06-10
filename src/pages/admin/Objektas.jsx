import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Tabs, PhotoTile } from '../../shared/UI.jsx'

export default function Objektas() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Badge, Avatar, Checkbox } = DS

  const [searchParams] = useSearchParams()
  const idx = +(searchParams.get('b') || 0)

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
    const [units, setUnits] = useState(() => makeUnits(P))
    const [sel, setSel] = useState({})
    const selCount = Object.values(sel).filter(Boolean).length
    const markSold = () => { setUnits((us) => us.map((u, i) => sel[i] ? { ...u, st: 'sold' } : u)); setSel({}) }
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
              <th style={{ width: 36 }}></th><th>Butas</th><th>Aukštas</th><th>Plotas</th><th>Būsena</th><th></th>
            </tr></thead>
            <tbody>
              {units.map((u, i) => (
                <tr key={i}>
                  <td><Checkbox checked={!!sel[i]} onChange={(v) => setSel({ ...sel, [i]: v })} /></td>
                  <td className="tbl__id">{u.id}</td>
                  <td>{u.floor} a.</td>
                  <td>{u.area} m²</td>
                  <td><Badge tone={UNIT_STATUS[u.st].tone}>{UNIT_STATUS[u.st].label}</Badge></td>
                  <td style={{ textAlign: 'right' }}><IconButton icon="ph ph-pencil-simple" variant="ghost" size="sm" ariaLabel="Redaguoti" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function ResidentsTab() {
    const residents = [
      { name: 'Lukas Petrauskas', apt: 'B-12', role: 'Savininkas', phone: '+370 612 34567' },
      { name: 'Greta Janušienė', apt: 'A-4', role: 'Savininkė', phone: '+370 600 22113' },
      { name: 'Mantas Šimkus', apt: 'C-21', role: 'Nuomininkas', phone: '+370 633 88221' },
      { name: 'Rūta Kazlauskaitė', apt: 'A-7', role: 'Savininkė', phone: '+370 644 55009' },
      { name: 'Tomas Petraitis', apt: 'B-9', role: 'Savininkas', phone: '+370 655 11447' },
    ]
    return (
      <div className="stack-sm" style={{ gap: 10 }}>
        {residents.map((r, i) => (
          <div key={i} className="row">
            <Avatar name={r.name} size={40} />
            <div className="row__main"><span className="row__title">{r.name}</span><span className="row__meta">Butas {r.apt}<span className="dot">·</span>{r.phone}</span></div>
            <Badge tone={r.role === 'Nuomininkas' ? 'neutral' : 'success'}>{r.role}</Badge>
            <IconButton icon="ph ph-dots-three" variant="ghost" size="sm" ariaLabel="Daugiau" />
          </div>
        ))}
      </div>
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
    const [contactsData] = useRepo('listContacts')
    const contacts = contactsData || []
    return (
      <div className="grid-2">
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
