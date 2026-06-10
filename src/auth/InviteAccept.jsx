import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function InviteAccept() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: redirect to owner dashboard
    navigate('/owner/pagrindinis')
  }

  const inputStyle = {
    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--ink-200)', fontSize: 'var(--text-body)',
    background: 'var(--surface-page)', color: 'var(--ink-900)', outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-page)', padding: '40px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400, background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)', padding: '40px 36px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/miteda-logo-dark.svg" alt="Miteda" style={{ height: 36, marginBottom: 24 }} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: '999px', background: 'var(--brand-green-faint)',
            color: 'var(--brand-green-strong)', fontSize: 'var(--text-small)',
            fontWeight: 'var(--fw-medium)', marginBottom: 16,
          }}>
            <i className="ph ph-envelope-open" />
            Kvietimas gautas
          </div>
          <h1 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>
            Jus pakviesti į Miteda
          </h1>
          <p style={{ margin: '8px 0 0', color: 'var(--ink-500)', fontSize: 'var(--text-body)' }}>
            Užpildykite duomenis, kad pradėtumėte
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-700)' }}>
              Vardas ir pavardė
            </label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Lukas Petrauskas" required style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-700)' }}>
              Slaptažodis
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle}
            />
          </div>
          <button type="submit" style={{
            marginTop: 8, padding: '12px 0', borderRadius: 'var(--radius-pill)',
            background: 'var(--brand-green)', color: '#fff', border: 'none',
            fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            Pradėti naudotis
          </button>
        </form>
      </div>
    </div>
  )
}
