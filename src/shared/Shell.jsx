import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { runPageEnter } from '../lib/animations'

// DS components come from the globally loaded bundle
const getDS = () => window.MitedaDesignSystem_acc833 || {}

const SEGMENT_LABELS = {
  admin: 'Administracija', owner: 'Savininkas', statyba: 'Statyba',
  objektai: 'Objektai', objektas: 'Objektas', defektai: 'Defektai',
  kontaktai: 'Kontaktai', darbai: 'Darbai', zinutes: 'Žinutės',
  pagrindinis: 'Pagrindinis', nuotraukos: 'Nuotraukos', sutartys: 'Sutartys',
  tvarkarastis: 'Tvarkaraštis', skelbimai: 'Skelbimai', bendruomene: 'Bendruomenė',
  nustatymai: 'Nustatymai', finansai: 'Finansai', ataskaitos: 'Ataskaitos',
  vadovas: 'Vadovas', darbininkas: 'Darbininkas',
}

const ROLES = {
  gyventojas: {
    folder: 'owner', home: '/owner/pagrindinis', label: 'Gyventojas', icon: 'ph ph-house',
    chip: { ic: 'ph ph-buildings', title: 'Kalnų Terasos', sub: 'Butas B-12' },
    account: { name: 'Lukas Petrauskas', sub: 'lukas.petrauskas@gmail.com', tone: 'forest' },
    nav: [
      { key: 'pagrindinis', icon: 'ph ph-house', label: 'Pagrindinis', to: '/owner/pagrindinis' },
      { key: 'defektai', icon: 'ph ph-warning-octagon', label: 'Defektai', to: '/owner/defektai' },
      { key: 'nuotraukos', icon: 'ph ph-images-square', label: 'Nuotraukos', to: '/owner/nuotraukos' },
      { key: 'sutartys', icon: 'ph ph-file-text', label: 'Paslaugų sutartys', to: '/owner/sutartys' },
      { key: 'kontaktai', icon: 'ph ph-address-book', label: 'Kontaktai', to: '/owner/kontaktai' },
      { key: 'tvarkarastis', icon: 'ph ph-calendar-dots', label: 'Tvarkaraštis', to: '/owner/tvarkarastis' },
      { key: 'skelbimai', icon: 'ph ph-megaphone', label: 'Skelbimų lenta', to: '/owner/skelbimai' },
      { key: 'zinutes', icon: 'ph ph-chat-circle', label: 'Žinutės', to: '/owner/zinutes', group: 'bottom' },
      { key: 'bendruomene', icon: 'ph ph-users-three', label: 'Bendruomenė', to: '/owner/bendruomene', group: 'bottom' },
      { key: 'darbai', icon: 'ph ph-wrench', label: 'Remonto darbai', to: '/owner/darbai', group: 'bottom' },
      { key: 'nustatymai', icon: 'ph ph-gear', label: 'Nustatymai', to: '/owner/nustatymai', group: 'bottom' },
    ],
  },
  admin: {
    folder: 'admin', home: '/admin/objektai', label: 'Administracija', icon: 'ph ph-shield-check',
    chip: { ic: 'ph ph-buildings', title: 'Miteda', sub: 'Administravimas' },
    account: { name: 'Aistė Vasiliauskienė', sub: 'Pastato administratorė', tone: 'green' },
    nav: [
      { key: 'objektai', icon: 'ph ph-buildings', label: 'Objektai', to: '/admin/objektai' },
      { key: 'defektai', icon: 'ph ph-warning-octagon', label: 'Defektai', to: '/admin/defektai' },
      { key: 'kontaktai', icon: 'ph ph-address-book', label: 'Kontaktai', to: '/admin/kontaktai' },
      { key: 'darbai', icon: 'ph ph-wrench', label: 'Remonto darbai', to: '/admin/darbai' },
      { key: 'darbu-eiga', icon: 'ph ph-megaphone', label: 'Darbų eiga', to: '/admin/darbu-eiga' },
      { key: 'zinutes', icon: 'ph ph-chat-circle', label: 'Žinutės', to: '/admin/zinutes' },
    ],
  },
  statyba: {
    folder: 'statyba', home: '/statyba/vadovas', label: 'Statyba', icon: 'ph ph-hard-hat',
    chip: { ic: 'ph ph-buildings', title: 'Kalnų Terasos', sub: 'Butas B-12 · remontas' },
    account: { name: 'Andrius Jankauskas', sub: 'Darbų vadovas', tone: 'green' },
    nav: [
      { key: 'vadovas', icon: 'ph ph-clipboard-text', label: 'Vadovas', to: '/statyba/vadovas' },
      { key: 'darbininkas', icon: 'ph ph-hard-hat', label: 'Darbininkas', to: '/statyba/darbininkas' },
    ],
  },
}

const ROLE_ORDER = ['gyventojas', 'admin', 'statyba']

function RoleSwitch({ role }) {
  return (
    <div className="sb__role">
      <span className="sb__role-cap">Demo · peržiūra kaip</span>
      <div className="sb__role-seg" role="tablist" aria-label="Rolės perjungimas">
        {ROLE_ORDER.map((rk) => {
          const r = ROLES[rk]
          const active = rk === role
          return (
            <Link key={rk} className={'sb__role-btn' + (active ? ' is-active' : '')}
              to={active ? '#' : r.home} title={r.label}
              aria-selected={active} role="tab">
              <i className={r.icon} aria-hidden="true" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Chip({ ic, title, sub }) {
  return (
    <button type="button" className="sb__chip">
      <span className="sb__chip-ic"><i className={ic} aria-hidden="true" /></span>
      <span className="sb__chip-tx">
        <span className="sb__chip-title">{title}</span>
        <span className="sb__chip-sub">{sub}</span>
      </span>
      <i className="ph ph-caret-up-down" style={{ fontSize: 16, color: 'rgba(255,254,252,0.55)' }} aria-hidden="true" />
    </button>
  )
}

function Sidebar({ role, nav, collapsed, onToggle }) {
  const r = ROLES[role]
  const DS = getDS()
  const SidebarItem = DS.SidebarItem
  const Avatar = DS.Avatar

  const top = r.nav.filter((n) => n.group !== 'bottom')
  const bottom = r.nav.filter((n) => n.group === 'bottom')

  return (
    <aside className="sidebar">
      <div className="sb__top">
        <Link className="plain sb__brand" to="/">
          <img className="sb__logo-full" src="/miteda-logo-light.svg" alt="Miteda" />
          <img className="sb__logo-mark" src="/miteda-mark.svg" alt="Miteda" />
        </Link>
        <button type="button" className="sb__toggle" onClick={onToggle}
          aria-label={collapsed ? 'Išskleisti šoninę juostą' : 'Sutraukti šoninę juostą'} title="Sutraukti / išskleisti">
          <i className={collapsed ? 'ph ph-sidebar' : 'ph ph-sidebar-simple'} aria-hidden="true" />
        </button>
      </div>
      <nav className="sb__nav">
        {top.map((n) => (
          <Link key={n.key} className="plain" to={n.to}>
            {SidebarItem
              ? <SidebarItem icon={n.icon} active={n.key === nav} title={n.label}>{n.label}</SidebarItem>
              : <span className={'sb-item' + (n.key === nav ? ' is-active' : '')}><i className={n.icon} />{n.label}</span>
            }
          </Link>
        ))}
        {bottom.length > 0 && <div className="sb__divider" />}
        {bottom.map((n) => (
          <Link key={n.key} className="plain" to={n.to}>
            {SidebarItem
              ? <SidebarItem icon={n.icon} active={n.key === nav} title={n.label}>{n.label}</SidebarItem>
              : <span className={'sb-item' + (n.key === nav ? ' is-active' : '')}><i className={n.icon} />{n.label}</span>
            }
          </Link>
        ))}
      </nav>
      <div className="sb__spacer" />
      <RoleSwitch role={role} />
      <div className="sb__foot">
        <button type="button" className="sb__chip">
          {Avatar && <Avatar name={r.account.name} tone={r.account.tone} size={36} />}
          <span className="sb__chip-tx">
            <span className="sb__chip-title">{r.account.name}</span>
            <span className="sb__chip-sub">{r.account.sub}</span>
          </span>
          <i className="ph ph-caret-up-down" style={{ fontSize: 16, color: 'rgba(255,254,252,0.55)' }} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}

const NOTIFICATIONS = [
  { id: 1, icon: 'ph ph-warning-octagon', tone: 'orange', title: 'Naujas defektas', body: 'B-12 · Lukas Petrauskas pranešė apie santechnikos gedimą.', time: 'Prieš 5 min', unread: true },
  { id: 2, icon: 'ph ph-file-text', tone: 'green', title: 'Sutartis pasirašyta', body: 'A-4 · G. Janušienė pasirašė priežiūros sutartį.', time: 'Prieš 1 val', unread: true },
  { id: 3, icon: 'ph ph-wrench', tone: 'green', title: 'Projektas atnaujintas', body: 'Vonios plytelės — pažanga atnaujinta iki 80%.', time: 'Prieš 3 val', unread: false },
  { id: 4, icon: 'ph ph-megaphone', tone: 'neutral', title: 'Naujas skelbimas', body: 'Administracija paskelbė darbų eigos atnaujinimą.', time: 'Vakar', unread: false },
  { id: 5, icon: 'ph ph-users-three', tone: 'neutral', title: 'Bendruomenės žinutė', body: 'C-21 · M. Šimkus parašė į bendruomenės forumą.', time: 'Vakar', unread: false },
]

function Header({ title, subtitle, actions, onMenu, role, breadcrumbs }) {
  const DS = getDS()
  const IconButton = DS.IconButton
  const Input = DS.Input
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = React.useState(false)
  const [popoverPos, setPopoverPos] = React.useState({ top: 0, left: 8, width: 360 })
  const [read, setRead] = React.useState(new Set())
  const notifRef = React.useRef(null)

  const r = ROLES[role] || ROLES.gyventojas
  const messagesPath = role === 'gyventojas' ? '/owner/zinutes' : '/admin/zinutes'
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !read.has(n.id)).length

  React.useEffect(() => {
    if (!notifOpen) return
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  const openNotif = () => {
    if (notifRef.current && window.innerWidth <= 680) {
      const rect = notifRef.current.getBoundingClientRect()
      const w = Math.min(360, window.innerWidth - 16)
      const left = Math.max(8, Math.min(rect.right - w, window.innerWidth - w - 8))
      setPopoverPos({ mobile: true, top: rect.bottom + 8, left, width: w })
    } else {
      setPopoverPos({ mobile: false })
    }
    setNotifOpen((o) => !o)
    setRead(new Set(NOTIFICATIONS.map((n) => n.id)))
  }

  const toneColor = { orange: 'var(--orange)', green: 'var(--brand-green)', neutral: 'var(--ink-300)' }

  return (
    <header className="hdr">
      <div className="hdr__l">
        <button type="button" className="menu-btn" onClick={onMenu} aria-label="Meniu"
          style={{ width: 44, height: 44, flex: '0 0 auto',
            borderRadius: 'var(--radius-sm)', border: 'none',
            background: 'var(--overlay-ink-04)', color: 'var(--ink-700)', cursor: 'pointer' }}>
          <i className="ph ph-list" style={{ fontSize: 22 }} aria-hidden="true" />
        </button>
        <div className="panel-head__tx">
          {breadcrumbs && breadcrumbs.length > 1 && (
            <nav className="hdr__bc" aria-label="Breadcrumb">
              {breadcrumbs.map((c, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="hdr__bc-sep" aria-hidden="true">/</span>}
                  {c.href && i < breadcrumbs.length - 1
                    ? <Link className="hdr__bc-link" to={c.href}>{c.label}</Link>
                    : <span className="hdr__bc-cur" aria-current={i === breadcrumbs.length - 1 ? 'page' : undefined}>{c.label}</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="hdr__title">{title}</h1>
          {subtitle && <p className="hdr__sub">{subtitle}</p>}
        </div>
      </div>
      <div className="hdr__r">
        {actions && <div className="hdr__actions">{actions}</div>}
        {Input && <Input className="hdr__search" placeholder="Ieškoti…" iconLeft="ph ph-magnifying-glass" />}
        <span className="hdr__io">
          {IconButton && <>
            <span ref={notifRef} style={{ position: 'relative' }}>
              <IconButton icon="ph ph-bell" variant="soft" dot={unreadCount > 0} ariaLabel="Pranešimai"
                onClick={openNotif} />
              {notifOpen && (
                <div style={popoverPos.mobile
                  ? { position: 'fixed', top: popoverPos.top, left: popoverPos.left, width: popoverPos.width, zIndex: 200, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--line-200)', overflow: 'hidden' }
                  : { position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 360, zIndex: 200, background: 'var(--surface-card)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--line-200)', overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid var(--line-100)' }}>
                    <span style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Pranešimai</span>
                    {unreadCount > 0 && <span style={{ fontSize: 'var(--text-small)', color: 'var(--brand-green-strong)', fontWeight: 'var(--fw-medium)' }}>{unreadCount} naujų</span>}
                  </div>
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} style={{
                        display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer',
                        background: n.unread && !read.has(n.id) ? 'var(--brand-green-faint)' : 'transparent',
                        borderBottom: '1px solid var(--line-100)',
                        transition: 'background 120ms',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = n.unread && !read.has(n.id) ? 'var(--brand-green-faint)' : 'transparent'}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                          <i className={n.icon} style={{ fontSize: 18, color: toneColor[n.tone] }} aria-hidden="true" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', marginBottom: 2 }}>{n.title}</div>
                          <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)', marginBottom: 4 }}>{n.body}</div>
                          <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line-100)' }}>
                    <button onClick={() => setNotifOpen(false)} style={{ width: '100%', padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', color: 'var(--ink-500)', fontSize: 'var(--text-small)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                      Žiūrėti visus pranešimus
                    </button>
                  </div>
                </div>
              )}
            </span>
            <IconButton icon="ph ph-chat-circle" variant="soft" dot ariaLabel="Žinutės" onClick={() => navigate(messagesPath)} />
          </>}
        </span>
      </div>
    </header>
  )
}

export default function Shell({ role, nav, title, subtitle, headerActions, breadcrumbs, children }) {
  const [open, setOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem('miteda-sb-collapsed') === '1' } catch (e) { return false }
  })
  const location = useLocation()
  React.useLayoutEffect(() => { runPageEnter() }, [location.pathname])
  const toggle = () => setCollapsed((c) => {
    const n = !c
    try { localStorage.setItem('miteda-sb-collapsed', n ? '1' : '0') } catch (e) {}
    return n
  })

  const autoCrumbs = React.useMemo(() => {
    const segs = location.pathname.split('/').filter(Boolean)
    if (segs.length < 2) return null
    return segs.map((seg, i) => ({
      label: SEGMENT_LABELS[seg] || seg,
      href: '/' + segs.slice(0, i + 1).join('/'),
    }))
  }, [location.pathname])

  const crumbs = breadcrumbs ?? autoCrumbs

  return (
    <div className={'app-shell' + (open ? ' nav-open' : '') + (collapsed ? ' sb-collapsed' : '')}>
      <div className="sidebar-scrim" onClick={() => setOpen(false)} />
      <Sidebar role={role} nav={nav} collapsed={collapsed} onToggle={toggle} />
      <main className="main">
        <Header title={title} subtitle={subtitle} actions={headerActions} onMenu={() => setOpen(true)} role={role} breadcrumbs={crumbs} />
        {children}
      </main>
    </div>
  )
}

export { ROLES }
