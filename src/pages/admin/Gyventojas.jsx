import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { Tabs, DSSelect } from '../../shared/UI.jsx'

// ── shared mock data ────────────────────────────────────────────────────────
const PHOTO_COLS = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b', '#aeb8a0', '#a0aeb8', '#b7c4a0', '#a8b8c4']
const PHOTO_LABELS = ['Svetainė', 'Miegamasis', 'Virtuvė', 'Vonios kambarys', 'Balkonas', 'Koridorius', 'Vaizdas', 'Planas']

const PEOPLE = [
  { slug: 'lukas-petrauskas', name: 'Lukas Petrauskas', role: 'Savininkas', apt: 'B-12', floor: 3, area: 68, phone: '+370 612 34567', email: 'l.petrauskas@gmail.com', since: '2024-03-15', orientation: 'Pietų', heating: 'Centrinis šildymas', parking: true, storage: true, year: '2024', energy: 'A+' },
  { slug: 'greta-janusiene', name: 'Greta Janušienė', role: 'Savininkė', apt: 'A-4', floor: 1, area: 52, phone: '+370 600 22113', email: 'g.janusiene@gmail.com', since: '2023-11-02', orientation: 'Rytų', heating: 'Grindinis šildymas', parking: false, storage: true, year: '2024', energy: 'A+' },
  { slug: 'mantas-simkus', name: 'Mantas Šimkus', role: 'Nuomininkas', apt: 'C-21', floor: 5, area: 78, phone: '+370 633 88221', email: 'm.simkus@gmail.com', since: '2024-06-20', orientation: 'Šiaurės', heating: 'Dujinis šildymas', parking: true, storage: false, year: '2024', energy: 'A' },
  { slug: 'ruta-kazlauskaite', name: 'Rūta Kazlauskaitė', role: 'Savininkė', apt: 'A-7', floor: 2, area: 61, phone: '+370 644 55009', email: 'r.kazlauskaite@gmail.com', since: '2023-09-08', orientation: 'Vakarų', heating: 'Centrinis šildymas', parking: false, storage: false, year: '2023', energy: 'A+' },
  { slug: 'tomas-petraitis', name: 'Tomas Petraitis', role: 'Savininkas', apt: 'B-9', floor: 2, area: 55, phone: '+370 655 11447', email: 't.petraitis@gmail.com', since: '2024-01-20', orientation: 'Pietų', heating: 'Centrinis šildymas', parking: true, storage: true, year: '2024', energy: 'A+' },
]

const DEFECTS_BY_PERSON = {
  'lukas-petrauskas': [
    { id: 'D-012', title: 'Stogo nuotėkis', status: 'open', date: '2026-04-10', desc: 'Virš vonios kamabrio atsiranda drėgmės dėmė po lietaus.' },
    { id: 'D-018', title: 'Langų kondensatas', status: 'in_progress', date: '2026-05-02', desc: 'Ryte ant vidinio stiklo kaupiasi kondensatas.' },
  ],
  'greta-janusiene': [
    { id: 'D-021', title: 'Šildymo sistemos triukšmas', status: 'closed', date: '2026-03-15', desc: 'Radiatorius burkšnoja naktį.' },
  ],
  'mantas-simkus': [],
  'ruta-kazlauskaite': [
    { id: 'D-025', title: 'Durų spyna', status: 'open', date: '2026-05-28', desc: 'Priekinių durų spyna sunkiai atsidaro.' },
  ],
  'tomas-petraitis': [
    { id: 'D-030', title: 'Vonios sifonas', status: 'in_progress', date: '2026-06-01', desc: 'Lėtai teka vanduo.' },
  ],
}

const POSTS_BY_PERSON = {
  'lukas-petrauskas': [
    { title: 'Parduodu beveik naują dviratį', cat: 'Parduodu', time: 'Prieš 2 val.', body: 'Miesto dviratis Kross, naudotas vieną sezoną. €180.' },
    { title: 'Ieškau dingusios katės', cat: 'Ieškau', time: 'Prieš 3 d.', body: 'Pilka katė vardu Tinginys, dingo prie kiemo.' },
  ],
  'greta-janusiene': [
    { title: 'Parduodu vaikišką kėdutę', cat: 'Parduodu', time: 'Prieš 5 d.', body: 'Maitinimo kėdutė, geros būklės, sulankstoma. €25.' },
  ],
  'mantas-simkus': [
    { title: 'Interneto tiekėjo rekomendacijos', cat: 'Klausimas', time: 'Prieš 4 d.', body: 'Persikrausčiau neseniai. Kokį internetą rekomenduotumėte?' },
  ],
  'ruta-kazlauskaite': [
    { title: 'Bendruomenės sodas kieme', cat: 'Idėja', time: 'Prieš 2 d.', body: 'Galvoju apie bendrą daržą prie pietinės pusės.' },
    { title: 'Atiduodu knygas', cat: 'Dovanoju', time: 'Prieš 2 d.', body: 'Dėžė grožinės literatūros lietuvių kalba.' },
  ],
  'tomas-petraitis': [
    { title: 'Automobilio stovėjimas', cat: 'Diskusija', time: 'Prieš 3 val.', body: 'Svečiai vis dažniau užima gyventojų vietas.' },
  ],
}

const MESSAGES = [
  { from: 'Administracija', body: 'Laba diena! Ar gavote mūsų pranešimą dėl karšto vandens atjungimo?', time: '10:32' },
  { from: 'me', body: 'Taip, ačiū. Ar žinote tikslų laiką?', time: '10:35' },
  { from: 'Administracija', body: 'Darbai planuojami 9:00–14:00. Atsiprašome už nepatogumus.', time: '10:36' },
  { from: 'me', body: 'Supratau, ačiū!', time: '10:38' },
]

const CONTRACTS = [
  { id: 'SUT-100', type: 'Pirkimo-pardavimo sutartis', date: '2024-03-15', status: 'Pasirašyta', tone: 'success' },
  { id: 'SUT-101', type: 'Administravimo sutartis', date: '2024-04-01', status: 'Pasirašyta', tone: 'success' },
  { id: 'SUT-102', type: 'Garantinis aptarnavimas', date: '2025-03-15', status: 'Galioja', tone: 'event' },
  { id: 'SUT-103', type: 'Draudimo polisas', date: '2026-01-01', status: 'Galioja', tone: 'event' },
]

const DEFECT_STATUS = {
  open: { label: 'Atviras', tone: 'urgent' },
  in_progress: { label: 'Vykdoma', tone: 'event' },
  closed: { label: 'Uždaryta', tone: 'success' },
}

const TABS = [
  { key: 'info', label: 'Informacija' },
  { key: 'apt', label: 'Butas' },
  { key: 'docs', label: 'Dokumentai' },
  { key: 'photos', label: 'Nuotraukos' },
  { key: 'defects', label: 'Defektai' },
  { key: 'chat', label: 'Pokalbiai' },
  { key: 'posts', label: 'Skelbimai' },
]

function InfoCard({ icon, label, value }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <i className={icon} style={{ fontSize: 14, color: 'var(--ink-400)' }} />
        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{value}</span>
    </div>
  )
}


export default function Gyventojas() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('info')
  const [isEditing, setIsEditing] = useState(false)

  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, Button, Card } = DS

  const person = PEOPLE.find((p) => p.slug === slug)

  if (!person) {
    return (
      <Shell role="admin" nav="kontaktai" title="Gyventojas nerastas">
        <div className="content">
          <Card>
            <p style={{ color: 'var(--ink-400)', padding: 24 }}>Gyventojas „{slug}" nerastas.</p>
            <Button variant="secondary" iconLeft="ph ph-arrow-left" onClick={() => navigate('/admin/kontaktai')}>Grįžti į kontaktus</Button>
          </Card>
        </div>
      </Shell>
    )
  }

  const defects = DEFECTS_BY_PERSON[slug] || []
  const posts = POSTS_BY_PERSON[slug] || []
  const rooms = person.area <= 53 ? 1 : person.area <= 75 ? 2 : 3

  const [form, setForm] = useState({ name: person.name, phone: person.phone, email: person.email, role: person.role, apt: person.apt, since: person.since })
  const fld = { height: 36, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const selFld = { ...fld, paddingRight: 30 }

  const aptRows = [
    { label: 'Butas', value: person.apt },
    { label: 'Aukštas', value: `${person.floor} aukštas` },
    { label: 'Plotas', value: `${person.area} m²` },
    { label: 'Kambariai', value: `${rooms} kamb.` },
    { label: 'Orientacija', value: person.orientation },
    { label: 'Šildymas', value: person.heating },
    { label: 'Automobilio stovėjimas', value: person.parking ? 'Taip' : 'Ne' },
    { label: 'Sandėliukas', value: person.storage ? 'Taip' : 'Ne' },
    { label: 'Statybos metai', value: person.year },
    { label: 'Energetinė klasė', value: person.energy },
  ]

  return (
    <Shell role="admin" nav="kontaktai"
      title={person.name}
      subtitle={`${person.role} · Butas ${person.apt}`}
      headerActions={
        <Link className="plain" to="/admin/kontaktai">
          <Button variant="secondary" iconLeft="ph ph-arrow-left">Kontaktai</Button>
        </Link>
      }>
      <div className="content">
        <Card>
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '4px 0 24px', borderBottom: '1px solid var(--line-100)', marginBottom: 24, flexWrap: 'wrap' }}>
            {Avatar && <Avatar name={person.name} size={72} />}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 'var(--text-large)', fontWeight: 'var(--fw-semibold)', color: 'var(--ink-900)' }}>{person.name}</h2>
                {Badge && <Badge tone={person.role === 'Nuomininkas' || person.role === 'Nuomininkė' ? 'neutral' : 'success'}>{person.role}</Badge>}
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 'var(--text-body)', color: 'var(--ink-500)' }}>Butas {person.apt} · Gyventojas nuo {person.since}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={`tel:${person.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line-200)', background: 'var(--surface-card)', color: 'var(--ink-700)', fontSize: 'var(--text-small)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                  <i className="ph ph-phone" style={{ fontSize: 14 }} />{person.phone}
                </a>
                <a href={`mailto:${person.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line-200)', background: 'var(--surface-card)', color: 'var(--ink-700)', fontSize: 'var(--text-small)', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
                  <i className="ph ph-envelope" style={{ fontSize: 14 }} />{person.email}
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              {Button && <>
                <Button variant="secondary" iconLeft="ph ph-chat-circle" size="sm" onClick={() => navigate(`/admin/zinutes?contact=${encodeURIComponent(person.name)}`)}>Žinutė</Button>
                <Button variant="secondary" iconLeft="ph ph-phone" size="sm">Skambinti</Button>
                {!isEditing
                  ? <Button variant="secondary" iconLeft="ph ph-pencil-simple" size="sm" onClick={() => { setTab('info'); setIsEditing(true) }}>Redaguoti</Button>
                  : <Button variant="accent" iconLeft="ph ph-floppy-disk" size="sm" onClick={() => setIsEditing(false)}>Išsaugoti</Button>
                }
              </>}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} /></div>

          {/* ── Informacija ── */}
          {tab === 'info' && !isEditing && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              <InfoCard icon="ph ph-user" label="Vardas, pavardė" value={form.name} />
              <InfoCard icon="ph ph-identification-card" label="Rolė" value={form.role} />
              <InfoCard icon="ph ph-door" label="Butas" value={form.apt} />
              <InfoCard icon="ph ph-phone" label="Telefonas" value={form.phone} />
              <InfoCard icon="ph ph-envelope" label="El. paštas" value={form.email} />
              <InfoCard icon="ph ph-calendar" label="Gyventojas nuo" value={form.since} />
            </div>
          )}
          {tab === 'info' && isEditing && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Vardas, pavardė', key: 'name' },
                { label: 'Telefonas', key: 'phone' },
                { label: 'El. paštas', key: 'email' },
                { label: 'Gyventojas nuo', key: 'since' },
                { label: 'Butas', key: 'apt' },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
                  <input style={fld} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Rolė</span>
                <DSSelect value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} options={['Savininkas', 'Savininkė', 'Nuomininkas', 'Nuomininkė']} />
              </div>
            </div>
          )}

          {/* ── Butas ── */}
          {tab === 'apt' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
              {aptRows.map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', margin: '2px 0' }}>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{r.label}</span>
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Dokumentai ── */}
          {tab === 'docs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Button && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                  <Button variant="secondary" iconLeft="ph ph-download-simple" size="sm" onClick={() => CONTRACTS.forEach((c, i) => { const a = document.createElement('a'); a.href = '#'; a.download = `${c.id}-${c.type}.pdf`; setTimeout(() => a.click(), i * 50) })}>Atsisiųsti visus</Button>
                </div>
              )}
              {CONTRACTS.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <i className="ph ph-file-text" style={{ fontSize: 18, color: 'var(--ink-400)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{c.type}</span>
                    <span style={{ display: 'block', fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{c.id} · {c.date}</span>
                  </div>
                  {Badge && <Badge tone={c.tone}>{c.status}</Badge>}
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', padding: 4 }}>
                    <i className="ph ph-download-simple" style={{ fontSize: 16 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Nuotraukos ── */}
          {tab === 'photos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {PHOTO_COLS.map((col, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ height: 110, background: col, borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }} />
                  <div style={{ padding: '6px 8px', background: 'var(--surface-sunken)', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-600)', fontFamily: 'var(--font-sans)' }}>{PHOTO_LABELS[i % 8]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Defektai ── */}
          {tab === 'defects' && (
            defects.length === 0
              ? <p style={{ color: 'var(--ink-400)', fontSize: 'var(--text-body)', padding: '16px 0' }}>Nėra registruotų defektų.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {defects.map((d) => {
                    const st = DEFECT_STATUS[d.status]
                    return (
                      <div key={d.id} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                          <i className="ph ph-warning-octagon" style={{ fontSize: 18, color: 'var(--orange)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{d.title}</span>
                            {Badge && <Badge tone={st.tone}>{st.label}</Badge>}
                          </div>
                          <p style={{ margin: 0, fontSize: 'var(--text-small)', color: 'var(--ink-500)', lineHeight: 1.5 }}>{d.desc}</p>
                          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)', marginTop: 4, display: 'block' }}>{d.id} · {d.date}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
          )}

          {/* ── Pokalbiai ── */}
          {tab === 'chat' && (
            <div style={{ maxWidth: 520 }}>
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

          {/* ── Skelbimai ── */}
          {tab === 'posts' && (
            posts.length === 0
              ? <p style={{ color: 'var(--ink-400)', fontSize: 'var(--text-body)', padding: '16px 0' }}>Nėra skelbiamų įrašų.</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {posts.map((p, i) => (
                    <div key={i} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.title}</span>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--overlay-ink-04)', color: 'var(--ink-500)' }}>{p.cat}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 'var(--text-small)', color: 'var(--ink-500)', lineHeight: 1.5 }}>{p.body}</p>
                      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)', marginTop: 6, display: 'block' }}>{p.time}</span>
                    </div>
                  ))}
                </div>
          )}
        </Card>
      </div>
    </Shell>
  )
}
