import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import styles from '../../tl/Approvals/approvals.module.css';
import { Calendar, FileText, HelpCircle, UserMinus, Package, AlertTriangle, MapPin, Check, X, Clock } from 'lucide-react';

const EmploymentApprovals = () => {
  const [activeTab, setActiveTab] = useState('leave');
  const [toast, setToast] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  const handleAction = async (id, actionType) => {
    const actionTxt = actionType === 'approve' ? 'Approved' : 'Rejected';
    setToast({ message: `Request ${actionTxt} Successfully!`, type: actionType === 'approve' ? 'success' : 'error' });
    if (selectedId === id) setSelectedId(null);
  };

  // Mock Data
  const leaves = [
    { id: 1, employee: 'prasad', type: 'Casual Leave', days: 2, dates: '2026-06-25 – 2026-06-26', reason: 'Personal work', status: 'pending' },
    { id: 2, employee: 'vivek1', type: 'Sick Leave', days: 1, dates: '2026-06-20 – 2026-06-20', reason: 'Fever', status: 'pending', overlapWarning: 'Conflicts with project deadline' }
  ];



  const helpRequests = [
    { id: 1, employee: 'vivek2', issueType: 'Hardware', description: 'Need a new monitor, current one is flickering.', date: '2026-06-18' },
    { id: 2, employee: 'vivek1', issueType: 'HR Policy', description: 'Clarification regarding maternity leave policy.', date: '2026-06-17' }
  ];

  const resignations = [
    { id: 1, employee: 'John Doe', lastDay: '2026-07-15', reason: 'Better opportunity', noticePeriod: '30 Days' }
  ];

  const assetRequests = [
    { id: 1, employee: 'prasad', assetType: 'MacBook Pro M3', reason: 'Need better performance for Docker builds', cost: '$2000' }
  ];

  let currentList = [];
  let selectedItem = null;

  if (activeTab === 'leave') {
    currentList = leaves;
    selectedItem = leaves.find(l => l.id === selectedId);
  } else if (activeTab === 'help') {
    currentList = helpRequests;
    selectedItem = helpRequests.find(h => h.id === selectedId);
  } else if (activeTab === 'resignation') {
    currentList = resignations;
    selectedItem = resignations.find(r => r.id === selectedId);
  } else if (activeTab === 'assets') {
    currentList = assetRequests;
    selectedItem = assetRequests.find(a => a.id === selectedId);
  }

  // Details Renderers
  const renderLeaveDetails = (item) => (
    <>
      <div className={styles.detailHeader}>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#0f172a' }}>{item.employee}</h2>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>{item.type} • {item.days} Days</span>
      </div>
      
      {item.overlapWarning && (
        <div className={styles.warningBox}>
          <AlertTriangle size={18} />
          <div>
            <strong>Calendar Conflict Detected</strong>
            <p style={{ margin: '4px 0 0 0' }}>{item.overlapWarning}</p>
          </div>
        </div>
      )}

      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Requested Dates</span>
        <div className={styles.detailValue}>{item.dates}</div>
      </div>
      
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Reason</span>
        <div className={styles.detailValue}>{item.reason}</div>
      </div>
    </>
  );

  const renderHelpDetails = (item) => (
    <>
      <div className={styles.detailHeader}>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#0f172a' }}>{item.employee}</h2>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Help Request • {item.issueType}</span>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Date Submitted</span>
        <div className={styles.detailValue}>{item.date}</div>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Description</span>
        <div className={styles.detailValue}>{item.description}</div>
      </div>
    </>
  );

  const renderResignationDetails = (item) => (
    <>
      <div className={styles.detailHeader}>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#0f172a' }}>{item.employee}</h2>
        <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>Resignation Submitted</span>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Notice Period</span>
        <div className={styles.detailValue}>{item.noticePeriod}</div>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Proposed Last Day</span>
        <div className={styles.detailValue} style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.lastDay}</div>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Reason</span>
        <div className={styles.detailValue}>{item.reason}</div>
      </div>
    </>
  );

  const renderAssetDetails = (item) => (
    <>
      <div className={styles.detailHeader}>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#0f172a' }}>{item.employee}</h2>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Asset Request • {item.assetType}</span>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Estimated Cost</span>
        <div className={styles.detailValue} style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>{item.cost}</div>
      </div>
      <div className={styles.detailSection}>
        <span className={styles.detailLabel}>Reason / Justification</span>
        <div className={styles.detailValue}>{item.reason}</div>
      </div>
    </>
  );

  return (
    <div className={styles.approvalsContainer}>
      {/* TABS */}
      <div className={styles.topTabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'leave' ? styles.tabBtnActive : ''}`} onClick={() => handleTabChange('leave')}>
          <Calendar size={16} /> Leave {leaves.length > 0 && <span className={styles.badge}>{leaves.length}</span>}
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'help' ? styles.tabBtnActive : ''}`} onClick={() => handleTabChange('help')}>
          <HelpCircle size={16} /> Help {helpRequests.length > 0 && <span className={styles.badge}>{helpRequests.length}</span>}
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'resignation' ? styles.tabBtnActive : ''}`} onClick={() => handleTabChange('resignation')}>
          <UserMinus size={16} /> Resignation {resignations.length > 0 && <span className={styles.badge}>{resignations.length}</span>}
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'assets' ? styles.tabBtnActive : ''}`} onClick={() => handleTabChange('assets')}>
          <Package size={16} /> Asset Requests {assetRequests.length > 0 && <span className={styles.badge}>{assetRequests.length}</span>}
        </button>
      </div>

      {/* 2-PANE LAYOUT */}
      <div className={styles.mainGrid}>
        
        {/* LIST PANEL */}
        <div className={styles.listPanel}>
          <div className={styles.panelTitle}>Pending Requests</div>
          
          {currentList.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>No pending requests in this queue.</div>
          ) : (
            currentList.map(item => (
              <div 
                key={item.id} 
                className={`${styles.listItem} ${selectedId === item.id ? styles.listItemSelected : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className={styles.itemHeader}>
                  <span className={styles.employeeName}>{item.employee}</span>
                </div>
                
                <div className={styles.itemDesc}>
                  {activeTab === 'leave' && `${item.type} (${item.days} days)`}
                  {activeTab === 'help' && `${item.issueType}`}
                  {activeTab === 'resignation' && `Last Day: ${item.lastDay}`}
                  {activeTab === 'assets' && `${item.assetType}`}
                </div>
                
                <div className={styles.itemActions}>
                  <button className={styles.btnApprove} onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'approve'); }}>Approve</button>
                  <button className={styles.btnReject} onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'reject'); }}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DETAIL PANEL */}
        <div className={styles.detailPanel}>
          <div className={styles.panelTitle}>Request Details</div>
          
          {!selectedItem ? (
            <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Select a request from the list to view details.</div>
          ) : (
            <div>
              {activeTab === 'leave' && renderLeaveDetails(selectedItem)}
              {activeTab === 'help' && renderHelpDetails(selectedItem)}
              {activeTab === 'resignation' && renderResignationDetails(selectedItem)}
              {activeTab === 'assets' && renderAssetDetails(selectedItem)}
              
              <div className={styles.bigActionRow}>
                <button className={styles.btnApprove} onClick={() => handleAction(selectedId, 'approve')}>Approve Request</button>
                <button className={styles.btnReject} onClick={() => handleAction(selectedId, 'reject')}>Reject Request</button>
              </div>
            </div>
          )}
        </div>

      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          fontWeight: 500,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {toast.type === 'success' ? <Check size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default EmploymentApprovals;
