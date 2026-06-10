import React, { useState, useEffect, useRef } from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PhotoTile } from '../../shared/UI.jsx'
import repo from '../../lib/repo.js'

const PHOTO = ["#9bb7a4", "#c2b59b", "#8fa6b8"]

function Bubble({ m }) {
  return (
    <div className={"bubble " + m.side}>
      {m.who && <div className="bubble__who">{m.who}</div>}
      {m.kind === "voice" && (
        <span className="rowflex" style={{ gap: 10 }}>
          <i className="ph-fill ph-play" style={{ fontSize: 18 }} aria-hidden="true" />
          <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[8, 14, 20, 12, 16, 9, 18, 11, 15, 7].map((h, i) => <span key={i} style={{ width: 3, height: h, borderRadius: 2, background: m.side === "me" ? "rgba(255,255,255,0.7)" : "var(--ink-300)" }} />)}
          </span>
          <span style={{ fontSize: "var(--text-small)" }}>{m.dur}</span>
        </span>
      )}
      {m.kind === "receipt" && <span className="rowflex" style={{ gap: 8 }}><i className="ph ph-receipt" style={{ fontSize: 18 }} aria-hidden="true" />Kvitas pridėtas · {m.sum}</span>}
      {m.text && <div style={{ marginTop: m.kind ? 8 : 0 }}>{m.text}</div>}
      {m.kind === "photo" && <div className="rowflex" style={{ gap: 8, marginTop: 8 }}>
        {Array.from({ length: m.photos }).map((_, k) => <div key={k} style={{ width: 72, flex: "0 0 auto" }}><PhotoTile color={PHOTO[k % PHOTO.length]} ratio="1 / 1" /></div>)}
      </div>}
      <span className="bubble__time">{m.time}</span>
    </div>
  )
}

export default function Darbininkas() {
  const DS = window.MitedaDesignSystem_acc833 || {}
  const { Card, Button, Badge } = DS

  const [msgsRaw, refresh] = useRepo("listWorkerChat")
  const msgs = msgsRaw || []
  const [text, setText] = useState("")
  const [recording, setRecording] = useState(false)
  const [secs, setSecs] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs])

  useEffect(() => {
    if (!recording) return
    const t = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [recording])

  const now = () => {
    const d = new Date()
    return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0")
  }

  const send = () => {
    if (!text.trim()) return
    repo.addWorkerMessage({ who: null, side: "me", text: text.trim(), time: now() }).then(refresh)
    setText("")
  }

  const addPhoto = () => repo.addWorkerMessage({ who: null, side: "me", kind: "photo", photos: 1, text: "", time: now() }).then(refresh)
  const addReceipt = () => repo.addWorkerMessage({ who: null, side: "me", kind: "receipt", sum: "€42.00", text: "", time: now() }).then(refresh)
  const startRec = () => { setRecording(true); setSecs(0) }
  const stopRec = () => {
    setRecording(false)
    const dur = "0:" + String(secs).padStart(2, "0")
    repo.addWorkerMessage({ who: null, side: "me", kind: "voice", dur, text: "", time: now() }).then(refresh)
  }
  const fmt = "0:" + String(secs).padStart(2, "0")

  const CardComp = Card || (({ children, tone, padding, style, className }) => {
    const bg = tone === 'forest' ? 'var(--brand-forest)' : 'var(--surface-card)'
    return <div className={className} style={{ background: bg, borderRadius: 'var(--radius-lg)', padding: padding || 20, boxShadow: 'var(--shadow-xs)', ...style }}>{children}</div>
  })

  return (
    <Shell role="statyba" nav="darbininkas"
      title="Darbininkas" subtitle="Greitas darbų žurnalas objekte.">
      <style>{`
        .phone { max-width: 480px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 16px; }
        .chat { display: flex; flex-direction: column; height: calc(100vh - 220px); min-height: 420px; padding: 0; overflow: hidden; }
        .chat__scroll { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .chat__scroll::-webkit-scrollbar { width: 8px; }
        .chat__scroll::-webkit-scrollbar-thumb { background: var(--line-300); border-radius: 999px; }
        .bubble { max-width: 80%; padding: 10px 14px; border-radius: var(--radius-md); font-size: var(--text-body); line-height: var(--lh-body); }
        .bubble.them { align-self: flex-start; background: var(--surface-sunken); color: var(--ink-900); border-top-left-radius: 4px; }
        .bubble.me { align-self: flex-end; background: var(--brand-green); color: #fff; border-top-right-radius: 4px; }
        .bubble__who { font-size: var(--text-small); font-weight: var(--fw-medium); color: var(--brand-green-strong); margin-bottom: 3px; }
        .bubble__time { font-size: 11px; opacity: 0.6; margin-top: 4px; display: block; }
        .barbtn { width: 44px; height: 44px; flex: 0 0 auto; border: none; border-radius: var(--radius-sm); background: var(--overlay-ink-04); color: var(--ink-700); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .barbtn i { font-size: 20px; }
      `}</style>
      <div className="content">
        <div className="phone">
          <CardComp tone="forest" padding={18} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="tile lg" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}><i className="ph ph-hard-hat" aria-hidden="true" /></span>
            <div className="grow">
              <div style={{ fontSize: "var(--text-small)", color: "rgba(255,254,252,0.6)" }}>Šiandienos užduotis</div>
              <div style={{ fontSize: "var(--text-title)", fontWeight: "var(--fw-medium)", color: "#fff" }}>Vonios plytelių klijavimas · B-12</div>
            </div>
            {Badge && <Badge tone="success" dot>Vykdoma</Badge>}
          </CardComp>

          <CardComp className="chat">
            <div className="chat__scroll" ref={scrollRef}>
              {msgs.map((m, i) => <Bubble key={i} m={m} />)}
            </div>
            <div style={{ borderTop: "1px solid var(--line-100)", padding: 12 }}>
              {recording ? (
                <div className="rowflex" style={{ gap: 12 }}>
                  <span className="rowflex grow" style={{ gap: 10, color: "var(--orange)", fontWeight: "var(--fw-medium)" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "999px", background: "var(--orange)" }} />
                    Įrašoma… {fmt}
                  </span>
                  <button className="barbtn" onClick={() => setRecording(false)} style={{ background: "var(--overlay-ink-04)" }} aria-label="Atšaukti"><i className="ph ph-trash" aria-hidden="true" /></button>
                  {Button
                    ? <Button variant="accent" iconLeft="ph ph-check" onClick={stopRec}>Siųsti</Button>
                    : <button onClick={stopRec}>Siųsti</button>}
                </div>
              ) : (
                <div className="rowflex" style={{ gap: 8 }}>
                  <button className="barbtn" onClick={addPhoto} aria-label="Nuotrauka"><i className="ph ph-camera" aria-hidden="true" /></button>
                  <button className="barbtn" onClick={addReceipt} aria-label="Kvitas"><i className="ph ph-receipt" aria-hidden="true" /></button>
                  <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send() }} placeholder="Rašyti žinutę…"
                    style={{ flex: 1, height: 44, padding: "0 14px", border: "none", borderRadius: "var(--radius-sm)", background: "var(--surface-sunken)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", color: "var(--ink-900)", outline: "none" }} />
                  {text.trim()
                    ? <button className="barbtn" onClick={send} style={{ background: "var(--brand-green)", color: "#fff" }} aria-label="Siųsti"><i className="ph ph-paper-plane-tilt" aria-hidden="true" /></button>
                    : <button className="barbtn" onClick={startRec} style={{ background: "var(--brand-forest)", color: "#fff" }} aria-label="Įrašyti"><i className="ph ph-microphone" aria-hidden="true" /></button>}
                </div>
              )}
            </div>
          </CardComp>
        </div>
      </div>
    </Shell>
  )
}
