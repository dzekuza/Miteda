import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

const getDS = () => window.MitedaDesignSystem_acc833 || {}

const COVER_COLORS = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b', '#aeb8a0', '#a0aeb8']

function PropertyCard({ p, i, onEdit, onRemove }) {
  const { Card } = getDS()
  const pct = Math.round((p.sold / p.units) * 100)
  const coverColor = COVER_COLORS[i % COVER_COLORS.length]
  const iconBtn = (onClick, icon, hoverColor) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 8, border: 'none',
    background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)',
  })
  return (
    <Link className="plain" to={`/admin/objektas?b=${i}`}>
      <Card interactive style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, overflow: 'hidden' }}>
        <div style={{ aspectRatio: '5 / 4', background: p.coverImage ? `url(${p.coverImage}) center/cover no-repeat` : coverColor, flexShrink: 0, borderRadius: 16, margin: 8 }} />
        <div style={{ padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', letterSpacing: 'var(--tracking-tight)' }}>{p.name}</div>
              <div className="muted rowflex" style={{ fontSize: 'var(--text-body)', gap: 6, marginTop: 4 }}><i className="ph ph-map-pin" aria-hidden="true" />{p.address}</div>
            </div>
            <div className="rowflex" style={{ gap: 4 }}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(p, i) }}
                style={iconBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--ink-700)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-400)' }}
                title="Redaguoti">
                <i className="ph ph-pencil" style={{ fontSize: 14 }} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(p, i) }}
                style={iconBtn()}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--accent-red, #e53e3e)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-400)' }}
                title="Pašalinti">
                <i className="ph ph-trash" style={{ fontSize: 14 }} />
              </button>
            </div>
          </div>
          <div>
            <div className="between" style={{ marginBottom: 8 }}>
              <span className="muted" style={{ fontSize: 'var(--text-small)' }}>Parduota {p.sold} iš {p.units} butų</span>
              <span style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>{pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: '999px', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', borderRadius: '999px', background: 'var(--brand-green)' }} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function EditPropertyModal({ p, onClose, onSave }) {
  const { Button } = getDS()
  const [name, setName] = useState(p.name)
  const [addr, setAddr] = useState(p.address)
  const [units, setUnits] = useState(String(p.units))
  return (
    <Modal title="Redaguoti objektą" subtitle="Atnaujinkite pastato informaciją ir nuotrauką." onClose={onClose}
      footer={<React.Fragment>
        {Button && <Button variant="ghost" onClick={onClose}>Atšaukti</Button>}
        {Button && <Button variant="accent" iconLeft="ph ph-floppy-disk" onClick={() => name.trim() && onSave({ ...p, name: name.trim(), address: addr.trim() || '—', units: parseInt(units) || p.units })}>Išsaugoti</Button>}
      </React.Fragment>}>
      <div className="field"><label>Pavadinimas</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label>Adresas</label><input value={addr} onChange={(e) => setAddr(e.target.value)} /></div>
      <div className="field"><label>Butų skaičius</label><input value={units} onChange={(e) => setUnits(e.target.value)} type="number" /></div>
    </Modal>
  )
}

function AddModal({ onClose, onSubmit }) {
  const { Button } = getDS()
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [units, setUnits] = useState('')
  return (
    <Modal title="Pridėti objektą" subtitle="Naujas pastatas atsiras objektų sąraše." onClose={onClose}
      footer={<React.Fragment>
        {Button && <Button variant="secondary" onClick={onClose}>Atšaukti</Button>}
        {Button && <Button variant="accent" iconLeft="ph ph-plus" onClick={() => name.trim() && onSubmit({ name: name.trim(), address: addr.trim() || '—', units: parseInt(units) || 0, sold: 0 })}>Pridėti</Button>}
      </React.Fragment>}>
      <div className="field"><label>Pavadinimas</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pvz. Ąžuolų Namai" /></div>
      <div className="field"><label>Adresas</label><input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Gatvė, miestas" /></div>
      <div className="field"><label>Butų skaičius</label><input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="Pvz. 48" type="number" /></div>
    </Modal>
  )
}

export default function Objektai() {
  const { Button } = getDS()

  const [propsData, refresh] = useRepo('listProperties')
  const [localProps, setLocalProps] = useState(null)
  const props = localProps ?? propsData ?? []
  const [add, setAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)
  const totalUnits = props.reduce((s, p) => s + p.units, 0)
  const totalSold = props.reduce((s, p) => s + p.sold, 0)

  const handleSaveEdit = (updated, idx) => {
    setLocalProps(props.map((x, i) => i === idx ? updated : x))
    setEditing(null)
  }

  const handleRemove = (idx) => {
    setLocalProps(props.filter((_, i) => i !== idx))
    setRemoving(null)
  }

  return (
    <Shell role="admin" nav="objektai"
      title="Objektai" subtitle="Visi įmonės valdomi pastatai."
      headerActions={Button && <Button variant="primary" iconLeft="ph ph-plus" onClick={() => setAdd(true)}>Pridėti objektą</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat label="Objektai" value={props.length} />
          <Stat label="Iš viso butų" value={totalUnits} />
          <Stat label="Parduota" value={totalSold + ' / ' + totalUnits} accent />
        </div>
        <div className="grid-4" style={{ gap: 4 }}>
          {props.map((p, i) => (
            <PropertyCard key={i} p={p} i={i}
              onEdit={(p, i) => setEditing({ p, i })}
              onRemove={(p, i) => setRemoving({ p, i })}
            />
          ))}
        </div>
      </div>
      {add && <AddModal onClose={() => setAdd(false)} onSubmit={(p) => { repo.addProperty(p).then(() => { refresh(); setAdd(false) }) }} />}
      {editing && <EditPropertyModal p={editing.p} onClose={() => setEditing(null)} onSave={(updated) => handleSaveEdit(updated, editing.i)} />}
      {removing && Button && (
        <Modal title="Pašalinti objektą" onClose={() => setRemoving(null)} width={400}
          footer={<React.Fragment>
            <Button variant="primary" style={{ background: 'var(--accent-red, #e53e3e)', borderColor: 'var(--accent-red, #e53e3e)' }} onClick={() => handleRemove(removing.i)}>Pašalinti</Button>
            <Button variant="ghost" onClick={() => setRemoving(null)}>Atšaukti</Button>
          </React.Fragment>}>
          <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-600)' }}>
            Ar tikrai norite pašalinti objektą <strong style={{ color: 'var(--ink-900)' }}>{removing.p.name}</strong>? Šio veiksmo atšaukti negalėsite.
          </p>
        </Modal>
      )}
    </Shell>
  )
}
