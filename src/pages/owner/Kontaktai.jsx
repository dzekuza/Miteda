import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, FilterChips } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

export default function Kontaktai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, IconButton, Avatar } = DS

  function ContactCard({ c }) {
    return (
      <Card tone="flat" style={{ borderRadius: 'var(--radius-md)', display: 'flex', gap: 16, padding: 20 }}>
        <Avatar name={c.name} size={48} tone="default" />
        <div className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.name}</div>
            <div className="muted" style={{ fontSize: 'var(--text-body)' }}>{c.role} · {c.company}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="rowflex" style={{ gap: 8, fontSize: 'var(--text-body)', color: 'var(--ink-700)' }}><i className="ph ph-phone" style={{ color: 'var(--ink-400)' }} aria-hidden="true" />{c.phone}</span>
            <span className="rowflex" style={{ gap: 8, fontSize: 'var(--text-body)', color: 'var(--ink-700)' }}><i className="ph ph-envelope-simple" style={{ color: 'var(--ink-400)' }} aria-hidden="true" />{c.email}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '0 0 auto' }}>
          <IconButton icon="ph ph-phone" variant="solid" ariaLabel="Skambinti" />
          <IconButton icon="ph ph-envelope-simple" variant="outline" ariaLabel="Rašyti" />
        </div>
      </Card>
    )
  }

  const [cat, setCat] = React.useState('Visi')
  const [contactsData] = useRepo('listContacts')
  const contacts = contactsData || []
  const shown = cat === 'Visi' ? contacts : contacts.filter((c) => c.cat === cat)

  return (
    <Shell role="gyventojas" nav="kontaktai"
      title="Kontaktai" subtitle="Visi su jūsų pastatu susiję specialistai ir tarnybos.">
      <div className="content stack">
        <Card>
          <PanelHead title="Specialistų sąrašas" subtitle="Greitai susisiekite skambučiu ar el. paštu"
            action={<FilterChips items={MD.contactCats} value={cat} onChange={setCat} />} />
          <div className="grid-2">
            {shown.map((c, i) => <ContactCard key={i} c={c} />)}
          </div>
        </Card>
      </div>
    </Shell>
  )
}
