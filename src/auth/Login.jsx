import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: redirect to owner dashboard
    navigate('/owner/pagrindinis')
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
          <h1 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>Prisijungti</h1>
          <p style={{ margin: '8px 0 0', color: 'var(--ink-500)', fontSize: 'var(--text-body)' }}>Įveskite savo duomenis</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-700)' }}>El. paštas</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jusu@pastas.lt" required
              style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ink-200)', fontSize: 'var(--text-body)',
                background: 'var(--surface-page)', color: 'var(--ink-900)', outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-700)' }}>Slaptažodis</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--ink-200)', fontSize: 'var(--text-body)',
                background: 'var(--surface-page)', color: 'var(--ink-900)', outline: 'none',
              }}
            />
          </div>
          <button type="submit" style={{
            marginTop: 8, padding: '12px 0', borderRadius: 'var(--radius-pill)',
            background: 'var(--brand-green)', color: '#fff', border: 'none',
            fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            Prisijungti
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 'var(--text-small)', color: 'var(--ink-500)' }}>
          Neturite paskyros?{' '}
          <Link to="/register" style={{ color: 'var(--brand-green-strong)', textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}>
            Registruotis
          </Link>
        </p>
      </div>
    </div>
  )
}
