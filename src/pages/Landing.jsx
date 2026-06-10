import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--surface-page)', color: 'var(--ink-900)',
      WebkitFontSmoothing: 'antialiased', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 1040 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 48 }}>
          <img src="/miteda-logo-dark.svg" alt="Miteda" style={{ height: 40 }} />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: '999px', background: 'var(--brand-green-faint)',
            color: 'var(--brand-green-strong)', fontSize: 'var(--text-small)', fontWeight: 'var(--fw-medium)',
          }}>
            <i className="ph ph-flask" /> Demonstracinė versija · visi duomenys fiktyvūs
          </span>
          <h1 style={{ margin: '8px 0 0', fontSize: 40, lineHeight: 1.1, fontWeight: 'var(--fw-medium)', letterSpacing: 'var(--tracking-tight)' }}>
            Pastatų valdymo portalas
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--text-title)', color: 'var(--ink-500)', maxWidth: 560 }}>
            Vienas portalas naujų gyvenamųjų pastatų valdymui — nuo statybos iki įsikėlimo ir kasdienio gyvenimo. Pasirinkite rolę, kad pamatytumėte jos vaizdą.
          </p>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 'var(--radius-pill)',
            background: 'var(--brand-green)', color: '#fff',
            textDecoration: 'none', fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)',
          }}>
            Prisijungti
          </Link>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
        }}>
          <Link to="/owner/pagrindinis" style={{
            display: 'flex', flexDirection: 'column', gap: 16, textDecoration: 'none', color: 'inherit',
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: 28,
            boxShadow: 'var(--shadow-xs)', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-xs)' }}
          >
            <span style={{
              width: 56, height: 56, borderRadius: 'var(--radius-md)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--brand-green-faint)', color: 'var(--brand-green-strong)',
            }}>
              <i className="ph ph-house" style={{ fontSize: 28 }} />
            </span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>Gyventojas</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)', flex: 1 }}>
              Pranešimai, defektai, nuotraukos, sutartys, tvarkaraštis, bendruomenė ir buto remonto eiga.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>
              Atidaryti <i className="ph ph-arrow-right" />
            </span>
          </Link>

          <Link to="/admin/objektai" style={{
            display: 'flex', flexDirection: 'column', gap: 16, textDecoration: 'none', color: 'inherit',
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: 28,
            boxShadow: 'var(--shadow-xs)', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-xs)' }}
          >
            <span style={{
              width: 56, height: 56, borderRadius: 'var(--radius-md)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--brand-forest)', color: '#fff',
            }}>
              <i className="ph ph-shield-check" style={{ fontSize: 28 }} />
            </span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>Administracija</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)', flex: 1 }}>
              Objektų valdymas, butų ir gyventojų apskaita, defektai, kontaktai ir statybos naujienų transliacija.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>
              Atidaryti <i className="ph ph-arrow-right" />
            </span>
          </Link>

          <Link to="/statyba/vadovas" style={{
            display: 'flex', flexDirection: 'column', gap: 16, textDecoration: 'none', color: 'inherit',
            background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', padding: 28,
            boxShadow: 'var(--shadow-xs)', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-xs)' }}
          >
            <span style={{
              width: 56, height: 56, borderRadius: 'var(--radius-md)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--orange-soft)', color: 'var(--orange)',
            }}>
              <i className="ph ph-hard-hat" style={{ fontSize: 28 }} />
            </span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-heading)', fontWeight: 'var(--fw-medium)' }}>Statybos komanda</h2>
            <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--ink-500)', lineHeight: 'var(--lh-body)', flex: 1 }}>
              Darbų vadovo skydelis ir greitas darbininko žurnalas objekte — žinutės, nuotraukos, kvitai.
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-body)', fontWeight: 'var(--fw-medium)', color: 'var(--brand-green-strong)' }}>
              Atidaryti <i className="ph ph-arrow-right" />
            </span>
          </Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 'var(--text-small)', color: 'var(--ink-400)' }}>
          Roles galite perjungti bet kuriame ekrane per kairę šoninę juostą.
        </p>
      </div>
    </div>
  )
}
