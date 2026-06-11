import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat, Tabs, PhotoTile, Modal, Composer } from '../../shared/UI.jsx'

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

function UnitDetailModal({ unit, idx, onClose, onSaveStatus }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Badge, Button, Avatar } = DS
  const [tab, setTab] = useState('tech')
  const [status, setStatus] = useState(unit.st)

  const owner = OWNERS[idx % OWNERS.length]
  const contracts = CONTRACT_TPLS.map((c, i) => ({ ...c, id: `SUT-${100 + i}` }))
  const rooms = unit.area <= 53 ? 1 : unit.area <= 75 ? 2 : 3
  const orientation = ['Pietų', 'Rytų', 'Šiaurės', 'Vakarų'][idx % 4]
  const heating = ['Centrinis šildymas', 'Grindinis šildymas', 'Dujinis šildymas'][idx % 3]
  const hasParking = idx % 3 !== 2
  const hasStorage = idx % 2 === 0

  const techRows = [
    { label: 'Butas', value: unit.id },
    { label: 'Aukštas', value: `${unit.floor} aukštas` },
    { label: 'Plotas', value: `${unit.area} m²` },
    { label: 'Kambariai', value: `${rooms}-${rooms === 1 ? 'kambarinis' : 'kambariai'}` },
    { label: 'Orientacija', value: orientation },
    { label: 'Šildymas', value: heating },
    { label: 'Automobilio stovėjimas', value: hasParking ? 'Taip (1 vieta)' : 'Ne' },
    { label: 'Sandėliukas', value: hasStorage ? 'Taip' : 'Ne' },
    { label: 'Statybos metai', value: '2024' },
    { label: 'Energetinė klasė', value: 'A+' },
  ]

  const statusChanged = status !== unit.st

  return (
    <Modal
      title={`Butas ${unit.id}`}
      subtitle={`${unit.floor} aukštas · ${unit.area} m² · ${rooms} kamb.`}
      onClose={onClose}
      width={660}
      footer={statusChanged
        ? <>
            <Button variant="ghost" onClick={onClose}>Atšaukti</Button>
            <Button variant="accent" onClick={() => { onSaveStatus(status); onClose() }}>Išsaugoti pakeitimus</Button>
          </>
        : null
      }
    >
      {/* Status row */}
      <div className="between" style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--line-100)' }}>
        <div className="rowflex" style={{ gap: 8 }}>
          <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Būsena:</span>
          <Badge tone={UNIT_STATUS[status].tone}>{UNIT_STATUS[status].label}</Badge>
        </div>
        <div className="rowflex" style={{ gap: 6 }}>
          {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
            <button key={key} onClick={() => setStatus(key)} style={{
              height: 28, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-pill)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
              fontWeight: status === key ? 'var(--fw-medium)' : undefined,
              background: status === key ? 'var(--overlay-ink-04)' : 'transparent',
              color: status === key ? 'var(--ink-900)' : 'var(--ink-400)',
              outline: status === key ? '1.5px solid var(--line-300)' : 'none',
              transition: 'all 120ms',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Inner tabs */}
      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={DETAIL_TABS} value={tab} onChange={setTab} />
      </div>

      {/* Tech */}
      {tab === 'tech' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 0' }}>
          {techRows.map((r) => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-sunken)',
              margin: '2px 0',
            }}>
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{r.label}</span>
              <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Photos */}
      {tab === 'photos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {PHOTO_COLS.map((col, i) => (
            <PhotoTile key={i} color={col} label={['Svetainė', 'Miegamasis', 'Virtuvė', 'Vonios kambarys', 'Balkonas', 'Koridorius', 'Vaizdas', 'Planas'][i % 8]} />
          ))}
        </div>
      )}

      {/* Owner */}
      {tab === 'owner' && (
        <div className="stack-sm">
          <div className="row">
            {Avatar && <Avatar name={owner.name} size={48} />}
            <div className="row__main">
              <span className="row__title">{unit.st === 'free' ? '—' : owner.name}</span>
              <span className="row__meta">{unit.st === 'free' ? 'Butas laisvas, savininko nėra' : `Savininkas nuo ${owner.since}`}</span>
            </div>
          </div>
          {unit.st !== 'free' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
              {[
                { icon: 'ph ph-phone', label: 'Telefonas', value: owner.phone },
                { icon: 'ph ph-envelope', label: 'El. paštas', value: owner.email },
                { icon: 'ph ph-calendar', label: 'Įsigyta', value: owner.since },
                { icon: 'ph ph-identification-card', label: 'Tipas', value: unit.st === 'reserved' ? 'Rezervacija' : 'Pilnateisis savininkas' },
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
          )}
        </div>
      )}

      {/* Contracts */}
      {tab === 'contracts' && (
        <div className="stack-sm" style={{ gap: 8 }}>
          {unit.st === 'free'
            ? <p style={{ color: 'var(--ink-400)', fontSize: 'var(--text-body)', padding: '16px 0' }}>Nėra aktyvių sutarčių — butas laisvas.</p>
            : contracts.map((c) => (
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
            ))
          }
        </div>
      )}
    </Modal>
  )
}

const ADD_TABS = [
  { key: 'basic', label: 'Pagrindinis' },
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

  const [tab, setTab] = useState('basic')
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

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.id.trim()) e.id = 'Būtinas laukas'
    else if (!isEdit && units.some((u) => u.id === form.id.trim())) e.id = 'Toks butas jau egzistuoja'
    if (!form.floor || isNaN(+form.floor) || +form.floor < 1) e.floor = 'Įveskite teisingą aukštą'
    if (!form.area || isNaN(+form.area) || +form.area < 10) e.area = 'Įveskite teisingą plotą'
    setErrors(e)
    if (Object.keys(e).length > 0) { setTab('basic'); return false }
    return true
  }

  const submit = () => {
    if (!validate()) return
    const data = {
      id: form.id.trim(), floor: +form.floor, area: +form.area, st: form.st,
      rooms: +form.rooms, orientation: form.orientation, heating: form.heating,
      hasParking: form.hasParking, hasStorage: form.hasStorage,
      year: form.year, energyClass: form.energyClass,
      owner: form.ownerName ? { name: form.ownerName, phone: form.ownerPhone, email: form.ownerEmail, since: form.ownerSince } : null,
      photos: form.photos, documents: form.documents,
    }
    if (isEdit) onSave(data)
    else onAdd(data)
    onClose()
  }

  const fld = (err) => ({
    height: 40, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)',
    background: 'var(--surface-card)',
    boxShadow: err ? 'inset 0 0 0 1.5px var(--orange)' : 'inset 0 0 0 1px var(--line-200)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  })

  const selectFld = {
    height: 40, padding: '0 12px', border: 'none', borderRadius: 'var(--radius-sm)',
    background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--line-200)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--ink-900)',
    outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer',
  }

  const toggleRow = (label, checked, onChange) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', cursor: 'pointer' }}>
      <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-700)' }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: 'var(--brand-green)', cursor: 'pointer' }} />
    </label>
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

      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={ADD_TABS} value={tab} onChange={setTab} />
      </div>

      {/* --- Pagrindinis --- */}
      {tab === 'basic' && (
        <div className="stack-sm" style={{ gap: 14 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Buto numeris</label>
            <input style={fld(errors.id)} value={form.id} placeholder="pvz. A-12"
              onChange={(e) => set('id', e.target.value)} />
            {errors.id && <span style={{ fontSize: 'var(--text-small)', color: 'var(--orange)' }}>{errors.id}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Aukštas</label>
              <input style={fld(errors.floor)} type="number" min="1" value={form.floor}
                onChange={(e) => set('floor', e.target.value)} />
              {errors.floor && <span style={{ fontSize: 'var(--text-small)', color: 'var(--orange)' }}>{errors.floor}</span>}
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Plotas (m²)</label>
              <input style={fld(errors.area)} type="number" min="10" value={form.area}
                onChange={(e) => set('area', e.target.value)} />
              {errors.area && <span style={{ fontSize: 'var(--text-small)', color: 'var(--orange)' }}>{errors.area}</span>}
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Būsena</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.entries(UNIT_STATUS).map(([key, { label, tone }]) => (
                <button key={key} type="button" onClick={() => set('st', key)} style={{
                  flex: 1, height: 36, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small)',
                  fontWeight: form.st === key ? 'var(--fw-medium)' : undefined,
                  background: form.st === key ? 'var(--overlay-ink-04)' : 'transparent',
                  color: form.st === key ? 'var(--ink-900)' : 'var(--ink-400)',
                  outline: form.st === key ? '1.5px solid var(--line-300)' : 'none',
                  transition: 'all 120ms',
                }}>
                  <Badge tone={tone}>{label}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Techniniai duomenys --- */}
      {tab === 'tech' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Kambariai</label>
            <input style={fld()} type="number" min="1" max="10" value={form.rooms}
              onChange={(e) => set('rooms', e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Orientacija</label>
            <select style={selectFld} value={form.orientation} onChange={(e) => set('orientation', e.target.value)}>
              {ORIENTATIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Šildymas</label>
            <select style={selectFld} value={form.heating} onChange={(e) => set('heating', e.target.value)}>
              {HEATINGS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Energetinė klasė</label>
            <select style={selectFld} value={form.energyClass} onChange={(e) => set('energyClass', e.target.value)}>
              {ENERGY_CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Statybos metai</label>
            <input style={fld()} type="number" min="1900" max="2100" value={form.year}
              onChange={(e) => set('year', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {toggleRow('Automobilio stovėjimas', form.hasParking, (v) => set('hasParking', v))}
            {toggleRow('Sandėliukas', form.hasStorage, (v) => set('hasStorage', v))}
          </div>
        </div>
      )}

      {/* --- Savininkas --- */}
      {tab === 'owner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
            <label>Vardas Pavardė</label>
            <input style={fld()} value={form.ownerName} placeholder="Lukas Petrauskas"
              onChange={(e) => set('ownerName', e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Telefonas</label>
            <input style={fld()} value={form.ownerPhone} placeholder="+370 600 00000"
              onChange={(e) => set('ownerPhone', e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>El. paštas</label>
            <input style={fld()} type="email" value={form.ownerEmail} placeholder="vardas@gmail.com"
              onChange={(e) => set('ownerEmail', e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Savininkas nuo</label>
            <input style={fld()} type="date" value={form.ownerSince}
              onChange={(e) => set('ownerSince', e.target.value)} />
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
  const saveStatus = (st) => { setUnits((us) => us.map((u, i) => i === detail.idx ? { ...u, st } : u)) }
  const addUnit = (u) => setUnits((us) => [...us, u])
  const updateUnit = (idx, data) => setUnits((us) => us.map((u, i) => i === idx ? { ...u, ...data } : u))
  const deleteUnit = (idx) => { setUnits((us) => us.filter((_, i) => i !== idx)); setSel((s) => { const n = {}; Object.keys(s).forEach((k) => { if (+k < idx) n[k] = s[k]; else if (+k > idx) n[+k - 1] = s[k] }); return n }) }

  return (
    <div>
      <div className="between" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{units.length} butų iš viso</span>
        <Button variant="secondary" size="sm" iconLeft="ph ph-plus" onClick={() => setAdding(true)}>Pridėti butą</Button>
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
            {units.map((u, i) => {
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
                  <td>
                    {owner
                      ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: 11, fontWeight: 'var(--fw-medium)', color: 'var(--ink-500)' }}>
                            {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span style={{ fontSize: 'var(--text-body)', color: 'var(--ink-900)' }}>{owner.name}</span>
                        </div>
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
                              { icon: 'ph ph-pencil', label: 'Redaguoti', action: () => { setEditing({ idx: i, unit: u }); setPopover(null) } },
                              { icon: 'ph ph-trash', label: 'Ištrinti', danger: true, action: () => { deleteUnit(i); setPopover(null) } },
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
          onSaveStatus={(st) => saveStatus(st)}
        />
      )}
    </div>
  )
}

function ResidentDetailModal({ resident, onClose }) {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, Button } = DS
  const [tab, setTab] = useState('owner')

  const contracts = CONTRACT_TPLS.slice(0, 3).map((c, i) => ({ ...c, id: `SUT-${200 + i}` }))
  const photos = PHOTO_COLS.slice(0, 6)

  const detailTabs = [
    { key: 'owner', label: 'Savininkas' },
    { key: 'photos', label: 'Nuotraukos' },
    { key: 'contracts', label: 'Sutartys' },
  ]

  return (
    <Modal
      title={resident.name}
      subtitle={`Butas ${resident.apt} · ${resident.role}`}
      onClose={onClose}
      width={580}
    >
      <div style={{ marginBottom: 16 }}>
        <Tabs tabs={detailTabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'owner' && (
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
            {[
              { icon: 'ph ph-chat-circle', label: 'Siųsti žinutę', variant: 'secondary' },
              { icon: 'ph ph-phone', label: 'Skambinti', variant: 'secondary' },
              { icon: 'ph ph-pencil-simple', label: 'Redaguoti', variant: 'ghost' },
            ].map((a) => (
              <Button key={a.label} variant={a.variant} iconLeft={a.icon} size="sm" onClick={onClose}>{a.label}</Button>
            ))}
          </div>
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

function ResidentsTab() {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, Badge, IconButton } = DS

  const residents = [
    { name: 'Lukas Petrauskas', apt: 'B-12', role: 'Savininkas', phone: '+370 612 34567' },
    { name: 'Greta Janušienė', apt: 'A-4', role: 'Savininkė', phone: '+370 600 22113' },
    { name: 'Mantas Šimkus', apt: 'C-21', role: 'Nuomininkas', phone: '+370 633 88221' },
    { name: 'Rūta Kazlauskaitė', apt: 'A-7', role: 'Savininkė', phone: '+370 644 55009' },
    { name: 'Tomas Petraitis', apt: 'B-9', role: 'Savininkas', phone: '+370 655 11447' },
  ]
  const [selected, setSelected] = useState(null)

  return (
    <>
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
      {selected && <ResidentDetailModal resident={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function PhotosTab() {
  return (
    <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
      {PHOTO_COLS.map((col, i) => <PhotoTile key={i} color={col} />)}
    </div>
  )
}

function ContactsTab() {
  const DS = window.MitedaDesignSystem_acc833
  const { Avatar, IconButton } = DS

  const [contactsData] = useRepo('listContacts')
  const contacts = contactsData || []
  return (
    <div className="grid-2" style={{ alignItems: 'start' }}>
      {contacts.slice(0, 4).map((c, i) => (
        <div key={i} className="row">
          <Avatar name={c.name} size={40} />
          <div className="row__main"><span className="row__title">{c.name}</span><span className="row__meta">{c.role}<span className="dot">·</span>{c.company}</span></div>
          <IconButton icon="ph ph-phone" variant="solid" size="sm" ariaLabel="Skambinti" />
        </div>
      ))}
    </div>
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
  const P = props[idx] || props[0]
  if (!P) return null
  const pct = Math.round((P.sold / P.units) * 100)
  const tabs = [
    { key: 'units', label: 'Butai', count: P.units },
    { key: 'residents', label: 'Gyventojai' },
    { key: 'photos', label: 'Nuotraukos' },
    { key: 'contacts', label: 'Kontaktai' },
  ]

  return (
    <Shell role="admin" nav="objektai"
      title={P.name} subtitle={P.address}
      breadcrumbs={[
        { label: 'Administracija', href: '/admin/objektai' },
        { label: 'Objektai', href: '/admin/objektai' },
        { label: P.name },
      ]}
      headerActions={<Link className="plain" to="/admin/objektai"><Button variant="secondary" iconLeft="ph ph-arrow-left">Į objektus</Button></Link>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-door" label="Butai" value={P.units} />
          <Stat icon="ph ph-check-circle" label="Parduota" value={P.sold + ' (' + pct + '%)'} accent />
          <Stat icon="ph ph-users-three" label="Gyventojai" value={P.sold} />
        </div>
        <Card>
          <PanelHead title="Pastato valdymas" action={<Tabs tabs={tabs} value={tab} onChange={setTab} />} />
          {tab === 'units' && <UnitsTab P={P} />}
          {tab === 'residents' && <ResidentsTab />}
          {tab === 'photos' && <PhotosTab />}
          {tab === 'contacts' && <ContactsTab />}
        </Card>
      </div>
    </Shell>
  )
}
