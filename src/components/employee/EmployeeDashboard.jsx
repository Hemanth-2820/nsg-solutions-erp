import { useState, useEffect } from 'react';
import './Employee.css';

const CURRENT_EMPLOYEE_ID = 102; // Jane Smith (logged-in employee)

export default function EmployeeDashboard({ db, onUpdateDb, setActiveTab, currentUser }) {
  const employeeId = currentUser?.id || CURRENT_EMPLOYEE_ID;
  const employee = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    designation: currentUser.designation || 'Senior Developer',
    department: currentUser.department || 'Engineering',
    employeeCode: currentUser.emp_id || 'NSG-EMP-102'
  } : ((db?.employees || []).find(e => e.id === employeeId) || {
    name: 'Jane Smith',
    designation: 'Senior Developer',
    department: 'Engineering',
    employeeCode: 'NSG-EMP-102'
  });

  // ── Clock-in state ────────────────────────────────────────────────
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [elapsed, setElapsed] = useState('');
  const [clockBusy, setClockBusy] = useState(false);

  // Live elapsed timer
  useEffect(() => {
    if (!clockedIn || !clockInTime) { setElapsed(''); return; }
    const tick = () => {
      const diffMs = Date.now() - clockInTime;
      const h = Math.floor(diffMs / 3_600_000);
      const m = Math.floor((diffMs % 3_600_000) / 60_000);
      const s = Math.floor((diffMs % 60_000) / 1_000);
      setElapsed(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [clockedIn, clockInTime]);

  const handleClockIn = () => {
    setClockBusy(true);
    setTimeout(() => {
      setClockedIn(true);
      setClockInTime(Date.now());
      setClockBusy(false);
    }, 600);
  };

  const handleClockOut = () => {
    setClockBusy(true);
    setTimeout(() => {
      setClockedIn(false);
      setClockInTime(null);
      setElapsed('');
      setClockBusy(false);
    }, 600);
  };

  // ── Greeting ─────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const isLate = hour >= 10 && !clockedIn;

  // ── Tasks for this employee ───────────────────────────────────────
  const myTasks = (db?.tasks || []).filter(t => t.assignee === employee.name);
  const openTasks = myTasks.filter(t => t.status !== 'done');
  const doneTasks = myTasks.filter(t => t.status === 'done');

  // ── Leave balance ─────────────────────────────────────────────────
  const myLeave = (db?.leaveBalances || []).find(b => b.employee_id === employeeId);

  // ── Payslip ───────────────────────────────────────────────────────
  const myPayslips = (db?.payslips || []).filter(p => p.employee_id === employeeId);
  const latestPayslip = myPayslips.sort((a, b) => (b.period || '').localeCompare(a.period || ''))[0];

  // ── Assets ───────────────────────────────────────────────────────
  const myAssets = (db?.assets || []).filter(a => a.employee_id === employeeId);

  // ── Channels (unread badge) ───────────────────────────────────────
  const myChannels = (db?.chatChannels || []).filter(c => c.members && c.members.includes(String(employeeId)));

  // ── Derived leave statistics ──────────────────────────────────────
  const clLeft = myLeave?.CL ?? 12;
  const slLeft = myLeave?.SL ?? 8;
  const elLeft = myLeave?.EL ?? 15;
  const totalLeft = clLeft + slLeft + elLeft;
  const totalUsed = (12 - clLeft) + (8 - slLeft) + (15 - elLeft);

  // ── Pending actions ───────────────────────────────────────────────
  const [doneActions, setDoneActions] = useState({});
  const pendingActions = [
    { id: 'ts', label: 'Submit weekly timesheet', sub: 'Due: End of day today', tab: 'timesheet' },
    { id: 'lv', label: 'Review leave balance', sub: `${totalUsed} days used`, tab: 'leave' },
    { id: 'exp', label: 'File pending expenses', sub: 'Upload receipts and submit claims', tab: 'expenses' },
    { id: 'asset', label: 'Review asset NOC status', sub: `${myAssets.length} assigned asset(s)`, tab: 'assets' },
  ];

  // ── Notifications ─────────────────────────────────────────────────
  const [notifRead, setNotifRead] = useState({});
  const notifications = [
    { id: 'n1', icon: '📋', msg: 'Your timesheet for Sprint 14 is pending HR review.', time: '10 min ago', unread: true },
    { id: 'n2', icon: '💬', msg: 'Sarah Jenkins (HR) sent a message in #grievance-room.', time: '35 min ago', unread: true },
    { id: 'n3', icon: '✅', msg: 'Your leave request for June 10 was approved.', time: '2 hrs ago', unread: false },
    { id: 'n4', icon: '💰', msg: `Payslip for ${latestPayslip?.period || 'May 2026'} is now available.`, time: 'Yesterday', unread: false },
    { id: 'n5', icon: '📦', msg: 'Asset NOC for Corporate MacBook Pro Silicon is pending.', time: '2 days ago', unread: false },
  ];

  // Priority color util
  const priorityClass = p => ({ high: 'emp-priority--high', medium: 'emp-priority--medium', low: 'emp-priority--low' }[p] || 'emp-priority--low');
  const statusStyle = s => {
    switch(s) {
      case 'in-progress': return { background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' };
      case 'pending':     return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' };
      case 'done':        return { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' };
      case 'blocked':     return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' };
      default:            return { background: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.25)' };
    }
  };

  return (
    <div className="component-container emp-root">
      {/* ── Page header ── */}
      <div className="component-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Your personal workspace — tasks, leave, payroll and communications at a glance.</p>
        </div>
      </div>

      <div className="emp-body">

        {/* ── Welcome banner ── */}
        <div className={`emp-welcome ${isLate ? 'emp-welcome--late' : ''}`}>
          <div className="emp-welcome__glow" />
          <div>
            {isLate && (
              <div className="emp-late-pill">⚠️ You haven't clocked in yet today</div>
            )}
            <p className="emp-welcome__greeting">{greeting},</p>
            <h2 className="emp-welcome__name">{employee.name} 👋</h2>
            <p className="emp-welcome__meta">
              {employee.designation} · {employee.department} · {employee.employeeCode || 'NSG-EMP-102'}
            </p>
          </div>
          <div className="emp-welcome__actions">
            <div className="emp-clockin-wrap">
              <button
                className={`emp-clockin-btn ${clockedIn ? 'emp-clockin-btn--out' : 'emp-clockin-btn--in'}`}
                onClick={clockedIn ? handleClockOut : handleClockIn}
                disabled={clockBusy}
                id="emp-clock-btn"
              >
                {clockBusy ? (
                  <span className="emp-spin" style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%' }} />
                ) : (
                  clockedIn ? '🔴' : '🟢'
                )}
                {clockedIn ? 'Clock Out' : 'Clock In'}
                {clockedIn && elapsed && (
                  <span className="emp-clockin-elapsed">{elapsed}</span>
                )}
              </button>
            </div>
            <button className="emp-quick-btn" onClick={() => setActiveTab('leave')}>🌴 Request Leave</button>
            <button className="emp-quick-btn" onClick={() => setActiveTab('messaging')}>💬 Messages
              {myChannels.length > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '9px', fontWeight: '700' }}>
                  {myChannels.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            {
              label: 'Open Tasks',
              value: openTasks.length,
              sub: `${doneTasks.length} completed`,
              color: '#60a5fa',
              icon: '📋',
              onClick: () => setActiveTab('tasks')
            },
            {
              label: 'Leave Balance',
              value: myLeave ? `${totalLeft} days` : 'N/A',
              sub: `${totalUsed} used this year`,
              color: '#10b981',
              icon: '🌴',
              onClick: () => setActiveTab('leave')
            },
            {
              label: 'Latest Payslip',
              value: latestPayslip ? `₹${(latestPayslip.net_pay || 0).toLocaleString('en-IN')}` : 'N/A',
              sub: latestPayslip?.period || 'Check payroll',
              color: '#fbbf24',
              icon: '💰',
              onClick: () => setActiveTab('payroll')
            },
            {
              label: 'My Channels',
              value: myChannels.length,
              sub: 'Active workspaces',
              color: '#a78bfa',
              icon: '💬',
              onClick: () => setActiveTab('messaging')
            }
          ].map(kpi => (
            <div
              key={kpi.label}
              className="emp-card"
              style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onClick={kpi.onClick}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{kpi.icon}</span>
                <span style={{ fontSize: 10, color: kpi.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Main body grid ── */}
        <div className="emp-grid">

          {/* ── Tasks ── */}
          <div className="emp-card emp-grid__tasks">
            <div className="emp-section-header" style={{ marginBottom: 14 }}>
              <div className="emp-section-header__left">
                <span style={{ fontSize: 16 }}>📋</span>
                <span className="emp-section-header__title">My Active Tasks</span>
                <span className="emp-badge-count" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>{openTasks.length}</span>
              </div>
              <button
                style={{ fontSize: 12, background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '5px 12px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                onClick={() => setActiveTab('tasks')}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {openTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  🎉 No open tasks — great job!
                </div>
              )}
              {openTasks.slice(0, 5).map(task => (
                <div key={task.id} className="emp-task-row">
                  <span className={`emp-priority ${priorityClass(task.priority)}`}>{task.priority}</span>
                  <div style={{ flex: 1 }}>
                    <div className="emp-task-title">{task.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {task.project} · Sprint: {task.sprint} · Due: {task.due}
                    </div>
                  </div>
                  <span className="emp-status-chip" style={statusStyle(task.status)}>{task.status.replace('-', ' ')}</span>
                </div>
              ))}
              {doneTasks.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 700 }}>✅ Completed</div>
                  {doneTasks.slice(0,2).map(task => (
                    <div key={task.id} className="emp-task-row" style={{ opacity: 0.5 }}>
                      <span className={`emp-priority ${priorityClass(task.priority)}`}>{task.priority}</span>
                      <div className="emp-task-title emp-task-title--done">{task.title}</div>
                      <span className="emp-status-chip" style={statusStyle(task.status)}>done</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── CEO Announcements ── */}
          <div className="emp-card" style={{ marginTop: 16 }}>
            <div className="emp-section-header" style={{ marginBottom: 14 }}>
              <div className="emp-section-header__left">
                <span style={{ fontSize: 16 }}>📢</span>
                <span className="emp-section-header__title">CEO Announcements</span>
                <span className="emp-badge-count" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                  {(db?.announcements || []).length}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(db?.announcements || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  No announcements yet.
                </div>
              ) : (
                (db?.announcements || []).slice(0, 3).map(ann => (
                  <div key={ann.id} style={{
                    padding: '14px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderLeft: ann.priority === 'Urgent' ? '4px solid #f87171' : '4px solid #60a5fa',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{ann.date}</span>
                      {ann.priority === 'Urgent' && (
                        <span style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 800 }}>URGENT</span>
                      )}
                    </div>
                    <strong style={{ fontSize: 13, color: '#fff' }}>{ann.title}</strong>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{ann.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Pending Actions ── */}
            <div className="emp-card">
              <div className="emp-section-header" style={{ marginBottom: 14 }}>
                <div className="emp-section-header__left">
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <span className="emp-section-header__title">Pending Actions</span>
                  <span className="emp-badge-count" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                    {pendingActions.filter(a => !doneActions[a.id]).length}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingActions.map(action => {
                  const done = !!doneActions[action.id];
                  return (
                    <div
                      key={action.id}
                      className={`emp-action-row ${done ? 'emp-action-row--done' : 'emp-action-row--active'}`}
                      style={{ borderColor: done ? 'rgba(16,185,129,0.25)' : 'var(--border-color)' }}
                      onClick={() => {
                        if (!done) setDoneActions(p => ({ ...p, [action.id]: true }));
                        if (action.tab && setActiveTab) setActiveTab(action.tab);
                      }}
                    >
                      <div className={`emp-action-checkbox ${done ? 'emp-action-checkbox--checked' : ''}`}
                        style={{ borderColor: done ? '#10b981' : 'var(--text-muted)' }}
                      >
                        {done && '✓'}
                      </div>
                      <div>
                        <p className={`emp-action-label ${done ? 'emp-action-label--done' : ''}`}>{action.label}</p>
                        <p className="emp-action-sub">{action.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Notifications ── */}
            <div className="emp-card">
              <div className="emp-section-header" style={{ marginBottom: 14 }}>
                <div className="emp-section-header__left">
                  <span style={{ fontSize: 16 }}>🔔</span>
                  <span className="emp-section-header__title">Notifications</span>
                  <span className="emp-badge-count" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                    {notifications.filter(n => n.unread && !notifRead[n.id]).length}
                  </span>
                </div>
                <button
                  style={{ fontSize: 11, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => {
                    const allRead = {};
                    notifications.forEach(n => { allRead[n.id] = true; });
                    setNotifRead(allRead);
                  }}
                >
                  Mark all read
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map(n => {
                  const isUnread = n.unread && !notifRead[n.id];
                  return (
                    <div
                      key={n.id}
                      className={`emp-notif-row ${isUnread ? 'emp-notif-row--unread' : 'emp-notif-row--read'}`}
                      onClick={() => setNotifRead(p => ({ ...p, [n.id]: true }))}
                    >
                      {isUnread && <div className="emp-notif-dot" />}
                      <span className="emp-notif-icon">{n.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p className={`emp-notif-msg ${!isUnread ? 'emp-notif-msg--read' : ''}`}>{n.msg}</p>
                        <p className="emp-notif-time">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Quick links ── */}
            <div className="emp-card">
              <div className="emp-section-header" style={{ marginBottom: 14 }}>
                <div className="emp-section-header__left">
                  <span style={{ fontSize: 16 }}>🚀</span>
                  <span className="emp-section-header__title">Quick Access</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'My Timesheet', icon: '⏱️', tab: 'timesheet' },
                  { label: 'Payslips', icon: '💰', tab: 'payroll' },
                  { label: 'Leave Request', icon: '🌴', tab: 'leave' },
                  { label: 'My Assets', icon: '💻', tab: 'assets' },
                  { label: 'Profile', icon: '👤', tab: 'profile' },
                  { label: 'Messaging', icon: '💬', tab: 'messaging' },
                ].map(item => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.15s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
