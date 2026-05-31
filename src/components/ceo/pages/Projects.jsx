import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, FolderGit2, CheckCircle, Clock, AlertTriangle, AlertOctagon, 
  Settings, ChevronRight, Activity, Users, ShieldCheck, PieChart, 
  BarChart2, FileText, Download, Target, LayoutGrid, List, FileSignature, X, CornerUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Active Projects", value: "34", trend: "up", percent: "5%", comp: "vs last month", icon: <Briefcase size={20} color="#93C5FD" />, color: "info" },
  { title: "Completed Projects", value: "12", trend: "up", percent: "20%", comp: "YTD", icon: <CheckCircle size={20} color="#86EFAC" />, color: "success" },
  { title: "Delayed Projects", value: "3", trend: "up", percent: "2%", comp: "vs last week", icon: <AlertTriangle size={20} color="#FCA5A5" />, color: "critical" },
  { title: "Sprint Completion Rate", value: "88%", trend: "down", percent: "4%", comp: "vs last sprint", icon: <Activity size={20} color="#86EFAC" />, color: "success" },
  { title: "Budget Utilization", value: "65%", trend: "flat", percent: "0%", comp: "of allocated", icon: <PieChart size={20} color="#FCD34D" />, color: "warning" },
  { title: "Resource Utilization", value: "92%", trend: "up", percent: "11%", comp: "vs last month", icon: <Users size={20} color="#86EFAC" />, color: "success" },
  { title: "Portfolio Health Score", value: "A-", trend: "up", percent: "1 tier", comp: "vs last quarter", icon: <ShieldCheck size={20} color="#C4B5FD" />, color: "purple" },
  { title: "High-Risk Projects", value: "2", trend: "down", percent: "50%", comp: "vs last month", icon: <AlertOctagon size={20} color="#FCA5A5" />, color: "critical" },
];

const projects = [
  { id: "PRJ-101", name: "ERP Cloud Migration v2.0", owner: "Sarah Connor", dept: "Engineering", start: "01 Jan 2026", target: "30 Sep 2026", progress: 68, sprint: "Sprint 14", budget: "healthy", risk: "Low", status: "Active" },
  { id: "PRJ-102", name: "Q3 Ad Campaign Scaling", owner: "Mike Ross", dept: "Marketing", start: "15 Apr 2026", target: "30 Jun 2026", progress: 42, sprint: "Sprint 4", budget: "warning", risk: "Medium", status: "Active" },
  { id: "PRJ-103", name: "Data Center Compliance Audit", owner: "John Doe", dept: "IT Infra", start: "01 May 2026", target: "15 Jun 2026", progress: 12, sprint: "Phase 1", budget: "critical", risk: "High", status: "Delayed" },
  { id: "PRJ-104", name: "EU Office Expansion Phase 1", owner: "Harvey Specter", dept: "Operations", start: "01 Mar 2026", target: "31 Dec 2026", progress: 25, sprint: "Planning", budget: "healthy", risk: "Low", status: "On Hold" },
  { id: "PRJ-105", name: "Mobile App V3 Launch", owner: "Jane Smith", dept: "Product", start: "01 Jan 2026", target: "30 Apr 2026", progress: 100, sprint: "Completed", budget: "healthy", risk: "None", status: "Completed" },
];

const sprints = [
  { project: "ERP Cloud Migration", name: "Sprint 14", goal: "Complete DB Schema mapping", pointsPlan: 120, pointsDone: 95, remaining: 5, health: "healthy" },
  { project: "Q3 Ad Campaign", name: "Sprint 4", goal: "Launch LinkedIN Ads", pointsPlan: 45, pointsDone: 20, remaining: 8, health: "warning" },
];

const resources = [
  { dept: "Engineering", assigned: 142, capacity: 150, util: 94 },
  { dept: "Marketing", assigned: 22, capacity: 25, util: 88 },
  { dept: "IT Infra", assigned: 45, capacity: 45, util: 100 },
];

const risks = [
  { project: "Data Center Compliance", risk: "Timeline Delay due to vendor", severity: "Critical", dept: "IT Infra", action: "Escalate to Vendor VP" },
  { project: "Q3 Ad Campaign", risk: "Budget overshoot projected by 15%", severity: "High", dept: "Marketing", action: "Review Ad Spends" },
];

const okrs = [
  { okr: "Achieve 99.99% Uptime", project: "ERP Cloud Migration", contribution: 85, impact: "High" },
  { okr: "Expand to EU Market", project: "EU Office Expansion", contribution: 60, impact: "Critical" },
];

const timeline = [
  { time: "Today, 09:15 AM", user: "Sarah Connor", action: "Completed Sprint 13 for ERP Migration", impact: "High" },
  { time: "Yesterday, 2:30 PM", user: "John Doe", action: "Escalated Vendor Risk on Data Center Audit", impact: "Critical" },
  { time: "28 May 2026", user: "Vivek C.", action: "Approved Budget for Q3 Ad Campaign", impact: "High" },
];

const chartData = [
  { name: 'Jan', velocity: 420, completed: 8 },
  { name: 'Feb', velocity: 450, completed: 12 },
  { name: 'Mar', velocity: 410, completed: 9 },
  { name: 'Apr', velocity: 480, completed: 14 },
  { name: 'May', velocity: 520, completed: 18 },
];

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// ==========================================
// COMPONENTS
// ==========================================

export default function Projects() {
  const [viewMode, setViewMode] = useState('grid');
  const [signOffModal, setSignOffModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Planning': return 'info';
      case 'On Hold': return 'warning';
      case 'Delayed': return 'critical';
      case 'Completed': return 'success';
      default: return 'neutral';
    }
  };

  const getBudgetColor = (b) => {
    if (b === 'healthy') return '#10B981';
    if (b === 'warning') return '#F59E0B';
    return '#EF4444';
  };

  const openSignOff = (proj) => {
    setSelectedProject(proj);
    setSignOffModal(true);
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Projects Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Project Portfolio Center</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Strategic Execution & Portfolio</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>34 Active Projects</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>Health Score: 92/100</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Updated 5 mins ago</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Portfolio Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <BarChart2 size={16} /> Analytics
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Users size={16} /> Resource Overview
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <FileText size={16} /> Portfolio Report
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <FolderGit2 size={16} /> Create Project
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Portfolio KPI Dashboard */}
        <div className="ceo-kpi-grid">
          {kpiData.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
              </div>
              <div className="ceo-kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: kpi.trend === 'up' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'down' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'up' && kpi.color === 'critical' ? '#F87171' : '#94A3B8', fontWeight: 600 }}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>{kpi.comp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 3 & 4: Project Portfolio Overview & Toggle */}
        <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '0' }}>
          <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '24px' }}>
            <div className="ceo-dash-card-title"><Briefcase size={18} color="#3B82F6" /> Enterprise Project Portfolio</div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
              <button onClick={() => setViewMode('grid')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: viewMode === 'grid' ? '#3B82F6' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--ceo-text-muted)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                <LayoutGrid size={14} /> Grid
              </button>
              <button onClick={() => setViewMode('table')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: viewMode === 'table' ? '#3B82F6' : 'transparent', color: viewMode === 'table' ? 'white' : 'var(--ceo-text-muted)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                <List size={14} /> Table
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ padding: '0 24px 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {projects.map((proj, i) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '12px', padding: '20px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} className="ceo-btn-hover">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span className={`ceo-badge ${getStatusColor(proj.status)}`}>{proj.status}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', fontFamily: 'monospace' }}>{proj.id}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{proj.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', marginBottom: '16px' }}>{proj.dept} • {proj.owner}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '6px' }}>
                      <span>Progress</span>
                      <span style={{ color: 'var(--ceo-text-primary)', fontWeight: 600 }}>{proj.progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                      <div style={{ height: '100%', width: `${proj.progress}%`, background: proj.progress === 100 ? '#10B981' : '#3B82F6' }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ color: 'var(--ceo-text-muted)' }}>Target Date</span>
                        <span style={{ fontWeight: 600 }}>{proj.target}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                        <span style={{ color: 'var(--ceo-text-muted)' }}>Budget</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getBudgetColor(proj.budget) }}></div>
                          <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{proj.budget}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="ceo-approval-header" style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 1fr 1fr' }}>
                  <div>Project Name</div>
                  <div>Owner</div>
                  <div>Progress</div>
                  <div>Budget Health</div>
                  <div>Risk</div>
                  <div style={{ textAlign: 'right' }}>Status</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {projects.map((proj, i) => (
                    <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 1fr 1fr', padding: '16px 24px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{proj.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', fontFamily: 'monospace' }}>{proj.id}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>{proj.owner}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${proj.progress}%`, background: proj.progress === 100 ? '#10B981' : '#3B82F6' }}></div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{proj.progress}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getBudgetColor(proj.budget) }}></div>
                        <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{proj.budget}</span>
                      </div>
                      <div><span className={`ceo-badge ${proj.risk === 'High' ? 'critical' : proj.risk === 'Medium' ? 'warning' : 'neutral'}`}>{proj.risk} Risk</span></div>
                      <div style={{ textAlign: 'right' }}><span className={`ceo-badge ${getStatusColor(proj.status)}`}>{proj.status}</span></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* SECTION 5: Sprint Overview Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Activity size={18} color="#8B5CF6" /> Live Sprint Execution (Read-only)</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sprints.map((sprint, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>{sprint.project}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{sprint.name}</div>
                    </div>
                    <div><span className={`ceo-badge ${sprint.health === 'healthy' ? 'success' : 'warning'}`}>{sprint.health}</span></div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', marginBottom: '16px' }}>Goal: {sprint.goal}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid var(--ceo-border)', paddingTop: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Points Planned</div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>{sprint.pointsPlan}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Points Done</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#10B981' }}>{sprint.pointsDone}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Remaining Tasks</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#F59E0B' }}>{sprint.remaining}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '6px' }}>
                      <span>Sprint Progress</span>
                      <span>{Math.round((sprint.pointsDone/sprint.pointsPlan)*100)}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(sprint.pointsDone/sprint.pointsPlan)*100}%`, background: '#8B5CF6' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 6: Project Budget Monitoring */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><PieChart size={18} color="#10B981" /> Financial Delivery Health</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.slice(0, 3).map((proj, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{proj.name}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: proj.budget === 'healthy' ? '50%' : proj.budget === 'warning' ? '85%' : '110%' }} 
                      transition={{ duration: 1 }} 
                      style={{ height: '100%', background: getBudgetColor(proj.budget), borderRadius: '4px' }}
                    ></motion.div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ceo-text-muted)' }}>
                    <span style={{ color: getBudgetColor(proj.budget) }}>{proj.budget === 'critical' ? 'Over Budget!' : 'On Track'}</span>
                    <span>Status: <span style={{ textTransform: 'capitalize' }}>{proj.budget}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
          
          {/* SECTION 7: Resource Allocation Dashboard */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Users size={18} color="#F59E0B" /> Resource Allocation</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resources.map((res, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{res.dept}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: res.util > 95 ? '#EF4444' : '#10B981' }}>{res.util}% Utilized</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ceo-text-muted)' }}>
                    <span>Assigned: {res.assigned}</span>
                    <span>Capacity: {res.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 8: Project Risk Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #EF4444' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><AlertOctagon size={18} color="#EF4444" /> Execution Risks & Blockers</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {risks.map((risk, i) => (
                <div key={i} style={{ padding: '16px', background: risk.severity === 'Critical' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)', border: `1px solid ${risk.severity === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>{risk.project}</div>
                    <span className={`ceo-badge ${risk.severity === 'Critical' ? 'critical' : 'warning'}`}>{risk.severity}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: risk.severity === 'Critical' ? '#FCA5A5' : '#FCD34D', marginBottom: '16px' }}>{risk.risk}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>Dept: {risk.dept}</div>
                    <button style={{ background: risk.severity === 'Critical' ? '#EF4444' : '#F59E0B', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{risk.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 9: Strategic Goal Alignment */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Target size={18} color="#3B82F6" /> Strategic OKR Alignment</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {okrs.map((okr, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i !== okrs.length - 1 ? '1px solid var(--ceo-border)' : 'none' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Linked Objective</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{okr.okr}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <CornerUpRight size={14} color="#3B82F6" />
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>Executing via: {okr.project}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ceo-text-muted)' }}>Project Contribution</span>
                    <span style={{ fontWeight: 700, color: '#10B981' }}>{okr.contribution}% delivered</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 10: Project Sign-Off Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><FileSignature size={18} color="#10B981" /> Awaiting Executive Sign-Off</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.filter(p => p.progress === 100).map((proj, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>{proj.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Owner: {proj.owner}</div>
                    </div>
                    <span className="ceo-badge success">Ready for Closure</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ceo-text-secondary)', marginBottom: '16px' }}>
                    <span>Budget: 98% Used</span>
                    <span>Delivered On Time</span>
                  </div>
                  <button onClick={() => openSignOff(proj)} style={{ width: '100%', background: '#10B981', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <FileSignature size={16} /> Open Sign-Off Form
                  </button>
                </div>
              ))}
              {projects.filter(p => p.progress === 100).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--ceo-text-muted)', padding: '24px 0', fontSize: '13px' }}>
                  No projects currently awaiting closure.
                </div>
              )}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* SECTION 11: Executive Project Analytics */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><BarChart2 size={18} color="#3B82F6" /> Delivery Velocity & Output Trends</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '2px' }}></div> Sprint Velocity (Pts)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '2px', background: '#10B981' }}></div> Projects Delivered</span>
              </div>
            </div>
            <div style={{ height: '250px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                  <Bar yAxisId="left" dataKey="velocity" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
                  <Line yAxisId="right" type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SECTION 12: Project Activity Timeline */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Clock size={18} color="#8B5CF6" /> Portfolio Activity Timeline</div>
            </div>
            <div style={{ marginTop: '8px' }}>
              {timeline.map((log, i) => (
                <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                  <div className="ceo-timeline-dot" style={{ borderColor: log.impact === 'Critical' ? '#EF4444' : log.impact === 'High' ? '#F59E0B' : '#3B82F6' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div className="ceo-timeline-time" style={{ margin: 0 }}>{log.time}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{log.user}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{log.action}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </motion.div>

      {/* SECTION 10: Project Sign-Off Modal (Bounce Entrance) */}
      <AnimatePresence>
        {signOffModal && selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setSignOffModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
              style={{ width: '600px', background: 'var(--ceo-card-bg)', border: '1px solid var(--ceo-border)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>Project Closure Sign-Off</div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>{selectedProject.name} ({selectedProject.id})</div>
                  </div>
                </div>
                <button onClick={() => setSignOffModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Outcome Summary</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>All deliverables met. Scope completed successfully with 0 critical defects.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Budget Summary</div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>Allocated: ₹2M<br/>Consumed: ₹1.85M (Under Budget)</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '8px', border: '1px dashed var(--ceo-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)', marginBottom: '16px' }}>Digital Signature (CEO)</div>
                  <div style={{ height: '80px', borderBottom: '1px solid var(--ceo-border)', margin: '0 40px 12px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'cursive', fontSize: '24px', color: 'var(--ceo-text-primary)', opacity: 0.8 }}>Vivek C.</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ceo-text-secondary)' }}>By signing off, this project will be officially closed and archived.</div>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--ceo-border)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setSignOffModal(false)} style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button style={{ background: '#10B981', border: 'none', color: 'white', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSignature size={16} /> Confirm Project Closure
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
