import React, { useState, useLayoutEffect, useRef } from 'react'
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
  sold: { label: 'Parduotas', tone: 'success' },
  reserved: { label: 'Rezervuotas', tone: 'event' },
  free: { label: 'Laisvas', tone: 'neutral' },
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
  const FieldBox = ({ label, disabled, onClick, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', boxShadow: disabled ? 'inset 0 0 0 1px var(--line-100)' : 'inset 0 0 0 1px var(--line-200)', opacity: disabled ? 0.5 : 1, cursor: onClick ? 'pointer' : undefined, transition: 'box-shadow 150ms' }} onClick={onClick}>
        {children}
      </div>
    </div>
  )
  const EditRow = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      {children}
    </div>
  )

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
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setStatusPicker((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px 2px 8px', border: 'none', borderRadius: 'var(--radius-pill)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Badge tone={UNIT_STATUS[form.st]?.tone}>{UNIT_STATUS[form.st]?.label}</Badge>
              <i className="ph ph-pencil-simple" style={{ fontSize: 12, color: 'var(--ink-400)' }} />
            </button>
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
                : <span className="row__title">{unit.st === 'free' ? '—' : owner?.name}</span>}
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
                <div className="stack-sm" style={{ gap: 8 }}>
                  {contracts.map((c) => (
                    <div key={c.id} className="row" style={{ marginTop: 0 }}>
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
          <div className="stack-sm" style={{ gap: 8, marginBottom: form.contracts.length ? 12 : 0 }}>
            {form.contracts.map((c, i) => (
              <div key={c.id} className="row" style={{ marginTop: 0 }}>
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

  const submit = () => {
    if (!validate()) return
    const data = {
      id: form.id.trim(), floor: +form.floor, area: +form.area, st: form.st,
      rooms: +form.rooms, orientation: form.orientation, heating: form.heating,
      hasParking: form.hasParking, parkingNr: form.parkingNr, hasStorage: form.hasStorage,
      year: form.year, energyClass: form.energyClass,
      owner: form.ownerName ? { name: form.ownerName, phone: form.ownerPhone, email: form.ownerEmail, since: form.ownerSince } : null,
      photos: form.photos, documents: form.documents,
    }
    if (isEdit) onSave(data)
    else onAdd(data)
    onClose()
  }

  const iInp = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', fontFamily: 'var(--font-sans)', width: '100%' }
  const iSel = { border: 'none', background: 'transparent', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }
  const FieldBox = ({ label, error, disabled, onClick, wrapStyle, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...wrapStyle }}>
      <span style={{ fontSize: 'var(--text-small)', color: error ? 'var(--orange)' : 'var(--ink-400)', fontWeight: 'var(--fw-medium)' }}>{error || label}</span>
      <div style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 12px', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', boxShadow: error ? 'inset 0 0 0 1.5px var(--orange)' : disabled ? 'inset 0 0 0 1px var(--line-100)' : 'inset 0 0 0 1px var(--line-200)', opacity: disabled ? 0.5 : 1, cursor: onClick ? 'pointer' : undefined, transition: 'box-shadow 150ms' }} onClick={onClick}>
        {children}
      </div>
    </div>
  )

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
      footer={<>
        <Button variant="ghost" onClick={onClose}>Atšaukti</Button>
        <Button variant="accent" iconLeft={isEdit ? 'ph ph-floppy-disk' : 'ph ph-plus'} onClick={submit}>{isEdit ? 'Išsaugoti' : 'Pridėti butą'}</Button>
      </>}>

      {/* Header row — status */}
      <div className="between" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Būsena:</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
              <button key={key} type="button" onClick={() => set('st', key)} style={{
                height: 26, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-pill)',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                background: form.st === key ? 'var(--overlay-ink-04)' : 'transparent',
                outline: form.st === key ? '1.5px solid var(--line-300)' : 'none',
                transition: 'all 120ms',
              }}>
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
          <FieldBox label="Orientacija">
            <select style={iSel} value={form.orientation} onChange={(e) => set('orientation', e.target.value)}>
              {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FieldBox>
          <FieldBox label="Šildymas">
            <select style={iSel} value={form.heating} onChange={(e) => set('heating', e.target.value)}>
              {HEATINGS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </FieldBox>
          <FieldBox label="Automobilio stovėjimas" onClick={() => set('hasParking', !form.hasParking)}>
            <span style={{ flex: 1, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{form.hasParking ? 'Taip' : 'Ne'}</span>
            <input type="checkbox" checked={form.hasParking} onChange={(e) => set('hasParking', e.target.checked)} onClick={(e) => e.stopPropagation()}
              style={{ width: 16, height: 16, accentColor: 'var(--brand-green)', cursor: 'pointer', flexShrink: 0 }} />
          </FieldBox>
          <FieldBox label="Stovėjimo aikštelės Nr." disabled={!form.hasParking}>
            <input style={{ ...iInp, opacity: form.hasParking ? 1 : 0.35 }} disabled={!form.hasParking} placeholder="pvz. P-12" value={form.parkingNr || ''} onChange={(e) => set('parkingNr', e.target.value)} />
          </FieldBox>
          <FieldBox label="Sandėliukas" onClick={() => set('hasStorage', !form.hasStorage)}>
            <span style={{ flex: 1, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{form.hasStorage ? 'Taip' : 'Ne'}</span>
            <input type="checkbox" checked={form.hasStorage} onChange={(e) => set('hasStorage', e.target.checked)} onClick={(e) => e.stopPropagation()}
              style={{ width: 16, height: 16, accentColor: 'var(--brand-green)', cursor: 'pointer', flexShrink: 0 }} />
          </FieldBox>
          <FieldBox label="Statybos metai">
            <input style={iInp} type="number" min="1900" max="2100" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </FieldBox>
          <FieldBox label="Energetinė klasė">
            <select style={iSel} value={form.energyClass} onChange={(e) => set('energyClass', e.target.value)}>
              {ENERGY_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
          <FieldBox label="Savininkas nuo">
            <input style={iInp} type="date" value={form.ownerSince} onChange={(e) => set('ownerSince', e.target.value)} />
          </FieldBox>
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
          <div className="stack-sm" style={{ gap: 8, marginBottom: form.documents.length ? 12 : 0 }}>
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

function UnitsTab({ P }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Button, IconButton, Badge, Checkbox } = DS

  const [units, setUnits] = useState(() => makeUnits(P))
  const [sel, setSel] = useState({})
  const [detail, setDetail] = useState(null)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [popover, setPopover] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [filterAukstas, setFilterAukstas] = useState('all')
  const [filterKambariai, setFilterKambariai] = useState('all')
  const [filterBusena, setFilterBusena] = useState('all')
  const [openDropdown, setOpenDropdown] = useState(null)

  React.useEffect(() => {
    if (popover === null) return
    const close = () => setPopover(null)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [popover])

  React.useEffect(() => {
    if (openDropdown === null) return
    const close = (e) => { if (!e.target.closest('[data-filter-dropdown]')) setOpenDropdown(null) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [openDropdown])

  const selCount = Object.values(sel).filter(Boolean).length
  const allSelected = units.length > 0 && selCount === units.length
  const toggleAll = () => {
    if (allSelected) setSel({})
    else { const all = {}; units.forEach((_, i) => { all[i] = true }); setSel(all) }
  }
  const markSold = () => { setUnits((us) => us.map((u, i) => sel[i] ? { ...u, st: 'sold' } : u)); setSel({}) }
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

  const maxFloor = Math.max(...units.map((u) => u.floor), 1)
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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap', position: 'sticky', top: 0, background: 'var(--surface-card)', zIndex: 10, paddingTop: 4 }}>
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
        <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={() => setAdding(true)}>Pridėti</Button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>
          {filtered.length !== units.length ? `${filtered.length} iš ${units.length} butų` : `${units.length} butų iš viso`}
        </span>
      </div>
      {selCount > 0 && (
        <div className="between" style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--brand-green-faint)' }}>
          <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>Pažymėta {selCount} butų</span>
          <div className="rowflex" style={{ gap: 8 }}>
            <Button variant="accent" size="sm" iconLeft="ph ph-check" onClick={markSold}>Pažymėti parduotais</Button>
            <Button variant="ghost" size="sm" onClick={() => setSel({})}>Atšaukti</Button>
          </div>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr>
            <th style={{ width: 36 }}><Checkbox checked={allSelected} onChange={toggleAll} /></th>
            <th>Butas</th><th>Aukštas</th><th>Plotas</th><th>Kamb.</th><th>Būsena</th>
            <th>Savininkas</th><th>Telefonas</th><th>Nuo</th><th></th>
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
      </div>
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
  const { Avatar, Badge, Button } = DS
  const [tab, setTab] = useState('owner')
  const [isEditing, setIsEditing] = useState(false)

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

  const startEdit = () => { setForm(initForm()); setIsEditing(true) }
  const cancelEdit = () => { setForm(initForm()); setIsEditing(false) }
  const saveEdit = () => { onSave({ ...resident, ...form }); setIsEditing(false) }

  const fld = { height: 36, padding: '0 10px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)', outline: 'none', width: '100%', boxSizing: 'border-box' }
  const selFld = { ...fld, paddingRight: 30 }

  const EditRow = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{label}</span>
      {children}
    </div>
  )

  return (
    <Modal
      title={resident.name}
      subtitle={`Butas ${resident.apt} · ${resident.role}`}
      onClose={onClose}
      width={580}
      footer={isEditing
        ? <><Button variant="ghost" onClick={cancelEdit}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-floppy-disk" onClick={saveEdit}>Išsaugoti</Button></>
        : null}
    >
      {/* Edit toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        {!isEditing
          ? <button type="button" onClick={startEdit}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid var(--line-200)', borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', color: 'var(--ink-600)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-green)'; e.currentTarget.style.color = 'var(--brand-green)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-200)'; e.currentTarget.style.color = 'var(--ink-600)' }}>
              <i className="ph ph-pencil-simple" style={{ fontSize: 15 }} />
              Redaguoti
            </button>
          : <span style={{ fontSize: 'var(--text-small)', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <i className="ph ph-pencil-simple" style={{ fontSize: 14 }} /> Redagavimo režimas
            </span>
        }
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={detailTabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'owner' && !isEditing && (
        <div className="stack-sm">
          <div className="row" style={{ marginBottom: 4 }}>
            {Avatar && <Avatar name={resident.name} size={48} />}
            <div className="row__main">
              <span className="row__title">{resident.name}</span>
              <span className="row__meta">Butas {resident.apt}<span className="dot">·</span>{resident.phone}</span>
            </div>
            <Badge tone={resident.role === 'Nuomininkas' ? 'neutral' : 'success'}>{resident.role}</Badge>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { icon: 'ph ph-phone', label: 'Telefonas', value: resident.phone },
              { icon: 'ph ph-envelope', label: 'El. paštas', value: resident.name.split(' ')[0].toLowerCase() + '@gmail.com' },
              { icon: 'ph ph-calendar', label: 'Gyventojas nuo', value: '2024-01-10' },
              { icon: 'ph ph-map-pin', label: 'Adresas', value: `Butas ${resident.apt}` },
            ].map((f) => (
              <div key={f.label} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <i className={f.icon} style={{ fontSize: 14, color: 'var(--ink-400)' }} aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{f.label}</span>
                </div>
                <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{f.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <Button variant="secondary" iconLeft="ph ph-chat-circle" size="sm">Siųsti žinutę</Button>
            <Button variant="secondary" iconLeft="ph ph-phone" size="sm">Skambinti</Button>
          </div>
        </div>
      )}

      {tab === 'owner' && isEditing && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <EditRow label="Vardas, pavardė">
            <input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </EditRow>
          <EditRow label="Telefonas">
            <input style={fld} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </EditRow>
          <EditRow label="El. paštas">
            <input style={fld} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </EditRow>
          <EditRow label="Gyventojas nuo">
            <input style={fld} value={form.since} onChange={(e) => set('since', e.target.value)} />
          </EditRow>
          <EditRow label="Butas">
            <input style={fld} value={form.apt} onChange={(e) => set('apt', e.target.value)} />
          </EditRow>
          <EditRow label="Rolė">
            <DSSelect value={form.role} onChange={(v) => set('role', v)} options={['Savininkas', 'Savininkė', 'Nuomininkas', 'Nuomininkė']} />
          </EditRow>
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
        <div className="stack-sm" style={{ gap: 8 }}>
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
      footer={<><Button variant="ghost" onClick={onClose}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-plus" onClick={submit}>Pridėti</Button></>}>
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

function ResidentsTab({ P }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, IconButton, Button } = DS

  const [residents, setResidents] = useState([
    { name: 'Lukas Petrauskas', apt: 'B-12', role: 'Savininkas', phone: '+370 612 34567' },
    { name: 'Greta Janušienė', apt: 'A-4', role: 'Savininkė', phone: '+370 600 22113' },
    { name: 'Mantas Šimkus', apt: 'C-21', role: 'Nuomininkas', phone: '+370 633 88221' },
    { name: 'Rūta Kazlauskaitė', apt: 'A-7', role: 'Savininkė', phone: '+370 644 55009' },
    { name: 'Tomas Petraitis', apt: 'B-9', role: 'Savininkas', phone: '+370 655 11447' },
  ])
  const [selected, setSelected] = useState(null)
  const [adding, setAdding] = useState(false)

  const saveResident = (updated) => {
    setResidents((rs) => rs.map((r) => r.name === selected.name && r.apt === selected.apt ? updated : r))
    setSelected(updated)
  }
  const addResident = (r) => setResidents((rs) => [...rs, r])
  const unitIds = P ? makeUnits(P).map((u) => u.id) : []

  return (
    <>
      <div className="between" style={{ marginBottom: 12 }}>
        <span />
        <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={() => setAdding(true)}>Pridėti gyventoją</Button>
      </div>
      <div className="stack-sm" style={{ gap: 4 }}>
        {residents.map((r, i) => (
          <div key={i} className="row" style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
            <Avatar name={r.name} size={40} />
            <div className="row__main">
              <span className="row__title">{r.name}</span>
              <span className="row__meta">Butas {r.apt}<span className="dot">·</span>{r.phone}</span>
            </div>
            <Badge tone={r.role === 'Nuomininkas' ? 'neutral' : 'success'}>{r.role}</Badge>
            <IconButton icon="ph ph-arrow-right" variant="ghost" size="sm" ariaLabel="Peržiūrėti"
              onClick={(e) => { e.stopPropagation(); setSelected(r) }} />
          </div>
        ))}
      </div>
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

function PhotosTab() {
  const { Button } = window.MitedaDesignSystem_acc833
  const fileRef = React.useRef()
  const [photos, setPhotos] = useState(PHOTO_COLS)
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
      footer={<><Button variant="ghost" onClick={onClose}>Atšaukti</Button><Button variant="accent" iconLeft="ph ph-plus" onClick={submit}>Pridėti</Button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormRow label="Vardas, pavardė"><input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Vardas Pavardė" /></FormRow>
        <FormRow label="Telefonas"><input style={fld} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+370 6xx xxxxx" /></FormRow>
        <FormRow label="Rolė"><input style={fld} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Vadybininkas" /></FormRow>
        <FormRow label="Įmonė"><input style={fld} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="UAB Įmonė" /></FormRow>
      </div>
    </Modal>
  )
}

function ContactsTab() {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, IconButton, Button } = DS

  const [contactsData] = useRepo('listContacts')
  const [extra, setExtra] = useState([])
  const [adding, setAdding] = useState(false)
  const contacts = [...(contactsData || []), ...extra]
  return (
    <div>
      <div className="between" style={{ marginBottom: 12 }}>
        <span />
        <Button variant="accent" size="sm" iconLeft="ph ph-plus" onClick={() => setAdding(true)}>Pridėti kontaktą</Button>
      </div>
      <div className="grid-2" style={{ alignItems: 'stretch' }}>
        {contacts.slice(0, 4 + extra.length).map((c, i) => (
          <div key={i} className="row" style={{ marginTop: 0, alignItems: 'center' }}>
            <Avatar name={c.name} size={40} />
            <div className="row__main"><span className="row__title">{c.name}</span><span className="row__meta">{c.role}<span className="dot">·</span>{c.company}</span></div>
            <IconButton icon="ph ph-phone" variant="solid" size="sm" ariaLabel="Skambinti" />
          </div>
        ))}
      </div>
      {adding && <AddContactModal onClose={() => setAdding(false)} onAdd={(c) => setExtra((e) => [...e, c])} />}
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
      <div className="stack-sm" style={{ gap: 14 }}>
        <div className="field" style={{ marginBottom: 0 }}>
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
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Objekto pavadinimas</label>
          <input style={fld} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="pvz. Vilniaus g. 12" />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Adresas</label>
          <input style={fld} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="pvz. Vilniaus g. 12, Vilnius" />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
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
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {tab === 'units' && <UnitsTab P={P} />}
              {tab === 'residents' && <ResidentsTab P={P} />}
              {tab === 'photos' && <PhotosTab />}
              {tab === 'contacts' && <ContactsTab />}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
    {editingObj && <EditObjektasModal P={P} onSave={(updated) => setLocalP(updated)} onClose={() => setEditingObj(false)} />}
    </>
  )
}
