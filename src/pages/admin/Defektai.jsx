import React, { useState } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Tabs, FilterChips, StatusBadge, Modal, Thread, Composer } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

const ST = MD.defectStatuses
const WORKERS = MD.contacts.filter((c) => c.cat !== 'Administracija')

const DETAIL_TABS = [
  { key: 'info', label: 'Informacija' },
  { key: 'chat', label: 'Pokalbis' },
]

function seedThread(d) {
  return [{ who: d.author, role: 'Gyventojas', text: 'Defektas užregistruotas.', time: d.date + ' · 08:00' }]
}

function CreateDefectModal({ buildings, onAdd, onClose }) {
  const { Button } = window.MitedaDesignSystem_acc833
  const [form, setForm] = useState({
    title: '', desc: '', building: buildings.find((b) => b !== 'Visi') || '', apt: '', status: 'open',
  })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Būtinas laukas'
    if (!form.building.trim()) e.building = 'Būtinas laukas'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = () => {
    if (!validate()) return
    const now = new Date()
    onAdd({
      id: 'DF-' + (110 + Math.floor(Math.random() * 90)),
      title: form.title.trim(),
      description: form.desc.trim(),
      building: form.building,
      apt: form.apt.trim() || '—',
      status: form.status,
      author: 'Administratorius',
      date: now.toISOString().slice(0, 10).replace(/-/g, ' '),
      worker: null,
      thread: [{ who: 'Administratorius', role: 'Administracija', text: 'Defektas sukurtas.', time: now.toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' }) }],
    })
    onClose()
  }

  const fld = (err) => ({
    height: 40, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)',
    background: 'var(--surface-card)',
    boxShadow: err ? 'inset 0 0 0 1.5px var(--orange)' : 'inset 0 0 0 1px var(--line-200)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  })

  return (
    <Modal title="Naujas defektas" subtitle="Sukurti naują defektų pranešimą" onClose={onClose} width={520}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Atšaukti</Button>
        <Button variant="accent" iconLeft="ph ph-plus" onClick={submit}>Sukurti defektą</Button>
      </>}>
      <div className="stack-sm" style={{ gap: 14 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Defekto aprašymas</label>
          <input style={fld(errors.title)} value={form.title} placeholder="Pvz. Praleidžia vamzdis po kriaukle"
            onChange={(e) => set('title', e.target.value)} />
          {errors.title && <span style={{ fontSize: 'var(--text-small)', color: 'var(--orange)' }}>{errors.title}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Objektas</label>
            <select style={{ ...fld(errors.building), cursor: 'pointer' }} value={form.building}
              onChange={(e) => set('building', e.target.value)}>
              {buildings.filter((b) => b !== 'Visi').map((b) => <option key={b}>{b}</option>)}
            </select>
            {errors.building && <span style={{ fontSize: 'var(--text-small)', color: 'var(--orange)' }}>{errors.building}</span>}
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Butas</label>
            <input style={fld()} value={form.apt} placeholder="pvz. B-12"
              onChange={(e) => set('apt', e.target.value)} />
          </div>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Papildomas aprašymas</label>
          <textarea style={{ ...fld(), height: 72, padding: '10px 12px', resize: 'vertical' }}
            value={form.desc} placeholder="Detalus defekto aprašymas..."
            onChange={(e) => set('desc', e.target.value)} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Pirminis statusas</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(ST).map(([key, { label }]) => (
              <button key={key} type="button" onClick={() => set('status', key)} style={{
                flex: 1, height: 36, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
                background: form.status === key ? 'var(--overlay-ink-04)' : 'transparent',
                color: form.status === key ? 'var(--ink-900)' : 'var(--ink-400)',
                outline: form.status === key ? '1.5px solid var(--line-300)' : 'none',
                fontWeight: form.status === key ? 'var(--fw-medium)' : undefined,
                transition: 'all 120ms',
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function DefectDetailModal({ defect, onClose, onUpdate }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Button, Badge, Avatar } = DS
  const [tab, setTab] = useState('info')
  const [status, setStatus] = useState(defect.status)
  const [worker, setWorker] = useState(defect.worker)
  const [thread, setThread] = useState(defect.thread || seedThread(defect))
  const [pickingWorker, setPickingWorker] = useState(false)

  const hasChanges = status !== defect.status || worker !== defect.worker

  const save = () => { onUpdate({ ...defect, status, worker, thread }); onClose() }

  const sendMsg = (text) => {
    const msg = { who: 'Administratorius', role: 'Administracija', text, time: new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' }) }
    const next = [...thread, msg]
    setThread(next)
    onUpdate({ ...defect, status, worker, thread: next })
  }

  const infoRows = [
    { label: 'Objektas', value: defect.building },
    { label: 'Butas', value: defect.apt },
    { label: 'Pateikė', value: defect.author },
    { label: 'Data', value: defect.date },
    ...(defect.description ? [{ label: 'Aprašymas', value: defect.description }] : []),
  ]

  return (
    <Modal
      title={defect.title}
      subtitle={`${defect.id} · ${defect.building} · Butas ${defect.apt}`}
      onClose={onClose}
      width={660}
      footer={hasChanges
        ? <><Button variant="ghost" onClick={onClose}>Atšaukti</Button><Button variant="accent" onClick={save}>Išsaugoti</Button></>
        : null}
    >
      {/* Status row */}
      <div className="between" style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--line-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Būsena:</span>
          {Badge && <Badge tone={ST[status].tone}>{ST[status].label}</Badge>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries(ST).map(([key, { label }]) => (
            <button key={key} onClick={() => setStatus(key)} style={{
              height: 28, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-pill)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
              fontWeight: status === key ? 'var(--fw-medium)' : undefined,
              background: status === key ? 'var(--overlay-ink-04)' : 'transparent',
              color: status === key ? 'var(--ink-900)' : 'var(--ink-400)',
              outline: status === key ? '1.5px solid var(--line-300)' : 'none',
              transition: 'all 120ms',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={DETAIL_TABS} value={tab} onChange={setTab} />
      </div>

      {/* Informacija */}
      {tab === 'info' && (
        <div>
          <div className="stack" style={{ gap: 0, marginBottom: 24 }}>
            {infoRows.map(({ label, value }) => (
              <div key={label} className="between" style={{ padding: '11px 0', borderBottom: '1px solid var(--line-100)' }}>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>{label}</span>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)', fontWeight: 'var(--fw-medium)', maxWidth: 320, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Worker assignment */}
          <div style={{ borderTop: '1px solid var(--line-100)', paddingTop: 16 }}>
            <div className="between" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Priskirtas meistras</span>
              <Button variant="ghost" size="sm" iconLeft={worker ? 'ph ph-pencil' : 'ph ph-user-plus'}
                onClick={() => setPickingWorker((v) => !v)}>
                {worker ? 'Pakeisti' : 'Priskirti meistrą'}
              </Button>
            </div>

            {!pickingWorker && !worker && (
              <p style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', padding: '6px 0' }}>Meistras nepriskirtas</p>
            )}

            {!pickingWorker && worker && (
              <div className="row" style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                {Avatar && <Avatar name={worker.name} size={40} />}
                <div className="row__main">
                  <span className="row__title">{worker.name}</span>
                  <span className="row__meta">{worker.role}<span className="dot">·</span>{worker.phone}</span>
                </div>
                <button onClick={() => { setWorker(null); setPickingWorker(false) }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-300)', padding: 4 }}>
                  <i className="ph ph-x" style={{ fontSize: 14 }} />
                </button>
              </div>
            )}

            {pickingWorker && (
              <div className="stack-sm" style={{ gap: 6 }}>
                {WORKERS.map((w) => (
                  <button key={w.name} type="button"
                    onClick={() => { setWorker(w); setPickingWorker(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                      width: '100%', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                      background: worker?.name === w.name ? 'var(--brand-green-faint)' : 'var(--surface-sunken)',
                      outline: worker?.name === w.name ? '1.5px solid var(--brand-green)' : 'none',
                    }}>
                    {Avatar && <Avatar name={w.name} size={32} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{w.name}</div>
                      <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{w.role}<span className="dot">·</span>{w.phone}</div>
                    </div>
                    {worker?.name === w.name && <i className="ph ph-check" style={{ color: 'var(--brand-green)', fontSize: 16 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pokalbis */}
      {tab === 'chat' && (
        <div>
          <Thread items={thread} />
          <div style={{ marginTop: 16 }}>
            <Composer placeholder="Rašyti žinutę apie defektą…" onSend={sendMsg} button="Siųsti" />
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function Defektai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  const [b, setB] = useState('Visi')
  const [s, setS] = useState('Visos')
  const [selected, setSelected] = useState(null)
  const [creating, setCreating] = useState(false)
  const [defects, setDefects] = useState(null)
  const [popover, setPopover] = useState(null)

  React.useEffect(() => {
    if (popover === null) return
    const close = () => setPopover(null)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [popover])

  const [adRaw] = useRepo('listAdminDefects')

  React.useEffect(() => {
    if (adRaw && defects === null) {
      setDefects(adRaw.map((d) => ({ ...d, worker: null, thread: seedThread(d) })))
    }
  }, [adRaw])

  const rows_src = defects || []
  const buildings = ['Visi', ...new Set(rows_src.map((d) => d.building))]
  const SMAP = { 'Atviras': 'open', 'Vykdoma': 'progress', 'Išspręsta': 'resolved' }

  let rows = rows_src
  if (b !== 'Visi') rows = rows.filter((d) => d.building === b)
  if (s !== 'Visos') rows = rows.filter((d) => d.status === SMAP[s])

  const counts = {
    open: rows_src.filter((d) => d.status === 'open').length,
    progress: rows_src.filter((d) => d.status === 'progress').length,
    resolved: rows_src.filter((d) => d.status === 'resolved').length,
  }

  const addDefect = (d) => setDefects((prev) => [d, ...(prev || [])])
  const updateDefect = (updated) => {
    setDefects((prev) => (prev || []).map((d) => d.id === updated.id ? updated : d))
    setSelected((prev) => prev?.id === updated.id ? updated : prev)
  }
  const deleteDefect = (id) => setDefects((prev) => (prev || []).filter((d) => d.id !== id))

  return (
    <Shell role="admin" nav="defektai"
      title="Defektai" subtitle="Visi pranešimai apie defektus iš visų objektų."
      headerActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" iconLeft="ph ph-export">Eksportuoti</Button>
          <Button variant="accent" iconLeft="ph ph-plus" onClick={() => setCreating(true)}>Naujas defektas</Button>
        </div>
      }>
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
                <th>ID</th><th>Problema</th><th>Butas</th><th>Objektas</th><th>Pateikė</th>
                <th>Meistras</th><th>Data</th><th>Būsena</th><th></th>
              </tr></thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(d)}
                    tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(d)}>
                    <td className="tbl__id">{d.id}</td>
                    <td style={{ color: 'var(--ink-900)' }}>{d.title}</td>
                    <td>{d.apt}</td>
                    <td>{d.building}</td>
                    <td>{d.author}</td>
                    <td>
                      {d.worker
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', flex: '0 0 auto' }}>
                              {d.worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-700)' }}>{d.worker.name.split(' ')[0]}</span>
                          </div>
                        : <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(d) }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px 0', fontSize: 'var(--text-small)', color: 'var(--ink-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <i className="ph ph-plus-circle" style={{ fontSize: 14 }} /> Priskirti
                          </button>}
                    </td>
                    <td className="muted">{d.date}</td>
                    <td><StatusBadge map={ST} value={d.status} /></td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <IconButton icon="ph ph-arrow-up-right" variant="ghost" size="sm" ariaLabel="Atidaryti"
                          onClick={(e) => { e.stopPropagation(); setSelected(d) }} />
                        <div style={{ position: 'relative' }}>
                          <IconButton icon="ph ph-dots-three-vertical" variant="ghost" size="sm" ariaLabel="Veiksmai"
                            onClick={(e) => { e.stopPropagation(); setPopover(popover === d.id ? null : d.id) }} />
                          {popover === d.id && (
                            <div onMouseDown={(e) => e.stopPropagation()} style={{
                              position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
                              background: 'var(--surface-card)', border: '1px solid var(--line-200)',
                              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                              minWidth: 160, overflow: 'hidden',
                            }}>
                              {[
                                { icon: 'ph ph-arrow-up-right', label: 'Atidaryti', action: () => { setSelected(d); setPopover(null) } },
                                { icon: 'ph ph-pencil', label: 'Redaguoti', action: () => { setSelected(d); setPopover(null) } },
                                { icon: 'ph ph-trash', label: 'Ištrinti', danger: true, action: () => { deleteDefect(d.id); setPopover(null) } },
                              ].map(({ icon, label, action, danger }) => (
                                <button key={label} type="button" onClick={action} style={{
                                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                  padding: '10px 14px', border: 'none', background: 'transparent',
                                  cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
                                  color: danger ? 'var(--orange)' : 'var(--ink-800)', textAlign: 'left',
                                }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                  <i className={icon} style={{ fontSize: 16 }} />
                                  {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="sec-sub" style={{ padding: '16px' }}>Nėra defektų pagal pasirinktus filtrus.</p>}
          </div>
        </Card>
      </div>

      {creating && <CreateDefectModal buildings={buildings} onAdd={addDefect} onClose={() => setCreating(false)} />}
      {selected && <DefectDetailModal defect={selected} onClose={() => setSelected(null)} onUpdate={updateDefect} />}
    </Shell>
  )
}
