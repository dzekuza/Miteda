import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, FilterChips, Modal, Composer } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'
import MD from '../../lib/data.js'

const CAT_TONE = { 'Parduodu': 'success', 'Paslaugos': 'event', 'Dovanoju': 'success', 'Ieškau': 'urgent', 'Pranešimai': 'neutral' }

export default function Skelbimai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Badge, Avatar } = DS

  function NoticeCard({ n, onContact }) {
    return (
      <Card tone="flat" style={{ borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
        <div className="between">
          <Badge tone={CAT_TONE[n.cat] || 'neutral'}>{n.cat}</Badge>
          {n.price && <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: n.price === 'Nemokamai' ? 'var(--brand-green-strong)' : 'var(--ink-900)' }}>{n.price}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 'var(--text-title)', lineHeight: 'var(--lh-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', textWrap: 'pretty' }}>{n.title}</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)', textWrap: 'pretty' }}>{n.body}</p>
        </div>
        <div className="between" style={{ paddingTop: 12, borderTop: '1px solid var(--line-100)' }}>
          <span className="rowflex" style={{ gap: 8 }}>
            <Avatar name={n.who} size={28} />
            <span className="muted" style={{ fontSize: 'var(--text-small)' }}>{n.who} · {n.time}</span>
          </span>
          <IconButton icon="ph ph-chat-circle" variant="ghost" size="sm" ariaLabel="Susisiekti" onClick={() => onContact(n)} />
        </div>
      </Card>
    )
  }

  function PostModal({ onClose, onSubmit }) {
    const [cat, setCat] = React.useState('Parduodu')
    const [title, setTitle] = React.useState('')
    const [body, setBody] = React.useState('')
    const [price, setPrice] = React.useState('')
    return (
      <Modal title="Naujas skelbimas" subtitle="Jūsų skelbimą matys visi pastato gyventojai." onClose={onClose}
        footer={<React.Fragment>
          <Button variant="secondary" onClick={onClose}>Atšaukti</Button>
          <Button variant="accent" iconLeft="ph ph-megaphone" onClick={() => title.trim() && onSubmit({ cat, title: title.trim(), body: body.trim(), price: price.trim() || null })}>Skelbti</Button>
        </React.Fragment>}>
        <div className="field">
          <label>Kategorija</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {MD.bulletinCats.filter((c) => c !== 'Visi').map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Pavadinimas</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pvz. parduodu dviratį" /></div>
        <div className="field"><label>Aprašymas</label><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Trumpas aprašymas…" /></div>
        <div className="field"><label>Kaina (nebūtina)</label><input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Pvz. €50 arba Nemokamai" /></div>
      </Modal>
    )
  }

  const [postsData, refresh] = useRepo('listBulletin')
  const posts = postsData || []
  const [cat, setCat] = React.useState('Visi')
  const [post, setPost] = React.useState(false)
  const [contact, setContact] = React.useState(null)
  const shown = cat === 'Visi' ? posts : posts.filter((p) => p.cat === cat)
  const add = (n) => { repo.addBulletin(n).then(() => { refresh(); setPost(false) }) }

  return (
    <Shell role="gyventojas" nav="skelbimai"
      title="Skelbimų lenta" subtitle="Bendruomenės skelbimai — parduodu, ieškau, dovanoju."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus" onClick={() => setPost(true)}>Naujas skelbimas</Button>}>
      <div className="content stack">
        <Card padding={16}><FilterChips items={MD.bulletinCats} value={cat} onChange={setCat} /></Card>
        <div className="grid-3">
          {shown.map((n, i) => <NoticeCard key={i} n={n} onContact={setContact} />)}
        </div>
      </div>
      {post && <PostModal onClose={() => setPost(false)} onSubmit={add} />}
      {contact && (
        <Modal title={`Susisiekti su ${contact.who}`} subtitle={contact.title} onClose={() => setContact(null)}>
          <Composer placeholder={`Žinutė ${contact.who}…`} button="Siųsti" onSend={() => setContact(null)} />
        </Modal>
      )}
    </Shell>
  )
}
