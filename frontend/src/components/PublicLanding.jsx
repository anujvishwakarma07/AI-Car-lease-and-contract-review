import React, { useState } from 'react';
import { ArrowUpRight, Sun, Moon, ArrowLeft, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import darkModeLogo from '../assets/darkModeTextual.png';
import darkModeSymbol from '../assets/darkModeSymbolic.png';
import lightModeLogo from '../assets/LightModeTextual.png';
import lightModeSymbol from '../assets/lightModeSybolic.png';

const PublicLanding = ({ setIsAuthenticated, setUser, theme, toggleTheme }) => {
  const [showAuth, setShowAuth] = useState(false);

  // ────────── FULL-SCREEN AUTH PAGE ──────────
  if (showAuth) {
    return (
      <FullScreenAuth
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
        theme={theme}
        toggleTheme={toggleTheme}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  // ────────── PUBLIC LANDING PAGE ──────────
  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 99,
        background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={theme === 'dark' ? darkModeSymbol : lightModeSymbol} alt="VetoCar Mark" style={{ height: '26px', objectFit: 'contain' }} />
          <img src={theme === 'dark' ? darkModeLogo : lightModeLogo} alt="VetoCar" style={{ height: '16px', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="btn" style={{ padding: '10px 24px', fontSize: '11px' }} onClick={() => setShowAuth(true)}>
            Sign In
          </button>
        </div>
      </header>

      {/* DASHBOARD VIEW CONTENT */}
      <div style={{ flex: 1, padding: '32px 24px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div className="home-split-grid">
          <div>
            <h1 className="home-hero-header">
              DECODE DEALS.<br />
              NEGOTIATE LIKE<br />
              AN EXPERT.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px', maxWidth: '480px' }}>
              VetoCar extracts terms, isolates hidden dealer fees, and gives you exact, tailored conversation scripts to drop your monthly lease payments.
            </p>
            <div className="home-hero-buttons">
              <button className="btn" onClick={() => setShowAuth(true)}>Analyze Contract</button>
              <button className="btn" style={{ backgroundColor: 'transparent', color: 'var(--primary)', borderColor: 'var(--border)' }} onClick={() => setShowAuth(true)}>
                Consult Coach
              </button>
            </div>
          </div>

          <div className="feature-action-panel">
            <div className="feature-action-card" onClick={() => setShowAuth(true)} style={{ cursor: 'pointer' }}>
              <span className="feature-action-num">01 //</span>
              <div>
                <h3 className="feature-action-title">Lease Contract Analyzer</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>Upload quotation sheets or draft lease contracts. Isolate interest markups, check residual calculations, and find hidden administrative add-ons.</p>
              </div>
            </div>
            <div className="feature-action-card" onClick={() => setShowAuth(true)} style={{ cursor: 'pointer' }}>
              <span className="feature-action-num">02 //</span>
              <div>
                <h3 className="feature-action-title">VIN Lookup Engine</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>Retrieve manufacturing specs and body details directly from the public NHTSA database to verify trim options and base values.</p>
              </div>
            </div>
            <div className="feature-action-card" onClick={() => setShowAuth(true)} style={{ cursor: 'pointer' }}>
              <span className="feature-action-num">03 //</span>
              <div>
                <h3 className="feature-action-title">AI Negotiation Coach</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>Generate specific objection-handling responses, counter-offer letters, or custom emails to send to dealership sales managers.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ margin: '64px 0 32px 0', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', color: 'var(--text-muted)' }}>System Workflow //</h3>
          <div className="home-workflow-grid">
            <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Upload Data</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Import draft sales quotes or finance agreements in PDF format.</p>
            </div>
            <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Audit Parameters</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Gemini scans for rate markups, incorrect residual values, and dealer add-ons.</p>
            </div>
            <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Obtain Counter-Offers</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Generate professional counter-offers to negotiate payments directly with the dealer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="app-footer" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="footer-top">
          <div className="footer-brand-section">
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <img src={theme === 'dark' ? darkModeSymbol : lightModeSymbol} alt="VetoCar Mark" style={{ height: '22px', objectFit: 'contain' }} />
              <img src={theme === 'dark' ? darkModeLogo : lightModeLogo} alt="VetoCar Logo" style={{ height: '14px', objectFit: 'contain' }} />
              <span className="footer-brand-version">// SYS_VER.1.0.4</span>
            </div>
            <p className="footer-disclaimer">
              ADVISORY NOTICE: ALL INTEREST RATE CALCULATIONS, FEE AUDITS, AND NEGOTIATION SCRIPTS ARE GENERATED BY LARGE LANGUAGE MODELS FOR INFORMATIONAL PURPOSES ONLY. ALWAYS VERIFY FINANCIAL MATH WITH A CERTIFIED PROFESSIONAL BEFORE SIGNING.
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <span className="footer-col-title">INTEGRATIONS</span>
              <a href="https://www.nhtsa.gov/" target="_blank" rel="noopener noreferrer" className="footer-link">NHTSA API <ArrowUpRight size={10} /></a>
              <a href="https://vpic.nhtsa.dot.gov/api/" target="_blank" rel="noopener noreferrer" className="footer-link">VPIC ENGINE <ArrowUpRight size={10} /></a>
              <a href="#" className="footer-link">LEASING CALCULATOR</a>
            </div>
            <div className="footer-links-col">
              <span className="footer-col-title">DOCUMENTATION</span>
              <a href="#" className="footer-link">USER MANUAL</a>
              <a href="#" className="footer-link">AUDIT CRITERIA</a>
              <a href="#" className="footer-link">NEGOTIATION STRATEGY</a>
            </div>
            <div className="footer-links-col">
              <span className="footer-col-title">SYSTEM STATUS</span>
              <div className="status-indicator"><span className="status-dot"></span><span className="status-text">CORE SERVICE: ONLINE</span></div>
              <div className="status-detail">ENG: GEMINI 1.5 FLASH</div>
              <div className="status-detail">LATENCY: &lt;140ms</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">© {new Date().getFullYear()} VETOCAR. STARK ARCHITECT SYSTEM. ALL RIGHTS RESERVED.</span>
          <span className="footer-design-tag">DESIGNED FOR AUTOMOTIVE INTELLIGENCE</span>
        </div>
      </footer>
    </div>
  );
};


// ════════════════════════════════════════════════
// FULL-SCREEN SPLIT AUTH PAGE
// ════════════════════════════════════════════════
const FullScreenAuth = ({ setIsAuthenticated, setUser, theme, toggleTheme, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#000000' : 'var(--bg-main)';
  const textColor = isDark ? '#ffffff' : 'var(--text-main)';
  const subtextColor = isDark ? 'rgba(255,255,255,0.45)' : 'var(--text-muted)';
  const labelColor = isDark ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'var(--border)';
  const borderLight = isDark ? 'rgba(255,255,255,0.07)' : 'var(--border)';
  const pillBg = isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-sidebar)';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-surface)';
  const cardBg = isDark ? 'rgba(8,8,10,0.85)' : 'var(--bg-sidebar)';
  const accentLine = isDark ? 'rgba(255,255,255,0.3)' : 'var(--border)';
  const btnBg = isDark ? '#ffffff' : 'var(--text-main)';
  const btnText = isDark ? '#000000' : 'var(--bg-main)';
  const gridLineColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const glowBg = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(0,0,0,0.02)';
  const ghostTextColor = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.'); setLoading(false); return;
    }
    if (isRegister) {
      if (!email.trim()) { setError('Please provide a valid email address.'); setLoading(false); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Access handshake failed.');
      setLoading(false);
      if (isRegister) {
        setSuccess('Account created! Please sign in.');
        setTimeout(() => { setIsRegister(false); setSuccess(''); setUsername(''); setPassword(''); setConfirmPassword(''); setEmail(''); }, 1500);
      } else {
        localStorage.setItem('token', data.token);
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUser) setUser(data.user);
      }
    } catch (err) {
      setError(err.message || 'Connection refused.'); setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: bgColor,
      color: textColor,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background-color 0.25s ease, color 0.25s ease',
    }}>
      {/* ── Blueprint grid ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px),
                          linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      {/* ── Centre radial glow ── */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '900px', borderRadius: '50%',
        background: `radial-gradient(circle, ${glowBg} 0%, transparent 65%)`,
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── Giant ghost text ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <span style={{
          fontSize: 'clamp(80px, 18vw, 220px)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.06em',
          color: ghostTextColor,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>VETOCAR</span>
      </div>

      {/* ── Top bar ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: `1px solid ${borderLight}`,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: `1px solid ${borderColor}`,
          color: mutedColor, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.1em', padding: '8px 16px',
          transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = textColor; e.currentTarget.style.color = textColor; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; e.currentTarget.style.color = mutedColor; }}
        >
          <ArrowLeft size={13} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={theme === 'dark' ? darkModeSymbol : lightModeSymbol} alt="mark" style={{ height: '26px', objectFit: 'contain' }} />
          <img src={theme === 'dark' ? darkModeLogo : lightModeLogo} alt="VetoCar" style={{ height: '16px', objectFit: 'contain' }} />
        </div>

        <button onClick={toggleTheme} style={{
          background: 'none', border: `1px solid ${borderColor}`,
          color: mutedColor, cursor: 'pointer',
          display: 'flex', alignItems: 'center', padding: '8px',
        }}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* ── Floating stat pills (top corners) ── */}
      <div style={{ position: 'fixed', top: '120px', left: '5%', zIndex: 5 }}>
        <div style={{ background: pillBg, border: `1px solid ${borderColor}`, padding: '14px 20px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '9px', color: labelColor, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Avg. Dealer Markup</div>
          <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: textColor }}>₹84,200</div>
        </div>
      </div>
      <div style={{ position: 'fixed', top: '120px', right: '5%', zIndex: 5 }}>
        <div style={{ background: pillBg, border: `1px solid ${borderColor}`, padding: '14px 20px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '9px', color: labelColor, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Audit Scan Time</div>
          <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: textColor }}>&lt; 30s</div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: '14%', left: '4%', zIndex: 5 }}>
        <div style={{ background: pillBg, border: `1px solid ${borderColor}`, padding: '14px 20px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '9px', color: labelColor, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Data Privacy</div>
          <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: textColor }}>100%</div>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: '14%', right: '4%', zIndex: 5 }}>
        <div style={{ background: pillBg, border: `1px solid ${borderColor}`, padding: '14px 20px', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '9px', color: labelColor, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Interest Rate Markup</div>
          <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.02em', color: textColor }}>3.5%</div>
        </div>
      </div>

      {/* ── Centred form card ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px',
      }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          background: cardBg,
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(24px)',
          padding: '40px',
          boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.7)' : '0 32px 80px rgba(0,0,0,0.1)',
          position: 'relative',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${accentLine}, transparent)`,
          }} />

          {/* Form heading */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px',
              background: pillBg,
              border: `1px solid ${borderColor}`,
              marginBottom: '18px',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: textColor }} />
              <span style={{ fontSize: '9px', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em', color: subtextColor }}>
                {isRegister ? 'New Access Request' : 'Secure Gateway'}
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0, color: textColor }}>
              {isRegister ? 'Create Account' : 'Enter Portal'}
            </h2>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '1px', color: '#ef4444' }} />
              <span style={{ fontSize: '12px', color: isDark ? '#f87171' : '#c53030' }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '1px', color: '#10b981' }} />
              <span style={{ fontSize: '12px', color: isDark ? '#34d399' : '#22543d' }}>{success}</span>
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Username', type: 'text', placeholder: 'e.g., dealbreaker07', value: username, setter: setUsername, show: true },
              { label: 'Email Address', type: 'email', placeholder: 'e.g., user@domain.com', value: email, setter: setEmail, show: isRegister },
              { label: 'Password', type: 'password', placeholder: '••••••••', value: password, setter: setPassword, show: true },
              { label: 'Confirm Password', type: 'password', placeholder: '••••••••', value: confirmPassword, setter: setConfirmPassword, show: isRegister },
            ].filter(f => f.show).map((field) => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: labelColor, marginBottom: '8px', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: inputBg,
                    border: `1px solid ${borderColor}`,
                    color: textColor, padding: '12px 14px', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px', width: '100%', height: '50px',
                background: btnBg, border: 'none', color: btnText,
                fontSize: '12px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '14px', height: '14px', border: `2px solid ${isDark ? '#00000033' : '#ffffff33'}`, borderTop: `2px solid ${btnText}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {isRegister ? 'Creating...' : 'Authenticating...'}
                </>
              ) : (
                isRegister ? 'Create Account' : 'Enter Portal'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${borderLight}` }}>
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: labelColor, fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}
            >
              {isRegister ? '← Back to Sign In' : 'No account? Request Access →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLanding;
