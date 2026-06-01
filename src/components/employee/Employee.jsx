import React, { useState, useEffect } from 'react';
import {
  Clock, LogOut, FileText, CalendarPlus,
  CheckSquare, Bell, ChevronRight, AlertTriangle,
  MapPin, Loader, TrendingUp, Circle,
} from 'lucide-react';
import './Employee.css';
import Attendance from './Attendance';
import Leave from './Leave';
import Tasks from './Tasks';
import Timesheet from './Timesheet';
import Payroll from './Payroll';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_TASKS = [
  { id: 1, title: 'Finalize Q3 sprint report',  priority: 'high',   status: 'in-progress', due: 'Today'     },
  { id: 2, title: 'Code review – auth module',   priority: 'medium', status: 'pending',     due: 'Today'     },
  { id: 3, title: 'Update Jira board tickets',   priority: 'low',    status: 'pending',     due: 'Today'     },
  { id: 4, title: 'Team sync meeting notes',     priority: 'medium', status: 'done',        due: 'Yesterday' },
  { id: 5, title: 'Deploy staging build v2.4',   priority: 'high',   status: 'blocked',     due: 'Tomorrow'  },
];

const MOCK_ACTIONS = [
  { id: 1, label: 'Timesheet due',     sub: 'Submit by 6 PM today',       type: 'urgent'  },
  { id: 2, label: 'Document pending',  sub: 'NDA form awaits signature',   type: 'warning' },
  { id: 3, label: 'Leave balance low', sub: '2 days remaining this year',  type: 'info'    },
];

const MOCK_NOTIFS = [
  { id: 1, icon: '🎯', msg: 'Sprint 14 kicked off — 6 tasks assigned', time: '10 min ago', read: false },
  { id: 2, icon: '✅', msg: 'Leave request approved by Sarah M.',       time: '1 hr ago',   read: false },
  { id: 3, icon: '💬', msg: 'Ravi commented on your PR #204',          time: '2 hrs ago',  read: true  },
  { id: 4, icon: '📋', msg: 'Monthly payslip for May is ready',        time: 'Yesterday',  read: true  },
];

// ─── Shared atoms ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count, accent }) {
  return (
    <div className="emp-section-header">
      <div className="emp-section-header__left">
        <span style={{ color: accent }}>{icon}</span>
        <span className="emp-section-header__title">{title}</span>
      </div>
      {count > 0 && (
        <span
          className="emp-badge-count"
          style={{ background: `${accent}22`, color: accent }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function ViewAllLink({ label }) {
  return (
    <div className="emp-view-all">
      <button>
        {label} <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─── Priority badge & Status chip ────────────────────────────────────────────

function PriorityBadge({ level }) {
  return (
    <span className={`emp-priority emp-priority--${level}`}>
      {level === 'medium' ? 'Med' : level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

const STATUS_COLORS = {
  'in-progress': '#60a5fa',
  pending:       '#a78bfa',
  done:          '#34d399',
  blocked:       '#f87171',
};
const STATUS_LABELS = {
  'in-progress': 'In Progress',
  pending:       'Pending',
  done:          'Done',
  blocked:       'Blocked',
};

function StatusChip({ status, onClick }) {
  const color = STATUS_COLORS[status] || '#a78bfa';
  return (
    <span
      className="emp-status-chip"
      style={{ color, borderColor: `${color}40` }}
      onClick={onClick}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ─── Clock-in button ─────────────────────────────────────────────────────────

function ClockInBtn({ clockedIn, onClockIn, gpsStatus }) {
  const loading = gpsStatus === 'fetching';
  const denied  = gpsStatus === 'denied';

  return (
    <div className="emp-clockin-wrap">
      <button
        className={`emp-clockin-btn ${clockedIn ? 'emp-clockin-btn--out' : 'emp-clockin-btn--in'}`}
        onClick={onClockIn}
        disabled={loading}
      >
        {loading
          ? <Loader size={15} className="emp-spin" />
          : clockedIn
            ? <LogOut size={15} />
            : <Clock size={15} />
        }
        {loading ? 'Locating…' : clockedIn ? 'Clock Out' : 'Clock In'}
        {clockedIn && <span className="emp-clockin-elapsed">04:22</span>}
      </button>

      {denied && (
        <div className="emp-gps-tooltip">
          <MapPin size={12} /> GPS denied — WFH attendance may not be accepted
        </div>
      )}
    </div>
  );
}

// ─── Quick action button ──────────────────────────────────────────────────────

function QuickBtn({ icon, label }) {
  return (
    <button className="emp-quick-btn">
      {icon}{label}
    </button>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────

function WelcomeBanner({ clockedIn, onClockIn, gpsStatus, isLate, currentTime }) {
  return (
    <div className={`emp-welcome ${isLate ? 'emp-welcome--late' : ''}`}>
      <div className="emp-welcome__glow" />

      <div>
        {isLate && (
          <div className="emp-late-pill">
            <AlertTriangle size={13} />
            You're late — attendance may be flagged
          </div>
        )}
        <p className="emp-welcome__greeting">{getGreeting()},</p>
        <h2 className="emp-welcome__name">Rahul Sangappa Navi 👋</h2>
        <p className="emp-welcome__meta">
          {currentTime} · Software Engineer · Team Nexus
        </p>
      </div>

      <div className="emp-welcome__actions">
        <ClockInBtn clockedIn={clockedIn} onClockIn={onClockIn} gpsStatus={gpsStatus} />
        <QuickBtn icon={<CalendarPlus size={15} />} label="Apply Leave" />
        <QuickBtn icon={<FileText size={15} />}     label="Log Hours"   />
      </div>
    </div>
  );
}

// ─── Task row ────────────────────────────────────────────────────────────────

function TaskRow({ task, onUpdate }) {
  const [open, setOpen] = useState(false);
  const statuses = ['pending', 'in-progress', 'done', 'blocked'];

  return (
    <div className="emp-task-row">
      <Circle size={14} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />

      <span className={`emp-task-title ${task.status === 'done' ? 'emp-task-title--done' : ''}`}>
        {task.title}
      </span>

      <PriorityBadge level={task.priority} />

      <div style={{ position: 'relative' }}>
        <StatusChip status={task.status} onClick={() => setOpen(o => !o)} />

        {open && (
          <div className="emp-status-dropdown">
            {statuses.map(s => (
              <div
                key={s}
                className="emp-status-dropdown__item"
                onClick={() => { onUpdate(task.id, s); setOpen(false); }}
              >
                {STATUS_LABELS[s]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Today's Tasks ────────────────────────────────────────────────────────────

function TodayTasksList({ tasks }) {
  const [items, setItems] = useState(tasks.slice(0, 5));

  function updateStatus(id, next) {
    setItems(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
  }

  return (
    <div className="emp-card">
      <SectionHeader icon={<TrendingUp size={15} />} title="Today's Tasks" count={items.length} accent="#60a5fa" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {items.map(task => (
          <TaskRow key={task.id} task={task} onUpdate={updateStatus} />
        ))}
      </div>
      <ViewAllLink label="View all tasks" />
    </div>
  );
}

// ─── Pending Actions ──────────────────────────────────────────────────────────

const ACCENT_MAP = { urgent: '#f87171', warning: '#fbbf24', info: '#60a5fa' };

function PendingActionsChecklist({ actions }) {
  const [done, setDone] = useState([]);
  const toggle = id => setDone(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]);

  return (
    <div className="emp-card">
      <SectionHeader
        icon={<CheckSquare size={15} />}
        title="Pending Actions"
        count={actions.length - done.length}
        accent="#a78bfa"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {actions.map(a => {
          const isDone  = done.includes(a.id);
          const accent  = ACCENT_MAP[a.type] || '#60a5fa';
          return (
            <div
              key={a.id}
              className={`emp-action-row ${isDone ? 'emp-action-row--done' : 'emp-action-row--active'}`}
              style={{ borderColor: isDone ? 'rgba(16,185,129,0.25)' : `${accent}30` }}
              onClick={() => toggle(a.id)}
            >
              <div
                className={`emp-action-checkbox ${isDone ? 'emp-action-checkbox--checked' : ''}`}
                style={{ borderColor: isDone ? '#10b981' : accent }}
              >
                {isDone && '✓'}
              </div>
              <div style={{ flex: 1 }}>
                <p className={`emp-action-label ${isDone ? 'emp-action-label--done' : ''}`}>{a.label}</p>
                <p className="emp-action-sub">{a.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Notification Feed ────────────────────────────────────────────────────────

function NotificationFeed({ notifs }) {
  const [items, setItems] = useState(notifs);
  const markRead = id => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="emp-card">
      <SectionHeader
        icon={<Bell size={15} />}
        title="Notifications"
        count={items.filter(n => !n.read).length}
        accent="#10b981"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
        {items.map(n => (
          <div
            key={n.id}
            className={`emp-notif-row ${n.read ? 'emp-notif-row--read' : 'emp-notif-row--unread'}`}
            onClick={() => markRead(n.id)}
          >
            <span className="emp-notif-icon">{n.icon}</span>
            <div style={{ flex: 1 }}>
              <p className={`emp-notif-msg ${n.read ? 'emp-notif-msg--read' : ''}`}>{n.msg}</p>
              <p className="emp-notif-time">{n.time}</p>
            </div>
            {!n.read && <div className="emp-notif-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Employee (root) ──────────────────────────────────────────────────────────

export default function Employee({ activeTab }) {
  const [clockedIn,   setClockedIn]   = useState(false);
  const [gpsStatus,   setGpsStatus]   = useState('idle'); // idle | fetching | ok | denied
  const [currentTime, setCurrentTime] = useState(fmtTime(new Date()));
  const isLate = new Date().getHours() >= 9 && !clockedIn;

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(fmtTime(new Date())), 30_000);
    return () => clearInterval(t);
  }, []);

  function handleClockIn() {
    if (clockedIn) { setClockedIn(false); setGpsStatus('idle'); return; }
    setGpsStatus('fetching');
    navigator.geolocation?.getCurrentPosition(
      ()  => { setGpsStatus('ok');     setClockedIn(true); },
      ()  => { setGpsStatus('denied'); setClockedIn(true); },
      { timeout: 10_000, enableHighAccuracy: true }
    );
    if (!navigator.geolocation) { setGpsStatus('ok'); setClockedIn(true); }
  }

  if (activeTab === 'attendance') return <Attendance />;
  
  if (activeTab === 'leave')      return <Leave />;

  if (activeTab === 'tasks') return <Tasks />;

  if (activeTab === 'timesheet') return <Timesheet />;

  if (activeTab === 'payroll') return <Payroll />;

  if (activeTab !== 'dashboard') return null;
  

  return (
    <div className="component-container emp-root">
      <div className="component-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Organize your day-to-day deliverables, submit your timecards, and review your benefits.</p>
        </div>
      </div>

      <div className="emp-body">
        <WelcomeBanner
          clockedIn={clockedIn}
          onClockIn={handleClockIn}
          gpsStatus={gpsStatus}
          isLate={isLate}
          currentTime={currentTime}
        />

        <div className="emp-grid">
          <div className="emp-grid__tasks">
            <TodayTasksList tasks={MOCK_TASKS} />
          </div>
          <PendingActionsChecklist actions={MOCK_ACTIONS} />
          <NotificationFeed notifs={MOCK_NOTIFS} />
        </div>
      </div>
    </div>
  );
}