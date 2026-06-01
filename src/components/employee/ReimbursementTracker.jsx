import React from 'react';
import { Check, X, Clock, HelpCircle } from 'lucide-react';

export default function ReimbursementTracker({ claim, onCancelClaim }) {
  if (!claim) {
    return (
      <div 
        style={{
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '13px',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        Select an expense claim from the table to view real-time reimbursement tracker status.
      </div>
    );
  }

  // Define steps
  const steps = [
    { 
      key: 'tl', 
      label: 'TL Approved', 
      status: claim.tlStatus || 'pending', 
      subLabels: { pending: 'PENDING', approved: 'APPROVED', denied: 'DENIED' }
    },
    { 
      key: 'hr', 
      label: 'HR Processed', 
      status: claim.hrStatus || 'pending', 
      subLabels: { pending: 'PENDING', approved: 'APPROVED', denied: 'DENIED' }
    },
    { 
      key: 'payroll', 
      label: 'Added to Payslip/Paid', 
      status: claim.payrollStatus || 'pending', 
      subLabels: { pending: 'PENDING', reimbursed: 'PAID', approved: 'PAID', denied: 'DENIED' }
    }
  ];

  // Helper check to determine if a step is active/unlocked
  const isStepActive = (index) => {
    if (index === 0) return true;
    const prevStep = steps[index - 1];
    return prevStep.status === 'approved' || prevStep.status === 'reimbursed';
  };

  const getStatusIcon = (status, active) => {
    if (!active) return <Clock size={14} strokeWidth={2.5} />;
    
    switch (status) {
      case 'approved':
      case 'reimbursed':
        return <Check size={14} strokeWidth={3} />;
      case 'denied':
        return <X size={14} strokeWidth={3} />;
      case 'pending':
      default:
        return <Clock size={14} strokeWidth={2.5} />;
    }
  };

  const getStatusColors = (status, active) => {
    if (!active) {
      return {
        border: 'var(--border-color)',
        bg: 'var(--bg-secondary)', // Opaque to hide connection line behind circle
        color: 'var(--text-muted)',
        line: 'var(--border-color)'
      };
    }

    switch (status) {
      case 'approved':
      case 'reimbursed':
        return {
          border: '#10b981',
          bg: 'var(--bg-secondary)', // Opaque to hide connection line behind circle
          color: '#10b981',
          line: '#10b981'
        };
      case 'denied':
        return {
          border: '#ef4444',
          bg: 'var(--bg-secondary)', // Opaque to hide connection line behind circle
          color: '#ef4444',
          line: '#ef4444'
        };
      case 'pending':
      default:
        return {
          border: '#f59e0b',
          bg: 'var(--bg-secondary)', // Opaque to hide connection line behind circle
          color: '#f59e0b',
          line: 'var(--border-color)'
        };
    }
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(claim.amount);

  // Status Note Text builder
  const getStatusNote = () => {
    if (claim.payrollStatus === 'reimbursed') {
      return 'This expense claim has been fully processed and added to your next payslip. Payment is complete.';
    }
    if (claim.payrollStatus === 'pending' && claim.hrStatus === 'approved') {
      return 'HR processed the claim. Finance desk is queueing the payout to be added on your next payslip.';
    }
    if (claim.hrStatus === 'pending' && claim.tlStatus === 'approved') {
      return 'Team Lead approved. Awaiting final audit processing and confirmation by HR Admin.';
    }
    if (claim.tlStatus === 'pending') {
      return 'Awaiting Team Lead review. Submissions are processed in weekly cycles.';
    }
    if (claim.tlStatus === 'denied' || claim.hrStatus === 'denied' || claim.payrollStatus === 'denied') {
      return 'This expense claim request has been denied. Check comments or contact your manager.';
    }
    return '';
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Header Info */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
            Reimbursement Lifecycle
          </h4>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Claim ID: #{claim.id} • Submitted on {claim.date}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <strong style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formattedAmount}
          </strong>
          
          {claim.tlStatus === 'pending' && onCancelClaim && (
            <button 
              type="button"
              onClick={() => onCancelClaim(claim.id)} 
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
            >
              <X size={12} strokeWidth={2.5} /> Cancel Claim
            </button>
          )}
        </div>
      </div>

      {/* 3-Step Visual Progress Bar */}
      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 0 16px 0'
        }}
      >
        {/* Precise Connection Line 1 (TL to HR) */}
        <div 
          style={{
            position: 'absolute',
            top: '28px', // centered with 36px height circles (10px padding + 18px radius)
            left: '16.67%',
            width: '33.33%',
            height: '2px',
            backgroundColor: getStatusColors(steps[1].status, isStepActive(1)).line,
            zIndex: 1,
            transition: 'background-color 0.3s ease'
          }}
        />

        {/* Precise Connection Line 2 (HR to Payroll) */}
        <div 
          style={{
            position: 'absolute',
            top: '28px', // centered with 36px height circles (10px padding + 18px radius)
            left: '50%',
            width: '33.33%',
            height: '2px',
            backgroundColor: getStatusColors(steps[2].status, isStepActive(2)).line,
            zIndex: 1,
            transition: 'background-color 0.3s ease'
          }}
        />

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const active = isStepActive(idx);
          const colors = getStatusColors(step.status, active);
          const subText = step.subLabels[step.status] || 'PENDING';
          
          return (
            <div 
              key={step.key} 
              style={{
                width: '33.33%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
                position: 'relative'
              }}
            >
              {/* Node Circle */}
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: active ? '0 2px 4px rgba(0,0,0,0.02)' : 'none'
                }}
              >
                {getStatusIcon(step.status, active)}
              </div>

              {/* Step Title Label */}
              <span 
                style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  marginTop: '10px', 
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {step.label}
              </span>

              {/* Step Sub-label (Status in capitals) */}
              <span 
                style={{ 
                  fontSize: '9px', 
                  color: 'var(--text-muted)',
                  marginTop: '3px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}
              >
                {subText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Styled Status Note Box (Matches screenshot) */}
      <div 
        style={{
          marginTop: '8px',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <span 
          style={{ 
            fontSize: '12px', 
            fontWeight: '700', 
            color: '#10b981', // green label
            whiteSpace: 'nowrap' 
          }}
        >
          Status Note:
        </span>
        <span 
          style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.5' 
          }}
        >
          {getStatusNote()}
        </span>
      </div>
    </div>
  );
}
