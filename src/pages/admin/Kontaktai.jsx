import React, { useState } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, FilterChips } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'

export default function Kontaktai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Avatar, Badge, Input } = DS

  const blank = { name: '', role: '', company: '', cat: 'Administracija', phone: '', email: '' }

  function EditPanel({ value, onChange, onSave, onClose, isNew }) {
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 96 }}>
        <div className="between">
          <h2 className="sec-title" style={{ fontSize: 'var(--text-title)' }}>{isNew ? 'Naujas kontaktas' : 'Redaguoti kontaktą'}</h2>
          <IconButton icon="ph ph-x" variant="ghost" size="sm" ariaLabel="Uždaryti" onClick={onClose} />
        </div>
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
      </Card>
    )
  }

  const [listData, refresh] = useRepo('listContacts')
  const list = listData || []
  const [cat, setCat] = useState('Visi')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(blank)
  const shown = cat === 'Visi' ? list : list.filter((c) => c.cat === cat)

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
      <div className={'content ' + (editing !== null ? 'grid-aside' : 'stack')}>
        <Card>
          <PanelHead title="Specialistai" subtitle={`${list.length} įrašai`}
            action={<FilterChips items={MD.contactCats} value={cat} onChange={setCat} />} />
          <div className="stack-sm" style={{ gap: 10 }}>
            {shown.map((c) => {
              const i = list.indexOf(c)
              return (
                <div key={i} className="row" style={{ cursor: 'pointer', boxShadow: editing === i ? 'inset 0 0 0 1.5px var(--brand-green)' : 'inset 0 0 0 1px var(--line-100)' }} onClick={() => openEdit(c, i)}>
                  <Avatar name={c.name} size={40} />
                  <div className="row__main"><span className="row__title">{c.name}</span><span className="row__meta">{c.role}<span className="dot">·</span>{c.company}</span></div>
                  <Badge tone="neutral">{c.cat}</Badge>
                  <span className="muted" style={{ fontSize: 'var(--text-small)', minWidth: 120, textAlign: 'right' }}>{c.phone}</span>
                  <IconButton icon="ph ph-pencil-simple" variant="ghost" size="sm" ariaLabel="Redaguoti" />
                </div>
              )
            })}
          </div>
        </Card>
        {editing !== null && <EditPanel value={draft} onChange={setDraft} onSave={save} onClose={() => setEditing(null)} isNew={editing === 'new'} />}
      </div>
    </Shell>
  )
}
