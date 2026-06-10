import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

export default function Objektai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  function PropertyCard({ p, i }) {
    const pct = Math.round((p.sold / p.units) * 100)
    return (
      <Link className="plain" to={`/admin/objektas?b=${i}`}>
        <Card interactive style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <span className="tile lg" style={{ background: 'var(--brand-forest)', color: '#fff' }}><i className="ph ph-buildings" aria-hidden="true" /></span>
            <IconButton icon="ph ph-arrow-up-right" variant="ghost" size="sm" ariaLabel="Atidaryti" />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', letterSpacing: 'var(--tracking-tight)' }}>{p.name}</div>
            <div className="muted rowflex" style={{ fontSize: 'var(--text-body)', gap: 6, marginTop: 2 }}><i className="ph ph-map-pin" aria-hidden="true" />{p.address}</div>
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
        </Card>
      </Link>
    )
  }

  function AddModal({ onClose, onSubmit }) {
    const [name, setName] = useState('')
    const [addr, setAddr] = useState('')
    const [units, setUnits] = useState('')
    return (
      <Modal title="Pridėti objektą" subtitle="Naujas pastatas atsiras objektų sąraše." onClose={onClose}
        footer={<React.Fragment>
          <Button variant="secondary" onClick={onClose}>Atšaukti</Button>
          <Button variant="accent" iconLeft="ph ph-plus" onClick={() => name.trim() && onSubmit({ name: name.trim(), address: addr.trim() || '—', units: parseInt(units) || 0, sold: 0 })}>Pridėti</Button>
        </React.Fragment>}>
        <div className="field"><label>Pavadinimas</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pvz. Ąžuolų Namai" /></div>
        <div className="field"><label>Adresas</label><input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Gatvė, miestas" /></div>
        <div className="field"><label>Butų skaičius</label><input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="Pvz. 48" type="number" /></div>
      </Modal>
    )
  }

  const [propsData, refresh] = useRepo('listProperties')
  const props = propsData || []
  const [add, setAdd] = useState(false)
  const totalUnits = props.reduce((s, p) => s + p.units, 0)
  const totalSold = props.reduce((s, p) => s + p.sold, 0)

  return (
    <Shell role="admin" nav="objektai"
      title="Objektai" subtitle="Visi įmonės valdomi pastatai."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus" onClick={() => setAdd(true)}>Pridėti objektą</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-buildings" label="Objektai" value={props.length} />
          <Stat icon="ph ph-door" label="Iš viso butų" value={totalUnits} />
          <Stat icon="ph ph-check-circle" label="Parduota" value={totalSold + ' / ' + totalUnits} accent />
        </div>
        <div className="grid-3">
          {props.map((p, i) => <PropertyCard key={i} p={p} i={i} />)}
        </div>
      </div>
      {add && <AddModal onClose={() => setAdd(false)} onSubmit={(p) => { repo.addProperty(p).then(() => { refresh(); setAdd(false) }) }} />}
    </Shell>
  )
}
