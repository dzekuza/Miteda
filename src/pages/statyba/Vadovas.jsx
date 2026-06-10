import React, { useState, useEffect } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, PhotoTile } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

const PHOTO = ["#9bb7a4", "#c2b59b", "#8fa6b8", "#b7a99b"]

function PostUpdate({ onPost, manager }) {
  const DS = window.MitedaDesignSystem_acc833 || {}
  const { Button, Switch } = DS

  const [text, setText] = useState("")
  const [photos, setPhotos] = useState(0)
  const [notify, setNotify] = useState(true)

  const post = () => {
    if (!text.trim()) return
    onPost({ who: manager, text: text.trim(), time: "Ką tik", photos, notify })
    setText("")
    setPhotos(0)
  }

  const Card = DS.Card || (({ children, style }) => <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-xs)', ...style }}>{children}</div>)

  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <PanelHead title="Naujas atnaujinimas" />
      <div className="field" style={{ margin: 0 }}><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Aprašykite šiandienos darbus…" /></div>
      <div className="rowflex" style={{ gap: 10 }}>
        {Array.from({ length: photos }).map((_, k) => <div key={k} style={{ width: 56, flex: "0 0 auto" }}><PhotoTile color={PHOTO[k % PHOTO.length]} ratio="1 / 1" /></div>)}
        <button onClick={() => setPhotos(photos + 1)} style={{ width: 56, height: 56, flex: "0 0 auto", borderRadius: "var(--radius-md)", border: "1.5px dashed var(--line-300)", background: "var(--surface-sunken)", color: "var(--ink-400)", cursor: "pointer" }} aria-label="Pridėti nuotrauką"><i className="ph ph-camera" style={{ fontSize: 20 }} aria-hidden="true" /></button>
      </div>
      <div className="between" style={{ paddingTop: 12, borderTop: "1px solid var(--line-100)" }}>
        <label className="rowflex" style={{ gap: 10, cursor: "pointer", fontSize: "var(--text-body)", color: "var(--ink-700)" }}>
          {Switch
            ? <Switch checked={notify} onChange={setNotify} ariaLabel="Pranešti savininkui" />
            : <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />}
          Pranešti buto savininkui
        </label>
        {Button
          ? <Button variant="accent" iconLeft="ph ph-paper-plane-tilt" onClick={post}>Skelbti</Button>
          : <button onClick={post}>Skelbti</button>}
      </div>
    </Card>
  )
}

function Feed({ items }) {
  const DS = window.MitedaDesignSystem_acc833 || {}
  const { Avatar, Badge } = DS
  const Card = DS.Card || (({ children }) => <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-xs)' }}>{children}</div>)

  return (
    <Card>
      <PanelHead title="Projekto atnaujinimai" subtitle={`${items.length} įrašai`} />
      <div>
        {items.map((u, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
              <span style={{ width: 12, height: 12, borderRadius: "999px", background: "var(--brand-green)", boxShadow: "0 0 0 4px var(--brand-green-faint)" }} />
              {i < items.length - 1 && <span style={{ flex: 1, width: 2, background: "var(--line-200)", marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: i < items.length - 1 ? 24 : 0 }}>
              <div className="rowflex" style={{ gap: 8, marginBottom: 6 }}>
                {Avatar && <Avatar name={u.who} size={28} tone="green" />}
                <span style={{ fontSize: "var(--text-body)", fontWeight: "var(--fw-medium)", color: "var(--ink-900)" }}>{u.who}</span>
                {u.notify && Badge && <Badge tone="success" dot>Savininkas informuotas</Badge>}
                <span className="muted right" style={{ fontSize: "var(--text-small)" }}>{u.time}</span>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "var(--text-body)", lineHeight: "var(--lh-body)", color: "var(--ink-700)", textWrap: "pretty" }}>{u.text}</p>
              {u.photos > 0 && <div className="rowflex" style={{ gap: 10 }}>
                {Array.from({ length: u.photos }).map((_, k) => <div key={k} style={{ width: 84, flex: "0 0 auto" }}><PhotoTile color={PHOTO[(i + k) % PHOTO.length]} ratio="1 / 1" /></div>)}
              </div>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function Vadovas() {
  const DS = window.MitedaDesignSystem_acc833 || {}
  const { Card, IconButton, Avatar } = DS

  const [repair] = useRepo("getRepair")
  const [building] = useRepo("building")
  const [user] = useRepo("currentUser")
  const [feed, setFeed] = useState(null)

  useEffect(() => {
    if (repair && feed === null) setFeed(repair.updates.map((u) => ({ ...u, notify: true })))
  }, [repair])

  if (!repair || !building || !user || feed === null) return null

  const R = repair

  const CardFallback = ({ children, tone, style }) => {
    const bg = tone === 'forest' ? 'var(--brand-forest)' : 'var(--surface-card)'
    return <div style={{ background: bg, borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-xs)', ...style }}>{children}</div>
  }
  const CardComp = Card || CardFallback

  return (
    <Shell role="statyba" nav="vadovas"
      title="Darbų vadovas" subtitle="Jūsų objektas, komanda ir projekto eiga.">
      <div className="content grid-aside">
        <div className="stack">
          <PostUpdate manager={R.manager.name} onPost={(u) => {
            repo.addRepairUpdate(u)
            setFeed([u, ...feed])
          }} />
          <Feed items={feed} />
        </div>
        <div className="stack">
          <CardComp tone="forest">
            <span style={{ fontSize: "var(--text-small)", color: "rgba(255,254,252,0.6)" }}>Priskirtas objektas</span>
            <div style={{ fontSize: "var(--text-heading)", fontWeight: "var(--fw-medium)", color: "#fff", margin: "4px 0 2px" }}>{building.name}</div>
            <div style={{ fontSize: "var(--text-body)", color: "rgba(255,254,252,0.7)" }}>Butas {user.apt} · {building.address}</div>
            <div className="rowflex" style={{ gap: 10, marginTop: 18 }}>
              <div className="grow" style={{ background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
                <div style={{ fontSize: "var(--text-small)", color: "rgba(255,254,252,0.6)" }}>Eiga</div>
                <div style={{ fontSize: "var(--text-heading)", fontWeight: "var(--fw-medium)", color: "var(--brand-green)" }}>68%</div>
              </div>
              <div className="grow" style={{ background: "rgba(255,255,255,0.08)", borderRadius: "var(--radius-md)", padding: "12px 14px" }}>
                <div style={{ fontSize: "var(--text-small)", color: "rgba(255,254,252,0.6)" }}>Išlaidos</div>
                <div style={{ fontSize: "var(--text-heading)", fontWeight: "var(--fw-medium)", color: "#fff" }}>{R.total}</div>
              </div>
            </div>
          </CardComp>
          <CardComp>
            <PanelHead title="Mano komanda" />
            <div className="stack-sm" style={{ gap: 10 }}>
              {R.workers.map((w, i) => (
                <div key={i} className="rowflex" style={{ gap: 12 }}>
                  {Avatar && <Avatar name={w.name} size={36} />}
                  <div className="grow">
                    <div style={{ fontSize: "var(--text-body)", fontWeight: "var(--fw-medium)", color: "var(--ink-900)" }}>{w.name}</div>
                    <div className="muted" style={{ fontSize: "var(--text-small)" }}>{w.role}</div>
                  </div>
                  {IconButton && <IconButton icon="ph ph-chat-circle" variant="soft" size="sm" ariaLabel="Rašyti" />}
                </div>
              ))}
            </div>
          </CardComp>
          <CardComp>
            <PanelHead title="Išlaidos" />
            {R.expenses.map((e, i) => (
              <div key={i} className="between" style={{ padding: "8px 0", borderBottom: "1px solid var(--line-100)" }}>
                <span style={{ fontSize: "var(--text-body)", color: "var(--ink-700)" }}>{e.item}</span>
                <span style={{ fontSize: "var(--text-body)", fontWeight: "var(--fw-medium)", color: "var(--ink-900)" }}>{e.sum}</span>
              </div>
            ))}
            <div className="between" style={{ paddingTop: 12 }}>
              <span style={{ fontWeight: "var(--fw-medium)", color: "var(--ink-900)" }}>Iš viso</span>
              <span style={{ fontSize: "var(--text-heading)", fontWeight: "var(--fw-medium)", color: "var(--brand-green-strong)" }}>{R.total}</span>
            </div>
          </CardComp>
        </div>
      </div>
    </Shell>
  )
}
