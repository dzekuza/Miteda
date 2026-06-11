import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Modal } from '../../shared/UI.jsx'

export default function Darbai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, Badge, Avatar, KeyRow } = DS

  function ProjectCard({ p, onClick, onEdit, onRemove }) {
    return (
      <Card interactive role="button" tabIndex={0}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}>
        <div className="between">
          <div>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.building} · {p.apt}</div>
            <div className="muted" style={{ fontSize: 'var(--text-small)', marginTop: 2 }}>{p.phase}</div>
          </div>
          <div className="rowflex" style={{ gap: 4 }}>
            <Badge tone={p.progress > 75 ? 'success' : 'event'}>{p.progress}%</Badge>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(p) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--ink-700)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-400)' }}
              title="Redaguoti">
              <i className="ph ph-pencil" style={{ fontSize: 14 }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(p) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-400)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-raised)'; e.currentTarget.style.color = 'var(--accent-red, #e53e3e)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-400)' }}
              title="Pašalinti">
              <i className="ph ph-trash" style={{ fontSize: 14 }} />
            </button>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: '999px', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: p.progress + '%', borderRadius: '999px', background: p.progress > 75 ? 'var(--brand-green)' : 'var(--accent-pink)' }} />
        </div>
        <div className="between" style={{ paddingTop: 14, borderTop: '1px solid var(--line-100)' }}>
          <div className="rowflex" style={{ gap: 10 }}>
            <Avatar name={p.manager} size={32} tone="green" />
            <div>
              <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Darbų vadovas</div>
              <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.manager}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{p.workers} darbininkai</div>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.total}</div>
          </div>
        </div>
      </Card>
    )
  }

  function ProjectModal({ p, onClose }) {
    const expenses = [
      { label: 'Medžiagos', value: '€4 200' },
      { label: 'Darbas', value: '€6 800' },
      { label: 'Papildomos išlaidos', value: '€2 160' },
    ]
    return (
      <Modal title={`${p.building} · ${p.apt}`} subtitle={p.phase} onClose={onClose} width={520}>
        <div className="stack" style={{ gap: 20 }}>
          <div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', marginBottom: 8 }}>Progresa</div>
            <div style={{ height: 10, borderRadius: '999px', background: 'var(--surface-sunken)', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: p.progress + '%', borderRadius: '999px', background: p.progress > 75 ? 'var(--brand-green)' : 'var(--accent-pink)' }} />
            </div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-500)' }}>{p.progress}% baigta</div>
          </div>
          <div style={{ height: 1, background: 'var(--line-100)' }} />
          <div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', marginBottom: 12 }}>Komanda</div>
            <div className="rowflex" style={{ gap: 10 }}>
              <Avatar name={p.manager} size={36} tone="green" />
              <div>
                <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.manager}</div>
                <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Darbų vadovas · {p.workers} darbininkai</div>
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--line-100)' }} />
          <div>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', marginBottom: 8 }}>Išlaidos</div>
            <div className="stack-sm" style={{ gap: 0 }}>
              {expenses.map((e) => (
                <div key={e.label} className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line-100)' }}>
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-700)' }}>{e.label}</span>
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.value}</span>
                </div>
              ))}
              <div className="between" style={{ padding: '10px 0' }}>
                <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Iš viso</span>
                <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>{p.total}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  function NewProjectModal({ onClose }) {
    const { Input, Textarea } = DS
    const [building, setBuilding] = React.useState('')
    const [apt, setApt] = React.useState('')
    const [phase, setPhase] = React.useState('')
    const [manager, setManager] = React.useState('')
    const valid = building.trim() && apt.trim() && phase.trim() && manager.trim()
    return (
      <Modal title="Naujas projektas" subtitle="Sukurkite naują remonto ar priežiūros projektą." onClose={onClose} width={480}>
        <div className="stack" style={{ gap: 16 }}>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="field" style={{ margin: 0 }}><label>Pastatas</label><input value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="Pvz. A korpusas" /></div>
            <div className="field" style={{ margin: 0 }}><label>Butas / zona</label><input value={apt} onChange={(e) => setApt(e.target.value)} placeholder="Pvz. Butas 12" /></div>
          </div>
          <div className="field" style={{ margin: 0 }}><label>Darbų etapas</label><input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="Pvz. Santechnikos įrengimas" /></div>
          <div className="field" style={{ margin: 0 }}><label>Darbų vadovas</label><input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Vardas Pavardė" /></div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Button variant="primary" onClick={() => valid && onClose()} style={!valid ? { opacity: 0.5, pointerEvents: 'none' } : {}}>Sukurti projektą</Button>
            <Button variant="ghost" onClick={onClose}>Atšaukti</Button>
          </div>
        </div>
      </Modal>
    )
  }

  function EditProjectModal({ p, onClose, onSave }) {
    const [building, setBuilding] = React.useState(p.building)
    const [apt, setApt] = React.useState(p.apt)
    const [phase, setPhase] = React.useState(p.phase)
    const [manager, setManager] = React.useState(p.manager)
    const valid = building.trim() && apt.trim() && phase.trim() && manager.trim()
    return (
      <Modal title="Redaguoti projektą" subtitle="Atnaujinkite projekto informaciją." onClose={onClose} width={480}>
        <div className="stack" style={{ gap: 16 }}>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="field" style={{ margin: 0 }}><label>Pastatas</label><input value={building} onChange={(e) => setBuilding(e.target.value)} /></div>
            <div className="field" style={{ margin: 0 }}><label>Butas / zona</label><input value={apt} onChange={(e) => setApt(e.target.value)} /></div>
          </div>
          <div className="field" style={{ margin: 0 }}><label>Darbų etapas</label><input value={phase} onChange={(e) => setPhase(e.target.value)} /></div>
          <div className="field" style={{ margin: 0 }}><label>Darbų vadovas</label><input value={manager} onChange={(e) => setManager(e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Button variant="primary" onClick={() => valid && onSave({ ...p, building, apt, phase, manager })} style={!valid ? { opacity: 0.5, pointerEvents: 'none' } : {}}>Išsaugoti</Button>
            <Button variant="ghost" onClick={onClose}>Atšaukti</Button>
          </div>
        </div>
      </Modal>
    )
  }

  const [projData] = useRepo('listProjects')
  const [projects, setProjects] = React.useState(null)
  const PROJECTS = projects ?? projData ?? []
  const [selected, setSelected] = React.useState(null)
  const [showNew, setShowNew] = React.useState(false)
  const [editing, setEditing] = React.useState(null)
  const [removing, setRemoving] = React.useState(null)
  const totalWorkers = PROJECTS.reduce((s, p) => s + p.workers, 0)

  function handleRemove(p) {
    setProjects(PROJECTS.filter((x) => x !== p))
    setRemoving(null)
  }

  function handleSaveEdit(updated) {
    setProjects(PROJECTS.map((x) => x === editing ? updated : x))
    setEditing(null)
  }

  return (
    <Shell role="admin" nav="darbai"
      title="Remonto darbai" subtitle="Visi aktyvūs remonto projektai visuose objektuose."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus" onClick={() => setShowNew(true)}>Naujas projektas</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-wrench" label="Aktyvūs projektai" value={PROJECTS.length} />
          <Stat icon="ph ph-users-three" label="Darbininkai objektuose" value={totalWorkers} />
          <Stat icon="ph ph-wallet" label="Bendros išlaidos" value="€13 160" accent />
        </div>
        <div className="grid-2">
          {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} onClick={() => setSelected(p)} onEdit={setEditing} onRemove={setRemoving} />)}
        </div>
      </div>
      {selected && <ProjectModal p={selected} onClose={() => setSelected(null)} />}
      {showNew && <NewProjectModal onClose={() => setShowNew(false)} />}
      {editing && <EditProjectModal p={editing} onClose={() => setEditing(null)} onSave={handleSaveEdit} />}
      {removing && (
        <Modal title="Pašalinti projektą" subtitle="Projektas ir visi jo darbai bus negrįžtamai ištrinti." onClose={() => setRemoving(null)} width={400}>
          <div className="stack" style={{ gap: 20 }}>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-600)' }}>
              Ar tikrai norite pašalinti projektą <strong style={{ color: 'var(--ink-900)' }}>{removing.building} · {removing.apt}</strong>? Šio veiksmo atšaukti negalėsite.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="primary" style={{ background: 'var(--accent-red, #e53e3e)', borderColor: 'var(--accent-red, #e53e3e)' }} onClick={() => handleRemove(removing)}>Pašalinti</Button>
              <Button variant="ghost" onClick={() => setRemoving(null)}>Atšaukti</Button>
            </div>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
