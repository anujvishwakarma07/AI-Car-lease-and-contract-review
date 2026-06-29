import { AlertCircle, CheckCircle, Scale, ShieldAlert, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const OfferComparision = () => {
    const [contract, setContract] = useState([]);
    const [dealAId, setDealAId] = useState('');
    const [dealBId, setDealBId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8080/api/contracts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch saved contracts');
                }

                const data = await res.json();
                setContract(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            };
        }
        fetchContract();
    }, []);

    const dealA = contract.find(c => c._id === dealAId);
    const dealB = contract.find(c => c._id == dealBId);

    const calculateTotalCost = (deal) => {
        if (!deal || !deal.analysis) return 0;
        const { monthlyPayment, leaseTermMonths, downPayment, dispositionFee } = deal.analysis;
        const term = leaseTermMonths || 0;
        const down = downPayment || 0;
        const disp = dispositionFee || 0;
        const monthly = monthlyPayment || 0;
        return (monthly * term) + down + disp;
    };

    const costA = calculateTotalCost(dealA);
    const costB = calculateTotalCost(dealB);

    const getRecommendation = () => {
        if (!dealA || !dealB) return null;
        const scoreA = dealA.analysis.fairnessScore || 0;
        const scoreB = dealB.analysis.fairnessScore || 0;
        let winner = null;
        let reason = '';
        let savings = 0;
        if (costA > 0 && costB > 0) {
            if (costA < costB) {
                winner = 'Deal A';
                savings = costB - costA;
                reason = `it saves you $${savings.toLocaleString(undefined, { maximumFractionDigits: 2 })} in total lease costs over the term`;
            } else if (costB < costA) {
                winner = 'Deal B';
                savings = costA - costB;
                reason = `it saves you $${savings.toLocaleString(undefined, { maximumFractionDigits: 2 })} in total lease costs over the term`;
            }
        }
        if (!winner || savings === 0) {
            if (scoreA > scoreB) {
                winner = 'Deal A';
                reason = `it has a higher fairness rating (${scoreA}/100 vs ${scoreB}/100) and fewer red flags`;
            } else if (scoreB > scoreA) {
                winner = 'Deal B';
                reason = `it has a higher fairness rating (${scoreB}/100 vs ${scoreA}/100) and fewer red flags`;
            } else {
                return { text: "Both deals are financially equivalent. Pick the vehicle you prefer!", isEqual: true };
            }
        }
        return {
            text: `VETOCAR Recommendation: We advise proceeding with **${winner}** because ${reason}.`,
            winner,
            savings
        };
    };
    const recommendation = getRecommendation();

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-main)' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Scale size={24} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        Comparative Audit //
                    </span>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                    Multiple Offer Comparison
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
                    Compare two audited quotes side-by-side to highlight payment deltas, hidden markups, and identify the better offer.
                </p>
            </div>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <div className="spinner"></div>
                </div>
            )}
            {error && (
                <div className="badge badge-error" style={{ marginBottom: '24px', padding: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <ShieldAlert size={16} />
                    <span>Error loading comparisons: {error}</span>
                </div>
            )}
            {!loading && !error && (
                <>
                    {/* Dropdowns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div className="card" style={{ padding: '20px', borderRadius: '0px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                                Select Deal A //
                            </label>
                            <select
                                value={dealAId}
                                onChange={(e) => setDealAId(e.target.value)}
                                className="form-input"
                                style={{ width: '100%' }}
                            >
                                <option value="">-- Choose first audited contract --</option>
                                {contract
                                    .filter(c => c._id !== dealBId)
                                    .map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.fileName} (Score: {c.analysis.fairnessScore}/100)
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="card" style={{ padding: '20px', borderRadius: '0px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                                Select Deal B //
                            </label>
                            <select
                                value={dealBId}
                                onChange={(e) => setDealBId(e.target.value)}
                                className="form-input"
                                style={{ width: '100%' }}
                            >
                                <option value="">-- Choose second audited contract --</option>
                                {contract
                                    .filter(c => c._id !== dealAId)
                                    .map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.fileName} (Score: {c.analysis.fairnessScore}/100)
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    {/* Deal Cards Comparison */}
                    {dealA && dealB ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {recommendation && (
                                <div style={{
                                    backgroundColor: 'rgba(0, 242, 254, 0.05)',
                                    borderLeft: '4px solid var(--primary)',
                                    padding: '20px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}>
                                    <Sparkles size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>VetoCar Recommendation Engine:</strong>
                                        <span>{recommendation.text}</span>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Deal A Card */}
                                <div className="card" style={{ padding: '24px', borderRadius: '0px', position: 'relative' }}>
                                    {recommendation?.winner === 'Deal A' && (
                                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                            <CheckCircle size={14} /> RECOMMENDED
                                        </div>
                                    )}
                                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '-0.01em', fontWeight: 800, fontSize: '18px', marginBottom: '4px', color: 'var(--primary)' }}>
                                        Deal A
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', wordBreak: 'break-all', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
                                        {dealA.fileName}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Deal Fairness Score</span>
                                            <strong style={{ fontSize: '16px', color: dealA.analysis.fairnessScore >= 80 ? 'var(--primary)' : dealA.analysis.fairnessScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                {dealA.analysis.fairnessScore}/100
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Contract Type</span>
                                            <strong>{dealA.analysis.contractType}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Monthly Payment</span>
                                            <strong style={{ color: dealA.analysis.monthlyPayment <= dealB.analysis.monthlyPayment ? 'var(--primary)' : 'inherit' }}>
                                                ${dealA.analysis.monthlyPayment?.toFixed(2) || 'N/A'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Down Payment</span>
                                            <strong style={{ color: dealA.analysis.downPayment <= dealB.analysis.downPayment ? 'var(--primary)' : 'inherit' }}>
                                                ${dealA.analysis.downPayment?.toFixed(2) || '0.00'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Interest Rate / APR</span>
                                            <strong style={{ color: dealA.analysis.interestRateOrAPR <= dealB.analysis.interestRateOrAPR ? 'var(--primary)' : 'inherit' }}>
                                                {dealA.analysis.interestRateOrAPR ? `${dealA.analysis.interestRateOrAPR}%` : 'N/A'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Lease Term</span>
                                            <strong>{dealA.analysis.leaseTermMonths || 'N/A'} mos</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Out-of-Pocket Cost</span>
                                            <strong style={{ color: costA <= costB ? 'var(--primary)' : 'inherit', fontSize: '15px' }}>
                                                ${costA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </strong>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '24px' }}>
                                        <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                                            Audited Red Flags ({dealA.analysis.redFlags?.length || 0})
                                        </h4>
                                        {dealA.analysis.redFlags && dealA.analysis.redFlags.length > 0 ? (
                                            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#ef4444' }}>
                                                {dealA.analysis.redFlags.map((flag, idx) => (
                                                    <li key={idx} style={{ lineHeight: '1.4' }}>{flag}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: 'var(--primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                                                <CheckCircle size={14} /> No red flags detected!
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Deal B Card */}
                                <div className="card" style={{ padding: '24px', borderRadius: '0px', position: 'relative' }}>
                                    {recommendation?.winner === 'Deal B' && (
                                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                            <CheckCircle size={14} /> RECOMMENDED
                                        </div>
                                    )}
                                    <h3 style={{ textTransform: 'uppercase', letterSpacing: '-0.01em', fontWeight: 800, fontSize: '18px', marginBottom: '4px', color: 'var(--primary)' }}>
                                        Deal B
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', wordBreak: 'break-all', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
                                        {dealB.fileName}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Deal Fairness Score</span>
                                            <strong style={{ fontSize: '16px', color: dealB.analysis.fairnessScore >= 80 ? 'var(--primary)' : dealB.analysis.fairnessScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                {dealB.analysis.fairnessScore}/100
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Contract Type</span>
                                            <strong>{dealB.analysis.contractType}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Monthly Payment</span>
                                            <strong style={{ color: dealB.analysis.monthlyPayment <= dealA.analysis.monthlyPayment ? 'var(--primary)' : 'inherit' }}>
                                                ${dealB.analysis.monthlyPayment?.toFixed(2) || 'N/A'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Down Payment</span>
                                            <strong style={{ color: dealB.analysis.downPayment <= dealA.analysis.downPayment ? 'var(--primary)' : 'inherit' }}>
                                                ${dealB.analysis.downPayment?.toFixed(2) || '0.00'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Interest Rate / APR</span>
                                            <strong style={{ color: dealB.analysis.interestRateOrAPR <= dealA.analysis.interestRateOrAPR ? 'var(--primary)' : 'inherit' }}>
                                                {dealB.analysis.interestRateOrAPR ? `${dealB.analysis.interestRateOrAPR}%` : 'N/A'}
                                            </strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Lease Term</span>
                                            <strong>{dealB.analysis.leaseTermMonths || 'N/A'} mos</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Out-of-Pocket Cost</span>
                                            <strong style={{ color: costB <= costA ? 'var(--primary)' : 'inherit', fontSize: '15px' }}>
                                                ${costB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </strong>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '24px' }}>
                                        <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                                            Audited Red Flags ({dealB.analysis.redFlags?.length || 0})
                                        </h4>
                                        {dealB.analysis.redFlags && dealB.analysis.redFlags.length > 0 ? (
                                            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#ef4444' }}>
                                                {dealB.analysis.redFlags.map((flag, idx) => (
                                                    <li key={idx} style={{ lineHeight: '1.4' }}>{flag}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: 'var(--primary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                                                <CheckCircle size={14} /> No red flags detected!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            border: '1px dashed var(--border)',
                            padding: '60px 20px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                        }}>
                            <AlertCircle size={32} style={{ color: 'var(--border)' }} />
                            <div>
                                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Awaiting Selection</strong>
                                <span>Please select two active contract offers from the dropdown lists above to trigger side-by-side audits.</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OfferComparision