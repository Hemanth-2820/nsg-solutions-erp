import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, Download, Filter, Calendar, Settings, ChevronRight, 
  Users, Briefcase, IndianRupee, PieChart, Target, ShieldCheck, 
  TrendingUp, TrendingDown, Clock, Sparkles, CheckCircle, Search,
  AlignLeft, Play, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, ComposedChart, Legend
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Total Employees", value: "842", trend: "up", percent: "5%", comp: "vs last quarter", icon: <Users size={20} color="#93C5FD" />, color: "info" },
  { title: "Active Projects", value: "34", trend: "up", percent: "12%", comp: "YTD", icon: <Briefcase size={20} color="#FCD34D" />, color: "warning" },
  { title: "Monthly Revenue", value: "₹42.5M", trend: "up", percent: "8%", comp: "vs last month", icon: <IndianRupee size={20} color="#86EFAC" />, color: "success" },
  { title: "Payroll Cost", value: "₹18.4M", trend: "flat", percent: "0%", comp: "vs last month", icon: <PieChart size={20} color="#C4B5FD" />, color: "purple" },
  { title: "OKR Achievement", value: "85%", trend: "up", percent: "4%", comp: "vs Q1", icon: <Target size={20} color="#86EFAC" />, color: "success" },
  { title: "Budget Utilization", value: "72%", trend: "down", percent: "5%", comp: "of planned", icon: <TrendingDown size={20} color="#86EFAC" />, color: "success" },
  { title: "Retention Rate", value: "94%", trend: "flat", percent: "0%", comp: "industry avg: 88%", icon: <Users size={20} color="#86EFAC" />, color: "success" },
  { title: "Compliance Score", value: "98/100", trend: "up", percent: "2 pts", comp: "vs last audit", icon: <ShieldCheck size={20} color="#86EFAC" />, color: "success" },
];

const insights = [
  { msg: "Payroll cost increased 12% compared to previous month due to annual appraisals.", type: "warning" },
  { msg: "Project delivery efficiency improved by 8% in Engineering department.", type: "success" },
  { msg: "Employee retention reached 94%, highest level this financial year.", type: "success" },
  { msg: "Marketing ad spend is projecting a 15% budget overrun for Q3.", type: "critical" },
];

const scheduledReports = [
  { name: "Monthly Financial Rollup", freq: "Monthly (1st)", recipients: "CEO, CFO", next: "01 Jul 2026" },
  { name: "Weekly Workforce Health", freq: "Weekly (Mon)", recipients: "CEO, HR Head", next: "08 Jun 2026" },
  { name: "Quarterly OKR Status", freq: "Quarterly", recipients: "Board of Directors", next: "01 Oct 2026" },
];

const timeline = [
  { time: "Today, 10:45 AM", user: "System", action: "Generated 'Monthly Financial Rollup'", type: "Financial" },
  { time: "Yesterday, 3:30 PM", user: "Vivek C.", action: "Exported 'Workforce Health' to PDF", type: "Workforce" },
  { time: "28 May 2026", user: "Finance Team", action: "Updated Scheduled 'Q3 Forecast'", type: "Financial" },
];

const tableData = [
  { id: "RPT-001", dept: "Engineering", metric1: "145", metric2: "92%", metric3: "₹4.2M", status: "Healthy" },
  { id: "RPT-002", dept: "Sales", metric1: "85", metric2: "88%", metric3: "₹2.8M", status: "Warning" },
  { id: "RPT-003", dept: "Marketing", metric1: "42", metric2: "75%", metric3: "₹1.5M", status: "Critical" },
  { id: "RPT-004", dept: "Operations", metric1: "120", metric2: "95%", metric3: "₹3.1M", status: "Healthy" },
  { id: "RPT-005", dept: "HR & Finance", metric1: "35", metric2: "98%", metric3: "₹1.1M", status: "Healthy" },
];

const chartData = [
  { name: 'Jan', val1: 4000, val2: 2400 },
  { name: 'Feb', val1: 3000, val2: 1398 },
  { name: 'Mar', val1: 2000, val2: 9800 },
  { name: 'Apr', val1: 2780, val2: 3908 },
  { name: 'May', val1: 1890, val2: 4800 },
  { name: 'Jun', val1: 2390, val2: 3800 },
  { name: 'Jul', val1: 3490, val2: 4300 },
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

export default function Reports() {
  const [activeTab, setActiveTab] = useState("Financial Reports");
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Reports Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Business Intelligence</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Executive Reports Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>Q2 FY 2026-27</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>Data is Live</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Last refreshed: Just now</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> BI System Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Settings size={16} /> Analytics Settings
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Clock size={16} /> Schedule Reports
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Download size={16} /> Export Reports
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <BarChart2 size={16} /> Generate Report
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Executive KPI Dashboard */}
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

        {/* SECTION 15: Executive Insights Panel */}
        <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><Sparkles size={18} color="#8B5CF6" /> AI Executive Insights & Observations</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ padding: '16px', background: ins.type === 'critical' ? 'rgba(239, 68, 68, 0.05)' : ins.type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1px solid ${ins.type === 'critical' ? 'rgba(239, 68, 68, 0.2)' : ins.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`, borderRadius: '8px', fontSize: '13px', lineHeight: '1.5', color: ins.type === 'critical' ? '#FCA5A5' : ins.type === 'warning' ? '#FCD34D' : '#6EE7B7' }}>
                {ins.msg}
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 3 & 4: Report Type Center & Filter Panel */}
        <motion.div variants={itemVariants}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {["Workforce Reports", "Payroll Reports", "Attendance Reports", "Project Reports", "Financial Reports", "OKR Reports", "Compliance Reports"].map(tab => (
                <div key={tab} onClick={() => setActiveTab(tab)} style={{ fontSize: '13px', fontWeight: 600, color: activeTab === tab ? '#3B82F6' : 'var(--ceo-text-muted)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="activeRptTab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '2px', background: '#3B82F6' }}></motion.div>}
                </div>
              ))}
            </div>
            <button onClick={() => setFilterOpen(!filterOpen)} style={{ background: filterOpen ? '#3B82F6' : 'transparent', color: filterOpen ? 'white' : 'var(--ceo-text-primary)', border: '1px solid var(--ceo-border)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
              <Filter size={14} /> Advanced Filters
            </button>
          </div>

          <AnimatePresence>
            {filterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', marginBottom: '24px' }}
              >
                <div style={{ background: 'var(--ceo-card-bg)', border: '1px solid var(--ceo-border)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: '16px', alignItems: 'end' }}>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Date Range</label>
                    <select className="ceo-form-input"><option>This Quarter</option><option>This Year</option></select>
                  </div>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Department</label>
                    <select className="ceo-form-input"><option>All Departments</option><option>Engineering</option></select>
                  </div>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Location</label>
                    <select className="ceo-form-input"><option>All Locations</option><option>HQ</option></select>
                  </div>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Employee Type</label>
                    <select className="ceo-form-input"><option>All</option><option>Full-Time</option></select>
                  </div>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Project</label>
                    <select className="ceo-form-input"><option>All Projects</option></select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '10px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Clear</button>
                    <button style={{ background: '#3B82F6', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Apply</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* DYNAMIC CONTENT AREA BASED ON TAB */}
        {/* Sections 5-11 are merged into a visual representation controlled by the Tab */}
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* SECTION 12: Dynamic Analytics Canvas */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><BarChart2 size={18} color="#3B82F6" /> {activeTab} Overview Canvas</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '2px' }}></div> Primary Metric</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '2px' }}></div> Secondary Metric</span>
              </div>
            </div>
            <div style={{ height: '350px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                  <Area type="monotone" dataKey="val1" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal1)" />
                  <Bar dataKey="val2" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* RIGHT SIDEBAR: Sections 14 & 16 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* SECTION 14: Scheduled Reports Center */}
            <motion.div variants={itemVariants} className="ceo-dash-card">
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><Calendar size={18} color="#F59E0B" /> Scheduled Reports</div>
                <button style={{ background: 'transparent', border: 'none', color: '#F59E0B', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>+ New Schedule</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {scheduledReports.map((sch, i) => (
                  <div key={i} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{sch.name}</div>
                      <span className="ceo-badge neutral">{sch.freq}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '8px' }}>Recipients: {sch.recipients}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Next: {sch.next}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}><Play size={14} /></button>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}><Settings size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 16: Report Activity Timeline */}
            <motion.div variants={itemVariants} className="ceo-dash-card" style={{ flex: 1 }}>
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><Clock size={18} color="#8B5CF6" /> BI Activity Feed</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                {timeline.map((log, i) => (
                  <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: '#3B82F6' }}></div>
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

        {/* SECTION 13: Report Data Preview Table */}
        <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '0' }}>
          <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '16px' }}>
            <div className="ceo-dash-card-title"><AlignLeft size={18} color="#10B981" /> Data Grid Preview ({activeTab})</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--ceo-text-muted)" style={{ position: 'absolute', left: '10px', top: '8px' }} />
                <input type="text" placeholder="Search..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', borderRadius: '6px', padding: '6px 12px 6px 30px', color: 'white', fontSize: '12px', width: '150px' }} />
              </div>
            </div>
          </div>
          
          <div className="ceo-approval-header" style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '16px 24px 12px 24px' }}>
            <div>ID</div>
            <div>Department Segment</div>
            <div>Metric 1 (Count)</div>
            <div>Metric 2 (Score)</div>
            <div>Metric 3 (Value)</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tableData.map((row, i) => (
              <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1fr', padding: '12px 24px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ceo-text-muted)' }}>{row.id}</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{row.dept}</div>
                <div style={{ fontSize: '13px' }}>{row.metric1}</div>
                <div style={{ fontSize: '13px' }}>{row.metric2}</div>
                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--ceo-text-secondary)' }}>{row.metric3}</div>
                <div style={{ textAlign: 'right' }}><span className={`ceo-badge ${row.status === 'Healthy' ? 'success' : row.status === 'Warning' ? 'warning' : 'critical'}`}>{row.status}</span></div>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Showing 1-5 of 142 records</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Previous</button>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
