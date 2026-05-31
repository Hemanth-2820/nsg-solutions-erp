import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, Clock, AlertTriangle, FileText, Download, 
  BarChart2, ShieldCheck, History, Search, Filter, 
  ChevronRight, X, CheckCircle, AlertOctagon, CornerUpRight,
  User, Building, Briefcase, FileSignature, PieChart, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Pending Approvals", value: "24", trend: "down", percent: "12%", comp: "vs last week", icon: <Clock size={20} color="#FCD34D" />, color: "warning" },
  { title: "Approved Today", value: "18", trend: "up", percent: "5%", comp: "vs yesterday", icon: <CheckCircle size={20} color="#86EFAC" />, color: "success" },
  { title: "Rejected Today", value: "2", trend: "flat", percent: "0%", comp: "vs yesterday", icon: <AlertOctagon size={20} color="#FCA5A5" />, color: "critical" },
  { title: "Escalated Requests", value: "5", trend: "up", percent: "2%", comp: "vs last week", icon: <AlertTriangle size={20} color="#FCA5A5" />, color: "critical" },
  { title: "Payroll Approvals", value: "1", trend: "flat", percent: "0%", comp: "monthly cycle", icon: <Briefcase size={20} color="#93C5FD" />, color: "info" },
  { title: "Budget Requests", value: "4", trend: "down", percent: "8%", comp: "vs last week", icon: <PieChart size={20} color="#C4B5FD" />, color: "purple" },
  { title: "Policy Changes", value: "2", trend: "up", percent: "1%", comp: "vs last month", icon: <FileSignature size={20} color="#93C5FD" />, color: "info" },
  { title: "Avg Processing Time", value: "4.2h", trend: "down", percent: "15%", comp: "vs last month", icon: <Activity size={20} color="#86EFAC" />, color: "success" },
];

const inboxApprovals = [
  { id: "REQ-901", type: "Budget", by: "Sarah Connor", dept: "Marketing", date: "Today, 09:30 AM", priority: "High", status: "Pending" },
  { id: "REQ-902", type: "Promotion", by: "Mike Ross", dept: "Legal", date: "Yesterday, 2:15 PM", priority: "Normal", status: "Under Review" },
  { id: "REQ-903", type: "Capex", by: "John Doe", dept: "IT Infra", date: "28 May 2026", priority: "Critical", status: "Pending" },
  { id: "REQ-904", type: "Exit Request", by: "Jane Smith", dept: "Sales", date: "27 May 2026", priority: "High", status: "Escalated" },
  { id: "REQ-905", type: "Policy", by: "HR Admin", dept: "HR", date: "26 May 2026", priority: "Normal", status: "Pending" },
];

const payrollBatches = [
  { cycle: "May 2026", amount: "₹8,650,000", count: 245, processor: "Finance Team", status: "Verified" },
];

const budgets = [
  { dept: "Marketing", req: "₹450,000", alloc: "₹2,000,000", util: 85, by: "Sarah Connor" },
  { dept: "IT Infra", req: "₹1,200,000", alloc: "₹5,000,000", util: 92, by: "John Doe" },
];

const policies = [
  { name: "Remote Work Guidelines V2", summary: "Added IP restrictions for VPN access", impact: "High", by: "HR Head", date: "01 Jun 2026" },
  { name: "Travel Allowance 2026", summary: "Increased per-diem by 15%", impact: "Medium", by: "Finance", date: "15 Jun 2026" },
];

const lifecycle = [
  { name: "David Miller", dept: "Engineering", current: "SDE II", proposed: "Senior SDE", date: "01 Jun 2026" },
  { name: "Emma Watson", dept: "Marketing", current: "Marketing Exec", proposed: "Transfer to Sales", date: "15 Jun 2026" },
];

const escalations = [
  { reason: "Budget Exceeded by 12%", dept: "Operations", status: "System Blocked", action: "Override Block" },
  { reason: "Exception to Notice Period", dept: "Sales", status: "HR Rejected", action: "Override Rejection" },
];

const timeline = [
  { time: "Today, 10:45 AM", user: "Vivek C.", action: "Approved Payroll Batch (May)", impact: "Critical" },
  { time: "Yesterday, 4:20 PM", user: "Vivek C.", action: "Rejected Marketing Ad Spend Request", impact: "Medium" },
  { time: "28 May 2026", user: "System", action: "Escalated IT Infra Capex Request", impact: "High" },
];

const chartData = [
  { name: 'Mon', vol: 45, time: 2.1 },
  { name: 'Tue', vol: 52, time: 2.4 },
  { name: 'Wed', vol: 38, time: 1.8 },
  { name: 'Thu', vol: 65, time: 3.2 },
  { name: 'Fri', vol: 48, time: 2.5 },
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

export default function Approvals() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const openDrawer = (req) => {
    setSelectedReq(req);
    setDrawerOpen(true);
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)', position: 'relative' }}>
      
      {/* SECTION 1: Executive Approval Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Approval Command Center</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Executive Approvals</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>24 Pending</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>5 Critical</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Avg Time: 4.2h</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> Attention Required</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <History size={16} /> Audit History
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <ShieldCheck size={16} /> Policies
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <BarChart2 size={16} /> Analytics
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Approval KPI Dashboard */}
        <div className="ceo-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {kpiData.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
              </div>
              <div className="ceo-kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: kpi.trend === 'up' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'down' && kpi.color === 'warning' ? '#34D399' : kpi.trend === 'up' && kpi.color === 'critical' ? '#F87171' : '#94A3B8', fontWeight: 600 }}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>{kpi.comp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* SECTION 3: Approval Inbox */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '0' }}>
            <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '16px' }}>
              <div className="ceo-dash-card-title"><CheckSquare size={18} color="#3B82F6" /> Executive Approval Inbox</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="var(--ceo-text-muted)" style={{ position: 'absolute', left: '10px', top: '8px' }} />
                  <input type="text" placeholder="Search ID..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', borderRadius: '6px', padding: '6px 12px 6px 30px', color: 'white', fontSize: '12px', width: '150px' }} />
                </div>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Filter size={14} /> Filter</button>
              </div>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--ceo-border)', padding: '0 24px', gap: '24px' }}>
              {["All", "Payroll", "Budget", "Policy", "Promotions", "Exit Requests"].map(tab => (
                <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 0', fontSize: '13px', fontWeight: 600, color: activeTab === tab ? '#3B82F6' : 'var(--ceo-text-muted)', borderBottom: activeTab === tab ? '2px solid #3B82F6' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {tab}
                </div>
              ))}
            </div>
            
            <div className="ceo-approval-header" style={{ gridTemplateColumns: '40px 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '16px 24px 12px 24px' }}>
              <div><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? inboxApprovals.map(a => a.id) : [])} checked={selectedIds.length === inboxApprovals.length} style={{ cursor: 'pointer' }}/></div>
              <div>ID</div>
              <div>Type</div>
              <div>Requested By</div>
              <div>Dept</div>
              <div>Date</div>
              <div>Priority</div>
              <div style={{ textAlign: 'right' }}>Status</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {inboxApprovals.map((app, i) => (
                <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '40px 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '12px 24px', cursor: 'pointer' }} onClick={() => openDrawer(app)}>
                  <div onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(app.id)} onChange={() => toggleSelect(app.id)} style={{ cursor: 'pointer' }}/></div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ceo-text-muted)' }}>{app.id}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.type}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{app.by}</div>
                  <div style={{ fontSize: '12px' }}><span className="ceo-badge neutral">{app.dept}</span></div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>{app.date}</div>
                  <div><span className={`ceo-badge ${app.priority === 'Critical' ? 'critical' : app.priority === 'High' ? 'warning' : 'neutral'}`}>{app.priority}</span></div>
                  <div style={{ textAlign: 'right' }}><span className={`ceo-badge ${app.status === 'Pending' ? 'warning' : app.status === 'Escalated' ? 'critical' : 'neutral'}`}>{app.status}</span></div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 5: Payroll Approval Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Briefcase size={18} color="#10B981" /> Payroll Approval Center</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {payrollBatches.map((batch, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>Payroll Cycle</div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{batch.cycle}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>Total Amount</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>{batch.amount}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ceo-text-secondary)', marginBottom: '20px' }}>
                    <span>{batch.count} Employees</span>
                    <span>Processed by: {batch.processor}</span>
                    <span className="ceo-badge success">{batch.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ flex: 1, background: '#10B981', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Approve Release</button>
                    <button style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Reject Batch</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 6: Budget Approval Workspace */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><PieChart size={18} color="#F59E0B" /> Budget Review Workspace</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {budgets.map((bdg, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{bdg.dept} <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 400 }}>via {bdg.by}</span></div>
                      <div style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 600, marginTop: '4px' }}>Requested: {bdg.req}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Current Util: {bdg.util}%</div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>Allocated: {bdg.alloc}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                    <button style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    <button style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '6px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Override</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 7: Policy Change Approvals */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><FileSignature size={18} color="#8B5CF6" /> Policy Change Approvals</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {policies.map((pol, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i !== policies.length - 1 ? '1px solid var(--ceo-border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{pol.name}</div>
                    <span className={`ceo-badge ${pol.impact === 'High' ? 'warning' : 'neutral'}`}>{pol.impact} Impact</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', marginBottom: '8px' }}>{pol.summary}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>By: {pol.by} • Effective: {pol.date}</div>
                    <button style={{ background: 'transparent', border: '1px solid #3B82F6', color: '#3B82F6', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Review</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 8: Employee Lifecycle Approvals */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Users size={18} color="#EC4899" /> Employee Lifecycle Approvals</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lifecycle.map((lc, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i !== lifecycle.length - 1 ? '1px solid var(--ceo-border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{lc.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{lc.dept}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>{lc.proposed}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Current: {lc.current}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#10B981', cursor: 'pointer' }}><CheckCircle size={18} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><AlertOctagon size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* SECTION 9: Escalation & Override Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #EF4444' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><AlertOctagon size={18} color="#EF4444" /> Escalation & Override Center</div>
              <span className="ceo-badge critical">CEO Exclusive</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {escalations.map((esc, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#FCA5A5', marginBottom: '4px' }}>{esc.reason}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ceo-text-muted)', marginBottom: '16px' }}>
                    <span>{esc.dept}</span>
                    <span>Status: {esc.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, background: '#EF4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{esc.action}</button>
                    <button style={{ flex: 1, background: 'transparent', color: 'white', border: '1px solid var(--ceo-border)', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delegate</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 10 & 11 Combo Box */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '32px' }}>
            
            {/* SECTION 10: Approval Analytics */}
            <motion.div variants={itemVariants} className="ceo-dash-card">
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><BarChart2 size={18} color="#3B82F6" /> Approval Analytics (Last 5 Days)</div>
              </div>
              <div style={{ height: '160px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#F8FAFC' }} />
                    <Area type="monotone" dataKey="vol" name="Volume" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* SECTION 11: Audit Trail Timeline */}
            <motion.div variants={itemVariants} className="ceo-dash-card">
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><History size={18} color="#10B981" /> Approval Audit Trail</div>
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

        </div>

      </motion.div>

      {/* SECTION 4: Approval Detail Drawer (Slide-in) */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '480px', background: 'var(--ceo-bg)', borderLeft: '1px solid var(--ceo-border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{selectedReq?.id} - {selectedReq?.type}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Requested by {selectedReq?.by} ({selectedReq?.dept})</div>
                </div>
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ceo-text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>Request Details</h4>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--ceo-border)', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Submitted</div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{selectedReq?.date}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Priority</div>
                      <div><span className="ceo-badge warning">{selectedReq?.priority}</span></div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--ceo-text-secondary)', lineHeight: '1.5' }}>
                    This request requires executive approval to proceed. All departmental checks have been cleared by the respective managers.
                  </div>
                </div>

                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ceo-text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>Approval Chain</h4>
                <div style={{ marginBottom: '24px' }}>
                  <div className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: '#10B981' }}></div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>Manager Approval <CheckCircle size={12} color="#10B981" style={{ display: 'inline', marginLeft: '4px' }}/></div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Approved by John Smith</div>
                  </div>
                  <div className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: '#10B981' }}></div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>Finance Verification <CheckCircle size={12} color="#10B981" style={{ display: 'inline', marginLeft: '4px' }}/></div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Verified by Emma Finance</div>
                  </div>
                  <div className="ceo-timeline-item" style={{ paddingBottom: '0' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: '#F59E0B' }}></div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>CEO Approval</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Pending your action</div>
                  </div>
                </div>

                <div className="ceo-form-group">
                  <label>Reject Reason (Required for Rejection)</label>
                  <textarea 
                    className="ceo-form-input" 
                    rows="3" 
                    placeholder="Enter reason for rejection or clarification..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--ceo-border)', background: 'var(--ceo-card-bg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  disabled={!rejectReason}
                  style={{ background: rejectReason ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', color: rejectReason ? '#F87171' : 'var(--ceo-text-muted)', border: rejectReason ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: rejectReason ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                >
                  Reject Request
                </button>
                <button style={{ background: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1E293B', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '24px', border: '1px solid var(--ceo-border)', zIndex: 900 }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>{selectedIds.length} Requests Selected</div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Export</button>
              <button style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Bulk Reject</button>
              <button style={{ background: '#10B981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Bulk Approve</button>
            </div>
            <button onClick={() => setSelectedIds([])} style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer', marginLeft: '12px' }}><X size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
