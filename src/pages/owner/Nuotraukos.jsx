import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead } from '../../shared/UI.jsx'

function shade(base, i) {
  const amt = (i % 5) * 6 - 8
  const n = parseInt(base.slice(1), 16)
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt
  const c = (x) => Math.max(0, Math.min(255, x))
  return `rgb(${c(r)},${c(g)},${c(b)})`
}

function buildAll(albums) {
  const all = []
  albums.forEach((al, ai) => {
    for (let i = 0; i < al.count; i++) all.push({ album: al.name, ai, color: shade(al.colors[i % al.colors.length], i), idx: i })
  })
  return all
}

export default function Nuotraukos() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton } = DS

  function Lightbox({ start, onClose, all }) {
    const [i, setI] = React.useState(start)
    const p = all[i]
    const go = (d) => setI((x) => (x + d + all.length) % all.length)
    React.useEffect(() => {
      const h = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); if (e.key === 'Escape') onClose() }
      window.addEventListener('keydown', h)
      return () => window.removeEventListener('keydown', h)
    }, [])
    return (
      <div className="modal-scrim" style={{ background: 'rgba(3,3,2,0.82)' }} onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 920 }}>
          <div className="between" style={{ width: '100%', color: '#fff' }}>
            <div>
              <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)' }}>{p.album}</div>
              <div style={{ fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.6)' }}>{i + 1} iš {all.length}</div>
            </div>
            <IconButton icon="ph ph-x" variant="ghost" ariaLabel="Uždaryti" onClick={onClose} style={{ color: '#fff' }} />
          </div>
          <div className="rowflex" style={{ width: '100%', gap: 16 }}>
            <IconButton icon="ph ph-caret-left" variant="outline" size="lg" ariaLabel="Ankstesnė" onClick={() => go(-1)} />
            <div style={{ flex: 1, aspectRatio: '3 / 2', borderRadius: 'var(--radius-lg)', background: p.color, boxShadow: 'var(--shadow-lg)' }} />
            <IconButton icon="ph ph-caret-right" variant="outline" size="lg" ariaLabel="Kita" onClick={() => go(1)} />
          </div>
        </div>
      </div>
    )
  }

  function Album({ al, ai, onOpen, all }) {
    const [exp, setExp] = React.useState(false)
    const show = exp ? al.count : Math.min(al.count, 8)
    return (
      <Card>
        <PanelHead title={al.name} subtitle={`${al.count} nuotraukos`}
          action={<Button variant="secondary" size="sm" iconRight={exp ? 'ph ph-caret-up' : 'ph ph-caret-down'} onClick={() => setExp(!exp)}>{exp ? 'Suskleisti' : 'Rodyti visas'}</Button>} />
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {Array.from({ length: show }).map((_, i) => {
            const globalIdx = all.findIndex((x) => x.ai === ai && x.idx === i)
            return (
              <button key={i} onClick={() => onOpen(globalIdx)} style={{
                border: 'none', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)',
                aspectRatio: '4 / 3', background: shade(al.colors[i % al.colors.length], i),
                transition: 'transform var(--dur-fast) var(--ease-standard)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }} />
            )
          })}
        </div>
      </Card>
    )
  }

  const [lb, setLb] = React.useState(null)
  const [albumsData] = useRepo('list', 'photoAlbums')
  const albums = albumsData || []
  const all = React.useMemo(() => buildAll(albums), [albums])

  return (
    <Shell role="gyventojas" nav="nuotraukos"
      title="Nuotraukos" subtitle="Pastato ir buto nuotraukų galerija pagal etapus."
      headerActions={<Button variant="primary" iconLeft="ph ph-upload-simple">Įkelti</Button>}>
      <div className="content stack">
        {albums.map((al, ai) => <Album key={ai} al={al} ai={ai} onOpen={setLb} all={all} />)}
      </div>
      {lb !== null && <Lightbox start={lb} all={all} onClose={() => setLb(null)} />}
    </Shell>
  )
}
