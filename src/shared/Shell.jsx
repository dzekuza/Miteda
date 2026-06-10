import React from 'react'
import { Link } from 'react-router-dom'

// DS components come from the globally loaded bundle
const getDS = () => window.MitedaDesignSystem_acc833 || {}

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
        <Chip {...r.chip} />
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

function Header({ title, subtitle, actions, onMenu }) {
  const DS = getDS()
  const IconButton = DS.IconButton
  const Input = DS.Input

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
          <h1 className="hdr__title">{title}</h1>
          {subtitle && <p className="hdr__sub">{subtitle}</p>}
        </div>
      </div>
      <div className="hdr__r">
        {actions}
        {Input && <Input className="hdr__search" placeholder="Ieškoti…" iconLeft="ph ph-magnifying-glass" />}
        <span className="hdr__io">
          {IconButton && <>
            <IconButton icon="ph ph-bell" variant="soft" dot ariaLabel="Pranešimai" />
            <IconButton icon="ph ph-chat-circle" variant="soft" dot ariaLabel="Žinutės" />
          </>}
        </span>
      </div>
    </header>
  )
}

export default function Shell({ role, nav, title, subtitle, headerActions, children }) {
  const [open, setOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem('miteda-sb-collapsed') === '1' } catch (e) { return false }
  })
  const toggle = () => setCollapsed((c) => {
    const n = !c
    try { localStorage.setItem('miteda-sb-collapsed', n ? '1' : '0') } catch (e) {}
    return n
  })
  return (
    <div className={'app-shell' + (open ? ' nav-open' : '') + (collapsed ? ' sb-collapsed' : '')}>
      <div className="sidebar-scrim" onClick={() => setOpen(false)} />
      <Sidebar role={role} nav={nav} collapsed={collapsed} onToggle={toggle} />
      <main className="main">
        <Header title={title} subtitle={subtitle} actions={headerActions} onMenu={() => setOpen(true)} />
        {children}
      </main>
    </div>
  )
}

export { ROLES }
