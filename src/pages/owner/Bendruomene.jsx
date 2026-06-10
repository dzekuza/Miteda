import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Modal, Composer, Thread } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

export default function Bendruomene() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Badge, Avatar, Input } = DS

  function LikeBtn({ liked, count, onToggle }) {
    return (
      <button onClick={(e) => { e.stopPropagation(); onToggle() }} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer',
        background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
        fontWeight: 'var(--fw-medium)', color: liked ? 'var(--orange)' : 'var(--ink-400)',
      }}>
        <i className={liked ? 'ph-fill ph-heart' : 'ph ph-heart'} style={{ fontSize: 18 }} aria-hidden="true" />{count}
      </button>
    )
  }

  function ThreadCard({ t, onOpen }) {
    return (
      <Card tone="flat" interactive style={{ borderRadius: 'var(--radius-md)', padding: 20, cursor: 'pointer' }} onClick={() => onOpen(t)}>
        <div className="rowflex" style={{ gap: 10, marginBottom: 12 }}>
          <Badge tone="event">{t.cat}</Badge>
          {t.hot && <Badge tone="urgent" dot>Populiaru</Badge>}
          <span className="muted right" style={{ fontSize: 'var(--text-small)' }}>{t.time}</span>
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', textWrap: 'pretty' }}>{t.title}</h3>
        <p style={{ margin: '0 0 16px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)', textWrap: 'pretty' }}>{t.body}</p>
        <div className="between">
          <span className="rowflex" style={{ gap: 8 }}>
            <Avatar name={t.author} size={28} />
            <span className="muted" style={{ fontSize: 'var(--text-small)' }}>{t.author}</span>
          </span>
          <span className="rowflex" style={{ gap: 16, color: 'var(--ink-400)', fontSize: 'var(--text-small)' }}>
            <span className="rowflex" style={{ gap: 6 }}><i className="ph ph-chat-circle" style={{ fontSize: 18 }} aria-hidden="true" />{t.replies}</span>
            <span className="rowflex" style={{ gap: 6 }}><i className="ph ph-heart" style={{ fontSize: 18 }} aria-hidden="true" />{t.likes}</span>
            <span className="rowflex" style={{ gap: 6 }}><i className="ph ph-eye" style={{ fontSize: 18 }} aria-hidden="true" />{t.views}</span>
          </span>
        </div>
      </Card>
    )
  }

  function ThreadModal({ t, onClose }) {
    const [comments, setComments] = React.useState([
      { who: 'Greta Janušienė', role: 'Gyventojas', text: 'Pritariu, seniai laikas tai aptarti.', time: 'Prieš 2 val.' },
      { who: 'Mantas Šimkus', role: 'Gyventojas', text: 'Galiu padėti suorganizuoti.', time: 'Prieš 1 val.' },
    ])
    return (
      <Modal title={t.title} subtitle={`${t.cat} · ${t.author} · ${t.time}`} onClose={onClose} width={640}>
        <p style={{ margin: '0 0 20px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-700)' }}>{t.body}</p>
        <div style={{ height: 1, background: 'var(--line-100)', marginBottom: 18 }} />
        <h3 className="sec-title" style={{ fontSize: 'var(--text-title)', marginBottom: 14 }}>Komentarai ({comments.length})</h3>
        <Thread items={comments} />
        <div style={{ marginTop: 16 }}>
          <Composer placeholder="Parašyti komentarą…" button="Komentuoti"
            onSend={(text) => setComments([...comments, { who: MD.user.name, role: 'Gyventojas', text, time: 'Ką tik' }])} />
        </div>
      </Modal>
    )
  }

  const [open, setOpen] = React.useState(null)
  const [likes, setLikes] = React.useState({})
  const [threadsData] = useRepo('listThreads')
  const threads = threadsData || []
  const toggle = (i, base) => setLikes((l) => ({ ...l, [i]: l[i] ? 0 : 1 }))

  return (
    <Shell role="gyventojas" nav="bendruomene"
      title="Bendruomenė" subtitle="Diskusijos kaimynų temomis — dalinkitės, klauskite, padėkite."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus">Nauja diskusija</Button>}>
      <div className="content grid-aside">
        <div className="stack">
          {threads.map((t, i) => <ThreadCard key={i} t={t} onOpen={setOpen} />)}
        </div>
        <div className="stack">
          <Card>
            <PanelHead title="Populiariausios temos" />
            <div className="stack-sm" style={{ gap: 4 }}>
              {threads.filter((t) => t.hot).concat(threads.filter((t) => !t.hot)).slice(0, 4).map((t, i) => (
                <div key={i} className="rowflex" style={{ gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--line-100)' : 'none', cursor: 'pointer' }} onClick={() => setOpen(t)}>
                  <span style={{ fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-300)', width: 24 }}>{i + 1}</span>
                  <div className="grow">
                    <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 'var(--text-small)' }}>{t.replies} atsakymai</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <PanelHead title="Ieškoti temų" />
            <Input placeholder="Įveskite raktažodį…" iconLeft="ph ph-magnifying-glass" />
            <div className="chips" style={{ marginTop: 14 }}>
              {['#parkavimas', '#dviračiai', '#sodas', '#internetas', '#talka'].map((t) => (
                <span key={t} className="chip" style={{ cursor: 'default' }}>{t}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {open && <ThreadModal t={open} onClose={() => setOpen(null)} />}
    </Shell>
  )
}
