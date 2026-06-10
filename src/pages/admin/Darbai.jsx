import React from 'react'
import Shell from '../../shared/Shell.jsx'
import { useRepo, PanelHead, Stat } from '../../shared/UI.jsx'

export default function Darbai() {
  const DS = window.MitedaDesignSystem_acc833
  const { Card, Button, Badge, Avatar } = DS

  function ProjectCard({ p }) {
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="between">
          <div>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.building} · {p.apt}</div>
            <div className="muted" style={{ fontSize: 'var(--text-small)', marginTop: 2 }}>{p.phase}</div>
          </div>
          <Badge tone={p.progress > 75 ? 'success' : 'event'}>{p.progress}%</Badge>
        </div>
        <div style={{ height: 8, borderRadius: '999px', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: p.progress + '%', borderRadius: '999px', background: p.progress > 75 ? 'var(--brand-green)' : 'var(--accent-pink)' }} />
        </div>
        <div className="between" style={{ paddingTop: 14, borderTop: '1px solid var(--line-100)' }}>
          <div className="rowflex" style={{ gap: 10 }}>
            <Avatar name={p.manager} size={32} tone="green" />
            <div>
              <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>Darbų vadovas</div>
              <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.manager}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>{p.workers} darbininkai</div>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>{p.total}</div>
          </div>
        </div>
      </Card>
    )
  }

  const [projData] = useRepo('listProjects')
  const PROJECTS = projData || []
  const totalWorkers = PROJECTS.reduce((s, p) => s + p.workers, 0)

  return (
    <Shell role="admin" nav="darbai"
      title="Remonto darbai" subtitle="Visi aktyvūs remonto projektai visuose objektuose."
      headerActions={<Button variant="primary" iconLeft="ph ph-plus">Naujas projektas</Button>}>
      <div className="content stack">
        <div className="grid-3">
          <Stat icon="ph ph-wrench" label="Aktyvūs projektai" value={PROJECTS.length} />
          <Stat icon="ph ph-users-three" label="Darbininkai objektuose" value={totalWorkers} />
          <Stat icon="ph ph-wallet" label="Bendros išlaidos" value="€13 160" accent />
        </div>
        <div className="grid-2">
          {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} />)}
        </div>
      </div>
    </Shell>
  )
}
