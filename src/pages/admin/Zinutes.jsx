import React, { useState } from 'react'
import Shell from '../../shared/Shell.jsx'
import { PanelHead } from '../../shared/UI.jsx'

const CONVOS = [
  { id: 1, name: 'Lukas Petrauskas', role: 'B-12 · Gyventojas', avatar: 'LP', unread: 3, lastMsg: 'Kada bus patikrintas defektas?', time: '10:31' },
  { id: 2, name: 'Giedrė Janušienė', role: 'A-4 · Gyventoja', avatar: 'GJ', unread: 1, lastMsg: 'Ačiū, laukiu patvirtinimo.', time: '09:14' },
  { id: 3, name: 'Mindaugas Šimkus', role: 'C-21 · Gyventojas', avatar: 'MŠ', unread: 0, lastMsg: 'Supratau, iki pasimatymo.', time: 'Vakar' },
  { id: 4, name: 'Rasa Kazlauskaitė', role: 'A-7 · Gyventoja', avatar: 'RK', unread: 0, lastMsg: 'Prašau atnaujinti sutartį.', time: 'Ant.' },
  { id: 5, name: 'Tomas Petraitis', role: 'B-9 · Gyventojas', avatar: 'TP', unread: 0, lastMsg: 'Dėkoju už greitą atsakymą.', time: 'Pir.' },
]

const MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Laba diena. Norėjau pasiteirauti apie vonios defektą.', time: '10:15' },
    { id: 2, from: 'me', text: 'Laba diena, Lukai. Patikrėsime artimiausiomis dienomis.', time: '10:28' },
    { id: 3, from: 'them', text: 'Kada bus patikrintas defektas?', time: '10:31' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Labas, ar galite patvirtinti sutarties atnaujinimą?', time: '09:10' },
    { id: 2, from: 'me', text: 'Taip, išsiųsime dokumentus šiandien.', time: '09:12' },
    { id: 3, from: 'them', text: 'Ačiū, laukiu patvirtinimo.', time: '09:14' },
  ],
  3: [
    { id: 1, from: 'me', text: 'Gerb. Mindaugai, primename apie rytojaus susitikimą 10 val.', time: 'Vakar' },
    { id: 2, from: 'them', text: 'Supratau, iki pasimatymo.', time: 'Vakar' },
  ],
  4: [{ id: 1, from: 'them', text: 'Prašau atnaujinti sutartį.', time: 'Ant.' }],
  5: [{ id: 1, from: 'them', text: 'Dėkoju už greitą atsakymą.', time: 'Pir.' }],
}

const isMobile = () => window.innerWidth <= 760

export default function AdminZinutes() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Avatar, Badge } = DS

  const [active, setActive] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(MESSAGES)
  const [search, setSearch] = useState('')
  const [mobile, setMobile] = useState(isMobile)

  React.useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const filtered = CONVOS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  const totalUnread = CONVOS.reduce((s, c) => s + c.unread, 0)

  const openConvo = (c) => { setActive(c); setChatOpen(true) }

  const send = () => {
    if (!input.trim() || !active) return
    const newMsg = { id: Date.now(), from: 'me', text: input.trim(), time: 'Dabar' }
    setMsgs((m) => ({ ...m, [active.id]: [...(m[active.id] || []), newMsg] }))
    setInput('')
  }

  const showList = !mobile || !chatOpen
  const showChat = !mobile || chatOpen

  const ConvoList = (
    <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid var(--line-100)' }}>
        <PanelHead title="Pokalbiai" subtitle={`${CONVOS.length} pokalbiai`} />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Ieškoti pokalbio…"
          style={{ marginTop: 10, width: '100%', padding: '8px 12px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', outline: 'none', boxSizing: 'border-box', background: 'var(--surface-sunken)' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((c) => (
          <div key={c.id} onClick={() => openConvo(c)}
            style={{ display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--line-100)', background: active?.id === c.id && !mobile ? 'var(--surface-sunken)' : 'transparent', transition: 'background 120ms' }}>
            <Avatar name={c.name} size={40} tone="green" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.name}</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)' }}>{c.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>{c.lastMsg}</span>
                {c.unread > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 999, background: 'var(--brand-green)', color: '#fff', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{c.unread}</span>}
              </div>
              <div style={{ marginTop: 3 }}><span style={{ fontSize: 10, color: 'var(--ink-300)' }}>{c.role}</span></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )

  const ChatPanel = active ? (
    <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
        {mobile && (
          <button onClick={() => setChatOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 8px 0 0', color: 'var(--ink-500)', display: 'flex', alignItems: 'center' }}>
            <i className="ph ph-arrow-left" style={{ fontSize: 20 }} aria-hidden="true" />
          </button>
        )}
        <Avatar name={active.name} size={36} tone="green" />
        <div>
          <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{active.name}</div>
          <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{active.role}</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(msgs[active.id] || []).map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.from === 'me' ? 'var(--brand-green)' : 'var(--surface-sunken)', color: m.from === 'me' ? '#fff' : 'var(--ink-900)', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)' }}>
              {m.text}
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.65, textAlign: 'right' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line-100)', display: 'flex', gap: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={`Rašykite ${active.name.split(' ')[0]}…`}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', outline: 'none', background: 'var(--surface-card)' }} />
        <button onClick={send} style={{ padding: '0 18px', height: 42, border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--brand-green)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-body)' }}>
          <i className="ph ph-paper-plane-tilt" style={{ fontSize: 18 }} aria-hidden="true" />
        </button>
      </div>
    </Card>
  ) : (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-300)', fontSize: 'var(--text-body)' }}>
      Pasirinkite pokalbį
    </Card>
  )

  return (
    <Shell role="admin" nav="zinutes" title="Žinutės" subtitle="Pokalbiai su gyventojais ir paslaugų teikėjais."
      headerActions={totalUnread > 0 ? <Badge tone="urgent">{totalUnread} naujų</Badge> : null}>
      <div className="content" style={{ height: 'calc(100vh - 72px)', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '320px 1fr', gap: 16 }}>
        {showList && ConvoList}
        {showChat && ChatPanel}
      </div>
    </Shell>
  )
}
