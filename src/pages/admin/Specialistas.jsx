import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { Tabs } from '../../shared/UI.jsx'
import MD from '../../lib/data.js'

const PHOTO_COLS = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b', '#aeb8a0', '#a0aeb8']

const WORK_HISTORY = [
  { id: 'D-012', title: 'Stogo nuotėkis', apt: 'B-12', date: '2026-04-10', status: 'Atlikta' },
  { id: 'D-018', title: 'Langų kondensatas', apt: 'B-07', date: '2026-05-02', status: 'Vykdoma' },
  { id: 'D-025', title: 'Durų spyna', apt: 'A-7', date: '2026-05-28', status: 'Atlikta' },
]

const MESSAGES = [
  { from: 'Administracija', body: 'Laba diena! Ar galite atvykti rytoj apžiūrėti defekto?', time: '09:10' },
  { from: 'me', body: 'Taip, atvyksiu 11:00.', time: '09:15' },
  { from: 'Administracija', body: 'Puiku, ačiū!', time: '09:16' },
]

const TABS = [
  { key: 'info', label: 'Informacija' },
  { key: 'work', label: 'Darbai' },
  { key: 'photos', label: 'Nuotraukos' },
  { key: 'chat', label: 'Pokalbiai' },
]

function toSlug(name) {
  return name.toLowerCase()
    .replace(/ą/g,'a').replace(/č/g,'c').replace(/ę/g,'e').replace(/ė/g,'e')
    .replace(/į/g,'i').replace(/š/g,'s').replace(/ų/g,'u').replace(/ū/g,'u').replace(/ž/g,'z')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}


function InfoCard({ icon, label, value }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <i className={icon} style={{ fontSize: 14, color: 'var(--ink-400)' }} />
        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{value || '—'}</span>
    </div>
  )
}

export { toSlug }

export default function Specialistas() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('info')

  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, Button, Card } = DS

  const contacts = MD.contacts || []
  const person = contacts.find((c) => toSlug(c.name) === slug)

  if (!person) {
    return (
      <Shell role="admin" nav="kontaktai" title="Kontaktas nerastas">
        <div className="content">
          <Card>
            <p style={{ color: 'var(--ink-400)', padding: 24 }}>Kontaktas nerastas.</p>
            <Button variant="secondary" iconLeft="ph ph-arrow-left" onClick={() => navigate('/admin/kontaktai')}>Grįžti</Button>
          </Card>
        </div>
      </Shell>
    )
  }

  return (
    <Shell role="admin" nav="kontaktai"
      title={person.name}
      subtitle={`${person.role} · ${person.company}`}
      headerActions={
        <Link className="plain" to="/admin/kontaktai">
          <Button variant="secondary" iconLeft="ph ph-arrow-left">Kontaktai</Button>
        </Link>
      }>
      <div className="content">
        <Card>
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingBottom: 24, borderBottom: '1px solid var(--line-100)', marginBottom: 24, flexWrap: 'wrap' }}>
            {Avatar && <Avatar name={person.name} size={72} />}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 'var(--text-large)', fontWeight: 'var(--fw-semibold)', color: 'var(--ink-900)' }}>{person.name}</h2>
                {Badge && <Badge tone="neutral">{person.cat}</Badge>}
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 'var(--text-body)', color: 'var(--ink-500)' }}>{person.role} · {person.company}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={`tel:${person.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line-200)', background: 'var(--surface-card)', color: 'var(--ink-700)', fontSize: 'var(--text-small)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                  <i className="ph ph-phone" style={{ fontSize: 14 }} />{person.phone}
                </a>
                <a href={`mailto:${person.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line-200)', background: 'var(--surface-card)', color: 'var(--ink-700)', fontSize: 'var(--text-small)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                  <i className="ph ph-envelope" style={{ fontSize: 14 }} />{person.email}
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {Button && <>
                <Button variant="secondary" iconLeft="ph ph-chat-circle" size="sm" onClick={() => navigate('/admin/zinutes')}>Žinutė</Button>
                <Button variant="secondary" iconLeft="ph ph-phone" size="sm">Skambinti</Button>
              </>}
            </div>
          </div>

          {/* Stats + Tabs */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { icon: 'ph ph-wrench', label: 'Darbai', value: WORK_HISTORY.length, sub: 'Iš viso' },
                { icon: 'ph ph-check-circle', label: 'Atlikta', value: WORK_HISTORY.filter((w) => w.status === 'Atlikta').length, sub: 'Užbaigti' },
                { icon: 'ph ph-clock', label: 'Vykdoma', value: WORK_HISTORY.filter((w) => w.status === 'Vykdoma').length, sub: 'Aktyvūs' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', textAlign: 'center' }}>
                  <i className={s.icon} style={{ fontSize: 20, color: 'var(--ink-400)', marginBottom: 4, display: 'block' }} />
                  <span style={{ display: 'block', fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-semibold)', color: 'var(--ink-900)', lineHeight: 1.2 }}>{s.value}</span>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--ink-400)', marginTop: 2 }}>{s.sub}</span>
                </div>
              ))}
            </div>
            <Tabs tabs={TABS} value={tab} onChange={setTab} />
          </div>

          {/* Info */}
          {tab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              <InfoCard icon="ph ph-user" label="Vardas, pavardė" value={person.name} />
              <InfoCard icon="ph ph-briefcase" label="Pareigos" value={person.role} />
              <InfoCard icon="ph ph-buildings" label="Įmonė" value={person.company} />
              <InfoCard icon="ph ph-tag" label="Kategorija" value={person.cat} />
              <InfoCard icon="ph ph-phone" label="Telefonas" value={person.phone} />
              <InfoCard icon="ph ph-envelope" label="El. paštas" value={person.email} />
            </div>
          )}

          {/* Work history */}
          {tab === 'work' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {WORK_HISTORY.map((w) => (
                <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <i className="ph ph-wrench" style={{ fontSize: 18, color: 'var(--ink-400)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{w.title}</span>
                    <span style={{ display: 'block', fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{w.id} · Butas {w.apt} · {w.date}</span>
                  </div>
                  {Badge && <Badge tone={w.status === 'Atlikta' ? 'success' : 'event'}>{w.status}</Badge>}
                </div>
              ))}
            </div>
          )}

          {/* Photos */}
          {tab === 'photos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {PHOTO_COLS.map((col, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 110, background: col }} />
                  <div style={{ padding: '6px 8px', background: 'var(--surface-sunken)' }}>
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-600)', fontFamily: 'var(--font-sans)' }}>Nuotrauka {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat */}
          {tab === 'chat' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {MESSAGES.map((m, i) => {
                  const isMe = m.from === 'me'
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                      {!isMe && Avatar && <Avatar name={person.name} size={28} />}
                      <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: isMe ? 'var(--brand-green)' : 'var(--surface-sunken)', color: isMe ? '#fff' : 'var(--ink-900)', fontSize: 'var(--text-body)', lineHeight: 1.5 }}>
                        {m.body}
                        <span style={{ display: 'block', fontSize: 11, marginTop: 4, opacity: 0.65, textAlign: isMe ? 'right' : 'left' }}>{m.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly placeholder="Rašyti žinutę…" style={{ flex: 1, height: 38, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', boxShadow: 'inset 0 0 0 1px var(--line-200)' }} />
                {Button && <Button variant="accent" iconLeft="ph ph-paper-plane-tilt" size="sm">Siųsti</Button>}
              </div>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  )
}
