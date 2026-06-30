import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle2, ShieldAlert, Trash2, Download } from 'lucide-react';

const ContractAnalyzer = ({ contractResult, setContractResult, setChatMessages }) => {
  const [contractFile, setContractFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8080/api';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/contracts`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to load history : ', error);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete')) return;

    try {
      const res = await fetch(`${API_URL}/contracts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setHistory(prev => prev.filter(c => c._id !== id));
        if (contractResult && contractResult._id === id) {
          setContractResult(null);
        }
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to delete contract');
      }
    } catch (error) {
      console.error('Delete error', error);
      alert('Something went wrong during deletion.');
    }
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    const element = document.getElementById('analysis-report-container');
    if (!element) return;

    setExporting(true);

    const triggerGeneration = () => {
      const opt = {
        margin: 10,
        filename: `VetoCar_Audit_${contractResult.fileName.replace('.pdf', '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0c1017'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      window.html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => setExporting(false))
        .catch((err) => {
          console.error(err);
          setExporting(false);
        });
    }

    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = triggerGeneration;
      document.body.appendChild(script);
    } else {
      triggerGeneration();
    }
  };

// Score styling helpers
const getScoreClass = (score) => {
  if (!score && score !== 0) return 'avg';
  if (score >= 75) return 'good';
  if (score >= 50) return 'avg';
  return 'bad';
};

const getScoreBadge = (score) => {
  if (!score && score !== 0) return <span className="badge badge-warning">Medium</span>;
  if (score >= 75) return <span className="badge badge-success">Fair Deal</span>;
  if (score >= 50) return <span className="badge badge-warning">Caution</span>;
  return <span className="badge badge-danger">Unfair Deal</span>;
};

// Drag and drop event handlers
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === "dragover" || e.type === "dragenter") {
    setDragging(true);
  } else if (e.type === "dragleave") {
    setDragging(false);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragging(false);

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    if (file.type === "application/pdf") {
      setContractFile(file);
      setUploadError('');
    } else {
      setUploadError('Only PDF files are supported.');
    }
  }
};

const selectFile = () => {
  fileInputRef.current.click();
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setContractFile(e.target.files[0]);
    setUploadError('');
  }
};

//API CONNECTION (WIRING TO BACKEND) -
const handleAnalyze = async () => {
  if (!contractFile) return;

  setAnalyzing(true);
  setUploadError('');
  setContractResult(null);

  const formData = new FormData();
  formData.append('contract', contractFile);

  try {
    const response = await fetch(`${API_URL}/contracts/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze contract');
    }

    // Store the analysis result in the shared state (so Chat can access it)
    setContractResult(data);

    setHistory(prev => [data, ...prev]);

    if (setChatMessages) {
      setChatMessages(prev => [
        ...prev,
        { role: 'bot', text: `✨ System Context Loaded: I have analyzed the terms for your ${data.analysis.year || ''} ${data.analysis.make || ''} ${data.analysis.model || 'vehicle'}. Ask me about this offer!` }
      ]);
    }

  } catch (err) {
    console.error('Error uploading contract:', err);
    setUploadError(err.message || 'Something went wrong during analysis.');
  } finally {
    setAnalyzing(false);
  }
};

return (
  <div>
    <div className="view-header">
      <h1 className="view-title">Contract Analyzer</h1>
      <p className="view-subtitle">Upload your draft contract to review lease parameters and find hidden costs.</p>
    </div>

    {/* Upload Box */}
    <div className="card">
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={selectFile}
      >
        <UploadCloud className="drop-zone-icon" size={48} />
        {contractFile ? (
          <div>
            <p style={{ fontWeight: 600 }}>{contractFile.name}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {(contractFile.size / 1024 / 1024).toFixed(2)} MB - Click to replace
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: 600 }}>Drag & Drop your Lease/Loan PDF here</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>or click to browse files</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          style={{ display: 'none' }}
        />
      </div>

      {uploadError && <p style={{ color: 'var(--danger)', marginTop: '12px' }}>{uploadError}</p>}

      {contractFile && (
        <button
          className="btn"
          onClick={handleAnalyze}
          disabled={analyzing}
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        >
          {analyzing ? (
            <>
              <div className="spinner"></div> Running Gemini Analysis...
            </>
          ) : (
            'Analyze Contract'
          )}
        </button>
      )}
    </div>

    {/* Saved Contracts History List */}
    {history.length > 0 && (
      <div className="card" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 600 }}>
          Saved Contracts History
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((c) => (
            <div
              key={c._id}
              onClick={() => {
                setContractResult(c);
                if (setChatMessages) {
                  setChatMessages([
                    { role: 'bot', text: `✨ System Context Restored: I have reloaded the terms for your ${c.analysis.year || ''} ${c.analysis.make || ''} ${c.analysis.model || 'vehicle'}. Ask me about this offer!` }
                  ]);
                }
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{c.fileName}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Analyzed on: {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${c.analysis.fairnessScore >= 75 ? 'badge-success' : c.analysis.fairnessScore >= 50 ? 'badge-warning' : 'badge-danger'
                  }`}>
                  Score: {c.analysis.fairnessScore}
                </span>
                <button
                  onClick={(e) => handleDelete(c._id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Analysis Results Display */}
    {contractResult && (
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Analysis Report</h2>
          <button 
            className="btn" 
            onClick={handleExportPDF} 
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
          >
            {exporting ? (
              <>
                <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download PDF Report</span>
              </>
            )}
          </button>
        </div>

        <div id="analysis-report-container" style={{ padding: '8px' }}>
          <div className="analysis-grid">

        {/* Left Card: Score and Red Flags */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Deal Fairness & Assessment</h3>

          <div className="score-radial">
            <div className={`score-circle ${getScoreClass(contractResult.analysis.fairnessScore)}`}>
              {contractResult.analysis.fairnessScore ?? 'N/A'}
            </div>
            <div>
              <h4 style={{ marginBottom: '4px' }}>Fairness Score</h4>
              {getScoreBadge(contractResult.analysis.fairnessScore)}
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            {contractResult.analysis.fairnessExplanation}
          </p>

          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--danger)' }} />
            Red Flags & Warnings
          </h4>
          {contractResult.analysis.redFlags && contractResult.analysis.redFlags.length > 0 ? (
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
              {contractResult.analysis.redFlags.map((flag, idx) => (
                <li key={idx} style={{ marginBottom: '8px', color: 'var(--danger)' }}>{flag}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--success)' }}>✨ No major hidden fees or warning clauses detected.</p>
          )}
        </div>

        {/* Right Card: Parameter List */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Extracted Offer Terms</h3>
          <table className="parameters-table">
            <tbody>
              <tr>
                <td className="parameter-label">Contract Type</td>
                <td className="parameter-value">{contractResult.analysis.contractType || 'Unknown'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Interest Rate / APR</td>
                <td className="parameter-value">{contractResult.analysis.interestRateOrAPR ? `${contractResult.analysis.interestRateOrAPR}%` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Lease Duration</td>
                <td className="parameter-value">{contractResult.analysis.leaseTermMonths ? `${contractResult.analysis.leaseTermMonths} Months` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Monthly Payment</td>
                <td className="parameter-value">{contractResult.analysis.monthlyPayment ? `$${contractResult.analysis.monthlyPayment}` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Down Payment</td>
                <td className="parameter-value">{contractResult.analysis.downPayment ? `$${contractResult.analysis.downPayment}` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Residual Value</td>
                <td className="parameter-value">{contractResult.analysis.residualValue ? `$${contractResult.analysis.residualValue}` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Yearly Mileage Limit</td>
                <td className="parameter-value">{contractResult.analysis.mileageAllowanceYearly ? `${contractResult.analysis.mileageAllowanceYearly.toLocaleString()} mi` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Mileage Overage Fee</td>
                <td className="parameter-value">{contractResult.analysis.mileageOverageFeePerMile ? `$${contractResult.analysis.mileageOverageFeePerMile}/mi` : 'N/A'}</td>
              </tr>
              <tr>
                <td className="parameter-label">Disposition Fee</td>
                <td className="parameter-value">{contractResult.analysis.dispositionFee ? `$${contractResult.analysis.dispositionFee}` : 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          {contractResult.analysis.maintenanceResponsibility && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}><strong>Maintenance:</strong> {contractResult.analysis.maintenanceResponsibility}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
  </div>
);
};

export default ContractAnalyzer;
