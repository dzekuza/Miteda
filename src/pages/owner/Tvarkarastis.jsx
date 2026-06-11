import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

const WD = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']
const CAT_TONE = { 'Susirinkimas': 'event', 'Priežiūra': 'neutral', 'Aplinka': 'success', 'Patikra': 'urgent', 'Rezervacija': 'event' }

function buildMonth(y, m) {
  const first = new Date(y, m, 1)
  const off = (first.getDay() + 6) % 7
  const n = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < off; i++) cells.push(null)
  for (let d = 1; d <= n; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function Tvarkarastis() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Badge } = DS

  function DaySchedule({ sel }) {
    const [evData] = useRepo('list', 'events')
    const evs = (evData || []).filter((e) => e.day === sel)
    return (
      <div>
        <div className="between" style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Birželio {sel} d.</span>
          <span className="muted" style={{ fontSize: 'var(--text-small)' }}>{evs.length} įvykiai</span>
        </div>
        {evs.length === 0 && <p className="sec-sub" style={{ margin: 0 }}>Šią dieną įvykių nėra.</p>}
        {evs.map((e, i) => (
          <div key={i} className="rowflex" style={{ padding: '10px 0' }}>
            <span style={{ width: 8, height: 8, borderRadius: '999px', background: 'var(--accent-pink)', flex: '0 0 auto' }} />
            <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.title}</span>
              <span className="muted" style={{ fontSize: 'var(--text-body)' }}>{e.time} · {e.place}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function Calendar({ sel, onSel }) {
    const cells = buildMonth(2026, 5)
    const today = 10
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="between">
          <IconButton icon="ph ph-caret-left" variant="ghost" size="sm" ariaLabel="Ankstesnis" />
          <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>2026 m. birželis</span>
          <IconButton icon="ph ph-caret-right" variant="ghost" size="sm" ariaLabel="Kitas" />
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
            {WD.map((w) => <span key={w} style={{ textAlign: 'center', fontSize: 'var(--text-small)', color: 'var(--ink-400)', padding: '6px 0' }}>{w}</span>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (d === null) return <span key={i} />
              const isToday = d === today, isSel = d === sel, dots = MD.eventDays[d] || 0
              return (
                <button key={i} onClick={() => onSel(d)} style={{
                  position: 'relative', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
                  fontWeight: isToday ? 'var(--fw-medium)' : 'var(--fw-regular)',
                  background: isToday ? 'var(--brand-green)' : isSel ? 'var(--brand-green-faint)' : dots ? 'var(--surface-sunken)' : 'transparent',
                  color: isToday ? '#fff' : isSel ? 'var(--brand-green-strong)' : 'var(--ink-700)',
                }}>
                  {d}
                  {dots > 0 && <span style={{ position: 'absolute', bottom: 6, display: 'flex', gap: 2 }}>
                    {Array.from({ length: dots }).map((_, k) => <span key={k} style={{ width: 4, height: 4, borderRadius: '999px', background: isToday ? '#fff' : 'var(--accent-pink)' }} />)}
                  </span>}
                </button>
              )
            })}
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--line-100)' }} />
        <DaySchedule sel={sel} />
      </Card>
    )
  }

  function EventRow({ e, active, onClick }) {
    return (
      <div className="row" style={{ cursor: 'pointer', boxShadow: active ? 'inset 0 0 0 1.5px var(--brand-green)' : 'inset 0 0 0 1px var(--line-100)' }} onClick={onClick}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 44, flex: '0 0 auto' }}>
          <span className="muted" style={{ fontSize: 'var(--text-small)' }}>Bir</span>
          <span style={{ fontSize: 'var(--text-display)', lineHeight: '26px', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.day}</span>
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--line-100)' }} />
        <div className="row__main">
          <span className="row__title">{e.title}</span>
          <span className="row__meta">{e.time}<span className="dot">·</span>{e.place}</span>
        </div>
        <Badge tone={CAT_TONE[e.cat] || 'neutral'}>{e.cat}</Badge>
      </div>
    )
  }

  const [sel, setSel] = React.useState(11)
  const [evData] = useRepo('list', 'events')
  const events = evData || []

  return (
    <Shell role="gyventojas" nav="tvarkarastis"
      title="Tvarkaraštis" subtitle="Artimiausi pastato įvykiai ir priežiūros darbai."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus">Rezervuoti laiką</Button>}>
      <div className="content grid-aside">
        <Card>
          <PanelHead title="Artimiausi įvykiai" subtitle="Spustelėkite įvykį arba pasirinkite dieną kalendoriuje" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {events.map((e, i) => <EventRow key={i} e={e} active={e.day === sel} onClick={() => setSel(e.day)} />)}
          </div>
        </Card>
        <Calendar sel={sel} onSel={setSel} />
      </div>
    </Shell>
  )
}
