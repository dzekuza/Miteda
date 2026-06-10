import React from 'react'
import { Link } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, PhotoTile } from '../../shared/UI.jsx'

export default function Pagrindinis() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Badge, Button, IconButton, SegmentedControl, Avatar, KeyRow } = DS

  /* ---- Notice board ---- */
  function NoticeBoard() {
    const [notices] = useRepo('list', 'notices')
    return (
      <Card>
        <PanelHead title="Skelbimų lenta" subtitle="Naujausi administracijos pranešimai" />
        <div className="grid-fit-sm">
          {(notices || []).map((n, i) => (
            <Card key={i} tone={n.tone === 'urgent' ? 'urgent' : 'flat'} padding={18}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 'var(--radius-md)' }}>
              <Badge tone={n.catTone} style={{ alignSelf: 'flex-start' }}>{n.cat}</Badge>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-title)', lineHeight: 'var(--lh-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', textWrap: 'pretty' }}>{n.title}</h3>
                <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)', textWrap: 'pretty' }}>{n.body}</p>
              </div>
              <div className="between" style={{ marginTop: 4 }}>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{n.date}</span>
                <IconButton icon="ph ph-arrow-up-right" variant="ghost" size="sm" ariaLabel="Atidaryti" />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    )
  }

  /* ---- Messages ---- */
  function Messages() {
    const [messages] = useRepo('list', 'messages')
    return (
      <Card style={{ display: 'flex', flexDirection: 'column' }}>
        <PanelHead title="Naujos žinutės" subtitle="Tiesioginės žinutės" />
        <div className="stack-sm" style={{ gap: 10, flex: 1 }}>
          {(messages || []).map((m, i) => (
            <div key={i} className="rowflex" style={{
              padding: '12px 14px', borderRadius: 'var(--radius-md)',
              background: m.unread ? 'linear-gradient(180deg, var(--orange-soft), var(--orange-faint))' : 'var(--surface-sunken)',
            }}>
              <Avatar name={m.name} size={36} />
              <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{m.name}</span>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</span>
              </div>
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', flex: '0 0 auto' }}>{m.time}</span>
              {m.unread && <span style={{ width: 8, height: 8, borderRadius: '999px', background: 'var(--orange)', flex: '0 0 auto' }} />}
            </div>
          ))}
        </div>
      </Card>
    )
  }

  /* ---- Construction updates ---- */
  function Construction() {
    const [repair] = useRepo('getRepair')
    const u = (repair && repair.updates) || []
    const palette = ['#9bb7a4', '#c2b59b', '#8fa6b8']
    return (
      <Card style={{ display: 'flex', flexDirection: 'column' }}>
        <PanelHead title="Statybos naujienos" subtitle="Tiesioginiai komandos atnaujinimai"
          action={<Link className="plain" to="/owner/darbai"><Button variant="secondary" size="sm" iconRight="ph ph-arrow-up-right">Visi darbai</Button></Link>} />
        <div className="stack-sm" style={{ gap: 14, flex: 1 }}>
          {u.map((x, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 56, flex: '0 0 auto' }}><PhotoTile color={palette[i % palette.length]} ratio="1 / 1" /></div>
              <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-700)', textWrap: 'pretty' }}>{x.text}</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{x.who} · {x.time} · {x.photos} nuotr.</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  /* ---- Calendar (compact) ---- */
  const WD = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']
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
  function EventsCalendar() {
    const [view, setView] = React.useState('month')
    const [sel, setSel] = React.useState(11)
    const [evts] = useRepo('list', 'events')
    const events = evts || []
    const [edRaw] = useRepo('list', 'eventDays')
    const eventDays = edRaw || {}
    const cells = buildMonth(2026, 5)
    const today = 10
    const dayEvents = events.filter((e) => e.day === sel)
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <PanelHead title="Artimiausi įvykiai"
          action={<SegmentedControl value={view} onChange={setView}
            options={[{ value: 'list', label: 'Sąrašas', icon: 'ph ph-list-bullets' }, { value: 'month', label: 'Mėnuo', icon: 'ph ph-calendar-dots' }]} />} />
        {view === 'month' ? (
          <React.Fragment>
            <div className="between">
              <IconButton icon="ph ph-caret-left" variant="ghost" size="sm" ariaLabel="Ankstesnis" />
              <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>2026 m. birželis</span>
              <IconButton icon="ph ph-caret-right" variant="ghost" size="sm" ariaLabel="Kitas" />
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
                {WD.map((w) => <span key={w} style={{ textAlign: 'center', fontSize: 'var(--text-small)', color: 'var(--ink-400)', padding: '6px 0' }}>{w}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
                {cells.map((d, i) => {
                  if (d === null) return <span key={i} />
                  const isToday = d === today, isSel = d === sel, dots = eventDays[d] || 0
                  return (
                    <button key={i} onClick={() => setSel(d)} style={{
                      position: 'relative', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
                      fontWeight: isToday ? 'var(--fw-medium)' : 'var(--fw-regular)',
                      background: isToday ? 'var(--brand-green)' : isSel ? 'var(--brand-green-faint)' : 'transparent',
                      color: isToday ? '#fff' : isSel ? 'var(--brand-green-strong)' : 'var(--ink-700)',
                    }}>
                      {d}
                      {dots > 0 && <span style={{ position: 'absolute', bottom: 5, display: 'flex', gap: 2 }}>
                        {Array.from({ length: dots }).map((_, k) => <span key={k} style={{ width: 4, height: 4, borderRadius: '999px', background: isToday ? '#fff' : 'var(--accent-pink)' }} />)}
                      </span>}
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--line-100)' }} />
            <div>
              <div className="between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Birželio {sel} d.</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{dayEvents.length} įv.</span>
              </div>
              {dayEvents.length === 0 && <p className="sec-sub" style={{ margin: 0 }}>Šią dieną įvykių nėra.</p>}
              {dayEvents.map((e, i) => (
                <div key={i} className="rowflex" style={{ padding: '10px 0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '999px', background: 'var(--accent-pink)', flex: '0 0 auto' }} />
                  <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.title}</span>
                    <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-500)' }}>{e.time} · {e.place}</span>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ) : (
          <div className="stack-sm">
            {events.map((e, i) => (
              <div key={i} className="rowflex" style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flex: '0 0 auto' }}>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Bir</span>
                  <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.day}</span>
                </div>
                <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.title}</span>
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-500)' }}>{e.time} · {e.place}</span>
                </div>
                <Badge tone="event">{e.cat}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  /* ---- Digital keys + emergency ---- */
  function CopyRow({ icon, label, value }) {
    const [c, setC] = React.useState(false)
    const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(value).catch(() => {}); setC(true); setTimeout(() => setC(false), 1200) }
    return (
      <div className="rowflex" style={{ padding: '8px 0' }}>
        <span className="tile"><i className={icon} aria-hidden="true" /></span>
        <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{label}</span>
          <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-500)' }}>{value}</span>
        </div>
        <IconButton icon={c ? 'ph ph-check' : 'ph ph-copy'} variant="ghost" size="sm" ariaLabel="Kopijuoti" onClick={copy} />
      </div>
    )
  }
  function Keys() {
    const [keys] = useRepo('list', 'keys')
    return (
      <Card style={{ display: 'flex', flexDirection: 'column' }}>
        <PanelHead title="Skaitmeniniai raktai" />
        <div>
          {(keys || []).map((k, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ height: 1, background: 'var(--line-100)' }} />}
              <KeyRow icon={k.icon} label={k.label} value={k.value} />
            </React.Fragment>
          ))}
        </div>
        <div style={{ height: 1, background: 'var(--line-100)', margin: '8px 0 4px' }} />
        <span className="sec-sub" style={{ marginBottom: 4 }}>Pagalbos numeriai</span>
        <CopyRow icon="ph ph-first-aid" label="Bendrasis pagalbos" value="112" />
        <CopyRow icon="ph ph-wrench" label="Avarinė tarnyba" value="+370 600 11999" />
        <CopyRow icon="ph ph-headset" label="Administracija" value="+370 600 11223" />
      </Card>
    )
  }

  return (
    <Shell role="gyventojas" nav="pagrindinis"
      title="Pagrindinis" subtitle="Štai kas šiandien vyksta Kalnų Terasos name.">
      <div className="content grid-aside">
        <div className="stack">
          <NoticeBoard />
          <div className="grid-fit">
            <Messages />
            <Construction />
          </div>
        </div>
        <div className="stack">
          <EventsCalendar />
          <Keys />
        </div>
      </div>
    </Shell>
  )
}
