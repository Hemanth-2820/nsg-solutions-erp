import Expenses from './Expenses';
import Profile from './Profile';
import Resignation from './Resignation';
import Help from './Help';
import Assets from './Assets';
import Messaging from './Messaging';
import Attendance from './Attendance';
import Timesheet from './Timesheet';
import Tasks from './Tasks';
import Leave from './Leave';
import Payroll from './Payroll';
import EmployeeDashboard from './EmployeeDashboard';

export default function Employee({ activeTab, db, onUpdateDb, navigateTo }) {
  // Helper: switch to an employee tab
  const setActiveTab = (tab) => {
    if (navigateTo) navigateTo('Employee', tab);
    else window.location.hash = `#/Employee/${tab}`;
  };

  if (activeTab === 'dashboard') {
    return <EmployeeDashboard db={db} onUpdateDb={onUpdateDb} setActiveTab={setActiveTab} />;
  }

  if (activeTab === 'attendance') {
    return <Attendance db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'timesheet') {
    return <Timesheet db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'tasks') {
    return <Tasks db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'leave') {
    return <Leave db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'payroll') {
    return <Payroll db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'expenses') {
    return <Expenses db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'profile') {
    return <Profile db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'resignation') {
    return <Resignation db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'help') {
    return <Help db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'assets') {
    return <Assets db={db} onUpdateDb={onUpdateDb} />;
  }

  if (activeTab === 'messaging') {
    return <Messaging db={db} onUpdateDb={onUpdateDb} />;
  }

  // Fallback: show dashboard
  return <EmployeeDashboard db={db} onUpdateDb={onUpdateDb} setActiveTab={setActiveTab} />;
}