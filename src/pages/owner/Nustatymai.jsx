import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

export default function Nustatymai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, IconButton, Avatar, Input, Switch } = DS

  function SettingRow({ icon, title, sub, control, last }) {
    return (
      <div className="rowflex" style={{ gap: 14, padding: '16px 0', borderBottom: last ? 'none' : '1px solid var(--line-100)' }}>
        <span className="tile"><i className={icon} aria-hidden="true" /></span>
        <div className="grow">
          <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{title}</div>
          <div className="muted" style={{ fontSize: 'var(--text-small)' }}>{sub}</div>
        </div>
        {control}
      </div>
    )
  }

  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [saved, setSaved] = React.useState(false)
  const [user] = useRepo('currentUser')
  const [building] = useRepo('building')
  React.useEffect(() => { if (user) { setName(user.name); setPhone(user.phone) } }, [user])
  const save = () => { repo.saveProfile({ name, phone }).then(() => { setSaved(true); setTimeout(() => setSaved(false), 1600) }) }
  if (!user || !building) return null

  return (
    <Shell role="gyventojas" nav="nustatymai"
      title="Nustatymai" subtitle="Tvarkykite savo profilį ir paskyros saugumą.">
      <div className="content grid-aside">
        <div className="stack">
          <Card>
            <PanelHead title="Profilis" subtitle="Jūsų asmeninė informacija" />
            <div className="rowflex" style={{ gap: 20, marginBottom: 24 }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={name} size={88} tone="forest" />
                <button style={{ position: 'absolute', right: -2, bottom: -2, width: 32, height: 32, borderRadius: '999px', border: '3px solid var(--surface-card)', background: 'var(--brand-green)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Keisti nuotrauką">
                  <i className="ph ph-camera" style={{ fontSize: 16 }} aria-hidden="true" />
                </button>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{name}</div>
                <div className="muted" style={{ fontSize: 'var(--text-body)' }}>{building.name} · Butas {user.apt}</div>
                <div style={{ marginTop: 10 }}><Button variant="secondary" size="sm" iconLeft="ph ph-upload-simple">Įkelti nuotrauką</Button></div>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <Input label="Vardas ir pavardė" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Telefonas" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="El. paštas" value={user.email} disabled />
              <Input label="Butas" value={'Butas ' + user.apt} disabled />
            </div>
            <div className="rowflex" style={{ gap: 10, marginTop: 20 }}>
              <Button variant="accent" iconLeft={saved ? 'ph ph-check' : 'ph ph-floppy-disk'} onClick={save}>{saved ? 'Išsaugota' : 'Išsaugoti pakeitimus'}</Button>
              <Button variant="ghost">Atšaukti</Button>
            </div>
          </Card>
        </div>
        <div className="stack">
          <Card>
            <PanelHead title="Saugumas" />
            <SettingRow icon="ph ph-lock-key" title="Slaptažodis" sub="Paskutinį kartą keista prieš 3 mėn." control={<Button variant="secondary" size="sm">Keisti</Button>} />
            <SettingRow icon="ph ph-shield-check" title="Dviejų veiksnių autentifikacija" sub="Papildoma paskyros apsauga" control={<Switch defaultChecked ariaLabel="2FA" />} />
            <SettingRow icon="ph ph-device-mobile" title="Aktyvūs įrenginiai" sub="2 prisijungę įrenginiai" control={<Button variant="ghost" size="sm" iconRight="ph ph-arrow-up-right">Peržiūrėti</Button>} last />
          </Card>
          <Card>
            <PanelHead title="Pranešimai" />
            <SettingRow icon="ph ph-megaphone" title="Skelbimai ir naujienos" sub="Administracijos pranešimai" control={<Switch defaultChecked ariaLabel="Skelbimai" />} />
            <SettingRow icon="ph ph-wrench" title="Defektų atnaujinimai" sub="Kai pasikeičia būsena" control={<Switch defaultChecked ariaLabel="Defektai" />} />
            <SettingRow icon="ph ph-calendar-dots" title="Įvykių priminimai" sub="Likus dienai iki įvykio" control={<Switch ariaLabel="Įvykiai" />} last />
          </Card>
        </div>
      </div>
    </Shell>
  )
}
