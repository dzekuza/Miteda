import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Tabs, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'
import { toSlug } from './Specialistas.jsx'

const RESIDENTS = [
  { slug: 'lukas-petrauskas', name: 'Lukas Petrauskas', role: 'Savininkas', apt: 'B-12', phone: '+370 612 34567', email: 'l.petrauskas@gmail.com' },
  { slug: 'greta-janusiene', name: 'Greta Janušienė', role: 'Savininkė', apt: 'A-4', phone: '+370 600 22113', email: 'g.janusiene@gmail.com' },
  { slug: 'mantas-simkus', name: 'Mantas Šimkus', role: 'Nuomininkas', apt: 'C-21', phone: '+370 633 88221', email: 'm.simkus@gmail.com' },
  { slug: 'ruta-kazlauskaite', name: 'Rūta Kazlauskaitė', role: 'Savininkė', apt: 'A-7', phone: '+370 644 55009', email: 'r.kazlauskaite@gmail.com' },
  { slug: 'tomas-petraitis', name: 'Tomas Petraitis', role: 'Savininkas', apt: 'B-9', phone: '+370 655 11447', email: 't.petraitis@gmail.com' },
]

function EditModal({ value, onChange, onSave, onClose, isNew }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Button, Avatar, Input } = DS
  return (
    <Modal title={isNew ? 'Naujas kontaktas' : 'Redaguoti kontaktą'} onClose={onClose} width={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!isNew && <div className="rowflex" style={{ gap: 12 }}><Avatar name={value.name || '?'} size={48} /><span className="muted" style={{ fontSize: 'var(--text-small)' }}>{value.cat}</span></div>}
        <Input label="Vardas ir pavardė" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        <Input label="Pareigos" value={value.role} onChange={(e) => onChange({ ...value, role: e.target.value })} />
        <Input label="Įmonė" value={value.company} onChange={(e) => onChange({ ...value, company: e.target.value })} />
        <div className="field" style={{ margin: 0 }}>
          <label>Kategorija</label>
          <select value={value.cat} onChange={(e) => onChange({ ...value, cat: e.target.value })}>
            {MD.contactCats.filter((c) => c !== 'Visi').map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Telefonas" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        <Input label="El. paštas" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
        <div className="rowflex" style={{ gap: 10, marginTop: 4 }}>
          <Button variant="accent" iconLeft="ph ph-check" onClick={onSave} fullWidth>Išsaugoti</Button>
        </div>
      </div>
    </Modal>
  )
}

const TABS = [
  { key: 'visi', label: 'Visi' },
  { key: 'specialistai', label: 'Specialistai' },
  { key: 'gyventojai', label: 'Gyventojai' },
]

export default function Kontaktai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Avatar, Badge } = DS
  const navigate = useNavigate()

  const blank = { name: '', role: '', company: '', cat: 'Administracija', phone: '', email: '' }

  const [listData, refresh] = useRepo('listContacts')
  const list = listData || []
  const [tab, setTab] = useState('visi')
  const [cat, setCat] = useState('Visi')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(blank)

  const shownSpecialists = cat === 'Visi' ? list : list.filter((c) => c.cat === cat)
  const total = (tab === 'visi' ? list.length + RESIDENTS.length : tab === 'specialistai' ? list.length : RESIDENTS.length)

  const openEdit = (c, i) => { setEditing(i); setDraft({ ...c }) }
  const openNew = () => { setEditing('new'); setDraft({ ...blank, cat: cat === 'Visi' ? 'Administracija' : cat }) }
  const save = () => {
    if (!draft.name.trim()) return
    repo.saveContact(draft, editing === 'new' ? null : editing).then(() => { refresh(); setEditing(null) })
  }

  return (
    <Shell role="admin" nav="kontaktai"
      title="Kontaktai" subtitle="Pagrindinis specialistų ir paslaugų teikėjų katalogas."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus" onClick={openNew}>Naujas kontaktas</Button>}>
      <Card>
        <PanelHead title="Visi kontaktai" subtitle={`${total} įrašai`}
          action={<Tabs tabs={TABS} value={tab} onChange={setTab} />} />
        <div className="stack-sm" style={{ gap: 4 }}>
          {(tab === 'visi' || tab === 'specialistai') && shownSpecialists.map((c) => {
            const i = list.indexOf(c)
            return (
              <div key={`s-${i}`} className="row" style={{ cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}
                onClick={() => navigate(`/admin/specialistas/${toSlug(c.name)}`)}>
                <Avatar name={c.name} size={40} />
                <div className="row__main"><span className="row__title">{c.name}</span><span className="row__meta">{c.role}<span className="dot">·</span>{c.company}</span></div>
                <Badge tone="neutral">{c.cat}</Badge>
                <span className="muted" style={{ fontSize: 'var(--text-small)', minWidth: 120, textAlign: 'right' }}>{c.phone}</span>
                <IconButton icon="ph ph-pencil-simple" variant="ghost" size="sm" ariaLabel="Redaguoti"
                  onClick={(e) => { e.stopPropagation(); openEdit(c, i) }} />
              </div>
            )
          })}
          {(tab === 'visi' || tab === 'gyventojai') && RESIDENTS.map((r) => (
            <div key={r.slug} className="row" style={{ cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}
              onClick={() => navigate(`/admin/gyventojas/${r.slug}`)}>
              <Avatar name={r.name} size={40} />
              <div className="row__main">
                <span className="row__title">{r.name}</span>
                <span className="row__meta">Butas {r.apt}<span className="dot">·</span>{r.phone}</span>
              </div>
              <Badge tone={r.role === 'Nuomininkas' ? 'neutral' : 'success'}>{r.role}</Badge>
              <IconButton icon="ph ph-arrow-right" variant="ghost" size="sm" ariaLabel="Peržiūrėti"
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/gyventojas/${r.slug}`) }} />
            </div>
          ))}
        </div>
      </Card>
      {editing !== null && <EditModal value={draft} onChange={setDraft} onSave={save} onClose={() => setEditing(null)} isNew={editing === 'new'} />}
    </Shell>
  )
}
