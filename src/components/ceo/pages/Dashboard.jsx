import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Bell, Settings, ChevronDown, User, Activity, DollarSign, 
  Users, CheckSquare, Briefcase, TrendingUp, AlertOctagon,
  AlertTriangle, CheckCircle, Clock, PieChart, BarChart2,
  Calendar, FileText, ArrowUpRight, ArrowDownRight, Megaphone,
  ChevronRight, Target, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Total Revenue", value: "₹42.8M", trend: "up", percent: "12.5%", comp: "vs last month", icon: <DollarSign size={20} color="#86EFAC" />, color: "success" },
  { title: "Monthly Payroll Cost", value: "₹8.2M", trend: "up", percent: "2.1%", comp: "vs last month", icon: <Users size={20} color="#FCD34D" />, color: "warning" },
  { title: "Active Employees", value: "248", trend: "up", percent: "4.2%", comp: "vs last month", icon: <User size={20} color="#93C5FD" />, color: "info" },
  { title: "Pending Approvals", value: "14", trend: "down", percent: "18%", comp: "vs last week", icon: <CheckSquare size={20} color="#C4B5FD" />, color: "purple" },
  { title: "Active Projects", value: "32", trend: "flat", percent: "0%", comp: "vs last week", icon: <Briefcase size={20} color="#93C5FD" />, color: "info" },
  { title: "Budget Utilization", value: "68%", trend: "up", percent: "4%", comp: "vs planned", icon: <PieChart size={20} color="#86EFAC" />, color: "success" },
  { title: "OKR Achievement", value: "76%", trend: "up", percent: "11%", comp: "vs last quarter", icon: <Target size={20} color="#C4B5FD" />, color: "purple" },
  { title: "Critical Escalations", value: "3", trend: "down", percent: "50%", comp: "vs last week", icon: <AlertOctagon size={20} color="#FCA5A5" />, color: "critical" },
];

const escalations = [
  { severity: "critical", dept: "IT Infrastructure", time: "10 mins ago", msg: "Server cluster 3 downtime detected", status: "Investigating" },
  { severity: "critical", dept: "Finance", time: "1 hour ago", msg: "Q3 Budget exceeded by 12% in Marketing", status: "Pending Review" },
  { severity: "warning", dept: "Operations", time: "3 hours ago", msg: "Supply chain delay for Project Alpha", status: "Mitigated" },
  { severity: "warning", dept: "HR", time: "5 hours ago", msg: "Compliance document missing for 4 new hires", status: "Action Required" },
];

const approvals = [
  { type: "Payroll", by: "Sarah Connor (HR)", dept: "HR", date: "Today, 10:00 AM", priority: "High", status: "Pending" },
  { type: "Budget Request", by: "John Doe", dept: "Marketing", date: "Yesterday", priority: "Normal", status: "Pending" },
  { type: "Promotion", by: "Mike Ross", dept: "Legal", date: "24 May 2026", priority: "Normal", status: "Pending" },
  { type: "Policy Change", by: "Jane Smith", dept: "Operations", date: "22 May 2026", priority: "High", status: "Pending" },
];

const financeData = [
  { name: 'Jan', revenue: 4000, expense: 2400 },
  { name: 'Feb', revenue: 3000, expense: 1398 },
  { name: 'Mar', revenue: 2000, expense: 9800 },
  { name: 'Apr', revenue: 2780, expense: 3908 },
  { name: 'May', revenue: 1890, expense: 4800 },
  { name: 'Jun', revenue: 2390, expense: 3800 },
];

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// ==========================================
// COMPONENTS
// ==========================================

export default function Dashboard() {
  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1800px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E' }}></span>
            System Live • Last Sync: Just now
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Good morning, Vivek.</h1>
          <p style={{ color: 'var(--ceo-text-secondary)', margin: 0, fontSize: '15px' }}>Sunday, 31 May 2026 • Quarter 2</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--ceo-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input type="text" placeholder="Global Search (Press '/')" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', borderRadius: '20px', padding: '8px 16px 8px 36px', color: 'white', fontSize: '13px', width: '240px', transition: 'all 0.2s' }} />
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></span>
          </button>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}>
            <Settings size={20} />
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--ceo-border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>VC</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Vivek C.</span>
              <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>CEO / Founder</span>
            </div>
            <ChevronDown size={14} color="var(--ceo-text-muted)" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Executive KPI Grid */}
        <div className="ceo-kpi-grid">
          {kpiData.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
              </div>
              <div className="ceo-kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: kpi.trend === 'up' ? '#34D399' : kpi.trend === 'down' ? '#F87171' : '#94A3B8', fontWeight: 600 }}>
                  {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : kpi.trend === 'down' ? <ArrowDownRight size={14} /> : <TrendingUp size={14} />}
                  {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>{kpi.comp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROW 1: Escalations & Approvals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
          
          {/* SECTION 3: Escalation Command Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><ShieldAlert size={18} color="#EF4444" /> Escalation Command Center</div>
              <button style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {escalations.map((esc, i) => (
                <div key={i} className={`ceo-escalation-item ${esc.severity}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{esc.dept}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{esc.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{esc.msg}</div>
                  </div>
                  <div style={{ marginLeft: '16px' }}>
                    <button style={{ background: esc.severity === 'critical' ? '#EF4444' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 4: Pending Approvals Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '24px 0 0 0' }}>
            <div className="ceo-dash-card-header" style={{ padding: '0 24px' }}>
              <div className="ceo-dash-card-title"><CheckSquare size={18} color="#8B5CF6" /> Pending Approvals</div>
              <button style={{ background: '#8B5CF6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Bulk Approve</button>
            </div>
            
            <div className="ceo-approval-header">
              <div>Request Type</div>
              <div>Requested By</div>
              <div>Dept</div>
              <div>Date</div>
              <div>Priority</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {approvals.map((app, i) => (
                <div key={i} className="ceo-approval-row">
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.type}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>{app.by}</div>
                  <div style={{ fontSize: '12px' }}><span className="ceo-badge neutral">{app.dept}</span></div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>{app.date}</div>
                  <div>
                    <span className={`ceo-badge ${app.priority === 'High' ? 'warning' : 'neutral'}`}>
                      {app.priority}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Approve"><CheckCircle size={14} /></button>
                    <button style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Reject"><AlertOctagon size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px', textAlign: 'center', borderTop: '1px solid var(--ceo-border)', background: 'rgba(0,0,0,0.1)' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>View 10 More Approvals</button>
            </div>
          </motion.div>

        </div>

        {/* SECTION 5: Strategic Performance Overview */}
        <motion.div variants={itemVariants} className="ceo-dash-card">
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><Target size={18} color="#3B82F6" /> Strategic Performance & OKRs (Q2)</div>
            <button style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Go to Strategy</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
            
            {/* Left: OKRs */}
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ceo-text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>Company Objectives</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { name: "Achieve $50M ARR by Year End", pct: 68, color: "#F59E0B" },
                  { name: "Launch Enterprise Client Portal", pct: 92, color: "#10B981" },
                  { name: "Expand to EU Market", pct: 34, color: "#EF4444" }
                ].map((okr, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{okr.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: okr.color }}>{okr.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${okr.pct}%`, height: '100%', background: okr.color, borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dept Ranking */}
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--ceo-text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>Department Performance Ranking</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: "Engineering", score: "94/100", trend: "up", pos: 1 },
                  { name: "Sales", score: "88/100", trend: "up", pos: 2 },
                  { name: "Marketing", score: "82/100", trend: "down", pos: 3 },
                  { name: "Human Resources", score: "78/100", trend: "flat", pos: 4 },
                  { name: "Operations", score: "71/100", trend: "down", pos: 5 },
                ].map((dept, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i === 0 ? '#F59E0B' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: i === 0 ? 'white' : 'var(--ceo-text-muted)' }}>{dept.pos}</div>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>{dept.name}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ceo-text-primary)' }}>{dept.score}</div>
                    <div style={{ color: dept.trend === 'up' ? '#34D399' : dept.trend === 'down' ? '#F87171' : '#94A3B8' }}>
                      {dept.trend === 'up' ? <ArrowUpRight size={16} /> : dept.trend === 'down' ? <ArrowDownRight size={16} /> : <TrendingUp size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* ROW 2: Financial & Projects */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          
          {/* SECTION 6: Financial Health Dashboard */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><BarChart2 size={18} color="#10B981" /> Financial Health (YTD)</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="ceo-badge neutral">Revenue</span>
                <span className="ceo-badge" style={{ background: 'transparent', border: '1px dashed var(--ceo-border)' }}>Expense</span>
              </div>
            </div>
            
            <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expense" stroke="#64748B" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SECTION 7: Active Projects Overview */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Briefcase size={18} color="#F59E0B" /> Project Portfolio Health</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {[
                { name: "ERP Migration", pct: 45, health: "warning", sprint: "Sprint 4", risk: "Resource constrained" },
                { name: "Data Center Upgrade", pct: 88, health: "healthy", sprint: "Phase 3", risk: "None" },
                { name: "Mobile App V2", pct: 12, health: "critical", sprint: "Sprint 1", risk: "Budget overshoot expected" },
                { name: "Security Audit", pct: 100, health: "healthy", sprint: "Review", risk: "None" }
              ].map((proj, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--ceo-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{proj.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{proj.sprint} • {proj.risk}</div>
                    </div>
                    <span className={`ceo-badge ${proj.health === 'healthy' ? 'success' : proj.health === 'warning' ? 'warning' : 'critical'}`}>
                      {proj.health}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${proj.pct}%`, height: '100%', background: proj.health === 'healthy' ? '#10B981' : proj.health === 'warning' ? '#F59E0B' : '#EF4444' }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{proj.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ROW 3: Reports, Announcements, Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          
          {/* SECTION 8: Executive Reports Snapshot */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><FileText size={18} color="#8B5CF6" /> Reports Snapshot</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: "Headcount Trend (YTD)", val: "+14%", icon: <Users size={16} /> },
                { title: "Avg. Attrition Rate", val: "4.2%", icon: <Activity size={16} /> },
                { title: "Attendance Health", val: "94.8%", icon: <Calendar size={16} /> },
                { title: "Project Delivery Rate", val: "88%", icon: <CheckSquare size={16} /> }
              ].map((rep, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ceo-text-secondary)', fontSize: '13px' }}>
                    {rep.icon} {rep.title}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ceo-text-primary)' }}>{rep.val}</div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '20px', padding: '10px', background: 'transparent', border: '1px dashed var(--ceo-border)', borderRadius: '8px', color: 'var(--ceo-text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
              View Report Explorer
            </button>
          </motion.div>

          {/* SECTION 9: Company Announcements */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Megaphone size={18} color="#3B82F6" /> Latest Announcements</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: "New Leave Policy for Q3", date: "Today", read: 84 },
                { title: "Townhall Meeting Link", date: "Yesterday", read: 92 },
                { title: "Cybersecurity Training", date: "24 May", read: 45 },
              ].map((ann, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i !== 2 ? '1px solid var(--ceo-border)' : 'none' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{ann.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--ceo-text-muted)' }}>
                    <span>Published {ann.date} • All Employees</span>
                    <span style={{ color: ann.read > 80 ? '#10B981' : '#F59E0B', fontWeight: 600 }}>{ann.read}% Read</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 10: Executive Activity Timeline */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Clock size={18} color="#EC4899" /> Executive Activity</div>
            </div>
            <div style={{ marginTop: '12px' }}>
              {[
                { time: "10:45 AM", text: "Approved Payroll for May 2026", type: "approval" },
                { time: "09:30 AM", text: "Signed off on Project Delta budget", type: "budget" },
                { time: "Yesterday", text: "Published Q3 OKRs to organization", type: "policy" },
                { time: "28 May", text: "Welcomed 12 new hires via broadcast", type: "hr" },
              ].map((log, i) => (
                <div key={i} className="ceo-timeline-item">
                  <div className="ceo-timeline-dot" style={{ borderColor: log.type === 'approval' ? '#10B981' : log.type === 'budget' ? '#F59E0B' : '#8B5CF6' }}></div>
                  <div className="ceo-timeline-time">{log.time}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{log.text}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
