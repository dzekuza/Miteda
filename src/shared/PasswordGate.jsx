import React, { useState } from 'react'

const PASSWORD = 'miteda2026'
const STORAGE_KEY = 'miteda_access'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  if (unlocked) return children

  const submit = () => {
    if (value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 500)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') submit()
    if (error) setError(false)
  }

  return (
    <>
      {children}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10, 14, 10, 0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          width: '100%', maxWidth: 380,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl, 20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
          padding: '40px 36px',
          display: 'flex', flexDirection: 'column', gap: 24,
          animation: shake ? 'gate-shake 0.45s ease' : 'gate-in 0.3s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <img src="/miteda-logo-dark.svg" alt="Miteda" style={{ height: 32, marginBottom: 4 }} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 'var(--fw-medium)', color: 'var(--ink-900)' }}>
              Demonstracinė prieiga
            </h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-400)', lineHeight: 1.5 }}>
              Įveskite slaptažodį, kad galėtumėte peržiūrėti demonstraciją.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              autoFocus
              type="password"
              value={value}
              placeholder="Slaptažodis"
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              onKeyDown={onKey}
              style={{
                height: 44, padding: '0 14px',
                border: 'none', outline: 'none',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-page)',
                boxShadow: error
                  ? 'inset 0 0 0 1.5px var(--accent-red, #e53e3e)'
                  : 'inset 0 0 0 1px var(--line-200)',
                fontSize: 'var(--text-body)',
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-900)',
                transition: 'box-shadow 0.15s',
              }}
            />
            {error && (
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--accent-red, #e53e3e)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="ph ph-warning-circle" /> Neteisingas slaptažodis
              </span>
            )}
          </div>

          <button
            onClick={submit}
            style={{
              height: 44, border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--brand-green)',
              color: '#fff',
              fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)',
              fontFamily: 'var(--font-sans)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Įeiti
          </button>
        </div>

        <style>{`
          @keyframes gate-in {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes gate-shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-8px); }
            40%       { transform: translateX(8px); }
            60%       { transform: translateX(-5px); }
            80%       { transform: translateX(5px); }
          }
        `}</style>
      </div>
    </>
  )
}
