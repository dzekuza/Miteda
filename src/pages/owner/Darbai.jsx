import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, PhotoTile, Modal, Composer, Thread } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

const PHOTO = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b']

export default function Darbai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Badge, Avatar } = DS

  function UpdateItem({ u, i, last }) {
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
          <span style={{ width: 12, height: 12, borderRadius: '999px', background: 'var(--brand-green)', boxShadow: '0 0 0 4px var(--brand-green-faint)' }} />
          {!last && <span style={{ flex: 1, width: 2, background: 'var(--line-200)', marginTop: 4 }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: last ? 0 : 24 }}>
          <div className="rowflex" style={{ gap: 8, marginBottom: 6 }}>
            <Avatar name={u.who} size={28} tone="green" />
            <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{u.who}</span>
            <span className="muted right" style={{ fontSize: 'var(--text-small)' }}>{u.time}</span>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-700)', textWrap: 'pretty' }}>{u.text}</p>
          <div className="rowflex" style={{ gap: 10 }}>
            {Array.from({ length: u.photos }).map((_, k) => (
              <div key={k} style={{ width: 84, flex: '0 0 auto' }}><PhotoTile color={PHOTO[(i + k) % PHOTO.length]} ratio="1 / 1" /></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const [R] = useRepo('getRepair')
  const [chatOpen, setChatOpen] = React.useState(false)
  const [messages, setMessages] = React.useState([
    { who: R?.manager?.name || 'Vadovas', role: 'Darbų vadovas', text: 'Sveiki! Galite rašyti čia bet kuriuo klausimu dėl remonto darbų.', time: 'Vakar' },
  ])
  if (!R) return null

  return (
    <Shell role="gyventojas" nav="darbai"
      title="Remonto darbai" subtitle="Jūsų buto remonto eiga, komanda ir išlaidos."
      headerActions={<Button variant="secondary" iconLeft="ph ph-chat-circle" onClick={() => setChatOpen(true)}>Rašyti vadovui</Button>}>
      <div className="content grid-aside">
        <Card>
          <PanelHead title="Darbų eiga" subtitle="Naujausi komandos atnaujinimai su nuotraukomis" />
          <div style={{ marginTop: 8 }}>
            {R.updates.map((u, i) => <UpdateItem key={i} u={u} i={i} last={i === R.updates.length - 1} />)}
          </div>
        </Card>
        <div className="stack">
          <Card>
            <PanelHead title="Darbų vadovas" />
            <div className="rowflex" style={{ gap: 14 }}>
              <Avatar name={R.manager.name} size={48} tone="green" />
              <div className="grow">
                <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{R.manager.name}</div>
                <div className="muted" style={{ fontSize: 'var(--text-body)' }}>{R.manager.role}</div>
              </div>
              <IconButton icon="ph ph-phone" variant="solid" ariaLabel="Skambinti" />
            </div>
            <div style={{ height: 1, background: 'var(--line-100)', margin: '16px 0' }} />
            <span className="sec-sub" style={{ display: 'block', marginBottom: 12 }}>Darbininkai objekte</span>
            <div className="stack-sm" style={{ gap: 10 }}>
              {R.workers.map((w, i) => (
                <div key={i} className="rowflex" style={{ gap: 12 }}>
                  <Avatar name={w.name} size={36} />
                  <div className="grow">
                    <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{w.name}</div>
                    <div className="muted" style={{ fontSize: 'var(--text-small)' }}>{w.role}</div>
                  </div>
                  <Badge tone="success" dot>Objekte</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <PanelHead title="Išlaidos" />
            <div>
              {R.expenses.map((e, i) => (
                <div key={i} className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line-100)' }}>
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-700)' }}>{e.item}</span>
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{e.sum}</span>
                </div>
              ))}
              <div className="between" style={{ padding: '14px 0 0' }}>
                <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Iš viso</span>
                <span style={{ fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>{R.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {chatOpen && (
        <Modal title={`Žinutė — ${R.manager.name}`} subtitle={R.manager.role} onClose={() => setChatOpen(false)} width={520}>
          <Thread items={messages} />
          <div style={{ marginTop: 16 }}>
            <Composer placeholder="Rašyti vadovui…" button="Siųsti"
              onSend={(text) => setMessages((m) => [...m, { who: MD.user.name, role: 'Gyventojas', text, time: 'Ką tik' }])} />
          </div>
        </Modal>
      )}
    </Shell>
  )
}
