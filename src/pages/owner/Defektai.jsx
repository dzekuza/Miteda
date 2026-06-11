import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { PanelHead, Stat, FilterChips, Modal, Thread, Composer, StatusBadge } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'

const ST = MD.defectStatuses
const ROOMS = ['Vonios kambarys', 'Virtuvė', 'Svetainė', 'Miegamasis', 'Koridorius', 'Balkonas', 'Bendros erdvės']

export default function Defektai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  function ReportModal({ onClose, onSubmit }) {
    const [room, setRoom] = React.useState(ROOMS[0])
    const [title, setTitle] = React.useState('')
    const [desc, setDesc] = React.useState('')
    const submit = () => {
      if (!title.trim()) return
      onSubmit({ room, title: title.trim(), desc: desc.trim() })
    }
    return (
      <Modal title="Pranešti apie defektą" subtitle="Aprašykite problemą — administracija gaus pranešimą iškart." onClose={onClose}
        footer={<React.Fragment>
          <Button variant="secondary" onClick={onClose}>Atšaukti</Button>
          <Button variant="accent" iconLeft="ph ph-paper-plane-tilt" onClick={submit}>Pateikti</Button>
        </React.Fragment>}>
        <div className="field">
          <label>Patalpa</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            {ROOMS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Pavadinimas</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pvz. praleidžia vamzdis po kriaukle" />
        </div>
        <div className="field">
          <label>Aprašymas</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Trumpai aprašykite, kas atsitiko…" />
        </div>
        <div className="rowflex" style={{ gap: 8, color: 'var(--ink-400)', fontSize: 'var(--text-small)' }}>
          <i className="ph ph-paperclip" style={{ fontSize: 18 }} aria-hidden="true" />
          <span>Galite pridėti nuotraukų (demonstracinėje versijoje neaktyvu)</span>
        </div>
      </Modal>
    )
  }

  function DetailModal({ d, onClose, onReply }) {
    return (
      <Modal title={d.title} subtitle={`${d.id} · ${d.room} · ${d.apt}`} onClose={onClose} width={620}>
        <div className="rowflex" style={{ marginBottom: 16, gap: 10 }}>
          <StatusBadge map={ST} value={d.status} />
          <span className="muted" style={{ fontSize: 'var(--text-small)' }}>Pateikta {d.date}</span>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-700)' }}>{d.desc}</p>
        <div style={{ height: 1, background: 'var(--line-100)', marginBottom: 18 }} />
        <h3 className="sec-title" style={{ fontSize: 'var(--text-title)', marginBottom: 14 }}>Susirašinėjimas</h3>
        <Thread items={d.thread} />
        <div style={{ marginTop: 16 }}>
          <Composer placeholder="Atsakyti administracijai…" onSend={(t) => onReply(d.id, t)} />
        </div>
      </Modal>
    )
  }

  function DefectRow({ d, onOpen }) {
    return (
      <div className="row" style={{ cursor: 'pointer' }} onClick={() => onOpen(d)}>
        <span className={'tile ' + (d.status === 'open' ? 'tile--orange' : d.status === 'resolved' ? 'tile--green' : '')}>
          <i className="ph ph-wrench" aria-hidden="true" />
        </span>
        <div className="row__main">
          <span className="row__title">{d.title}</span>
          <span className="row__meta">{d.id}<span className="dot">·</span>{d.room}<span className="dot">·</span>{d.apt}</span>
        </div>
        <span className="muted" style={{ fontSize: 'var(--text-small)', marginRight: 4 }}>{d.date}</span>
        <StatusBadge map={ST} value={d.status} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ink-400)', fontSize: 'var(--text-small)' }}>
          <i className="ph ph-chat-circle" aria-hidden="true" />{d.thread.length}
        </span>
        <IconButton icon="ph ph-caret-right" variant="ghost" size="sm" ariaLabel="Atidaryti" />
      </div>
    )
  }

  const [defects, setDefects] = React.useState([])
  const [filter, setFilter] = React.useState('Visi')
  const [report, setReport] = React.useState(false)
  const [open, setOpen] = React.useState(null)

  const refresh = () => repo.listDefects().then(setDefects)
  React.useEffect(() => { refresh() }, [])

  const counts = {
    open: defects.filter((d) => d.status === 'open').length,
    progress: defects.filter((d) => d.status === 'progress').length,
    resolved: defects.filter((d) => d.status === 'resolved').length,
  }
  const FMAP = { 'Atviras': 'open', 'Vykdoma': 'progress', 'Išspręsta': 'resolved' }
  const shown = filter === 'Visi' ? defects : defects.filter((d) => d.status === FMAP[filter])
  const current = open ? defects.find((d) => d.id === open.id) : null

  const addDefect = ({ room, title, desc }) => {
    repo.addDefect({ room, title, desc }).then(() => { refresh(); setReport(false) })
  }
  const reply = (id, text) => {
    repo.addDefectReply(id, text).then(refresh)
  }

  return (
    <Shell role="gyventojas" nav="defektai"
      title="Defektai" subtitle="Praneškite apie problemas ir sekite jų sprendimą."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus" onClick={() => setReport(true)}>Pranešti apie defektą</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-warning-octagon" label="Atviri" value={counts.open} />
          <Stat icon="ph ph-spinner" label="Vykdoma" value={counts.progress} />
          <Stat icon="ph ph-check-circle" label="Išspręsta" value={counts.resolved} accent />
        </div>
        <Card>
          <PanelHead title="Mano defektai" subtitle="Jūsų pateikti pranešimai ir jų būsena"
            action={<FilterChips items={['Visi', 'Atviras', 'Vykdoma', 'Išspręsta']} value={filter} onChange={setFilter} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {shown.map((d) => <DefectRow key={d.id} d={d} onOpen={setOpen} />)}
            {shown.length === 0 && <p className="sec-sub">Nėra defektų pagal pasirinktą filtrą.</p>}
          </div>
        </Card>
      </div>
      {report && <ReportModal onClose={() => setReport(false)} onSubmit={addDefect} />}
      {current && <DetailModal d={current} onClose={() => setOpen(null)} onReply={reply} />}
    </Shell>
  )
}
