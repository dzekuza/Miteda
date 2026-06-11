import React, { useState } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, PhotoTile, Modal } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

export default function DarbuEiga() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Checkbox } = DS
  const [selected, setSelected] = useState(null)

  const PHOTO = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b']
  const OWNERS = ['B-12 · L. Petrauskas', 'A-4 · G. Janušienė', 'C-21 · M. Šimkus', 'A-7 · R. Kazlauskaitė', 'B-9 · T. Petraitis']

  function Composer({ onPublish }) {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [photos, setPhotos] = useState(0)
    const [rec, setRec] = useState({})
    const [all, setAll] = useState(false)
    const recipients = all ? ['Visi · Kalnų Terasos'] : OWNERS.filter((o, i) => rec[i])
    const publish = () => {
      if (!title.trim() || recipients.length === 0) return
      onPublish({ title: title.trim(), body: body.trim(), date: '2026 06 10', photos, recipients })
      setTitle(''); setBody(''); setPhotos(0); setRec({}); setAll(false)
    }
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PanelHead title="Naujas atnaujinimas" subtitle="Parašykite statybos naujieną ir pasirinkite, kam pranešti" />
        <div className="field" style={{ margin: 0 }}><label>Pavadinimas</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pvz. vonios plytelės paklotos" /></div>
        <div className="field" style={{ margin: 0 }}><label>Žinutė</label><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Aprašykite atliktus darbus…" /></div>
        <div>
          <span className="sec-sub" style={{ display: 'block', marginBottom: 8 }}>Nuotraukos</span>
          <div className="rowflex" style={{ gap: 10 }}>
            {Array.from({ length: photos }).map((_, k) => <div key={k} style={{ width: 64, flex: '0 0 auto' }}><PhotoTile color={PHOTO[k % PHOTO.length]} ratio="1 / 1" /></div>)}
            <button onClick={() => setPhotos(photos + 1)} style={{ width: 64, height: 64, flex: '0 0 auto', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--line-300)', background: 'var(--surface-sunken)', color: 'var(--ink-400)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Pridėti nuotrauką">
              <i className="ph ph-plus" style={{ fontSize: 22 }} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div>
          <div className="between" style={{ marginBottom: 10 }}>
            <span className="sec-sub">Kam pranešti</span>
            <Checkbox label="Visiems gyventojams" checked={all} onChange={setAll} />
          </div>
          {!all && (
            <div className="grid-2" style={{ gap: 8 }}>
              {OWNERS.map((o, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', boxShadow: 'inset 0 0 0 1px var(--line-100)' }}>
                  <Checkbox label={o} checked={!!rec[i]} onChange={(v) => setRec({ ...rec, [i]: v })} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rowflex" style={{ gap: 10, marginTop: 4 }}>
          <Button variant="accent" iconLeft="ph ph-paper-plane-tilt" onClick={publish}>Skelbti ir pranešti</Button>
          <span className="muted" style={{ fontSize: 'var(--text-small)' }}>{recipients.length} gavėjai</span>
        </div>
      </Card>
    )
  }

  function BroadcastItem({ b }) {
    return (
      <div
        className="row"
        role="button"
        tabIndex={0}
        onClick={() => setSelected(b)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(b)}
        style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
      >
        <div className="between" style={{ width: '100%' }}>
          <div>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{b.title}</div>
            <div className="muted" style={{ fontSize: 'var(--text-small)', marginTop: 2 }}>{b.date} · {b.photos} nuotr.</div>
          </div>
          <IconButton icon="ph ph-dots-three" variant="ghost" size="sm" ariaLabel="Daugiau" onClick={(e) => { e.stopPropagation(); setSelected(b) }} />
        </div>
        {b.body && <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)' }}>{b.body}</p>}
        <div className="chips">
          {b.recipients.map((r, i) => <span key={i} className="chip" style={{ cursor: 'default', height: 26, fontSize: 'var(--text-small)', display: 'inline-flex', alignItems: 'center' }}><i className="ph ph-bell" style={{ marginRight: 6 }} aria-hidden="true" />{r}</span>)}
        </div>
      </div>
    )
  }

  const [itemsData, refresh] = useRepo('listBroadcasts')
  const items = itemsData || []

  return (
    <Shell role="admin" nav="darbu-eiga"
      title="Darbų eiga" subtitle="Skelbkite statybos naujienas ir praneškite butų savininkams.">
      <div className="content grid-aside">
        <Composer onPublish={(b) => repo.addBroadcast(b).then(refresh)} />
        <Card>
          <PanelHead title="Ankstesni atnaujinimai" subtitle={`${items.length} paskelbta`} />
          <div className="stack-sm" style={{ gap: 12 }}>
            {items.map((b, i) => <BroadcastItem key={i} b={b} />)}
          </div>
        </Card>
      </div>
      {selected && (
        <Modal title={selected.title} subtitle={selected.date} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="muted" style={{ fontSize: 'var(--text-small)' }}>{selected.date} · {selected.photos} nuotr.</div>
            {selected.body && <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)' }}>{selected.body}</p>}
            <div>
              <span className="sec-sub" style={{ display: 'block', marginBottom: 8 }}>Gavėjai</span>
              <div className="chips">
                {selected.recipients.map((r, i) => (
                  <span key={i} className="chip" style={{ height: 26, fontSize: 'var(--text-small)', display: 'inline-flex', alignItems: 'center' }}>
                    <i className="ph ph-bell" style={{ marginRight: 6 }} aria-hidden="true" />{r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
