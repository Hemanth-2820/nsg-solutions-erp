import React, { useState } from 'react';
import { 
  Target, ChevronDown, CheckCircle2, AlertTriangle, 
  XCircle, Link as LinkIcon, Plus
} from 'lucide-react';
import '../CEO.css';

// --- Subcomponents ---

const ProgressRing = ({ progress, size = 64, strokeWidth = 6, color = 'var(--ceo-success)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="transparent" 
          stroke="var(--ceo-border)" 
          strokeWidth={strokeWidth} 
        />
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="transparent" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div 
        style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size > 50 ? '16px' : '12px', fontWeight: 800, color
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};

const OkrObjectiveCard = ({ objective, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    if (status === 'On Track') return 'var(--okr-on-track)';
    if (status === 'At Risk') return 'var(--okr-at-risk)';
    if (status === 'Behind') return 'var(--okr-behind)';
    return 'var(--okr-completed)';
  };
  
  const statusColor = getStatusColor(objective.status);

  return (
    <div 
      className="ceo-animate-fade"
      onClick={onClick}
      style={{ 
        padding: '16px',
        background: isSelected ? 'rgba(255,255,255,0.05)' : 'var(--ceo-card-bg)',
        border: `1px solid ${isSelected ? statusColor : 'var(--ceo-border)'}`,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}
    >
      <ProgressRing progress={objective.progress} size={48} strokeWidth={4} color={statusColor} />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--ceo-text-primary)' }}>{objective.title}</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="text-xs" style={{ color: statusColor, fontWeight: 700, textTransform: 'uppercase' }}>
            {objective.status}
          </span>
          <span className="ceo-text-muted text-xs">• {objective.owner}</span>
        </div>
      </div>
    </div>
  );
};

const KeyResultBar = ({ kr }) => {
  const pct = Math.min((kr.current / kr.target) * 100, 100);
  
  return (
    <div style={{ background: 'var(--ceo-card-bg)', border: '1px solid var(--ceo-border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
      <div className="flex-between mb-3">
        <h4 style={{ margin: 0, fontSize: '15px' }}>{kr.title}</h4>
        <div style={{ background: 'var(--kr-bar-bg)', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, color: 'var(--cascade-link-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LinkIcon size={12} /> {kr.linkedSprint || 'Link to Sprint'}
        </div>
      </div>
      
      <div className="flex-between mb-2 text-sm">
        <span className="ceo-text-secondary">Progress</span>
        <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{kr.current} / {kr.target} {kr.unit}</span>
      </div>
      
      <div style={{ width: '100%', height: '8px', background: 'var(--kr-bar-bg)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--ceo-purple)', transition: 'width 1s ease-out' }} />
      </div>
    </div>
  );
};


// --- Main Page Component ---

const OKRs = () => {
  const [selectedOkrId, setSelectedOkrId] = useState(1);
  const [quarter, setQuarter] = useState('Q3');

  const okrs = [
    { 
      id: 1, 
      title: "Launch Client Portal MVP", 
      status: "On Track", 
      owner: "Engineering",
      progress: 68,
      krs: [
        { id: 101, title: "Achieve 95% test coverage on backend APIs", current: 85, target: 95, unit: "%", linkedSprint: "Sprint 42 (API)" },
        { id: 102, title: "Complete 5 user acceptance testing sessions", current: 3, target: 5, unit: "sessions", linkedSprint: "Sprint 43 (UAT)" },
        { id: 103, title: "Reduce API response time to <200ms", current: 240, target: 200, unit: "ms", linkedSprint: null }
      ]
    },
    { 
      id: 2, 
      title: "Scale Enterprise Sales", 
      status: "At Risk", 
      owner: "Sales",
      progress: 35,
      krs: [
        { id: 201, title: "Close 3 Enterprise Deals", current: 1, target: 3, unit: "deals", linkedSprint: null },
        { id: 202, title: "Generate $500k in Pipeline", current: 200000, target: 500000, unit: "$", linkedSprint: null }
      ]
    },
    { 
      id: 3, 
      title: "Improve Employee Retention", 
      status: "Completed", 
      owner: "HR",
      progress: 100,
      krs: [
        { id: 301, title: "Rollout flexible work policy", current: 1, target: 1, unit: "policy", linkedSprint: "HR Q2 Sprint" },
        { id: 302, title: "Reduce attrition rate below 5%", current: 4.2, target: 5, unit: "%", linkedSprint: null }
      ]
    }
  ];

  const selectedOkr = okrs.find(o => o.id === selectedOkrId);

  return (
    <div className="ceo-module-container">
      <div className="mb-6">
        <h1 className="text-white tracking-tight" style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>Strategy & OKRs</h1>
        <p className="ceo-text-muted mt-1" style={{ margin: '4px 0 0 0' }}>Align company goals with daily execution</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gridTemplateRows: '52px 1fr', gap: '24px', height: 'calc(100vh - 180px)' }}>
        
        {/* Toolbar */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
              <button 
                key={q}
                className={`ceo-btn ${quarter === q ? 'ceo-btn-primary' : ''}`} 
                style={{ padding: '6px 16px', border: 'none', borderRadius: '6px' }}
                onClick={() => setQuarter(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px' }}>
            <span className="text-sm font-semibold">2026</span>
            <ChevronDown size={14} color="var(--ceo-text-muted)" />
          </div>
          <div style={{ flex: 1 }} />
          <button className="ceo-btn ceo-btn-primary"><Plus size={16} /> New Objective</button>
        </div>

        {/* OKR List */}
        <div style={{ overflowY: 'auto', paddingRight: '8px' }}>
          {okrs.map(okr => (
            <OkrObjectiveCard 
              key={okr.id} 
              objective={okr} 
              isSelected={selectedOkrId === okr.id} 
              onClick={() => setSelectedOkrId(okr.id)} 
            />
          ))}
        </div>

        {/* OKR Detail Panel */}
        <div className="ceo-premium-card ceo-animate-fade" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {selectedOkr ? (
            <>
              <div className="flex-between mb-6 pb-6" style={{ borderBottom: '1px solid var(--ceo-border)' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>{selectedOkr.title}</h2>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className="ceo-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{selectedOkr.owner}</span>
                    <span className="ceo-text-muted text-sm">Target: End of {quarter} 2026</span>
                  </div>
                </div>
                <ProgressRing progress={selectedOkr.progress} size={80} strokeWidth={6} color={
                  selectedOkr.status === 'On Track' ? 'var(--okr-on-track)' : 
                  selectedOkr.status === 'At Risk' ? 'var(--okr-at-risk)' : 
                  selectedOkr.status === 'Behind' ? 'var(--okr-behind)' : 'var(--okr-completed)'
                } />
              </div>

              <h3 className="ceo-section-title" style={{ fontSize: '16px', marginBottom: '20px' }}>Key Results (KRs)</h3>
              
              <div style={{ flex: 1 }}>
                {selectedOkr.krs.map(kr => (
                  <KeyResultBar key={kr.id} kr={kr} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%' }}>
              <Target size={48} color="var(--ceo-text-muted)" className="mb-4" />
              <p className="ceo-text-muted">Select an objective to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OKRs;
