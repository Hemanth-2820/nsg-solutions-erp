import React, { useState } from 'react';
import { Clock, Calendar, FileText } from 'lucide-react';
import { ApprovedTimesheetsView } from '../../hr/modules/timesheets/ApprovedTimesheetsView';
import { AttendanceRegisterView } from '../../hr/modules/attendance/AttendanceRegisterView';
import { LeaveManagementView } from '../../hr/modules/leave/LeaveManagementView';
import styles from '../../tl/Approvals/approvals.module.css';

const ApprovalHistory = ({ queryParams, setQueryParams, currentUser }) => {
  const [activeTab, setActiveTab] = useState('timesheets');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.approvalsContainer}>
      <div className={styles.topTabs} style={{ marginBottom: '24px' }}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'timesheets' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('timesheets')}
        >
          <Clock size={16} /> Timesheets History
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'leaves' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('leaves')}
        >
          <Calendar size={16} /> Leaves History
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'attendance' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabChange('attendance')}
        >
          <FileText size={16} /> Attendance History
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '600px', overflow: 'hidden' }}>
        {activeTab === 'timesheets' && <ApprovedTimesheetsView queryParams={queryParams} setQueryParams={setQueryParams} currentUser={currentUser} />}
        {activeTab === 'leaves' && <LeaveManagementView queryParams={queryParams} setQueryParams={setQueryParams} currentUser={currentUser} />}
        {activeTab === 'attendance' && <AttendanceRegisterView queryParams={queryParams} setQueryParams={setQueryParams} currentUser={currentUser} />}
      </div>
    </div>
  );
};

export default ApprovalHistory;
