import React, { useState, useLayoutEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import { Link, useSearchParams } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Tabs, PhotoTile, Modal, Composer, DSSelect } from '../../shared/UI.jsx'
function ConfirmDialog({ title, message, confirmLabel = 'Ištrinti', onConfirm, onCancel }) {
  const { Button } = window.MitedaDesignSystem_acc833
  return (
    <Modal title={title} subtitle={message} onClose={onCancel} width={400}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>Atšaukti</Button>
          <button type="button" onClick={onConfirm} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 16px', borderRadius: 'var(--radius-md)',
            border: 'none', background: 'var(--orange)', color: '#fff',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
            fontWeight: 'var(--fw-medium)', cursor: 'pointer',
          }}>
            <i className="ph ph-trash" style={{ fontSize: 15 }} />
            {confirmLabel}
          </button>
        </>
      }>
    </Modal>
  )
}

const UNIT_STATUS = {
  free: { label: 'Laisvas', tone: 'neutral' },
  reserved: { label: 'Rezervuotas', tone: 'event' },
  sold: { label: 'Parduotas', tone: 'success' },
}

const PHOTO_COLS = ['#9bb7a4', '#c2b59b', '#8fa6b8', '#b7a99b', '#aeb8a0', '#a0aeb8', '#b7c4a0', '#a8b8c4']

function makeUnits(P) {
  const list = []
  const floors = Math.ceil(P.units / 4)
  let n = 0
  for (let f = 1; f <= floors && n < P.units; f++) {
    for (let a = 1; a <= 4 && n < P.units; a++) {
      const st = n < P.sold ? 'sold' : (n < P.sold + 3 ? 'reserved' : 'free')
      list.push({ id: `${String.fromCharCode(64 + ((f - 1) % 3) + 1)}-${f}${a}`, floor: f, area: 42 + (a * 11), st })
      n++
    }
  }
  return list
}

const OWNERS = [
  { name: 'Lukas Petrauskas', phone: '+370 612 34567', email: 'l.petrauskas@gmail.com', since: '2024-03-15' },
  { name: 'Greta Janušienė', phone: '+370 600 22113', email: 'g.janusiene@gmail.com', since: '2023-11-02' },
  { name: 'Mantas Šimkus', phone: '+370 633 88221', email: 'm.simkus@gmail.com', since: '2024-06-20' },
  { name: 'Rūta Kazlauskaitė', phone: '+370 644 55009', email: 'r.kazlauskaite@gmail.com', since: '2023-09-08' },
]

const CONTRACT_TPLS = [
  { type: 'Pirkimo-pardavimo sutartis', date: '2024-03-15', status: 'signed', tone: 'success' },
  { type: 'Administravimo sutartis', date: '2024-04-01', status: 'signed', tone: 'success' },
  { type: 'Garantinis aptarnavimas', date: '2025-03-15', status: 'active', tone: 'event' },
  { type: 'Draudimo polisas', date: '2026-01-01', status: 'active', tone: 'event' },
]

const DETAIL_TABS = [
  { key: 'tech', label: 'Techniniai duomenys' },
  { key: 'photos', label: 'Nuotraukos' },
  { key: 'owner', label: 'Savininkas' },
  { key: 'contracts', label: 'Sutartys' },
]
const DEMO_RESIDENTS = [
  { name: 'Lukas Petrauskas', apt: 'B-12', role: 'Savininkas', phone: '+370 612 34567' },
  { name: 'Greta Janušienė', apt: 'A-4', role: 'Savininkė', phone: '+370 600 22113' },
  { name: 'Mantas Šimkus', apt: 'C-21', role: 'Nuomininkas', phone: '+370 633 88221' },
  { name: 'Rūta Kazlauskaitė', apt: 'A-7', role: 'Savininkė', phone: '+370 644 55009' },
  { name: 'Tomas Petraitis', apt: 'B-9', role: 'Savininkas', phone: '+370 655 11447' },
]

function UnitDetailModal({ unit, idx, onClose, onSaveUnit }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Badge, Button, Avatar } = DS
  const [tab, setTab] = useState('tech')
  const [isEditing, setIsEditing] = useState(true)
  const [statusPicker, setStatusPicker] = useState(false)

  const fallbackOwner = OWNERS[idx % OWNERS.length]
  const contracts = CONTRACT_TPLS.map((c, i) => ({ ...c, id: `SUT-${100 + i}` }))
  const rooms = unit.area <= 53 ? 1 : unit.area <= 75 ? 2 : 3
  const orientation = unit.orientation || ['Pietų', 'Rytų', 'Šiaurės', 'Vakarų'][idx % 4]
  const heating = unit.heating || ['Centrinis šildymas', 'Grindinis šildymas', 'Dujinis šildymas'][idx % 3]
  const hasParking = unit.hasParking !== undefined ? unit.hasParking : idx % 3 !== 2
  const hasStorage = unit.hasStorage !== undefined ? unit.hasStorage : idx % 2 === 0
  const owner = unit.st !== 'free' ? (unit.owner || fallbackOwner) : null

  const initForm = () => ({
    floor: String(unit.floor),
    area: String(unit.area),
    st: unit.st,
    orientation,
    heating,
    hasParking,
    parkingNr: unit.parkingNr || '',
    hasStorage,
    year: unit.year || '2024',
    energyClass: unit.energyClass || 'A+',
    ownerName: owner?.name || '',
    ownerPhone: owner?.phone || '',
    ownerEmail: owner?.email || '',
    ownerSince: owner?.since || '',
    photos: unit.photos || [],
    contracts: unit.contracts || contracts,
  })

  const [form, setForm] = useState(initForm)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const startEdit = () => { setForm(initForm()); setIsEditing(true); setStatusPicker(false) }
  const cancelEdit = () => { setForm(initForm()) }

  React.useEffect(() => {
    if (!statusPicker) return
    const close = () => setStatusPicker(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [statusPicker])

  const saveEdit = () => {
    const updated = {
      ...unit,
      floor: +form.floor,
      area: +form.area,
      st: form.st,
      orientation: form.orientation,
      heating: form.heating,
      hasParking: form.hasParking,
      parkingNr: form.parkingNr,
      hasStorage: form.hasStorage,
      year: form.year,
      energyClass: form.energyClass,
      owner: form.ownerName ? { name: form.ownerName, phone: form.ownerPhone, email: form.ownerEmail, since: form.ownerSince } : null,
      photos: form.photos,
      contracts: form.contracts,
    }
    onSaveUnit(updated)
  }

  const photoInputRef = React.useRef()
  const contractInputRef = React.useRef()
  const addPhotos = (e) => {
    const files = Array.from(e.target.files)
    set('photos', [...form.photos, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }))])
    e.target.value = ''
  }
  const addContracts = (e) => {
    const files = Array.from(e.target.files)
    set('contracts', [...form.contracts, ...files.map((f) => ({ id: `SUT-${Date.now()}`, type: f.name.replace(/\.[^.]+$/, ''), date: new Date().toISOString().slice(0, 10), status: 'signed', tone: 'positive', file: f }))])
    e.target.value = ''
  }

  const fld = { height: 36, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const selFld = { ...fld, paddingRight: 30 }

  const vTxt = { fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }
  const iInp = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', fontFamily: 'var(--font-sans)', width: '100%' }
  const iSel = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }
  const inp = { border: 'none', background: 'transparent', textAlign: 'right', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', fontFamily: 'var(--font-sans)', width: 120, minWidth: 0 }

  const currentRooms = form.area <= 53 ? 1 : form.area <= 75 ? 2 : 3

  return (
    <Modal
      title={`Butas ${unit.id}`}
      subtitle={`${unit.floor} aukštas · ${unit.area} m² · ${rooms} kamb.`}
      onClose={onClose}
      width={660}
      footer={isEditing
        ? <><Button variant="ghost" onClick={cancelEdit}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-floppy-disk" onClick={saveEdit}>Išsaugoti</Button></>
        : null}
    >
      {/* Header row — status + edit toggle */}
      <div className="between" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Būsena:</span>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 'var(--radius-pill)', cursor: 'pointer' }} onClick={() => setStatusPicker((v) => !v)}>
              <Badge tone={UNIT_STATUS[form.st]?.tone}>{UNIT_STATUS[form.st]?.label}</Badge>
              <i className="ph ph-pencil-simple" style={{ fontSize: 12, color: 'var(--ink-400)' }} />
          {statusPicker && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)', padding: 8, zIndex: 100, minWidth: 160 }} onMouseDown={(e) => e.stopPropagation()}>
              {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
                <button key={key} type="button" onClick={() => { set('st', key); setStatusPicker(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 8px',
                  border: 'none', borderRadius: 'var(--radius-sm)', background: form.st === key ? 'var(--overlay-ink-04)' : 'transparent',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
                }}>
                  <Badge tone={tone}>{label}</Badge>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={DETAIL_TABS} value={tab} onChange={setTab} />
      </div>

      {/* Tech tab */}
      {tab === 'tech' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldBox label="Butas" disabled>
            <span style={vTxt}>{unit.id}</span>
          </FieldBox>
          <FieldBox label="Aukštas">
            {isEditing
              ? <input style={iInp} type="number" min="1" value={form.floor} onChange={(e) => set('floor', e.target.value)} />
              : <span style={vTxt}>{unit.floor} aukštas</span>}
          </FieldBox>
          <FieldBox label="Plotas">
            {isEditing
              ? <input style={iInp} type="number" min="10" value={form.area} onChange={(e) => set('area', e.target.value)} />
              : <span style={vTxt}>{unit.area} m²</span>}
          </FieldBox>
          <FieldBox label="Kambariai" disabled>
            <span style={vTxt}>{currentRooms}-{currentRooms === 1 ? 'kambarinis' : 'kambariai'}</span>
          </FieldBox>
          <FieldBox label="Orientacija">
            {isEditing
              ? <select style={iSel} value={form.orientation} onChange={(e) => set('orientation', e.target.value)}>
                  {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              : <span style={vTxt}>{orientation}</span>}
          </FieldBox>
          <FieldBox label="Šildymas">
            {isEditing
              ? <select style={iSel} value={form.heating} onChange={(e) => set('heating', e.target.value)}>
                  {HEATINGS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              : <span style={vTxt}>{heating}</span>}
          </FieldBox>
          <FieldBox label="Automobilio stovėjimas" onClick={isEditing ? () => set('hasParking', !form.hasParking) : undefined}>
            {isEditing
              ? <><span style={{ ...vTxt, flex: 1 }}>{form.hasParking ? 'Taip' : 'Ne'}</span>
                  <input type="checkbox" checked={form.hasParking} onChange={(e) => set('hasParking', e.target.checked)} onClick={(e) => e.stopPropagation()} style={{ width: 16, height: 16, accentColor: 'var(--brand-green)', cursor: 'pointer', flexShrink: 0 }} /></>
              : <span style={vTxt}>{(unit.hasParking !== undefined ? unit.hasParking : hasParking) ? 'Taip' : 'Ne'}</span>}
          </FieldBox>
          <FieldBox label="Stovėjimo aikštelės Nr." disabled={!((unit.hasParking !== undefined ? unit.hasParking : hasParking) || isEditing)}>
            {isEditing
              ? <input style={{ ...iInp, opacity: form.hasParking ? 1 : 0.35 }} disabled={!form.hasParking} placeholder="pvz. P-12" value={form.parkingNr} onChange={(e) => set('parkingNr', e.target.value)} />
              : <span style={{ ...vTxt, color: unit.parkingNr ? 'var(--ink-900)' : 'var(--ink-300)' }}>{unit.parkingNr || '—'}</span>}
          </FieldBox>
          <FieldBox label="Sandėliukas" onClick={isEditing ? () => set('hasStorage', !form.hasStorage) : undefined}>
            {isEditing
              ? <><span style={{ ...vTxt, flex: 1 }}>{form.hasStorage ? 'Taip' : 'Ne'}</span>
                  <input type="checkbox" checked={form.hasStorage} onChange={(e) => set('hasStorage', e.target.checked)} onClick={(e) => e.stopPropagation()} style={{ width: 16, height: 16, accentColor: 'var(--brand-green)', cursor: 'pointer', flexShrink: 0 }} /></>
              : <span style={vTxt}>{hasStorage ? 'Taip' : 'Ne'}</span>}
          </FieldBox>
          <FieldBox label="Statybos metai">
            {isEditing
              ? <input style={iInp} type="number" min="1900" max="2100" value={form.year} onChange={(e) => set('year', e.target.value)} />
              : <span style={vTxt}>{unit.year || '2024'}</span>}
          </FieldBox>
          <FieldBox label="Energetinė klasė">
            {isEditing
              ? <select style={iSel} value={form.energyClass} onChange={(e) => set('energyClass', e.target.value)}>
                  {ENERGY_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              : <span style={vTxt}>{unit.energyClass || 'A+'}</span>}
          </FieldBox>
        </div>
      )}

      {/* Photos tab */}
      {tab === 'photos' && !isEditing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {(unit.photos && unit.photos.length > 0)
            ? unit.photos.map((p, i) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-sunken)' }}>
                <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))
            : PHOTO_COLS.map((col, i) => (
              <PhotoTile key={i} color={col} label={['Svetainė', 'Miegamasis', 'Virtuvė', 'Vonios kambarys', 'Balkonas', 'Koridorius', 'Vaizdas', 'Planas'][i % 8]} />
            ))
          }
        </div>
      )}
      {tab === 'photos' && isEditing && (
        <div>
          <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addPhotos} />
          {form.photos.length === 0
            ? (
              <button type="button" onClick={() => photoInputRef.current?.click()} style={{
                width: '100%', border: '1.5px dashed var(--line-300)', borderRadius: 'var(--radius-md)',
                padding: '32px 0', background: 'var(--surface-sunken)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <i className="ph ph-image" style={{ fontSize: 32, color: 'var(--ink-300)' }} />
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>Pasirinkite nuotraukas</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)' }}>JPG, PNG, WEBP</span>
              </button>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 12 }}>
                  {form.photos.map((p, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-sunken)' }}>
                      <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => set('photos', form.photos.filter((_, j) => j !== i))} style={{
                        position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                        border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                      }}><i className="ph ph-x" /></button>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" iconLeft="ph ph-plus" onClick={() => photoInputRef.current?.click()}>Pridėti daugiau</Button>
              </div>
            )
          }
        </div>
      )}

      {/* Owner tab */}
      {tab === 'owner' && (
        <div className="stack-sm">
          <div className="row">
            {Avatar && (owner || form.ownerName) && <Avatar name={isEditing ? (form.ownerName || '?') : owner?.name} size={48} />}
            <div className="row__main">
              {isEditing
                ? <input style={{ ...inp, textAlign: 'left', width: '100%', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-semibold)' }} value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} placeholder="Vardas Pavardė" />
                : unit.st === 'free'
                  ? <span className="row__title">—</span>
                  : <Link to={`/admin/gyventojas/${toSlug(owner?.name || '')}`} className="row__title" style={{ color: 'var(--brand-green)', textDecoration: 'none' }} onClick={onClose}>{owner?.name}</Link>}
              <span className="row__meta">{unit.st === 'free' ? 'Butas laisvas, savininko nėra' : `Savininkas nuo ${isEditing ? (form.ownerSince || '...') : owner?.since}`}</span>
            </div>
          </div>
          {(unit.st !== 'free') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
              {[
                { icon: 'ph ph-phone', label: 'Telefonas', key: 'ownerPhone', value: isEditing ? form.ownerPhone : owner?.phone, placeholder: '+370 600 00000' },
                { icon: 'ph ph-envelope', label: 'El. paštas', key: 'ownerEmail', value: isEditing ? form.ownerEmail : owner?.email, placeholder: 'vardas@gmail.com' },
                { icon: 'ph ph-calendar', label: 'Įsigyta', key: 'ownerSince', value: isEditing ? form.ownerSince : owner?.since, placeholder: '2023-01-01' },
                { icon: 'ph ph-identification-card', label: 'Tipas', key: null, value: unit.st === 'reserved' ? 'Rezervacija' : 'Pilnateisis savininkas' },
              ].map((f) => (
                <div key={f.label} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <i className={f.icon} style={{ fontSize: 14, color: 'var(--ink-400)' }} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{f.label}</span>
                  </div>
                  {isEditing && f.key
                    ? <input style={{ ...inp, textAlign: 'left', width: '100%' }} value={f.value || ''} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
                    : <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{f.value}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contracts tab */}
      {tab === 'contracts' && !isEditing && (
        <div>
          {unit.st === 'free'
            ? <p style={{ color: 'var(--ink-400)', fontSize: 'var(--text-body)', padding: '16px 0' }}>Nėra aktyvių sutarčių — butas laisvas.</p>
            : <>
                <div className="between" style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{contracts.length} dokumentai</span>
                  <button type="button"
                    onClick={() => contracts.forEach((c, idx) => {
                      const a = document.createElement('a')
                      a.href = c.url || '#'
                      a.download = `${c.id}-${c.type}.pdf`
                      if (!c.url) { a.setAttribute('data-no-file', '1') }
                      setTimeout(() => { if (!c.url) return; document.body.appendChild(a); a.click(); document.body.removeChild(a) }, idx * 120)
                    })}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', color: 'var(--ink-700)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-green)'; e.currentTarget.style.color = 'var(--brand-green)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-200)'; e.currentTarget.style.color = 'var(--ink-700)' }}>
                    <i className="ph ph-download-simple" style={{ fontSize: 15 }} />
                    Atsisiųsti visus
                  </button>
                </div>
                <div className="stack-sm gap-8">
                  {contracts.map((c) => (
                    <div key={c.id} className="row">
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <i className="ph ph-file-text" style={{ fontSize: 18, color: 'var(--ink-400)' }} aria-hidden="true" />
                      </div>
                      <div className="row__main">
                        <span className="row__title">{c.type}</span>
                        <span className="row__meta">{c.id}<span className="dot">·</span>{c.date}</span>
                      </div>
                      <Badge tone={c.tone}>{c.status === 'signed' ? 'Pasirašyta' : 'Galioja'}</Badge>
                      <a href={c.url || '#'} download={`${c.id}-${c.type}.pdf`}
                        onClick={!c.url ? (e) => e.preventDefault() : undefined}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-sm)', color: c.url ? 'var(--ink-500)' : 'var(--ink-200)', flexShrink: 0, textDecoration: 'none' }}
                        title={c.url ? 'Atsisiųsti' : 'Failas nepasiekiamas'}>
                        <i className="ph ph-download-simple" style={{ fontSize: 16 }} />
                      </a>
                    </div>
                  ))}
                </div>
              </>
          }
        </div>
      )}
      {tab === 'contracts' && isEditing && (
        <div>
          <input ref={contractInputRef} type="file" multiple style={{ display: 'none' }} onChange={addContracts} />
          <div className="stack-sm gap-8" style={{ marginBottom: form.contracts.length ? 12 : 0 }}>
            {form.contracts.map((c, i) => (
              <div key={c.id} className="row">
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <i className="ph ph-file-text" style={{ fontSize: 18, color: 'var(--ink-400)' }} aria-hidden="true" />
                </div>
                <div className="row__main">
                  <span className="row__title">{c.type}</span>
                  <span className="row__meta">{c.id}<span className="dot">·</span>{c.date}</span>
                </div>
                <button onClick={() => set('contracts', form.contracts.filter((_, j) => j !== i))} style={{
                  border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-300)', padding: 4,
                }}><i className="ph ph-x" style={{ fontSize: 14 }} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => contractInputRef.current?.click()} style={{
            width: '100%', border: '1.5px dashed var(--line-300)', borderRadius: 'var(--radius-md)',
            padding: '20px 0', background: 'var(--surface-sunken)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <i className="ph ph-upload-simple" style={{ fontSize: 18, color: 'var(--ink-300)' }} />
            <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>Įkelti sutartį</span>
          </button>
        </div>
      )}
    </Modal>
  )
}

const ADD_TABS = [
  { key: 'tech', label: 'Techniniai duomenys' },
  { key: 'owner', label: 'Savininkas' },
  { key: 'photos', label: 'Nuotraukos' },
  { key: 'docs', label: 'Dokumentai' },
]

const ORIENTATIONS = ['Pietų', 'Rytų', 'Šiaurės', 'Vakarų']
const HEATINGS = ['Centrinis šildymas', 'Grindinis šildymas', 'Dujinis šildymas']
const ENERGY_CLASSES = ['A++', 'A+', 'A', 'B', 'C', 'D']

const MONTHS_LT = ['Sausis','Vasaris','Kovas','Balandis','Gegužė','Birželis','Liepa','Rugpjūtis','Rugsėjis','Spalis','Lapkritis','Gruodis']
const DAYS_LT = ['P','A','T','K','Pn','Š','S']

function DatePicker({ value, onChange, placeholder = 'Pasirinkite datą' }) {
  const today = new Date()
  const parsed = value ? new Date(value + 'T00:00:00') : null
  const [open, setOpen] = React.useState(false)
  const [rect, setRect] = React.useState(null)
  const [viewYear, setViewYear] = React.useState(parsed?.getFullYear() || today.getFullYear())
  const [viewMonth, setViewMonth] = React.useState(parsed?.getMonth() ?? today.getMonth())
  const triggerRef = React.useRef(null)

  const toggle = () => {
    if (!open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect())
    setOpen(v => !v)
  }

  React.useEffect(() => {
    if (!open) return
    const close = (e) => {
      const cal = document.getElementById('miteda-datepicker-cal')
      if (!triggerRef.current?.contains(e.target) && !cal?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const firstDay = new Date(viewYear, viewMonth, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1)
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear(y => y + 1)) : setViewMonth(m => m + 1)

  const selectDay = (d) => {
    onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    setOpen(false)
  }

  const formatted = parsed
    ? `${String(parsed.getDate()).padStart(2, '0')}.${String(parsed.getMonth() + 1).padStart(2, '0')}.${parsed.getFullYear()}`
    : null

  const isSelected = (d) => parsed && d === parsed.getDate() && viewMonth === parsed.getMonth() && viewYear === parsed.getFullYear()
  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  const portalRoot = React.useMemo(() => document.getElementById('miteda-portal') || document.getElementById('root'), [])

  const navBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-500)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', display: 'flex', alignItems: 'center', lineHeight: 1 }

  return (
    <div ref={triggerRef} style={{ width: '100%' }}>
      <button type="button" onClick={toggle} style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 40,
        padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-card)', cursor: 'pointer', boxSizing: 'border-box',
        boxShadow: `inset 0 0 0 1px ${open ? 'var(--line-300)' : 'var(--line-200)'}`,
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
        fontWeight: 'var(--fw-medium)', color: formatted ? 'var(--ink-900)' : 'var(--ink-300)',
        outline: 'none', transition: 'box-shadow 0.15s',
      }}>
        <i className="ph ph-calendar-blank" style={{ fontSize: 15, color: 'var(--ink-400)', flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{formatted || placeholder}</span>
        {value && (
          <span role="button" onClick={(e) => { e.stopPropagation(); onChange('') }}
            style={{ display: 'flex', alignItems: 'center', color: 'var(--ink-300)', padding: 2, lineHeight: 1 }}>
            <i className="ph ph-x" style={{ fontSize: 13 }} />
          </span>
        )}
        <i className="ph ph-caret-down" style={{ fontSize: 13, color: 'var(--ink-300)', flexShrink: 0, marginLeft: 2 }} />
      </button>

      {open && rect && ReactDOM.createPortal(
        <div id="miteda-datepicker-cal" style={{
          position: 'fixed', bottom: window.innerHeight - rect.top + 6, left: rect.left,
          width: 240, zIndex: 9999,
          background: 'var(--surface-card)', borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)',
          border: '1px solid var(--line-200)', padding: '10px 8px 8px',
          userSelect: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--line-100)' }}>
            <button type="button" onClick={prevMonth} style={navBtn}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sunken)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <i className="ph ph-caret-left" style={{ fontSize: 14 }} />
            </button>
            <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--ink-900)' }}>
              {MONTHS_LT[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={navBtn}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sunken)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <i className="ph ph-caret-right" style={{ fontSize: 14 }} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {DAYS_LT.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-400)', padding: '2px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((d, i) => {
              const sel = d && isSelected(d)
              const tod = d && isToday(d)
              return (
                <button key={i} type="button" disabled={!d} onClick={() => d && selectDay(d)} style={{
                  width: '100%', height: 28, border: 'none', padding: 0,
                  borderRadius: 'var(--radius-sm)',
                  background: sel ? 'var(--brand-green)' : 'transparent',
                  color: sel ? '#fff' : tod ? 'var(--brand-green)' : d ? 'var(--ink-800)' : 'transparent',
                  fontSize: 'var(--text-small)', fontFamily: 'var(--font-sans)',
                  fontWeight: sel || tod ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                  cursor: d ? 'pointer' : 'default',
                  outline: tod && !sel ? '1.5px solid var(--brand-green)' : 'none',
                  outlineOffset: '-2px', transition: 'background 0.1s',
                }}
                  onMouseEnter={e => { if (d && !sel) e.currentTarget.style.background = 'var(--surface-sunken)' }}
                  onMouseLeave={e => { if (d && !sel) e.currentTarget.style.background = 'transparent' }}
                >{d || ''}</button>
              )
            })}
          </div>
        </div>,
        portalRoot
      )}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--brand-green)' : 'var(--line-300)',
        transition: 'background 0.18s', flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        transition: 'left 0.18s',
      }} />
    </button>
  )
}

function FieldBox({ label, error, disabled, onClick, wrapStyle, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...wrapStyle }}>
      <span style={{ fontSize: 'var(--text-small)', color: error ? 'var(--orange)' : 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>{error || label}</span>
      <div style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', boxShadow: error ? 'inset 0 0 0 1.5px var(--orange)' : disabled ? 'inset 0 0 0 1px var(--line-100)' : 'inset 0 0 0 1px var(--line-200)', opacity: disabled ? 0.5 : 1, cursor: onClick ? 'pointer' : undefined, transition: 'box-shadow 150ms' }} onClick={onClick}>
        {children}
      </div>
    </div>
  )
}

function EditRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      {children}
    </div>
  )
}

const toSlug = (name) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')

function saveInvite(email, name) {
  const invites = JSON.parse(localStorage.getItem('miteda_invites') || '{}')
  invites[email] = { name, email, slug: toSlug(name), status: 'pending', sentAt: new Date().toISOString() }
  localStorage.setItem('miteda_invites', JSON.stringify(invites))
}

function AddUnitModal({ units, onAdd, onClose, initial, onSave }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Button, Badge } = DS
  const isEdit = !!initial

  const lastUnit = units[units.length - 1]
  const suggestId = () => {
    if (!lastUnit) return 'A-11'
    const letter = lastUnit.id[0]
    const num = parseInt(lastUnit.id.slice(2))
    const nextLetter = num % 4 === 0 ? String.fromCharCode(letter.charCodeAt(0) + 1) : letter
    return `${nextLetter}-${num + 1}`
  }
  const sid = suggestId()

  const [tab, setTab] = useState('tech')
  const [form, setForm] = useState(initial ? {
    id: initial.id,
    floor: String(initial.floor),
    area: String(initial.area),
    rooms: String(initial.rooms || (initial.area <= 53 ? 1 : initial.area <= 75 ? 2 : 3)),
    orientation: initial.orientation || 'Pietų',
    heating: initial.heating || 'Centrinis šildymas',
    hasParking: initial.hasParking || false,
    hasStorage: initial.hasStorage || false,
    year: initial.year || '2024',
    energyClass: initial.energyClass || 'A+',
    st: initial.st,
    parkingNr: initial.parkingNr || '',
    ownerName: initial.owner?.name || '',
    ownerPhone: initial.owner?.phone || '',
    ownerEmail: initial.owner?.email || '',
    ownerSince: initial.owner?.since || '',
    photos: initial.photos || [],
    documents: initial.documents || [],
  } : {
    id: sid,
    floor: lastUnit ? String(lastUnit.floor + (lastUnit.id[0] !== sid[0] ? 1 : 0)) : '1',
    area: '65',
    rooms: '2',
    orientation: 'Pietų',
    heating: 'Centrinis šildymas',
    hasParking: false,
    parkingNr: '',
    hasStorage: false,
    year: '2024',
    energyClass: 'A+',
    st: 'free',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    ownerSince: '',
    photos: [],
    documents: [],
  })
  const [errors, setErrors] = useState({})
  const [ownerSearch, setOwnerSearch] = useState('')
  const [ownerDropOpen, setOwnerDropOpen] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.id.trim()) e.id = 'Būtinas laukas'
    else if (!isEdit && units.some((u) => u.id === form.id.trim())) e.id = 'Toks butas jau egzistuoja'
    if (!form.floor || isNaN(+form.floor) || +form.floor < 1) e.floor = 'Įveskite teisingą aukštą'
    if (!form.area || isNaN(+form.area) || +form.area < 10) e.area = 'Įveskite teisingą plotą'
    setErrors(e)
    if (Object.keys(e).length > 0) { setTab('tech'); return false }
    return true
  }

  const buildData = () => ({
    id: form.id.trim(), floor: +form.floor, area: +form.area, st: form.st,
    rooms: +form.rooms, orientation: form.orientation, heating: form.heating,
    hasParking: form.hasParking, parkingNr: form.parkingNr, hasStorage: form.hasStorage,
    year: form.year, energyClass: form.energyClass,
    owner: form.ownerName ? { name: form.ownerName, phone: form.ownerPhone, email: form.ownerEmail, since: form.ownerSince } : null,
    photos: form.photos, documents: form.documents,
  })

  const submit = () => {
    if (!validate()) return
    const data = buildData()
    if (isEdit) onSave(data)
    else onAdd(data)
    onClose()
  }

  const submitAndInvite = () => {
    if (!validate()) return
    const data = buildData()
    if (isEdit) onSave(data)
    else onAdd(data)
    if (form.ownerEmail && form.ownerName) {
      saveInvite(form.ownerEmail, form.ownerName)
    }
    setInviteSent(true)
    setTimeout(() => onClose(), 1200)
  }

  const iInp = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', fontFamily: 'var(--font-sans)', width: '100%' }
  const iSel = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }

  const photoInputRef = React.useRef()
  const docInputRef = React.useRef()

  const addPhotos = (e) => {
    const files = Array.from(e.target.files || [])
    set('photos', [...form.photos, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f }))])
    e.target.value = ''
  }
  const addDocs = (e) => {
    const files = Array.from(e.target.files || [])
    set('documents', [...form.documents, ...files.map((f) => ({ name: f.name, file: f }))])
    e.target.value = ''
  }

  return (
    <Modal title={isEdit ? `Redaguoti butą ${initial.id}` : 'Pridėti butą'} subtitle={isEdit ? 'Keisti buto duomenis' : 'Naujas butas šiame pastate'} onClose={onClose} width={680}
      footer={
        inviteSent
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-green)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-body)' }}>
              <i className="ph ph-check-circle" style={{ fontSize: 18 }} />
              Pakvietimas išsiųstas
            </div>
          : <>
              <Button variant="secondary" onClick={onClose}>Atšaukti</Button>
              {isEdit
                ? <Button variant="primary" iconLeft="ph ph-floppy-disk" onClick={submit}>Išsaugoti</Button>
                : (!form.ownerEmail || !form.ownerName)
                  ? <Button variant="primary" iconLeft="ph ph-plus" onClick={submit}>Pridėti butą</Button>
                  : <Button variant="primary" iconLeft="ph ph-envelope" onClick={submitAndInvite}>Pakviesti ir pridėti butą</Button>
              }
            </>
      }>

      {/* Header row — status */}
      <div className="between" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Būsena:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
              <button key={key} type="button" onClick={() => set('st', key)} style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-pill)', outline: form.st === key ? '1.5px solid var(--line-300)' : 'none' }}>
                <Badge tone={tone}>{label}</Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={ADD_TABS} value={tab} onChange={setTab} />
      </div>

      {/* --- Techniniai duomenys --- */}
      {tab === 'tech' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldBox label="Buto numeris" error={errors.id} wrapStyle={{ gridColumn: '1 / -1' }}>
            <input style={iInp} value={form.id} placeholder="pvz. A-12" onChange={(e) => set('id', e.target.value)} />
          </FieldBox>
          <FieldBox label="Aukštas" error={errors.floor}>
            <input style={iInp} type="number" min="1" value={form.floor} onChange={(e) => set('floor', e.target.value)} />
          </FieldBox>
          <FieldBox label="Plotas (m²)" error={errors.area}>
            <input style={iInp} type="number" min="10" value={form.area} onChange={(e) => set('area', e.target.value)} />
          </FieldBox>
          <FieldBox label="Kambariai">
            <input style={iInp} type="number" min="1" max="10" value={form.rooms} onChange={(e) => set('rooms', e.target.value)} />
          </FieldBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>Orientacija</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
              {ORIENTATIONS.map(o => (
                <button key={o} type="button" onClick={() => set('orientation', o)}
                  style={{ padding: '5px 14px', borderRadius: 999, border: `1.5px solid ${form.orientation === o ? 'var(--brand-green)' : 'transparent'}`, background: form.orientation === o ? 'none' : 'var(--surface-sunken)', color: form.orientation === o ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-700)', fontSize: 'var(--text-small)', fontFamily: 'var(--font-sans)', fontWeight: form.orientation === o ? 'var(--fw-medium)' : 'var(--fw-regular)', cursor: 'pointer', whiteSpace: 'nowrap', outline: 'none' }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>Šildymas</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
              {HEATINGS.map(h => (
                <button key={h} type="button" onClick={() => set('heating', h)}
                  style={{ padding: '5px 14px', borderRadius: 999, border: `1.5px solid ${form.heating === h ? 'var(--brand-green)' : 'transparent'}`, background: form.heating === h ? 'none' : 'var(--surface-sunken)', color: form.heating === h ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-700)', fontSize: 'var(--text-small)', fontFamily: 'var(--font-sans)', fontWeight: form.heating === h ? 'var(--fw-medium)' : 'var(--fw-regular)', cursor: 'pointer', whiteSpace: 'nowrap', outline: 'none' }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>Energetinė klasė</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 4 }}>
              {ENERGY_CLASSES.map(c => (
                <button key={c} type="button" onClick={() => set('energyClass', c)}
                  style={{ padding: '5px 14px', borderRadius: 999, border: `1.5px solid ${form.energyClass === c ? 'var(--brand-green)' : 'transparent'}`, background: form.energyClass === c ? 'none' : 'var(--surface-sunken)', color: form.energyClass === c ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-700)', fontSize: 'var(--text-small)', fontFamily: 'var(--font-sans)', fontWeight: form.energyClass === c ? 'var(--fw-medium)' : 'var(--fw-regular)', cursor: 'pointer', whiteSpace: 'nowrap', outline: 'none' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <FieldBox label="Automobilio stovėjimas" onClick={() => set('hasParking', !form.hasParking)}>
            <span style={{ flex: 1, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{form.hasParking ? 'Taip' : 'Ne'}</span>
            <Toggle checked={form.hasParking} onChange={(v) => set('hasParking', v)} />
          </FieldBox>
          <FieldBox label="Stovėjimo aikštelės Nr." disabled={!form.hasParking}>
            <input style={{ ...iInp, opacity: form.hasParking ? 1 : 0.35 }} disabled={!form.hasParking} placeholder="pvz. P-12" value={form.parkingNr || ''} onChange={(e) => set('parkingNr', e.target.value)} />
          </FieldBox>
          <FieldBox label="Sandėliukas" onClick={() => set('hasStorage', !form.hasStorage)}>
            <span style={{ flex: 1, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{form.hasStorage ? 'Taip' : 'Ne'}</span>
            <Toggle checked={form.hasStorage} onChange={(v) => set('hasStorage', v)} />
          </FieldBox>
          <FieldBox label="Statybos metai">
            <input style={iInp} type="number" min="1900" max="2100" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </FieldBox>
        </div>
      )}

      {/* --- Savininkas --- */}
      {tab === 'owner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Searchable existing owner picker */}
          <div style={{ gridColumn: '1 / -1', marginBottom: 4 }}>
            <div style={{ position: 'relative' }}>
              <i className="ph ph-magnifying-glass" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--ink-400)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Ieškoti esamo savininko…"
                value={ownerSearch}
                onFocus={() => setOwnerDropOpen(true)}
                onChange={(e) => { setOwnerSearch(e.target.value); setOwnerDropOpen(true) }}
                onBlur={() => setTimeout(() => setOwnerDropOpen(false), 120)}
                style={{ width: '100%', paddingLeft: 36, paddingRight: 12, height: 38, border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', boxSizing: 'border-box' }}
              />
              {ownerDropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
                  background: 'var(--surface-card)', border: '1px solid var(--line-200)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  overflow: 'hidden',
                }}>
                  {OWNERS.filter((o) => o.name.toLowerCase().includes(ownerSearch.toLowerCase())).map((o) => (
                    <button key={o.name} type="button"
                      onMouseDown={() => { set('ownerName', o.name); set('ownerPhone', o.phone); set('ownerEmail', o.email); set('ownerSince', o.since); setOwnerSearch(o.name); setOwnerDropOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)', flex: '0 0 auto' }}>
                        {o.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)', fontWeight: 'var(--fw-medium)' }}>{o.name}</span>
                        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{o.phone}</span>
                      </div>
                    </button>
                  ))}
                  {OWNERS.filter((o) => o.name.toLowerCase().includes(ownerSearch.toLowerCase())).length === 0 && (
                    <div style={{ padding: '12px 14px', fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>Nerasta. Įveskite duomenis žemiau.</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <FieldBox label="Vardas Pavardė" wrapStyle={{ gridColumn: '1 / -1' }}>
            <input style={iInp} value={form.ownerName} placeholder="Lukas Petrauskas" onChange={(e) => { set('ownerName', e.target.value); setOwnerSearch(e.target.value) }} />
          </FieldBox>
          <FieldBox label="Telefonas">
            <input style={iInp} value={form.ownerPhone} placeholder="+370 600 00000" onChange={(e) => set('ownerPhone', e.target.value)} />
          </FieldBox>
          <FieldBox label="El. paštas">
            <input style={iInp} type="email" value={form.ownerEmail} placeholder="vardas@gmail.com" onChange={(e) => set('ownerEmail', e.target.value)} />
          </FieldBox>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>Savininkas nuo</span>
            <DatePicker value={form.ownerSince} onChange={(v) => set('ownerSince', v)} />
          </div>
        </div>
      )}

      {/* --- Nuotraukos --- */}
      {tab === 'photos' && (
        <div>
          <input ref={photoInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addPhotos} />
          {form.photos.length === 0
            ? (
              <button type="button" onClick={() => photoInputRef.current?.click()} style={{
                width: '100%', border: '1.5px dashed var(--line-300)', borderRadius: 'var(--radius-md)',
                padding: '32px 0', background: 'var(--surface-sunken)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                <i className="ph ph-image" style={{ fontSize: 32, color: 'var(--ink-300)' }} />
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>Pasirinkite nuotraukas</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-300)' }}>JPG, PNG, WEBP</span>
              </button>
            )
            : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 12 }}>
                  {form.photos.map((p, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-sunken)' }}>
                      <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => set('photos', form.photos.filter((_, j) => j !== i))} style={{
                        position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                        border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                      }}><i className="ph ph-x" /></button>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" iconLeft="ph ph-plus" onClick={() => photoInputRef.current?.click()}>Pridėti daugiau</Button>
              </div>
            )
          }
        </div>
      )}

      {/* --- Dokumentai --- */}
      {tab === 'docs' && (
        <div>
          <input ref={docInputRef} type="file" multiple style={{ display: 'none' }} onChange={addDocs} />
          <div className="stack-sm gap-8" style={{ marginBottom: form.documents.length ? 12 : 0 }}>
            {form.documents.map((d, i) => (
              <div key={i} className="row" style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <i className="ph ph-file-text" style={{ fontSize: 16, color: 'var(--ink-400)' }} />
                </div>
                <div className="row__main">
                  <span className="row__title">{d.name}</span>
                </div>
                <button onClick={() => set('documents', form.documents.filter((_, j) => j !== i))} style={{
                  border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-300)', padding: 4,
                }}><i className="ph ph-x" style={{ fontSize: 14 }} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => docInputRef.current?.click()} style={{
            width: '100%', border: '1.5px dashed var(--line-300)', borderRadius: 'var(--radius-md)',
            padding: '20px 0', background: 'var(--surface-sunken)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <i className="ph ph-upload-simple" style={{ fontSize: 18, color: 'var(--ink-300)' }} />
            <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-400)' }}>Įkelti dokumentus</span>
          </button>
        </div>
      )}

    </Modal>
  )
}

function UnitsToolbar({ maxFloor, search, setSearch, searchFocused, setSearchFocused, filterAukstas, setFilterAukstas, filterKambariai, setFilterKambariai, filterBusena, setFilterBusena, openDropdown, setOpenDropdown, onAdd, filteredCount, totalCount }) {
  const { Button } = window.MitedaDesignSystem_acc833

  React.useEffect(() => {
    if (openDropdown === null) return
    const close = (e) => { if (!e.target.closest('[data-filter-dropdown]')) setOpenDropdown(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [openDropdown])

  const AUKSTAS_FILTERS = [
    { value: 'all', label: 'Aukštas' },
    ...Array.from({ length: maxFloor }, (_, i) => ({ value: String(i + 1), label: `${i + 1} aukštas` })),
  ]
  const KAMBARIAI_FILTERS = [
    { value: 'all', label: 'Kambariai' },
    { value: '1', label: '1 kamb.' },
    { value: '2', label: '2 kamb.' },
    { value: '3', label: '3+ kamb.' },
  ]
  const BUSENA_FILTERS = [
    { value: 'all', label: 'Būsena' },
    ...Object.entries(UNIT_STATUS).map(([k, v]) => ({ value: k, label: v.label })),
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--line-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, background: 'var(--overlay-ink-04)', borderRadius: 'var(--radius-md)', padding: '0 10px', width: 200, flexShrink: 0, overflow: 'hidden', border: searchFocused ? '1.5px solid var(--brand-green)' : '1.5px solid transparent', boxSizing: 'border-box', transition: 'border-color 0.15s' }}>
        <i className="ph ph-magnifying-glass" style={{ fontSize: 16, color: 'var(--ink-400)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Ieškoti buto, savininko…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)', color: 'var(--ink-900)', minWidth: 0 }}
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <i className="ph ph-x" style={{ fontSize: 14 }} />
          </button>
        )}
      </div>
      {[
        { key: 'aukstas', value: filterAukstas, set: setFilterAukstas, options: AUKSTAS_FILTERS },
        { key: 'kambariai', value: filterKambariai, set: setFilterKambariai, options: KAMBARIAI_FILTERS },
        { key: 'busena', value: filterBusena, set: setFilterBusena, options: BUSENA_FILTERS },
      ].map(({ key, value, set, options }) => {
        const active = value !== 'all'
        const currentLabel = options.find(o => o.value === value)?.label || options[0].label
        const isOpen = openDropdown === key
        const btnStyle = {
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${active ? 'var(--brand-green)' : 'var(--line-200)'}`,
          background: active ? 'var(--brand-green-faint)' : 'var(--surface-card)',
          color: active ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-600)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
          cursor: 'pointer', fontWeight: active ? 'var(--fw-medium)' : 'var(--fw-regular)',
          whiteSpace: 'nowrap', appearance: 'none', outline: 'none', height: 36, boxSizing: 'border-box',
        }
        return (
          <div key={key} data-filter-dropdown style={{ position: 'relative' }}>
            <button type="button" style={btnStyle} onClick={() => setOpenDropdown(isOpen ? null : key)}>
              {currentLabel}
              <i className={`ph ph-caret-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 11, opacity: 0.7 }} />
            </button>
            {isOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid var(--line-100)', minWidth: 150, padding: 4 }}>
                {options.map(o => (
                  <button key={o.value} type="button"
                    onClick={() => { set(o.value); setOpenDropdown(null) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: value === o.value ? 'var(--brand-green-faint)' : 'transparent', color: value === o.value ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-700)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', cursor: 'pointer', fontWeight: value === o.value ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>
                    {o.label}
                    {value === o.value && <i className="ph ph-check" style={{ fontSize: 13 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <div style={{ flex: 1 }} />
      {totalCount != null && (
        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', flexShrink: 0 }}>
          {filteredCount != null && filteredCount !== totalCount ? `${filteredCount} iš ${totalCount} butų` : `${totalCount} butų iš viso`}
        </span>
      )}
      <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={onAdd}>Pridėti</Button>
    </div>
  )
}

function UnitsTab({ P, propIdx, search, filterAukstas, filterKambariai, filterBusena, adding, setAdding, onCountChange }) {
  const DS = window.MitedaDesignSystem_acc833
  const { IconButton, Badge, Checkbox } = DS

  const [units, setUnits] = useState(() => {
    const seeded = localStorage.getItem('miteda_seeded_units_' + propIdx)
    if (seeded !== null) {
      const saved = localStorage.getItem('miteda_units_' + propIdx)
      return saved ? JSON.parse(saved) : []
    }
    return P.isNew ? [] : makeUnits(P)
  })
  const [sel, setSel] = useState({})
  const [detail, setDetail] = useState(null)
  const [editing, setEditing] = useState(null)
  const [popover, setPopover] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  React.useEffect(() => {
    if (popover === null) return
    const close = () => setPopover(null)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [popover])

  const selCount = Object.values(sel).filter(Boolean).length
  const allSelected = units.length > 0 && selCount === units.length
  const toggleAll = () => {
    if (allSelected) setSel({})
    else { const all = {}; units.forEach((_, i) => { all[i] = true }); setSel(all) }
  }
  const markSold = () => { setUnits((us) => us.map((u, i) => sel[i] ? { ...u, st: 'sold' } : u)); setSel({}) }
  React.useEffect(() => {
    localStorage.setItem('miteda_units_' + propIdx, JSON.stringify(units))
    localStorage.setItem('miteda_seeded_units_' + propIdx, '1')
  }, [units, propIdx])

  const saveStatus = (st) => { setUnits((us) => us.map((u, i) => i === detail.idx ? { ...u, st } : u)) }
  const addUnit = (u) => setUnits((us) => [...us, u])
  const updateUnit = (idx, data) => setUnits((us) => us.map((u, i) => i === idx ? { ...u, ...data } : u))
  const deleteUnit = (idx) => { setUnits((us) => us.filter((_, i) => i !== idx)); setSel((s) => { const n = {}; Object.keys(s).forEach((k) => { if (+k < idx) n[k] = s[k]; else if (+k > idx) n[+k - 1] = s[k] }); return n }) }

  const filtered = units.filter((u, i) => {
    const rooms = u.area <= 53 ? 1 : u.area <= 75 ? 2 : 3
    const hasResidents = u.st !== 'free'
    const owner = hasResidents ? (u.owner || OWNERS[i % OWNERS.length]) : null
    const q = search.trim().toLowerCase()
    if (q && !u.id.toLowerCase().includes(q) && !(owner && owner.name.toLowerCase().includes(q))) return false
    if (filterAukstas !== 'all' && u.floor !== +filterAukstas) return false
    if (filterKambariai !== 'all' && rooms !== +filterKambariai) return false
    if (filterBusena !== 'all' && u.st !== filterBusena) return false
    return true
  })

  React.useEffect(() => {
    if (onCountChange) onCountChange(filtered.length, units.length)
  }, [filtered.length, units.length])

  return (
    <div>


      {selCount > 0 && (
        <div className="between" style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--brand-green-faint)' }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Pažymėta {selCount} butų</span>
          <div className="rowflex gap-8">
            <Button variant="accent" size="sm" iconLeft="ph ph-check" onClick={markSold}>Pažymėti parduotais</Button>
            <Button variant="ghost" size="sm" onClick={() => setSel({})}>Atšaukti</Button>
          </div>
        </div>
      )}
      <table className="tbl">
          <thead><tr style={{ position: 'sticky', top: 0, zIndex: 4, background: 'var(--surface-card)' }}>
            <th style={{ width: 36, paddingTop: 10 }}><Checkbox checked={allSelected} onChange={toggleAll} /></th>
            <th style={{ paddingTop: 10 }}>Butas</th><th style={{ paddingTop: 10 }}>Aukštas</th><th style={{ paddingTop: 10 }}>Plotas</th><th style={{ paddingTop: 10 }}>Kamb.</th><th style={{ paddingTop: 10 }}>Būsena</th>
            <th style={{ paddingTop: 10 }}>Savininkas</th><th style={{ paddingTop: 10 }}>Telefonas</th><th style={{ paddingTop: 10 }}>Nuo</th><th style={{ paddingTop: 10 }}></th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-400)', fontSize: 'var(--text-body)' }}>Nėra atitinkančių butų</td></tr>
            )}
            {filtered.map((u) => {
              const i = units.indexOf(u)
              const rooms = u.area <= 53 ? 1 : u.area <= 75 ? 2 : 3
              const owner = u.st !== 'free' ? (u.owner || OWNERS[i % OWNERS.length]) : null
              return (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setDetail({ idx: i, unit: u })}>
                  <td onClick={(e) => e.stopPropagation()}><Checkbox checked={!!sel[i]} onChange={(v) => setSel({ ...sel, [i]: v })} /></td>
                  <td className="tbl__id">{u.id}</td>
                  <td>{u.floor} a.</td>
                  <td>{u.area} m²</td>
                  <td style={{ color: 'var(--ink-500)' }}>{rooms} kamb.</td>
                  <td><Badge tone={UNIT_STATUS[u.st].tone}>{UNIT_STATUS[u.st].label}</Badge></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {owner
                      ? <Link to={`/admin/gyventojas/${owner.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)' }}>
                            {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)' }}>{owner.name}</span>
                        </Link>
                      : <span style={{ color: 'var(--ink-300)' }}>—</span>}
                  </td>
                  <td style={{ color: owner ? 'var(--ink-600)' : 'var(--ink-300)', fontSize: 'var(--text-small)' }}>
                    {owner ? owner.phone : '—'}
                  </td>
                  <td style={{ color: 'var(--ink-400)', fontSize: 'var(--text-small)', whiteSpace: 'nowrap' }}>
                    {owner ? owner.since : '—'}
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <IconButton icon="ph ph-arrow-right" variant="ghost" size="sm" ariaLabel="Peržiūrėti"
                        onClick={() => setDetail({ idx: i, unit: u })} />
                      <div style={{ position: 'relative' }}>
                        <IconButton icon="ph ph-dots-three-vertical" variant="ghost" size="sm" ariaLabel="Veiksmai"
                          onClick={(e) => { e.stopPropagation(); setPopover(popover === i ? null : i) }} />
                        {popover === i && (
                          <div onMouseDown={(e) => e.stopPropagation()} style={{
                            position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50,
                            background: 'var(--surface-card)', border: '1px solid var(--line-200)',
                            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                            minWidth: 160, overflow: 'hidden',
                          }}>
                            {[
                              { icon: 'ph ph-trash', label: 'Ištrinti', danger: true, action: () => { setConfirmDelete(i); setPopover(null) } },
                            ].map(({ icon, label, action, danger }) => (
                              <button key={label} type="button" onClick={action} style={{
                                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                padding: '10px 14px', border: 'none', background: 'transparent',
                                cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
                                color: danger ? 'var(--orange)' : 'var(--ink-800)',
                                textAlign: 'left',
                              }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                <i className={icon} style={{ fontSize: 16 }} />
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
      </table>
      {adding && (
        <AddUnitModal units={units} onAdd={addUnit} onClose={() => setAdding(false)} />
      )}
      {editing && (
        <AddUnitModal units={units} initial={editing.unit}
          onSave={(data) => updateUnit(editing.idx, data)}
          onClose={() => setEditing(null)} />
      )}
      {detail && (
        <UnitDetailModal
          unit={units[detail.idx]}
          idx={detail.idx}
          onClose={() => setDetail(null)}
          onSaveUnit={(updated) => { setUnits((us) => us.map((u, i) => i === detail.idx ? updated : u)) }}
        />
      )}
      {confirmDelete !== null && (
        <ConfirmDialog
          title="Ištrinti butą"
          message={`Ar tikrai norite ištrinti butą ${units[confirmDelete]?.id}? Šio veiksmo atšaukti negalėsite.`}
          onConfirm={() => { deleteUnit(confirmDelete); setConfirmDelete(null) }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}

function ResidentDetailModal({ resident, onClose, onSave }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Badge, Button } = DS
  const [tab, setTab] = useState('owner')

  const contracts = CONTRACT_TPLS.slice(0, 3).map((c, i) => ({ ...c, id: `SUT-${200 + i}` }))
  const photos = PHOTO_COLS.slice(0, 6)

  const detailTabs = [
    { key: 'owner', label: 'Savininkas' },
    { key: 'photos', label: 'Nuotraukos' },
    { key: 'contracts', label: 'Sutartys' },
  ]

  const initForm = () => ({
    name: resident.name,
    phone: resident.phone,
    email: resident.name.split(' ')[0].toLowerCase() + '@gmail.com',
    since: '2024-01-10',
    apt: resident.apt,
    role: resident.role,
  })
  const [form, setForm] = useState(initForm)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const saveEdit = () => { onSave({ ...resident, ...form }) }

  const inp = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', fontFamily: 'var(--font-sans)', width: '100%' }

  return (
    <Modal
      title={resident.name}
      subtitle={`Butas ${resident.apt} · ${resident.role}`}
      onClose={onClose}
      width={580}
      footer={<><Button variant="ghost" onClick={onClose}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-floppy-disk" onClick={saveEdit}>Išsaugoti</Button></>}
    >
      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={detailTabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'owner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldBox label="Vardas, pavardė">
            <input style={inp} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FieldBox>
          <FieldBox label="Telefonas">
            <input style={inp} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </FieldBox>
          <FieldBox label="El. paštas">
            <input style={inp} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </FieldBox>
          <FieldBox label="Gyventojas nuo">
            <input style={inp} type="date" value={form.since} onChange={(e) => set('since', e.target.value)} />
          </FieldBox>
          <FieldBox label="Butas">
            <input style={inp} value={form.apt} onChange={(e) => set('apt', e.target.value)} />
          </FieldBox>
          <FieldBox label="Rolė">
            <select style={{ ...inp, cursor: 'pointer' }} value={form.role} onChange={(e) => set('role', e.target.value)}>
              {['Savininkas', 'Savininkė', 'Nuomininkas', 'Nuomininkė'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FieldBox>
        </div>
      )}

      {tab === 'photos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {photos.map((col, i) => (
            <PhotoTile key={i} color={col} label={['Svetainė', 'Miegamasis', 'Virtuvė', 'Vonios kambarys', 'Balkonas', 'Koridorius'][i % 6]} />
          ))}
        </div>
      )}

      {tab === 'contracts' && (
        <div className="stack-sm gap-8">
          {contracts.map((c) => (
            <div key={c.id} className="row">
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <i className="ph ph-file-text" style={{ fontSize: 18, color: 'var(--ink-400)' }} aria-hidden="true" />
              </div>
              <div className="row__main">
                <span className="row__title">{c.type}</span>
                <span className="row__meta">{c.id}<span className="dot">·</span>{c.date}</span>
              </div>
              <Badge tone={c.tone}>{c.status === 'signed' ? 'Pasirašyta' : 'Galioja'}</Badge>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

function FormRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      {children}
    </div>
  )
}

function AddResidentModal({ onClose, onAdd, units = [] }) {
  const { Button } = window.MitedaDesignSystem_acc833
  const fld = { height: 36, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const [form, setForm] = useState({ name: '', phone: '', email: '', apt: '', role: 'Savininkas' })
  const [aptSearch, setAptSearch] = useState('')
  const [aptOpen, setAptOpen] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = () => { if (!form.name.trim() || !form.apt.trim()) return; onAdd(form); onClose() }
  const filteredUnits = units.filter((id) => id.toLowerCase().includes(aptSearch.toLowerCase()))
  return (
    <Modal title="Pridėti gyventoją" subtitle="Sukurkite naują gyventojo profilį." onClose={onClose} width={520}
      footer={<><Button variant="secondary" onClick={onClose}>Atšaukti</Button><Button variant="primary" iconLeft="ph ph-plus" onClick={submit}>Pridėti</Button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormRow label="Vardas, pavardė"><input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Vardas Pavardė" /></FormRow>
        <FormRow label="Butas">
          {units.length > 0 ? (
            <div style={{ position: 'relative' }}>
              <input style={{ ...fld, paddingRight: 28 }} value={aptSearch || form.apt} placeholder="Ieškoti buto…"
                onFocus={() => setAptOpen(true)}
                onChange={(e) => { setAptSearch(e.target.value); set('apt', ''); setAptOpen(true) }}
              />
              {form.apt && !aptSearch && (
                <i className="ph ph-check" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--brand-green)', pointerEvents: 'none' }} />
              )}
              {aptOpen && filteredUnits.length > 0 && (
                <div onMouseDown={(e) => e.preventDefault()} style={{
                  position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 200,
                  background: 'var(--surface-card)', border: '1px solid var(--line-200)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  maxHeight: 180, overflowY: 'auto',
                }}>
                  {filteredUnits.map((id) => (
                    <button key={id} type="button" onMouseDown={() => { set('apt', id); setAptSearch(''); setAptOpen(false) }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none',
                        background: form.apt === id ? 'var(--brand-green-faint)' : 'transparent',
                        color: form.apt === id ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-800)',
                        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', cursor: 'pointer',
                      }}>
                      {id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <input style={fld} value={form.apt} onChange={(e) => set('apt', e.target.value)} placeholder="A-1" />
          )}
        </FormRow>
        <FormRow label="Telefonas"><input style={fld} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+370 6xx xxxxx" /></FormRow>
        <FormRow label="El. paštas"><input style={fld} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="vardas@gmail.com" /></FormRow>
        <FormRow label="Rolė"><DSSelect value={form.role} onChange={(v) => set('role', v)} options={['Savininkas', 'Savininkė', 'Nuomininkas', 'Nuomininkė']} /></FormRow>
      </div>
    </Modal>
  )
}

function ResidentsToolbar({ search, setSearch, searchFocused, setSearchFocused, filterRole, setFilterRole, openDropdown, setOpenDropdown, onAdd, filteredCount, totalCount }) {
  const { Button } = window.MitedaDesignSystem_acc833
  React.useEffect(() => {
    if (openDropdown === null) return
    const close = (e) => { if (!e.target.closest('[data-filter-dropdown]')) setOpenDropdown(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [openDropdown])
  const ROLE_FILTERS = [{ value: 'all', label: 'Role' }, { value: 'Savininkas', label: 'Savininkas' }, { value: 'Nuomininkas', label: 'Nuomininkas' }]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--line-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, background: 'var(--overlay-ink-04)', borderRadius: 'var(--radius-md)', padding: '0 10px', width: 200, flexShrink: 0, overflow: 'hidden', border: searchFocused ? '1.5px solid var(--brand-green)' : '1.5px solid transparent', boxSizing: 'border-box', transition: 'border-color 0.15s' }}>
        <i className="ph ph-magnifying-glass" style={{ fontSize: 16, color: 'var(--ink-400)', flexShrink: 0 }} />
        <input type="text" placeholder="Ieškoti gyventojo, buto…" value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)', color: 'var(--ink-900)', minWidth: 0 }} />
        {search && <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><i className="ph ph-x" style={{ fontSize: 14 }} /></button>}
      </div>
      {[{ key: 'role', value: filterRole, set: setFilterRole, options: ROLE_FILTERS }].map(({ key, value, set, options }) => {
        const active = value !== 'all'
        const currentLabel = options.find(o => o.value === value)?.label || options[0].label
        const isOpen = openDropdown === key
        const btnStyle = { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${active ? 'var(--brand-green)' : 'var(--line-200)'}`, background: active ? 'var(--brand-green-faint)' : 'var(--surface-card)', color: active ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-600)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', cursor: 'pointer', fontWeight: active ? 'var(--fw-medium)' : 'var(--fw-regular)', whiteSpace: 'nowrap', appearance: 'none', outline: 'none', height: 36, boxSizing: 'border-box' }
        return (
          <div key={key} data-filter-dropdown style={{ position: 'relative' }}>
            <button type="button" style={btnStyle} onClick={() => setOpenDropdown(isOpen ? null : key)}>
              {currentLabel}<i className={`ph ph-caret-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 11, opacity: 0.7 }} />
            </button>
            {isOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 200, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid var(--line-100)', minWidth: 150, padding: 4 }}>
                {options.map(o => (
                  <button key={o.value} type="button" onClick={() => { set(o.value); setOpenDropdown(null) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: value === o.value ? 'var(--brand-green-faint)' : 'transparent', color: value === o.value ? 'var(--brand-green-dark, var(--brand-green))' : 'var(--ink-700)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', cursor: 'pointer', fontWeight: value === o.value ? 'var(--fw-medium)' : 'var(--fw-regular)' }}>
                    {o.label}{value === o.value && <i className="ph ph-check" style={{ fontSize: 13 }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
      <div style={{ flex: 1 }} />
      {totalCount != null && <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', flexShrink: 0 }}>{filteredCount != null && filteredCount !== totalCount ? `${filteredCount} iš ${totalCount} gyventojų` : `${totalCount} gyventojų iš viso`}</span>}
      <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={onAdd}>Pridėti</Button>
    </div>
  )
}

function ContactsToolbar({ search, setSearch, searchFocused, setSearchFocused, onAdd, filteredCount, totalCount }) {
  const { Button } = window.MitedaDesignSystem_acc833
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--line-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, background: 'var(--overlay-ink-04)', borderRadius: 'var(--radius-md)', padding: '0 10px', width: 200, flexShrink: 0, overflow: 'hidden', border: searchFocused ? '1.5px solid var(--brand-green)' : '1.5px solid transparent', boxSizing: 'border-box', transition: 'border-color 0.15s' }}>
        <i className="ph ph-magnifying-glass" style={{ fontSize: 16, color: 'var(--ink-400)', flexShrink: 0 }} />
        <input type="text" placeholder="Ieškoti kontakto, įmonės…" value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontFamily: 'var(--font-sans)', color: 'var(--ink-900)', minWidth: 0 }} />
        {search && <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-400)', display: 'flex', alignItems: 'center', flexShrink: 0 }}><i className="ph ph-x" style={{ fontSize: 14 }} /></button>}
      </div>
      <div style={{ flex: 1 }} />
      {totalCount != null && <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', flexShrink: 0 }}>{filteredCount != null && filteredCount !== totalCount ? `${filteredCount} iš ${totalCount} kontaktų` : `${totalCount} kontaktų iš viso`}</span>}
      <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={onAdd}>Pridėti</Button>
    </div>
  )
}

function ResidentsTab({ P, propIdx, search, filterRole, adding, setAdding, onCountChange }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, IconButton, Button } = DS

  const [residents, setResidents] = useState(() => {
    const seeded = localStorage.getItem('miteda_seeded_residents_' + propIdx)
    if (seeded !== null) {
      const saved = localStorage.getItem('miteda_residents_' + propIdx)
      return saved ? JSON.parse(saved) : []
    }
    return P.isNew ? [] : DEMO_RESIDENTS
  })
  const [selected, setSelected] = useState(null)

  React.useEffect(() => {
    localStorage.setItem('miteda_residents_' + propIdx, JSON.stringify(residents))
    localStorage.setItem('miteda_seeded_residents_' + propIdx, '1')
  }, [residents, propIdx])

  const saveResident = (updated) => {
    setResidents((rs) => rs.map((r) => r.name === selected.name && r.apt === selected.apt ? updated : r))
    setSelected(updated)
  }
  const addResident = (r) => setResidents((rs) => [...rs, r])
  const unitIds = P ? makeUnits(P).map((u) => u.id) : []

  const q = (search || '').trim().toLowerCase()
  const filtered = residents.filter((r) => {
    if (filterRole && filterRole !== 'all' && r.role !== filterRole) return false
    if (q && !r.name.toLowerCase().includes(q) && !String(r.apt).toLowerCase().includes(q)) return false
    return true
  })
  React.useEffect(() => { if (onCountChange) onCountChange(filtered.length, residents.length) }, [filtered.length, residents.length])

  return (
    <>
      <table className="tbl">
        <thead><tr style={{ position: 'sticky', top: 0, zIndex: 4, background: 'var(--surface-card)' }}>
          <th style={{ paddingTop: 10 }}>Vardas</th>
          <th style={{ paddingTop: 10 }}>Butas</th>
          <th style={{ paddingTop: 10 }}>Telefonas</th>
          <th style={{ paddingTop: 10 }}>Rolė</th>
          <th style={{ paddingTop: 10 }}></th>
        </tr></thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-400)', fontSize: 'var(--text-body)' }}>{residents.length === 0 ? 'Nėra gyventojų' : 'Nerasta gyventojų'}</td></tr>
          )}
          {filtered.map((r, i) => (
            <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)' }}>
                    {r.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)' }}>{r.name}</span>
                </div>
              </td>
              <td style={{ color: 'var(--ink-600)' }}>Butas {r.apt}</td>
              <td style={{ color: 'var(--ink-600)', fontSize: 'var(--text-small)' }}>{r.phone}</td>
              <td><Badge tone={r.role === 'Nuomininkas' ? 'neutral' : 'success'}>{r.role}</Badge></td>
              <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                <IconButton icon="ph ph-arrow-right" variant="ghost" size="sm" ariaLabel="Peržiūrėti" onClick={() => setSelected(r)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <ResidentDetailModal
          resident={selected}
          onClose={() => setSelected(null)}
          onSave={saveResident}
        />
      )}
      {adding && <AddResidentModal units={unitIds} onClose={() => setAdding(false)} onAdd={addResident} />}
    </>
  )
}

function PhotosTab({ P, propIdx }) {
  const { Button } = window.MitedaDesignSystem_acc833
  const fileRef = React.useRef()
  const [photos, setPhotos] = useState(() => P.isNew ? [] : PHOTO_COLS)
  const addPhotos = (e) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setPhotos((p) => [...p, ...urls])
    e.target.value = ''
  }
  return (
    <div>
      <div className="between" style={{ marginBottom: 12 }}>
        <span />
        <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={() => fileRef.current?.click()}>Pridėti nuotrauką</Button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={addPhotos} />
      </div>
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {photos.map((col, i) => <PhotoTile key={i} color={col} />)}
      </div>
    </div>
  )
}

function AddContactModal({ onClose, onAdd }) {
  const { Button } = window.MitedaDesignSystem_acc833
  const fld = { height: 36, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const [form, setForm] = useState({ name: '', role: '', company: '', phone: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const submit = () => { if (!form.name.trim()) return; onAdd(form); onClose() }
  const Row = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      {children}
    </div>
  )
  return (
    <Modal title="Pridėti kontaktą" subtitle="Pridėkite kontaktą prie šio pastato." onClose={onClose} width={480}
      footer={<><Button variant="secondary" onClick={onClose}>Atšaukti</Button><Button variant="primary" iconLeft="ph ph-plus" onClick={submit}>Pridėti</Button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormRow label="Vardas, pavardė"><input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Vardas Pavardė" /></FormRow>
        <FormRow label="Telefonas"><input style={fld} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+370 6xx xxxxx" /></FormRow>
        <FormRow label="Rolė"><input style={fld} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Vadybininkas" /></FormRow>
        <FormRow label="Įmonė"><input style={fld} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="UAB Įmonė" /></FormRow>
      </div>
    </Modal>
  )
}

function ContactsTab({ P, propIdx, search, adding, setAdding, onCountChange }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, IconButton, Button } = DS
  const [allContactsData] = useRepo('listContacts')

  const [contacts, setContacts] = useState(() => {
    const seeded = localStorage.getItem('miteda_seeded_contacts_' + propIdx)
    if (seeded !== null) {
      const saved = localStorage.getItem('miteda_contacts_' + propIdx)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  React.useEffect(() => {
    if (P.isNew) { localStorage.setItem('miteda_seeded_contacts_' + propIdx, '1'); return }
    if (localStorage.getItem('miteda_seeded_contacts_' + propIdx) !== null) return
    if (!allContactsData) return
    const demo = allContactsData.filter((c) => c.objektai && c.objektai.includes(P.name))
    setContacts(demo.length > 0 ? demo : [])
    localStorage.setItem('miteda_seeded_contacts_' + propIdx, '1')
  }, [allContactsData, P.isNew, P.name, propIdx])

  React.useEffect(() => {
    localStorage.setItem('miteda_contacts_' + propIdx, JSON.stringify(contacts))
  }, [contacts, propIdx])

  const cq = (search || '').trim().toLowerCase()
  const filteredContacts = contacts.filter((c) => {
    if (!cq) return true
    return c.name.toLowerCase().includes(cq) || (c.company || '').toLowerCase().includes(cq) || (c.role || '').toLowerCase().includes(cq)
  })
  React.useEffect(() => { if (onCountChange) onCountChange(filteredContacts.length, contacts.length) }, [filteredContacts.length, contacts.length])

  return (
    <div>
      <table className="tbl">
        <thead><tr style={{ position: 'sticky', top: 0, zIndex: 4, background: 'var(--surface-card)' }}>
          <th style={{ paddingTop: 10 }}>Vardas</th>
          <th style={{ paddingTop: 10 }}>Rolė</th>
          <th style={{ paddingTop: 10 }}>įmonė</th>
          <th style={{ paddingTop: 10 }}>Telefonas</th>
          <th style={{ paddingTop: 10 }}></th>
        </tr></thead>
        <tbody>
          {filteredContacts.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-400)', fontSize: 'var(--text-body)' }}>{contacts.length === 0 ? 'Nėra kontaktų' : 'Nerasta kontaktų'}</td></tr>
          )}
          {filteredContacts.map((c, i) => (
            <tr key={i}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)' }}>
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)' }}>{c.name}</span>
                </div>
              </td>
              <td style={{ color: 'var(--ink-600)' }}>{c.role || '—'}</td>
              <td style={{ color: 'var(--ink-600)' }}>{c.company || '—'}</td>
              <td style={{ color: 'var(--ink-600)', fontSize: 'var(--text-small)' }}>{c.phone || '—'}</td>
              <td style={{ textAlign: 'right' }}>
                <IconButton icon="ph ph-phone" variant="ghost" size="sm" ariaLabel="Skambinti" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {adding && <AddContactModal onClose={() => setAdding(false)} onAdd={(c) => setContacts((prev) => [...prev, c])} />}
    </div>
  )
}

function EditObjektasModal({ P, onSave, onClose }) {
  const { Button } = window.MitedaDesignSystem_acc833
  const [form, setForm] = useState({ name: P.name, address: P.address, units: String(P.units), coverImage: P.coverImage || null })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const fileRef = React.useRef()
  const [dragOver, setDragOver] = useState(false)
  const fld = { height: 40, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    set('coverImage', URL.createObjectURL(file))
  }

  return (
    <Modal title="Redaguoti objektą" subtitle={P.name} onClose={onClose} width={480}
      footer={<><Button variant="ghost" onClick={onClose}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-floppy-disk" onClick={() => { onSave({ ...P, name: form.name.trim() || P.name, address: form.address.trim() || P.address, units: +form.units || P.units, coverImage: form.coverImage }); onClose() }}>Išsaugoti</Button></>}>
      <div className="stack-sm gap-14">
        <div className="field field--compact">
          <label>Viršelio nuotrauka</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => { handleFile(e.target.files[0]); e.target.value = '' }} />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            style={{ position: 'relative', height: 140, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: form.coverImage ? `url(${form.coverImage}) center/cover no-repeat` : 'var(--surface-sunken)', border: `1.5px dashed ${dragOver ? 'var(--brand-green)' : 'var(--line-200)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.15s', boxSizing: 'border-box' }}>
            {!form.coverImage
              ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: dragOver ? 'var(--brand-green)' : 'var(--ink-300)', pointerEvents: 'none' }}>
                  <i className="ph ph-image" style={{ fontSize: 32 }} />
                  <span style={{ fontSize: 'var(--text-small)' }}>{dragOver ? 'Paleiskite norėdami įkelti' : 'Tempkite arba spustelėkite'}</span>
                </div>
              : <div style={{ position: 'absolute', inset: 0, background: dragOver ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ color: '#fff', fontSize: 'var(--text-small)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className={`ph ${dragOver ? 'ph-arrow-down' : 'ph-pencil-simple'}`} style={{ fontSize: 16 }} />
                    {dragOver ? 'Paleiskite norėdami pakeisti' : 'Keisti nuotrauką'}
                  </span>
                </div>
            }
          </div>
          {form.coverImage && (
            <button type="button" onClick={() => set('coverImage', null)} style={{ marginTop: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 'var(--text-small)', color: 'var(--ink-400)', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              <i className="ph ph-x" style={{ fontSize: 13 }} /> Pašalinti nuotrauką
            </button>
          )}
        </div>
        <div className="field field--compact">
          <label>Objekto pavadinimas</label>
          <input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="pvz. Vilniaus g. 12" />
        </div>
        <div className="field field--compact">
          <label>Adresas</label>
          <input style={fld} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="pvz. Vilniaus g. 12, Vilnius" />
        </div>
        <div className="field field--compact">
          <label>Butų skaičius</label>
          <input style={fld} type="number" min="1" value={form.units} onChange={(e) => set('units', e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}

export default function Objektas() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button } = DS

  const [searchParams] = useSearchParams()
  const idx = +(searchParams.get('b') || 0)

  const [tab, setTab] = useState('units')
  const [unitsSearch, setUnitsSearch] = useState('')
  const [unitsSearchFocused, setUnitsSearchFocused] = useState(false)
  const [unitsFilterAukstas, setUnitsFilterAukstas] = useState('all')
  const [unitsFilterKambariai, setUnitsFilterKambariai] = useState('all')
  const [unitsFilterBusena, setUnitsFilterBusena] = useState('all')
  const [unitsOpenDropdown, setUnitsOpenDropdown] = useState(null)
  const [unitsAdding, setUnitsAdding] = useState(false)
  const [unitsCount, setUnitsCount] = useState(null)
  const [residentsSearch, setResidentsSearch] = useState('')
  const [residentsSearchFocused, setResidentsSearchFocused] = useState(false)
  const [residentsFilterRole, setResidentsFilterRole] = useState('all')
  const [residentsOpenDropdown, setResidentsOpenDropdown] = useState(null)
  const [residentsAdding, setResidentsAdding] = useState(false)
  const [residentsCount, setResidentsCount] = useState(null)
  const [contactsSearch, setContactsSearch] = useState('')
  const [contactsSearchFocused, setContactsSearchFocused] = useState(false)
  const [contactsAdding, setContactsAdding] = useState(false)
  const [contactsCount, setContactsCount] = useState(null)
  const [propsData] = useRepo('listProperties')
  const props = propsData || []
  const baseP = props[idx] || props[0]
  const [localP, setLocalP] = useState(null)
  const [editingObj, setEditingObj] = useState(false)
  const P = localP || baseP
  const cardRef = useRef(null)
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 24, autoAlpha: 0, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: el, scroller: '.main', start: 'top 88%', once: true },
      })
    })
    return () => ctx.revert()
  }, [])
  if (!P) return null
  const pct = Math.round((P.sold / P.units) * 100)
  const tabs = [
    { key: 'units', label: 'Butai', count: P.units },
    { key: 'residents', label: 'Gyventojai' },
    { key: 'photos', label: 'Nuotraukos' },
    { key: 'contacts', label: 'Kontaktai' },
  ]

  return (
    <>
    <Shell role="admin" nav="objektai"
      title={P.name} subtitle={P.address}
      breadcrumbs={[
        { label: 'Administracija', href: '/admin/objektai' },
        { label: 'Objektai', href: '/admin/objektai' },
        { label: P.name },
      ]}
      headerActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" iconLeft="ph ph-pencil-simple" onClick={() => setEditingObj(true)}>Redaguoti</Button>
          <Link className="plain" to="/admin/objektai"><Button variant="secondary" iconLeft="ph ph-arrow-left">Į objektus</Button></Link>
        </div>
      }>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-door" label="Butai" value={P.units} />
          <Stat icon="ph ph-check-circle" label="Parduota" value={P.sold + ' (' + pct + '%)'} accent />
          <Stat icon="ph ph-users-three" label="Gyventojai" value={P.sold} />
        </div>
        <div ref={cardRef} className="scroll-reveal">
          <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 'calc(100vh - 268px)' }}>
            <PanelHead title="Pastato valdymas" description="Valdykite butus, gyventojus, nuotraukas ir kontaktus." action={<Tabs tabs={tabs} value={tab} onChange={setTab} />} />
            {tab === 'residents' && (
              <ResidentsToolbar
                search={residentsSearch} setSearch={setResidentsSearch}
                searchFocused={residentsSearchFocused} setSearchFocused={setResidentsSearchFocused}
                filterRole={residentsFilterRole} setFilterRole={setResidentsFilterRole}
                openDropdown={residentsOpenDropdown} setOpenDropdown={setResidentsOpenDropdown}
                onAdd={() => setResidentsAdding(true)}
                filteredCount={residentsCount?.filtered}
                totalCount={residentsCount?.total}
              />
            )}
            {tab === 'contacts' && (
              <ContactsToolbar
                search={contactsSearch} setSearch={setContactsSearch}
                searchFocused={contactsSearchFocused} setSearchFocused={setContactsSearchFocused}
                onAdd={() => setContactsAdding(true)}
                filteredCount={contactsCount?.filtered}
                totalCount={contactsCount?.total}
              />
            )}
            {tab === 'units' && (
              <UnitsToolbar
                maxFloor={Math.ceil(P.units / 12)}
                search={unitsSearch} setSearch={setUnitsSearch}
                searchFocused={unitsSearchFocused} setSearchFocused={setUnitsSearchFocused}
                filterAukstas={unitsFilterAukstas} setFilterAukstas={setUnitsFilterAukstas}
                filterKambariai={unitsFilterKambariai} setFilterKambariai={setUnitsFilterKambariai}
                filterBusena={unitsFilterBusena} setFilterBusena={setUnitsFilterBusena}
                openDropdown={unitsOpenDropdown} setOpenDropdown={setUnitsOpenDropdown}
                onAdd={() => setUnitsAdding(true)}
                filteredCount={unitsCount?.filtered}
                totalCount={unitsCount?.total ?? P.units}
              />
            )}
            <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              {tab === 'units' && <UnitsTab P={P} propIdx={idx}
                search={unitsSearch}
                filterAukstas={unitsFilterAukstas}
                filterKambariai={unitsFilterKambariai}
                filterBusena={unitsFilterBusena}
                adding={unitsAdding}
                setAdding={setUnitsAdding}
                onCountChange={(f, t) => setUnitsCount({ filtered: f, total: t })}
              />}
              {tab === 'residents' && <ResidentsTab P={P} propIdx={idx}
                search={residentsSearch}
                filterRole={residentsFilterRole}
                adding={residentsAdding}
                setAdding={setResidentsAdding}
                onCountChange={(f, t) => setResidentsCount({ filtered: f, total: t })}
              />}
              {tab === 'photos' && <PhotosTab P={P} propIdx={idx} />}
              {tab === 'contacts' && <ContactsTab P={P} propIdx={idx}
                search={contactsSearch}
                adding={contactsAdding}
                setAdding={setContactsAdding}
                onCountChange={(f, t) => setContactsCount({ filtered: f, total: t })}
              />}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
    {editingObj && <EditObjektasModal P={P} onSave={(updated) => setLocalP(updated)} onClose={() => setEditingObj(false)} />}
    </>
  )
}
