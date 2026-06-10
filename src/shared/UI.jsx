import React from 'react'
import ReactDOM from 'react-dom'
import repo from '../lib/repo.js'

// DS components come from the globally loaded bundle
const getDS = () => window.MitedaDesignSystem_acc833 || {}

function PanelHead({ title, subtitle, action }) {
  return (
    <div className="panel-head">
      <div className="panel-head__tx">
        <h2 className="sec-title">{title}</h2>
        {subtitle && <p className="sec-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Stat({ icon, label, value, accent }) {
  return (
    <div className="stat">
      <span className="stat__k">{icon && <i className={icon} aria-hidden="true" />}{label}</span>
      <span className="stat__v" style={accent ? { color: 'var(--brand-green-strong)' } : undefined}>{value}</span>
    </div>
  )
}

function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.key} role="tab" aria-selected={t.key === value}
          className={'tabs__btn' + (t.key === value ? ' is-active' : '')}
          onClick={() => onChange(t.key)}>
          {t.label}{t.count != null && <span style={{ opacity: 0.55, marginLeft: 6 }}>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

function FilterChips({ items, value, onChange }) {
  return (
    <div className="chips">
      {items.map((it) => (
        <button key={it} className={'chip' + (it === value ? ' is-active' : '')} onClick={() => onChange(it)}>{it}</button>
      ))}
    </div>
  )
}

function Modal({ title, subtitle, onClose, children, footer, width }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const DS = getDS()
  const IconButton = DS.IconButton

  const portalRoot = React.useMemo(() => {
    let el = document.getElementById('miteda-portal')
    if (!el) {
      el = document.createElement('div')
      el.id = 'miteda-portal'
      document.getElementById('root').appendChild(el)
    }
    return el
  }, [])

  return ReactDOM.createPortal(
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" style={width ? { maxWidth: width } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div className="panel-head__tx">
            <h2 className="sec-title">{title}</h2>
            {subtitle && <p className="sec-sub">{subtitle}</p>}
          </div>
          {IconButton
            ? <IconButton icon="ph ph-x" variant="ghost" ariaLabel="Uždaryti" onClick={onClose} />
            : <button onClick={onClose} aria-label="Uždaryti"><i className="ph ph-x" /></button>
          }
        </div>
        {children}
        {footer && <div className="between" style={{ marginTop: 8, justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>,
    portalRoot
  )
}

const ROLE_TONE = { Gyventojas: 'neutral', Administracija: 'success', Meistras: 'event' }

function Thread({ items }) {
  const DS = getDS()
  const Avatar = DS.Avatar
  const Badge = DS.Badge

  return (
    <div className="thread">
      {items.map((m, i) => (
        <div className="msg" key={i}>
          {Avatar && <Avatar name={m.who} size={36} tone={m.role === 'Administracija' ? 'green' : 'default'} />}
          <div className="msg__b">
            <div className="msg__head">
              <span className="msg__who">{m.who}</span>
              {m.role && Badge && <Badge tone={ROLE_TONE[m.role] || 'neutral'}>{m.role}</Badge>}
              <span className="msg__time">{m.time}</span>
            </div>
            <div className="msg__bubble">{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Composer({ placeholder, onSend, button }) {
  const [v, setV] = React.useState('')
  const send = () => { if (v.trim() && onSend) { onSend(v.trim()); setV('') } }

  const DS = getDS()
  const Button = DS.Button

  return (
    <div className="composer">
      <input value={v} placeholder={placeholder || 'Rašyti žinutę…'}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
      {Button
        ? <Button variant="accent" iconLeft="ph ph-paper-plane-tilt" onClick={send}>{button || 'Siųsti'}</Button>
        : <button onClick={send}>{button || 'Siųsti'}</button>
      }
    </div>
  )
}

function StatusBadge({ map, value }) {
  const DS = getDS()
  const Badge = DS.Badge
  const s = map[value]
  if (!s) return null
  return Badge ? <Badge tone={s.tone}>{s.label}</Badge> : <span>{s.label}</span>
}

function PhotoTile({ color, label, onClick, ratio }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        border: 'none', padding: 0, cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative',
        aspectRatio: ratio || '4 / 3', background: color, display: 'block', width: '100%',
      }}>
      {label && (
        <span style={{
          position: 'absolute', left: 10, bottom: 10, fontSize: 'var(--text-small)',
          fontWeight: 'var(--fw-medium)', color: '#fff', background: 'rgba(3,3,2,0.35)',
          padding: '3px 8px', borderRadius: 'var(--radius-pill)', backdropFilter: 'blur(4px)',
        }}>{label}</span>
      )}
    </button>
  )
}

// Data hook — reads through repo (the backend seam).
// const [contacts, refresh] = useRepo("listContacts");
// const [notices]           = useRepo("list", "notices");
function useRepo(method, ...args) {
  const [data, setData] = React.useState(null)
  const argKey = JSON.stringify(args)
  const load = React.useCallback(() => {
    const fn = repo[method]
    return fn ? fn(...args).then(setData) : Promise.resolve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, argKey])
  React.useEffect(() => { load() }, [load])
  return [data, load]
}

export { PanelHead, Stat, Tabs, FilterChips, Modal, Thread, Composer, StatusBadge, PhotoTile, useRepo }
