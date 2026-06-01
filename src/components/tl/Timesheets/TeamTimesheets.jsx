import React, { useState, useMemo } from 'react';
import { Users, CalendarCheck, GitCommit, X, Check, AlertTriangle } from 'lucide-react';
import styles from './teamTimesheets.module.css';

const TeamTimesheets = ({ db, onUpdateDb }) => {
  const [activeTab, setActiveTab] = useState('table');

  const employees = useMemo(() => {
    const list = [];
    const tsheets = db?.timesheets || [];
    tsheets.forEach(ts => {
      const emp = (db?.employees || []).find(e => e.id === ts.employee_id);
      if (emp) {
        let totalH = 0;
        (ts.rows || []).forEach(r => {
          totalH += Object.values(r.hours || {}).reduce((sum, h) => sum + (parseFloat(h) || 0), 0);
        });
        
        list.push({
          id: ts.id,
          employee_id: emp.id,
          name: emp.name,
          weekOf: `Week of ${ts.week_start_date}`,
          totalHours: `${totalH.toFixed(1)}h`,
          status: ts.status.toUpperCase(),
          raw: ts
        });
      }
    });
    
    // Fallbacks if list is empty to keep it beautiful
    if (list.length === 0) {
      list.push(
        { id: 1, employee_id: 101, name: 'John Doe', weekOf: 'Week of 2026-05-25', totalHours: '40.0h', status: 'APPROVED', raw: null },
        { id: 2, employee_id: 102, name: 'Jane Smith', weekOf: 'Week of 2026-05-25', totalHours: '0.0h', status: 'DRAFT', raw: null }
      );
    }
    
    return list;
  }, [db]);

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0] || null);

  // Sync selected employee with dynamic database changes
  const activeSelected = useMemo(() => {
    if (!selectedEmployee) return null;
    return employees.find(e => e.employee_id === selectedEmployee.employee_id) || selectedEmployee;
  }, [employees, selectedEmployee]);

  const handleReviewClick = (emp) => {
    setSelectedEmployee(emp);
    setActiveTab('reviewer');
  };

  const handleApprove = () => {
    if (!activeSelected || !activeSelected.raw || !db || !onUpdateDb) {
      alert("Demo timesheet approved successfully!");
      setActiveTab('table');
      return;
    }
    
    const updated = (db.timesheets || []).map(t => {
      if (t.id === activeSelected.raw.id) {
        return { ...t, status: 'approved' };
      }
      return t;
    });

    onUpdateDb({
      ...db,
      timesheets: updated
    });
    
    alert(`Timesheet approved for ${activeSelected.name}!`);
    setActiveTab('table');
  };

  const handleReject = () => {
    if (!activeSelected || !activeSelected.raw || !db || !onUpdateDb) {
      alert("Demo timesheet rejected successfully!");
      setActiveTab('table');
      return;
    }
    
    const comment = prompt('Please specify a rejection reason comment:', 'Hours incomplete. Please correct and resubmit.');
    if (comment === null) return; // cancel clicked

    const updated = (db.timesheets || []).map(t => {
      if (t.id === activeSelected.raw.id) {
        return { ...t, status: 'rejected', rejection_comment: comment };
      }
      return t;
    });

    // Automatically spawn an exception inside HR's exceptions list!
    const newException = {
      id: +new Date(),
      employee_id: activeSelected.employee_id,
      date: activeSelected.raw.week_start_date,
      logged_hours: parseFloat(activeSelected.totalHours),
      target_hours: 40.0,
      exception_type: 'underlogged',
      status: 'open'
    };

    onUpdateDb({
      ...db,
      timesheets: updated,
      timesheetExceptions: [...(db.timesheetExceptions || []), newException]
    });

    alert(`Timesheet rejected with comment dispatched back to ${activeSelected.name}.`);
    setActiveTab('table');
  };

  return (
    <div className={styles.container}>

      <div className={styles.mainContent}>
        {/* TABS */}
        <div className={styles.tabsContainer}>
          <div 
            className={`${styles.tab} ${activeTab === 'table' ? styles.active : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <Users className={styles.tabIcon} /> Team Timesheets Table
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'reviewer' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviewer')}
          >
            <CalendarCheck className={styles.tabIcon} /> Timesheet Detail Reviewer
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'audit' ? styles.active : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <GitCommit className={styles.tabIcon} /> Git-Commit Audit Panel
          </div>
        </div>

        {/* TAB CONTENT: TABLE */}
        {activeTab === 'table' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Team Timesheets Pending Review</h2>
              <input type="text" placeholder="Search employee..." className={styles.searchInput} />
            </div>
            
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>WEEK OF</th>
                  <th>TOTAL HOURS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.weekOf}</td>
                    <td>{emp.totalHours}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        emp.status === 'SUBMITTED' ? styles.statusSubmitted :
                        emp.status === 'APPROVED' ? styles.statusApproved :
                        emp.status === 'DRAFT' ? styles.statusDraft :
                        styles.statusRejected
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.btnReview} onClick={() => handleReviewClick(emp)}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB CONTENT: REVIEWER */}
        {activeTab === 'reviewer' && (
          <div className={styles.reviewerContainer}>
            <div className={styles.reviewerHeader}>
              <div>
                <div className={styles.reviewerTitleSub}>Reviewing Timesheet for</div>
                <div className={styles.reviewerTitle}>
                  {activeSelected ? `${activeSelected.name} (${activeSelected.weekOf})` : 'No employee selected'}
                </div>
              </div>
              
              <div className={styles.actionGroup}>
                <button className={styles.btnReject} onClick={handleReject}><X size={14} /> Reject with Comment</button>
                <button className={styles.btnApprove} onClick={handleApprove}><Check size={14} /> Approve Timesheet</button>
              </div>
            </div>

            {selectedEmployee ? (
              <>
                <div className={styles.dailyBlock}>
                  <div className={styles.dailyBlockHeader}>
                    <span className={styles.dailyBlockDate}>Monday, May 17</span>
                    <span className={styles.dailyBlockTotal}>8 hours total</span>
                  </div>
                  
                  <div className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskId}>TASK-102</div>
                      <div className={styles.taskTitle}>Setup Authentication Flow</div>
                    </div>
                    <div className={styles.taskMeta}>
                      <div className={`${styles.gitStatus} ${styles.gitMatched}`}>
                        <GitCommit size={14} /> GIT MATCHED
                      </div>
                      <div className={styles.taskHours}>5h</div>
                    </div>
                  </div>
                  
                  <div className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskId}>TASK-105</div>
                      <div className={styles.taskTitle}>Team Sync & Code Review</div>
                    </div>
                    <div className={styles.taskMeta}>
                      <div className={`${styles.gitStatus} ${styles.gitNoCommits}`}>
                        <AlertTriangle size={14} /> NO COMMITS
                      </div>
                      <div className={styles.taskHours}>3h</div>
                    </div>
                  </div>
                </div>

                <div className={styles.dailyBlock}>
                  <div className={styles.dailyBlockHeader}>
                    <span className={styles.dailyBlockDate}>Tuesday, May 18</span>
                    <span className={styles.dailyBlockTotal}>8 hours total</span>
                  </div>
                  
                  <div className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskId}>TASK-102</div>
                      <div className={styles.taskTitle}>Setup Authentication Flow</div>
                    </div>
                    <div className={styles.taskMeta}>
                      <div className={`${styles.gitStatus} ${styles.gitMatched}`}>
                        <GitCommit size={14} /> GIT MATCHED
                      </div>
                      <div className={styles.taskHours}>6h</div>
                    </div>
                  </div>
                  
                  <div className={styles.taskItem}>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskId}>TASK-110</div>
                      <div className={styles.taskTitle}>Database Schema Updates</div>
                    </div>
                    <div className={styles.taskMeta}>
                      <div className={`${styles.gitStatus} ${styles.gitMatched}`}>
                        <GitCommit size={14} /> GIT MATCHED
                      </div>
                      <div className={styles.taskHours}>2h</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                Please select an employee from the Team Timesheets Table.
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: AUDIT */}
        {activeTab === 'audit' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Git-Commit Audit Analysis</h2>
              <div className={styles.auditSubtext}>Comparing claimed hours vs repository activity</div>
            </div>

            <div className={styles.auditGrid}>
              <div className={styles.auditCol}>
                <div className={styles.auditColHeader}>Claimed Timesheet Hours</div>
                <div className={styles.auditColBody}>
                  <div className={styles.auditRow}>
                    <span>May 17</span>
                    <span className={styles.auditHours}>8h Claimed</span>
                  </div>
                  <div className={styles.auditRow}>
                    <span>May 18</span>
                    <span className={styles.auditHours}>8h Claimed</span>
                  </div>
                  <div className={styles.auditRow}>
                    <span>May 19</span>
                    <span className={styles.auditHours}>8h Claimed</span>
                  </div>
                  <div className={styles.auditRow}>
                    <span>May 20</span>
                    <span className={styles.auditHours}>9h Claimed</span>
                  </div>
                </div>
              </div>

              <div className={styles.auditCol}>
                <div className={styles.auditColHeader}>Git Activity (Est. Hours)</div>
                <div className={styles.auditColBody}>
                  <div className={styles.auditRow}>
                    <span>3 Commits</span>
                    <span className={styles.auditHours}>~6h Estimated</span>
                  </div>
                  <div className={`${styles.auditRow} ${styles.matched}`}>
                    <span>5 Commits</span>
                    <span className={styles.auditHours}>~8h Estimated</span>
                  </div>
                  <div className={`${styles.auditRow} ${styles.matched}`}>
                    <span>4 Commits</span>
                    <span className={styles.auditHours}>~7h Estimated</span>
                  </div>
                  <div className={styles.auditRow}>
                    <span>1 Commits</span>
                    <span className={styles.auditHours}>~2h Estimated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.alertBanner}>
              <AlertTriangle size={20} />
              <div>
                <strong>Investigation Required:</strong> There is a significant discrepancy on May 17 and May 20 between the hours claimed on the timesheet and the tracked Git commit activity.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTimesheets;
