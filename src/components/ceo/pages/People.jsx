import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, FileText, Activity, Heart, ShieldAlert,
  Search, Filter, ChevronRight, X, Mail, Phone, Calendar,
  Briefcase, Award, TrendingUp, TrendingDown, Layers, MapPin, CheckCircle, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Total Employees", value: "842", trend: "up", percent: "5%", icon: <Users size={20} color="#3B82F6" />, color: "info" },
  { title: "Active Employees", value: "815", trend: "up", percent: "2%", icon: <CheckCircle size={20} color="#10B981" />, color: "success" },
  { title: "New Hires (YTD)", value: "42", trend: "up", percent: "12%", icon: <UserPlus size={20} color="#8B5CF6" />, color: "purple" },
  { title: "Retention Rate", value: "94%", trend: "flat", percent: "0%", icon: <Heart size={20} color="#F59E0B" />, color: "warning" },
  { title: "Department Count", value: "6", trend: "flat", percent: "0%", icon: <Layers size={20} color="#3B82F6" />, color: "info" },
  { title: "Leadership Count", value: "34", trend: "up", percent: "2", icon: <Award size={20} color="#10B981" />, color: "success" },
  { title: "Workforce Growth", value: "+8.5%", trend: "up", percent: "1.5%", icon: <TrendingUp size={20} color="#10B981" />, color: "success" },
  { title: "Open Positions", value: "18", trend: "down", percent: "4", icon: <Briefcase size={20} color="#EF4444" />, color: "critical" },
];

const employees = [
  { id: "EMP-001", name: "Vivek Chamanthula", email: "ceo@nsg.com", dept: "Executive", desig: "Chief Executive Officer", joinDate: "15 Jan 2020", status: "Active", role: "CEO" },
  { id: "EMP-042", name: "Sarah Jenkins", email: "sarah.j@nsg.com", dept: "HR", desig: "VP of Human Resources", joinDate: "01 Mar 2022", status: "Active", role: "HR" },
  { id: "EMP-108", name: "Michael Chang", email: "m.chang@nsg.com", dept: "Engineering", desig: "Director of Engineering", joinDate: "10 Jun 2023", status: "Active", role: "Team Lead" },
  { id: "EMP-215", name: "Anita Sharma", email: "anita.s@nsg.com", dept: "Sales", desig: "Enterprise Account Executive", joinDate: "12 Aug 2024", status: "Probation", role: "Employee" },
  { id: "EMP-340", name: "David Miller", email: "david.m@nsg.com", dept: "Marketing", desig: "Marketing Strategist", joinDate: "05 Nov 2021", status: "On Leave", role: "Employee" },
];

const timeline = [
  { time: "Today, 09:30 AM", user: "Sarah J. (HR)", action: "Approved Promotion: Michael Chang to Director", impact: "High" },
  { time: "Yesterday, 4:15 PM", user: "System", action: "Added New Employee: Anita Sharma (EMP-215)", impact: "Medium" },
  { time: "28 May 2026", user: "Sarah J. (HR)", action: "Initiated Q2 Organization-wide Talent Review", impact: "Critical" },
];

const riskData = [
  { dept: "Engineering", issue: "High Attrition Risk in Senior Devs", level: "Critical", rec: "Initiate retention bonuses and review workloads." },
  { dept: "Sales", issue: "Leadership Gap (VP Sales)", level: "High", rec: "Accelerate executive search or promote internally." },
];

const pieData = [
  { name: 'Engineering', value: 340, color: '#3B82F6' },
  { name: 'Sales', value: 210, color: '#10B981' },
  { name: 'Marketing', value: 120, color: '#F59E0B' },
  { name: 'Operations', value: 110, color: '#8B5CF6' },
  { name: 'HR & Finance', value: 62, color: '#F43F5E' },
];

const chartData = [
  { name: 'Jan', headcount: 780 },
  { name: 'Feb', headcount: 795 },
  { name: 'Mar', headcount: 810 },
  { name: 'Apr', headcount: 825 },
  { name: 'May', headcount: 842 },
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

export default function People() {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const getStatusColor = (s) => {
    switch(s) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Probation': return 'info';
      case 'Resigned': return 'critical';
      default: return 'neutral';
    }
  };

  const getRoleColor = (r) => {
    switch(r) {
      case 'CEO': return '#8B5CF6';
      case 'HR': return '#F59E0B';
      case 'Team Lead': return '#3B82F6';
      default: return '#64748B';
    }
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Workforce Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Organization Management</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Workforce Intelligence Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>842 Total Workforce</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>98/100 Org Health Score</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Updated just now</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Workforce Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Activity size={16} /> Org Analytics
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Award size={16} /> Talent Review
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Workforce KPI Dashboard */}
        <div className="ceo-kpi-grid">
          {kpiData.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
              </div>
              <div className="ceo-kpi-value">{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: kpi.trend === 'up' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'down' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'up' && kpi.color === 'critical' ? '#F87171' : kpi.trend === 'down' && kpi.color === 'critical' ? '#34D399' : '#3B82F6', fontWeight: 600 }}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>trend</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* SECTION 4, 8 & 9: Organization Overview & Distribution Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={16} color="#3B82F6"/> Department Distribution</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '120px', height: '120px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                          {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pieData.slice(0,4).map((d,i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }}></div>{d.name}</span>
                        <span style={{ fontWeight: 600 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={16} color="#8B5CF6"/> Leadership Structure</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--ceo-border)' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ceo-text-primary)' }}>1:24</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Leadership Ratio</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>94%</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Successor Readiness</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', lineHeight: '1.5' }}>
                    The organization has a healthy leadership coverage across all major departments. Sales requires a new VP replacement soon.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* SECTION 5 & 3: Employee Directory Table & Filters */}
            <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: 0 }}>
              <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '16px' }}>
                <div className="ceo-dash-card-title"><Users size={18} color="#10B981" /> Enterprise Employee Directory</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="var(--ceo-text-muted)" style={{ position: 'absolute', left: '10px', top: '8px' }} />
                    <input type="text" placeholder="Search employees..." style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', borderRadius: '6px', padding: '6px 12px 6px 30px', color: 'white', fontSize: '12px', width: '200px' }} />
                  </div>
                  <button onClick={() => setFilterOpen(!filterOpen)} style={{ background: filterOpen ? '#3B82F6' : 'transparent', color: filterOpen ? 'white' : 'var(--ceo-text-primary)', border: '1px solid var(--ceo-border)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={14} /> Filters
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {filterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 24px 16px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <select className="ceo-form-input" style={{ fontSize: '12px', padding: '8px' }}><option>All Departments</option><option>Engineering</option></select>
                      <select className="ceo-form-input" style={{ fontSize: '12px', padding: '8px' }}><option>All Statuses</option><option>Active</option></select>
                      <select className="ceo-form-input" style={{ fontSize: '12px', padding: '8px' }}><option>All Roles</option><option>Team Lead</option></select>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', borderRadius: '6px', fontSize: '12px' }}>Clear</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="ceo-approval-header" style={{ gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr', padding: '16px 24px 12px 24px' }}>
                <div>ID</div>
                <div>Employee Info</div>
                <div>Department & Role</div>
                <div>Status</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {employees.map((emp, i) => (
                  <div 
                    key={i} 
                    className="ceo-approval-row" 
                    style={{ gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr', padding: '12px 24px', cursor: 'pointer' }}
                    onClick={() => setSelectedEmp(emp)}
                  >
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ceo-text-muted)' }}>{emp.id}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>{emp.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{emp.email} • Joined {emp.joinDate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px' }}>{emp.dept}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-secondary)' }}>{emp.desig}</div>
                    </div>
                    <div>
                      <span className={`ceo-badge ${getStatusColor(emp.status)}`}>{emp.status}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>View</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* SECTION 12: Talent Risk Center */}
            <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #EF4444' }}>
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><ShieldAlert size={18} color="#EF4444" /> Talent Risk Center</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {riskData.map((risk, i) => (
                  <div key={i} style={{ padding: '16px', background: risk.level === 'Critical' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)', border: `1px solid ${risk.level === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`ceo-badge ${risk.level === 'Critical' ? 'critical' : 'warning'}`}>{risk.dept}</span>
                      <span style={{ fontSize: '11px', color: risk.level === 'Critical' ? '#FCA5A5' : '#FCD34D', fontWeight: 600 }}>{risk.level} Risk</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{risk.issue}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>{risk.rec}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 14: Workforce Analytics Center */}
            <motion.div variants={itemVariants} className="ceo-dash-card">
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><TrendingUp size={18} color="#3B82F6" /> Workforce Growth Trend</div>
              </div>
              <div style={{ height: '180px', width: '100%', marginTop: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                    <Area type="monotone" dataKey="headcount" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorHC)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* SECTION 15: Workforce Activity Timeline */}
            <motion.div variants={itemVariants} className="ceo-dash-card" style={{ flex: 1 }}>
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><Clock size={18} color="#F59E0B" /> Workforce Audit Trail</div>
              </div>
              <div style={{ marginTop: '16px' }}>
                {timeline.map((log, i) => (
                  <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: log.impact === 'Critical' ? '#EF4444' : log.impact === 'High' ? '#3B82F6' : '#10B981' }}></div>
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

      {/* SECTION 6: Employee Profile Drawer (Slide-in right panel) */}
      <AnimatePresence>
        {selectedEmp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
            onClick={() => setSelectedEmp(null)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '500px', background: 'var(--ceo-bg)', borderLeft: '1px solid var(--ceo-border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: 'white' }}>
                    {selectedEmp.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{selectedEmp.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', marginBottom: '8px' }}>{selectedEmp.desig}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className={`ceo-badge ${getStatusColor(selectedEmp.status)}`}>{selectedEmp.status}</span>
                      <span style={{ fontSize: '11px', color: getRoleColor(selectedEmp.role), border: `1px solid ${getRoleColor(selectedEmp.role)}`, padding: '2px 8px', borderRadius: '12px' }}>Role: {selectedEmp.role}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedEmp(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              
              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Employee ID</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{selectedEmp.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Email Address</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="var(--ceo-text-muted)"/> {selectedEmp.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Join Date</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="var(--ceo-text-muted)"/> {selectedEmp.joinDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Location</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="var(--ceo-text-muted)"/> HQ, Hyderabad</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ceo-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Layers size={20} color="#3B82F6" />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Department</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedEmp.dept}</div>
                    </div>
                  </div>
                  {/* SECTION 7: Organization Structure Center snippet */}
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '12px' }}>Reporting Hierarchy</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>VC</div>
                        Vivek C. (CEO)
                      </div>
                      <div style={{ width: '2px', height: '12px', background: 'var(--ceo-border)', marginLeft: '11px' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#3B82F6' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: 'white' }}>{selectedEmp.name.charAt(0)}</div>
                        {selectedEmp.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 13: Role & Access Management View */}
                <h4 style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>System Access & Roles</h4>
                <div style={{ padding: '16px', border: '1px solid var(--ceo-border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Assigned Role: {selectedEmp.role}</div>
                    <button style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '12px', cursor: 'pointer' }}>Change Role</button>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>This user has full access to the {selectedEmp.role} portal and related analytics dashboards.</div>
                </div>

              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--ceo-border)', background: 'var(--ceo-card-bg)', display: 'flex', gap: '12px' }}>
                <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Edit Employee</button>
                <button style={{ flex: 1, background: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FileText size={16} /> View Full Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
