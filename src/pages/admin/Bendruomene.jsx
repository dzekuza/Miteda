import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Modal, Composer, Thread } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

export default function AdminBendruomene() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, Badge, Avatar, Input } = DS

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

  function ThreadCard({ t, onOpen, liked, onLike }) {
    return (
      <Card tone="flat" interactive role="button" tabIndex={0}
        style={{ borderRadius: 'var(--radius-md)', padding: 20, cursor: 'pointer' }}
        onClick={() => onOpen(t)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(t) } }}>
        <div className="rowflex gap-10" style={{ marginBottom: 12 }}>
          <Badge tone="event">{t.cat}</Badge>
          {t.hot && <Badge tone="urgent" dot>Populiaru</Badge>}
          <span className="muted right" style={{ fontSize: 'var(--text-small)' }}>{t.time}</span>
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', textWrap: 'pretty' }}>{t.title}</h3>
        <p style={{ margin: '0 0 16px', fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)', textWrap: 'pretty' }}>{t.body}</p>
        <div className="between">
          <span className="rowflex gap-8">
            <Avatar name={t.author} size={28} />
            <span className="muted" style={{ fontSize: 'var(--text-small)' }}>{t.author}</span>
          </span>
          <span className="rowflex gap-16" style={{ color: 'var(--ink-400)', fontSize: 'var(--text-small)' }}>
            <span className="rowflex gap-6"><i className="ph ph-chat-circle" style={{ fontSize: 18 }} aria-hidden="true" />{t.replies}</span>
            <LikeBtn liked={liked} count={t.likes + (liked ? 1 : 0)} onToggle={onLike} />
            <span className="rowflex gap-6"><i className="ph ph-eye" style={{ fontSize: 18 }} aria-hidden="true" />{t.views}</span>
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
            onSend={(text) => setComments([...comments, { who: MD.user.name, role: 'Administratorius', text, time: 'Ką tik' }])} />
        </div>
      </Modal>
    )
  }

  const [open, setOpen] = React.useState(null)
  const [likes, setLikes] = React.useState({})
  const [threadsData] = useRepo('listThreads')
  const threads = threadsData || []
  const toggle = (i) => setLikes((l) => ({ ...l, [i]: l[i] ? 0 : 1 }))

  const [newOpen, setNewOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState('')
  const [newCat, setNewCat] = React.useState('')
  const [newBody, setNewBody] = React.useState('')

  const [pollOpen, setPollOpen] = React.useState(false)
  const [pollQ, setPollQ] = React.useState('')
  const [pollOpts, setPollOpts] = React.useState(['', ''])
  const [polls, setPolls] = React.useState([])
  const [pollVotes, setPollVotes] = React.useState({})
  const addPollOpt = () => setPollOpts((o) => [...o, ''])
  const setPollOpt = (i, v) => setPollOpts((o) => o.map((x, idx) => idx === i ? v : x))
  const removePollOpt = (i) => setPollOpts((o) => o.filter((_, idx) => idx !== i))
  const submitPoll = () => {
    if (!pollQ.trim() || pollOpts.filter(o => o.trim()).length < 2) return
    setPolls((p) => [{ q: pollQ, opts: pollOpts.filter(o => o.trim()), time: 'Ką tik', votes: {} }, ...p])
    setPollOpen(false)
  }
  const votePoll = (pi, oi) => setPollVotes((v) => ({ ...v, [pi]: oi }))

  const CATS = ['Informacija', 'Klausimai', 'Pasiūlymai', 'Renginiai', 'Kita']
  const MEMBERS = [
    { name: 'Greta Janušienė',      apt: 'A-4',  building: '1' },
    { name: 'Mantas Šimkus',        apt: 'C-21', building: '3' },
    { name: 'Ona Petrauskienė',     apt: 'B-7',  building: '2' },
    { name: 'Jonas Kazlauskas',     apt: 'A-11', building: '1' },
    { name: 'Rasa Stankevičiūtė',  apt: 'D-3',  building: '4' },
  ]

  const [mentionQ, setMentionQ] = React.useState(null)
  const bodyRef = React.useRef(null)
  const [search, setSearch] = React.useState('')
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [activeCat, setActiveCat] = React.useState('Visi')
  const [newAttachedFile, setNewAttachedFile] = React.useState(null)
  const newFileInputRef = React.useRef(null)

  function handleBodyChange(e) {
    const val = e.target.value
    setNewBody(val)
    const cursor = e.target.selectionStart
    const before = val.slice(0, cursor)
    const match = before.match(/@([^@\s]*)$/)
    setMentionQ(match ? match[1] : null)
  }

  function insertMention(name) {
    const el = bodyRef.current
    const cursor = el.selectionStart
    const before = newBody.slice(0, cursor)
    const after = newBody.slice(cursor)
    const atIdx = before.lastIndexOf('@')
    const newVal = before.slice(0, atIdx) + '@' + name + ' ' + after
    setNewBody(newVal)
    setMentionQ(null)
    setTimeout(() => { el.focus(); const p = atIdx + name.length + 2; el.setSelectionRange(p, p) }, 0)
  }

  const filteredMembers = mentionQ !== null ? MEMBERS.filter(m => m.name.toLowerCase().includes(mentionQ.toLowerCase())) : []

  const inp = { width: '100%', height: 38, padding: '0 10px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', background: 'var(--surface-card)', outline: 'none', boxSizing: 'border-box' }

  return (
    <>
    {newOpen && (
      <Modal title="Nauja diskusija" subtitle="Pradėkite naują diskusiją su gyventojais." onClose={() => setNewOpen(false)} width={520}
        footer={<><Button variant="secondary" onClick={() => setNewOpen(false)}>Atšaukti</Button><Button variant="primary" iconLeft="ph ph-paper-plane-tilt" onClick={() => setNewOpen(false)}>Skelbti</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', marginBottom: 6 }}>Tema</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Diskusijos pavadinimas…" style={inp} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', marginBottom: 6 }}>Kategorija</label>
            <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ ...inp, paddingRight: 30 }}>
              <option value="">Pasirinkite kategoriją…</option>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', marginBottom: 6 }}>Turinys</label>
            <div style={{ position: 'relative' }}>
              <textarea ref={bodyRef} value={newBody} onChange={handleBodyChange} onBlur={() => setTimeout(() => setMentionQ(null), 150)} rows={5} placeholder="Aprašykite diskusijos temą… (naudokite @ paminėti naudotoją)" style={{ ...inp, height: 'auto', padding: '10px 12px', resize: 'vertical' }} />
              {mentionQ !== null && filteredMembers.length > 0 && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, zIndex: 500, background: 'var(--surface-card)', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)', minWidth: 220, maxHeight: 200, overflowY: 'auto' }}>
                  {filteredMembers.map((m) => (
                    <div key={m.name} onMouseDown={(e) => { e.preventDefault(); insertMention(m.name) }}
                      style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--line-50)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                      <i className="ph ph-at" style={{ fontSize: 16, color: 'var(--orange)', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)', lineHeight: 1.3 }}>{m.name}</span>
                        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', lineHeight: 1.2 }}>Butas {m.apt} · Namo nr. {m.building}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    )}
    {pollOpen && (
      <Modal title="Naujas balsavimas" subtitle="Sukurkite balsavimą gyventojams." onClose={() => setPollOpen(false)} width={520}
        footer={<><Button variant="secondary" onClick={() => setPollOpen(false)}>Atšaukti</Button><Button variant="primary" iconLeft="ph ph-chart-bar" onClick={submitPoll}>Paskelbti balsavimą</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', marginBottom: 6 }}>Klausimas</label>
            <input value={pollQ} onChange={(e) => setPollQ(e.target.value)} placeholder="Pvz. Ar sutinkate su..." style={{ width: '100%', height: 38, padding: '0 10px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', background: 'var(--surface-card)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', marginBottom: 6 }}>Atsakymų variantai</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pollOpts.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={opt} onChange={(e) => setPollOpt(i, e.target.value)} placeholder={`Variantas ${i + 1}`}
                    style={{ flex: 1, height: 38, padding: '0 10px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', background: 'var(--surface-card)', outline: 'none', boxSizing: 'border-box' }} />
                  {pollOpts.length > 2 && (
                    <button type="button" onClick={() => removePollOpt(i)} style={{ width: 32, height: 32, border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--overlay-ink-04)', color: 'var(--ink-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="ph ph-x" style={{ fontSize: 14 }} />
                    </button>
                  )}
                </div>
              ))}
              {pollOpts.length < 6 && (
                <button type="button" onClick={addPollOpt} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brand-green)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', padding: 0 }}>
                  <i className="ph ph-plus" style={{ fontSize: 14 }} /> Pridėti variantą
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    )}
    <Shell role="admin" nav="bendruomene"
      title="Bendruomenė" subtitle="Gyventojų diskusijos ir aktualijos."
      headerActions={<div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" iconLeft="ph ph-chart-bar" onClick={() => { setPollQ(''); setPollOpts(['', '']); setPollOpen(true) }}>Naujas balsavimas</Button>
        <Button variant="primary" iconLeft="ph ph-plus" onClick={() => { setNewTitle(''); setNewCat(''); setNewBody(''); setNewOpen(true) }}>Nauja diskusija</Button>
      </div>}>
      <div className="content grid-aside">
        <div className="stack">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line-100)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, background: 'var(--overlay-ink-04)', borderRadius: 'var(--radius-md)', padding: '0 10px', width: 200, flexShrink: 0, overflow: 'hidden', border: searchFocused ? '1.5px solid var(--brand-green)' : '1.5px solid transparent', boxSizing: 'border-box', transition: 'border-color 0.15s' }}>
              <i className="ph ph-magnifying-glass" style={{ fontSize: 14, color: 'var(--ink-400)', flexShrink: 0 }} aria-hidden="true" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Ieškoti…" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 'var(--text-small)', color: 'var(--ink-900)', width: '100%' }} />
              {search && <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><i className="ph ph-x" style={{ fontSize: 12 }} /></button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: 0, flex: 1, minWidth: 0 }}>
              {['Visi', ...(MD.properties || []).map((p) => p.name)].map((c) => (
                <button key={c} type="button" onClick={() => setActiveCat(c)}
                  className={'filter-pill' + (activeCat === c ? ' is-active' : '')}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {polls.map((p, pi) => {
            const totalVotes = Object.values(p.votes || {}).reduce((a, b) => a + b, 0) + (pollVotes[pi] !== undefined ? 1 : 0)
            const voted = pollVotes[pi]
            return (
              <Card key={pi} tone="flat" style={{ borderRadius: 'var(--radius-md)', padding: 20 }}>
                <div className="rowflex gap-8" style={{ marginBottom: 12 }}>
                  <Badge tone="event">Balsavimas</Badge>
                  <span className="muted right" style={{ fontSize: 'var(--text-small)' }}>{p.time}</span>
                </div>
                <h3 style={{ margin: '0 0 14px', fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.q}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.opts.map((opt, oi) => {
                    const pct = totalVotes > 0 && voted !== undefined ? Math.round(((oi === voted ? 1 : 0) / totalVotes) * 100) : 0
                    return (
                      <button key={oi} type="button" onClick={() => votePoll(pi, oi)}
                        style={{ width: '100%', position: 'relative', padding: '10px 14px', border: voted === oi ? '1.5px solid var(--brand-green)' : '1px solid var(--line-200)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', cursor: voted === undefined ? 'pointer' : 'default', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', overflow: 'hidden' }}>
                        {voted !== undefined && <div style={{ position: 'absolute', inset: 0, width: pct + '%', background: voted === oi ? 'rgba(120,191,62,0.12)' : 'var(--overlay-ink-04)', transition: 'width 0.4s' }} />}
                        <span style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{opt}</span>
                          {voted !== undefined && <span style={{ color: 'var(--ink-400)', fontSize: 'var(--text-small)' }}>{pct}%</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {voted !== undefined && <p style={{ margin: '10px 0 0', fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{totalVotes} {totalVotes === 1 ? 'balsas' : 'balsai'}</p>}
              </Card>
            )
          })}
          {threads
            .filter((t) => (activeCat === 'Visi' || t.building === activeCat) && (!search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.body || '').toLowerCase().includes(search.toLowerCase())))
            .map((t, i) => <ThreadCard key={i} t={t} onOpen={setOpen} liked={!!likes[i]} onLike={() => toggle(i)} />)}
        </div>
        <div className="stack">
          <Card>
            <PanelHead title="Populiariausios temos" />
            <div className="stack-sm gap-4">
              {threads.filter((t) => t.hot).concat(threads.filter((t) => !t.hot)).slice(0, 4).map((t, i) => (
                <div key={i} className="rowflex" style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--line-100)' : 'none', cursor: 'pointer' }} onClick={() => setOpen(t)}>
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
    </>
  )
}
