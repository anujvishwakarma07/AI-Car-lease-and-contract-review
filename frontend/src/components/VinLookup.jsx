import React, { useState } from 'react';
import { Car, Search, AlertCircle, Info, Hash, MapPin, Flag, ShieldCheck, Database, BadgeCheck } from 'lucide-react';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

// Trust badges shown across all tabs
const TrustStrip = ({ source }) => (
  <div style={{
    display: 'flex', gap: '20px', flexWrap: 'wrap',
    marginBottom: '28px',
    padding: '14px 18px',
    background: 'var(--bg-hover)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
      <ShieldCheck size={15} style={{ color: '#10b981', flexShrink: 0 }} />
      <span>Official government database</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
      <Database size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <span>Source: {source}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
      <BadgeCheck size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
      <span>Real-time lookup</span>
    </div>
  </div>
);

// Quota-exceeded flash
const QuotaFlash = () => (
  <div style={{
    marginTop: '16px',
    padding: '16px 20px',
    borderRadius: '10px',
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.35)',
    display: 'flex', gap: '12px', alignItems: 'flex-start'
  }}>
    <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
    <div>
      <p style={{ fontWeight: 700, color: '#f59e0b', fontSize: '13px', marginBottom: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Lookup Temporarily Unavailable
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        The vehicle lookup service is momentarily at capacity. Please try again shortly or contact support if this persists.
      </p>
    </div>
  </div>
);

// Generic error flash
const ErrorFlash = ({ message }) => (
  <div className="flag-item" style={{ marginTop: '16px' }}>
    <AlertCircle size={20} />
    <span>{message}</span>
  </div>
);

const VinResultCard = ({ result }) => (
  <div className="card">
    <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Car size={20} style={{ color: 'var(--primary)' }} />
      Vehicle Specifications
    </h3>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
      Sourced from NHTSA (National Highway Traffic Safety Administration)
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">Make</td><td className="parameter-value">{result.make || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Model</td><td className="parameter-value">{result.model || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Model Year</td><td className="parameter-value">{result.year || 'N/A'}</td></tr>
        </tbody>
      </table>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">Manufacturer</td><td className="parameter-value">{result.manufacturer || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Body Class</td><td className="parameter-value">{result.bodyClass || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Vehicle Type</td><td className="parameter-value">{result.vehicleType || 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const PlateResultCard = ({ result, vin }) => (
  <div className="card">
    <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Car size={20} style={{ color: 'var(--primary)' }} />
      Vehicle Specifications
    </h3>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
      Plate resolved via DMV database · Full specs from NHTSA
    </p>
    {vin && (
      <div style={{ marginBottom: '20px', padding: '10px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 700, marginRight: '8px' }}>VIN //</span>{vin}
      </div>
    )}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">Make</td><td className="parameter-value">{result.make || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Model</td><td className="parameter-value">{result.model || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Model Year</td><td className="parameter-value">{result.year || 'N/A'}</td></tr>
        </tbody>
      </table>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">Manufacturer</td><td className="parameter-value">{result.manufacturer || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Body Class</td><td className="parameter-value">{result.bodyClass || 'N/A'}</td></tr>
          <tr><td className="parameter-label">Vehicle Type</td><td className="parameter-value">{result.vehicleType || 'N/A'}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const IndianRCResultCard = ({ info }) => (
  <div className="card">
    <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Flag size={20} style={{ color: 'var(--primary)' }} />
      Vehicle Registration Details
    </h3>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
      Sourced from VAHAN (Ministry of Road Transport & Highways)
    </p>

    <div style={{ marginBottom: '20px' }}>
      <span style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.1em',
        backgroundColor: info.rcStatus === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
        color: info.rcStatus === 'ACTIVE' ? '#10b981' : '#ef4444',
        border: `1px solid ${info.rcStatus === 'ACTIVE' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
      }}>
        RC STATUS: {info.rcStatus}
      </span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">Reg. Number</td><td className="parameter-value">{info.registrationNumber}</td></tr>
          <tr><td className="parameter-label">Owner</td><td className="parameter-value">{info.ownerName}</td></tr>
          <tr><td className="parameter-label">Make / Model</td><td className="parameter-value">{info.make}</td></tr>
          <tr><td className="parameter-label">Fuel Type</td><td className="parameter-value">{info.fuelType}</td></tr>
          <tr><td className="parameter-label">Color</td><td className="parameter-value">{info.color}</td></tr>
          <tr><td className="parameter-label">Vehicle Class</td><td className="parameter-value">{info.vehicleClass}</td></tr>
          <tr><td className="parameter-label">Seat Capacity</td><td className="parameter-value">{info.seatCapacity}</td></tr>
        </tbody>
      </table>
      <table className="parameters-table">
        <tbody>
          <tr><td className="parameter-label">RTO</td><td className="parameter-value">{info.rto}</td></tr>
          <tr><td className="parameter-label">Reg. Date</td><td className="parameter-value">{info.regDate}</td></tr>
          <tr><td className="parameter-label">Fitness Upto</td><td className="parameter-value">{info.regUpto}</td></tr>
          <tr><td className="parameter-label">Insurance Upto</td><td className="parameter-value">{info.insuranceUpto}</td></tr>
          <tr><td className="parameter-label">Insurer</td><td className="parameter-value">{info.insuranceCompany}</td></tr>
          <tr><td className="parameter-label">Chassis No.</td><td className="parameter-value" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{info.chassis}</td></tr>
          <tr><td className="parameter-label">Engine No.</td><td className="parameter-value" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{info.engine}</td></tr>
        </tbody>
      </table>
    </div>

    <div style={{ display: 'flex', gap: '10px', marginTop: '32px', padding: '16px', backgroundColor: 'var(--bg-hover)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
        Owner details are partially masked by the government database to protect privacy. This data is live from the VAHAN/Parivahan infrastructure.
      </p>
    </div>
  </div>
);

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.2s',
  }}>
    {icon} {label}
  </button>
);

// Detect if error is quota-related
const isQuotaError = (msg = '') =>
  msg.includes('429') || msg.toLowerCase().includes('quota') ||
  msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many');

const VinLookup = () => {
  const [activeMode, setActiveMode] = useState('vin');

  const [vinInput, setVinInput] = useState('');
  const [vinResult, setVinResult] = useState(null);
  const [decoding, setDecoding] = useState(false);
  const [vinError, setVinError] = useState('');
  const [vinQuota, setVinQuota] = useState(false);

  const [plateInput, setPlateInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [plateResult, setPlateResult] = useState(null);
  const [plateVin, setPlateVin] = useState('');
  const [plateLooking, setPlateLooking] = useState(false);
  const [plateError, setPlateError] = useState('');
  const [plateQuota, setPlateQuota] = useState(false);

  const [indianPlate, setIndianPlate] = useState('');
  const [indianResult, setIndianResult] = useState(null);
  const [indianLoading, setIndianLoading] = useState(false);
  const [indianError, setIndianError] = useState('');
  const [indianQuota, setIndianQuota] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api';

  const handleDecodeVin = async (e) => {
    e.preventDefault();
    if (!vinInput.trim()) return;
    setDecoding(true); setVinError(''); setVinResult(null); setVinQuota(false);
    try {
      const res = await fetch(`${API_URL}/vin/decode/${vinInput.trim()}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to decode VIN.');
      setVinResult(data.carInfo);
    } catch (err) {
      if (isQuotaError(err.message)) setVinQuota(true);
      else setVinError(err.message || 'Failed to decode VIN.');
    } finally { setDecoding(false); }
  };

  const handleDecodePlate = async (e) => {
    e.preventDefault();
    if (!plateInput.trim() || !stateInput) return;
    setPlateLooking(true); setPlateError(''); setPlateResult(null); setPlateVin(''); setPlateQuota(false);
    try {
      const res = await fetch(
        `${API_URL}/vin/plate?plate=${encodeURIComponent(plateInput.trim())}&state=${encodeURIComponent(stateInput)}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'License plate lookup failed.');
      setPlateResult(data.carInfo);
      setPlateVin(data.vin || '');
    } catch (err) {
      if (isQuotaError(err.message)) setPlateQuota(true);
      else setPlateError(err.message || 'Failed to decode license plate.');
    } finally { setPlateLooking(false); }
  };

  const handleIndianPlate = async (e) => {
    e.preventDefault();
    if (!indianPlate.trim()) return;
    setIndianLoading(true); setIndianError(''); setIndianResult(null); setIndianQuota(false);
    try {
      const res = await fetch(
        `${API_URL}/vin/indian-plate?plate=${encodeURIComponent(indianPlate.trim())}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Indian RC lookup failed.');
      setIndianResult(data.vehicleInfo);
    } catch (err) {
      if (isQuotaError(err.message)) setIndianQuota(true);
      else setIndianError(err.message || 'Failed to decode registration number.');
    } finally { setIndianLoading(false); }
  };

  return (
    <div>
      <div className="view-header">
        <h1 className="view-title">VIN & Plate Lookup</h1>
        <p className="view-subtitle">
          Retrieve verified vehicle specifications from official government databases — instantly and accurately.
        </p>
      </div>

      {/* Mode Toggle Tabs */}
      <div style={{ display: 'flex', marginBottom: '28px', borderBottom: '1px solid var(--border)' }}>
        <TabBtn active={activeMode === 'vin'} onClick={() => setActiveMode('vin')} icon={<Hash size={14} />} label="VIN Number" />
        <TabBtn active={activeMode === 'plate'} onClick={() => setActiveMode('plate')} icon={<MapPin size={14} />} label="US Plate" />
        <TabBtn active={activeMode === 'indian'} onClick={() => setActiveMode('indian')} icon={<Flag size={14} />} label="Indian RC" />
      </div>

      {/* VIN Tab */}
      {activeMode === 'vin' && (
        <>
          <TrustStrip source="NHTSA · vpic.nhtsa.dot.gov" />
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={20} style={{ color: 'var(--primary)' }} /> Decode Vehicle Identification Number
            </h3>
            <form onSubmit={handleDecodeVin} className="input-group">
              <input
                type="text"
                className="form-input"
                placeholder="Enter your 17-character VIN..."
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                maxLength={17}
                disabled={decoding}
              />
              <button type="submit" className="btn" disabled={decoding || vinInput.trim().length !== 17}>
                {decoding ? <><div className="spinner"></div> Decoding...</> : 'Decode VIN'}
              </button>
            </form>
            {vinQuota && <QuotaFlash />}
            {!vinQuota && vinError && <ErrorFlash message={vinError} />}
          </div>
          {vinResult && <VinResultCard result={vinResult} />}
        </>
      )}

      {/* US Plate Tab */}
      {activeMode === 'plate' && (
        <>
          <TrustStrip source="State DMV Records · NHTSA" />
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} /> US License Plate Lookup
            </h3>
            <form onSubmit={handleDecodePlate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your license plate number..."
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  disabled={plateLooking}
                />
                <select
                  className="form-input"
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  disabled={plateLooking}
                  style={{ minWidth: '80px' }}
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="btn" disabled={plateLooking || !plateInput.trim() || !stateInput}>
                {plateLooking ? <><div className="spinner"></div> Looking up...</> : 'Lookup Plate'}
              </button>
            </form>
            {plateQuota && <QuotaFlash />}
            {!plateQuota && plateError && <ErrorFlash message={plateError} />}
          </div>
          {plateResult && <PlateResultCard result={plateResult} vin={plateVin} />}
        </>
      )}

      {/* Indian RC Tab */}
      {activeMode === 'indian' && (
        <>
          <TrustStrip source="VAHAN · Parivahan · MoRTH" />
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flag size={20} style={{ color: 'var(--primary)' }} /> Indian Vehicle RC Lookup
            </h3>
            <form onSubmit={handleIndianPlate} className="input-group">
              <input
                type="text"
                className="form-input"
                placeholder="Enter your vehicle registration number..."
                value={indianPlate}
                onChange={(e) => setIndianPlate(e.target.value.toUpperCase())}
                disabled={indianLoading}
              />
              <button type="submit" className="btn" disabled={indianLoading || !indianPlate.trim()}>
                {indianLoading ? <><div className="spinner"></div> Fetching RC...</> : 'Lookup RC'}
              </button>
            </form>
            {indianQuota && <QuotaFlash />}
            {!indianQuota && indianError && <ErrorFlash message={indianError} />}
          </div>
          {indianResult && <IndianRCResultCard info={indianResult} />}
        </>
      )}
    </div>
  );
};

export default VinLookup;
