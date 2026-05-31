import React from 'react';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import People from './pages/People';
import Projects from './pages/Projects';
import Approvals from './pages/Approvals';
import CompanySetup from './pages/CompanySetup';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Announcements from './pages/Announcements';
import StrategyOKRs from './pages/OKRs';
import Messaging from './pages/Messaging';
import './CEO.css';

export default function Ceo({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'finance': return <Finance />;
      case 'people': return <People />;
      case 'projects': return <Projects />;
      case 'approvals': return <Approvals />;
      case 'companySetup': return <CompanySetup />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'announcements': return <Announcements />;
      case 'strategyOKRs': return <StrategyOKRs />;
      case 'messaging': return <Messaging />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="component-container" style={{ padding: 0 }}>
      {renderContent()}
    </div>
  );
}
