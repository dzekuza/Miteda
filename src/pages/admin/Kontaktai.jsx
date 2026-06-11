import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Tabs, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'
import { toSlug } from './Specialistas.jsx'

const PROPERTIES = MD.properties.map((p) => p.name)

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
    <Modal title={isNew ? 'Naujas kontaktas' : 'Redaguoti kontaktą'} subtitle={isNew ? 'Pridėti naują specialistą ar paslaugų teikėją.' : 'Atnaujinkite kontakto informaciją.'} onClose={onClose} width={480}>
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
  const { Button, IconButton, Avatar, Badge } = DS
  const navigate = useNavigate()

  const blank = { name: '', role: '', company: '', cat: 'Administracija', phone: '', email: '' }

  const [listData, refresh] = useRepo('listContacts')
  const list = listData || []
  const [tab, setTab] = useState('visi')
  const [cat, setCat] = useState('Visi')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(blank)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedObjektas, setSelectedObjektas] = useState(null)

  const toggleObjektas = (name) => setSelectedObjektas((prev) => (prev === name ? null : name))

  const shownSpecialists = list.filter((c) => {
    if (cat !== 'Visi' && c.cat !== cat) return false
    if (selectedObjektas && !(c.objektai || []).includes(selectedObjektas)) return false
    if (search) {
      const q = search.toLowerCase()
      return c.name.toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q)
    }
    return true
  })
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
      <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--line-100)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)' }}>
        <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', flexShrink: 0 }}>
          <div style={{ padding: '20px 24px 0' }}>
            <PanelHead title="Visi kontaktai" subtitle={`${total} įrašai`}
              action={<Tabs tabs={TABS} value={tab} onChange={setTab} />} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderBottom: '1px solid var(--line-100)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, background: 'var(--overlay-ink-04)', borderRadius: 'var(--radius-md)', padding: '0 10px', width: 200, flexShrink: 0, overflow: 'hidden', border: searchFocused ? '1.5px solid var(--brand-green)' : '1.5px solid transparent', boxSizing: 'border-box', transition: 'border-color 0.15s' }}>
              <i className="ph ph-magnifying-glass" style={{ color: 'var(--ink-400)', fontSize: 14, flexShrink: 0 }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Ieškoti..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 'var(--text-small)', color: 'var(--ink-900)', width: '100%' }} />
              {search && <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><i className="ph ph-x" style={{ fontSize: 12 }} /></button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {PROPERTIES.map((name) => (
                <Button key={name} variant="ghost" size="sm" onClick={() => toggleObjektas(name)}
                  style={{ boxShadow: selectedObjektas === name ? 'inset 0 0 0 1.5px var(--brand-green)' : 'inset 0 0 0 1.5px var(--line-200)', background: selectedObjektas === name ? 'var(--brand-green-soft, rgba(34,197,94,0.12))' : 'transparent', color: selectedObjektas === name ? 'var(--brand-green)' : 'var(--ink-600)', fontWeight: selectedObjektas === name ? 600 : 400 }}>
                  {name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="stack-sm" style={{ gap: 4, padding: '24px 24px 24px', background: 'var(--surface-card)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', overflowY: 'auto', flex: 1 }}>
          {(tab === 'visi' || tab === 'specialistai') && shownSpecialists.map((c) => {
            const i = list.indexOf(c)
            return (
              <div key={`s-${i}`} className="row" style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}
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
            <div key={r.slug} className="row" style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}
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
      </div>
      {editing !== null && <EditModal value={draft} onChange={setDraft} onSave={save} onClose={() => setEditing(null)} isNew={editing === 'new'} />}
    </Shell>
  )
}
