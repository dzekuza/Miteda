import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ company: '', name: '', email: '', password: '' })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: redirect to admin dashboard
    navigate('/admin/objektai')
  }

  const inputStyle = {
    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--ink-200)', fontSize: 'var(--text-body)',
    background: 'var(--surface-page)', color: 'var(--ink-900)', outline: 'none',
  }
  const labelStyle = { fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)', color: 'var(--ink-700)' }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-page)', padding: '40px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)', padding: '40px 36px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/miteda-logo-dark.svg" alt="Miteda" style={{ height: 36, marginBottom: 24 }} />
          <h1 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>Registracija</h1>
          <p style={{ margin: '8px 0 0', color: 'var(--ink-500)', fontSize: 'var(--text-body)' }}>Nekilnojamojo turto plėtotojams</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Įmonės pavadinimas</label>
            <input type="text" value={form.company} onChange={set('company')} placeholder="UAB Miteda" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Vardas ir pavardė</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Aistė Vasiliauskienė" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>El. paštas</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jusu@imone.lt" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Slaptažodis</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required style={inputStyle} />
          </div>
          <button type="submit" style={{
            marginTop: 8, padding: '12px 0', borderRadius: 'var(--radius-pill)',
            background: 'var(--brand-forest)', color: '#fff', border: 'none',
            fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            Sukurti paskyrą
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 'var(--text-small)', color: 'var(--ink-500)' }}>
          Jau turite paskyrą?{' '}
          <Link to="/login" style={{ color: 'var(--brand-green-strong)', textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}>
            Prisijungti
          </Link>
        </p>
      </div>
    </div>
  )
}
