import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, Download, FileText, 
  Settings, ChevronRight, Activity, Users, ShieldCheck, 
  CheckSquare, AlertOctagon, Scale, AlertTriangle, Eye, EyeOff,
  Briefcase, CheckCircle, Clock, PieChart, BarChart2, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Total Revenue", value: "₹84.5M", trend: "up", percent: "14%", comp: "vs last year", icon: <DollarSign size={20} color="#86EFAC" />, color: "success" },
  { title: "Total Expenses", value: "₹38.2M", trend: "up", percent: "8%", comp: "vs last year", icon: <TrendingDown size={20} color="#FCA5A5" />, color: "critical" },
  { title: "Net Profit (YTD)", value: "₹46.3M", trend: "up", percent: "18%", comp: "vs last year", icon: <TrendingUp size={20} color="#86EFAC" />, color: "success" },
  { title: "Payroll Cost", value: "₹18.4M", trend: "flat", percent: "2%", comp: "vs last quarter", icon: <Users size={20} color="#FCD34D" />, color: "warning" },
  { title: "Budget Utilization", value: "62%", trend: "down", percent: "4%", comp: "vs planned", icon: <PieChart size={20} color="#93C5FD" />, color: "info" },
  { title: "Cash Flow Status", value: "Healthy", trend: "up", percent: "11%", comp: "vs last month", icon: <Activity size={20} color="#86EFAC" />, color: "success" },
  { title: "Compliance Score", value: "98/100", trend: "flat", percent: "0%", comp: "vs last audit", icon: <ShieldCheck size={20} color="#C4B5FD" />, color: "purple" },
  { title: "Pending Approvals", value: "8", trend: "down", percent: "30%", comp: "vs last week", icon: <CheckSquare size={20} color="#FCD34D" />, color: "warning" },
];

const payrollStatus = [
  { dept: "Engineering", employees: 145, amount: "₹4,250,000", status: "Processed" },
  { dept: "Sales", employees: 48, amount: "₹1,850,000", status: "Processed" },
  { dept: "Marketing", employees: 24, amount: "₹850,000", status: "Under Review" },
  { dept: "Operations", employees: 32, amount: "₹920,000", status: "Pending" },
  { dept: "HR & Finance", employees: 18, amount: "₹740,000", status: "Processed" },
];

const salaryComponents = [
  { name: "Basic Salary", type: "Earning", calc: "40% of CTC", value: "40%", isFixed: false },
  { name: "House Rent Allowance", type: "Earning", calc: "50% of Basic", value: "50%", isFixed: false },
  { name: "Travel Allowance", type: "Earning", calc: "Fixed Amount", value: "₹3,000", isFixed: true },
  { name: "Special Allowance", type: "Earning", calc: "Balancing Figure", value: "Auto", isFixed: false },
  { name: "Provident Fund (PF)", type: "Deduction", calc: "12% of Basic", value: "12%", isFixed: false },
  { name: "Professional Tax", type: "Deduction", calc: "Fixed Value", value: "₹200", isFixed: true },
];

const budgets = [
  { dept: "Engineering", allocated: "₹12.5M", used: "₹8.2M", pct: 65, status: "healthy" },
  { dept: "Sales & Marketing", allocated: "₹8.0M", used: "₹7.4M", pct: 92, status: "warning" },
  { dept: "Operations", allocated: "₹4.5M", used: "₹4.8M", pct: 106, status: "critical" },
  { dept: "HR & Admin", allocated: "₹2.5M", used: "₹1.1M", pct: 44, status: "healthy" },
];

const compliance = [
  { name: "GST Filing (GSTR-3B)", status: "Filed", date: "20 May 2026", risk: "compliant" },
  { name: "Provident Fund (ECR)", status: "Processing", date: "Pending", risk: "warning" },
  { name: "ESI Contribution", status: "Filed", date: "15 May 2026", risk: "compliant" },
  { name: "TDS Return (Q4)", status: "Overdue", date: "15 May 2026", risk: "critical" },
  { name: "Payroll Compliance", status: "Verified", date: "01 May 2026", risk: "compliant" },
];

const approvals = [
  { type: "Payroll Run", by: "John Doe (HR Head)", dept: "Organization", amount: "₹8,610,000", priority: "High", status: "Pending" },
  { type: "Capex Request", by: "Sarah Connor", dept: "Engineering", amount: "₹1,250,000", priority: "Normal", status: "Pending" },
  { type: "Marketing Ad Spend", by: "Mike Ross", dept: "Marketing", amount: "₹450,000", priority: "High", status: "Pending" },
  { type: "Travel Reimbursement", by: "Jane Smith", dept: "Sales", amount: "₹45,000", priority: "Normal", status: "Pending" },
];

const expenses = [
  { category: "Payroll & Benefits", amount: "₹18.4M", impact: "High", trend: "up" },
  { category: "Cloud Infrastructure", amount: "₹2.1M", impact: "Medium", trend: "up" },
  { category: "Office & Facilities", amount: "₹1.8M", impact: "Low", trend: "flat" },
  { category: "Software Licenses", amount: "₹850K", impact: "Medium", trend: "down" },
  { category: "Travel & Entertainment", amount: "₹420K", impact: "Low", trend: "up" },
];

const alerts = [
  { type: "critical", msg: "Operations budget exceeded by 6% (₹300K overspend)" },
  { type: "critical", msg: "TDS Return filing for Q4 is overdue by 16 days" },
  { type: "warning", msg: "Marketing ad spend velocity is 40% higher than planned" },
  { type: "warning", msg: "PF ECR generation delayed for current month" },
];

const timeline = [
  { time: "Today, 11:30 AM", user: "Vivek C.", action: "Approved Q2 Marketing Budget adjustment", impact: "High" },
  { time: "Yesterday, 3:15 PM", user: "Finance Team", action: "Initiated May 2026 Payroll Run", impact: "Critical" },
  { time: "28 May 2026", user: "System", action: "GST GSTR-3B Successfully Filed", impact: "Medium" },
  { time: "25 May 2026", user: "Vivek C.", action: "Modified Salary Structure: Increased HRA", impact: "High" },
];

const chartData = [
  { name: 'Jan', revenue: 6.2, expense: 3.1, profit: 3.1 },
  { name: 'Feb', revenue: 7.1, expense: 3.4, profit: 3.7 },
  { name: 'Mar', revenue: 8.5, expense: 3.8, profit: 4.7 },
  { name: 'Apr', revenue: 7.8, expense: 3.5, profit: 4.3 },
  { name: 'May', revenue: 9.2, expense: 4.1, profit: 5.1 },
  { name: 'Jun', revenue: 10.5, expense: 4.3, profit: 6.2 },
];

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// ==========================================
// COMPONENTS
// ==========================================

export default function Finance() {
  const [showMask, setShowMask] = useState(false);

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Finance Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Financial Command Center</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Financial Health & Control</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>FY 2026-2027</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Updated just now</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Settings size={16} /> Financial Settings
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <PieChart size={16} /> Budget Review
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <FileText size={16} /> Generate Report
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Download size={16} /> Export Summary
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Executive Financial KPI Grid */}
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
                  {kpi.trend === 'up' ? <TrendingUp size={14} /> : kpi.trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                  {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>{kpi.comp}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* SECTION 3: Payroll Executive Overview */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Users size={18} color="#F59E0B" /> Payroll Executive Overview</div>
              <button style={{ background: 'transparent', border: 'none', color: '#F59E0B', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View Payroll Run</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--ceo-border)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Employees Paid</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>267</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Cost</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: '#3B82F6' }}>₹8.61M</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payroll Run</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>May '26</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
                <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: '#F59E0B' }}>Pending</div>
              </div>
            </div>

            <div className="ceo-approval-header" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr' }}>
              <div>Department</div>
              <div>Employees</div>
              <div style={{ textAlign: 'right' }}>Total Amount</div>
              <div style={{ textAlign: 'right' }}>Status</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {payrollStatus.map((pr, i) => (
                <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr', padding: '16px', borderBottom: i === payrollStatus.length - 1 ? 'none' : '1px solid var(--ceo-border)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{pr.dept}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>{pr.employees}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>{pr.amount}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`ceo-badge ${pr.status === 'Processed' ? 'success' : pr.status === 'Under Review' ? 'warning' : 'neutral'}`}>{pr.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 4: Salary Structure Builder */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Scale size={18} color="#8B5CF6" /> Salary Structure Builder</div>
              <button onClick={() => setShowMask(!showMask)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer', fontSize: '12px' }}>
                {showMask ? <EyeOff size={14} /> : <Eye size={14} />} {showMask ? "Mask" : "Unmask"}
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '8px', paddingRight: '4px' }}>
              {salaryComponents.map((comp, i) => (
                <div key={i} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ceo-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {comp.name}
                      <span className={`ceo-badge ${comp.type === 'Earning' ? 'success' : 'warning'}`} style={{ padding: '2px 6px', fontSize: '10px' }}>{comp.type}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{comp.calc}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: comp.type === 'Earning' ? '#10B981' : '#F59E0B' }}>
                    {showMask ? comp.value : '••••'}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* SECTION 5 & 6: Budget Allocation & Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          
          {/* SECTION 5: Department Budget Allocation Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Briefcase size={18} color="#3B82F6" /> Dept Budget Utilization</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {budgets.map((bdg, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{bdg.dept}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: bdg.status === 'healthy' ? '#10B981' : bdg.status === 'warning' ? '#F59E0B' : '#EF4444' }}>{bdg.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(bdg.pct, 100)}%` }} transition={{ duration: 1, delay: 0.2 + (i*0.1) }} style={{ height: '100%', background: bdg.status === 'healthy' ? '#10B981' : bdg.status === 'warning' ? '#F59E0B' : '#EF4444', borderRadius: '4px' }}></motion.div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ceo-text-muted)' }}>
                    <span>Used: {bdg.used}</span>
                    <span>Allocated: {bdg.allocated}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 6: Financial Health Analytics */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><BarChart2 size={18} color="#10B981" /> Revenue vs Expense & Profit Trend</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '2px' }}></div> Revenue</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', background: '#EF4444', borderRadius: '2px' }}></div> Expense</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '2px', background: '#10B981' }}></div> Net Profit</span>
              </div>
            </div>

            <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#F8FAFC' }}
                    formatter={(value) => [`₹${value}M`]}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        {/* ROW 4: Compliance & Approvals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
          
          {/* SECTION 7: Compliance Control Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><ShieldCheck size={18} color="#10B981" /> Compliance Control Center</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {compliance.map((comp, i) => (
                <div key={i} className={`ceo-escalation-item ${comp.risk}`} style={{ margin: 0, padding: '12px 16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{comp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Status / Audit Date: {comp.date}</div>
                  </div>
                  <span className={`ceo-badge ${comp.risk === 'compliant' ? 'success' : comp.risk === 'warning' ? 'warning' : 'critical'}`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 8: Financial Approval Queue */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '24px 0 0 0' }}>
            <div className="ceo-dash-card-header" style={{ padding: '0 24px' }}>
              <div className="ceo-dash-card-title"><CheckSquare size={18} color="#FCD34D" /> Financial Approval Inbox</div>
              <button style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Bulk Review</button>
            </div>
            
            <div className="ceo-approval-header" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr' }}>
              <div>Request Type</div>
              <div>Requested By</div>
              <div>Amount</div>
              <div>Priority</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {approvals.map((app, i) => (
                <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{app.type}</div>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{app.by}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{app.dept}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>{app.amount}</div>
                  <div><span className={`ceo-badge ${app.priority === 'High' ? 'warning' : 'neutral'}`}>{app.priority}</span></div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Approve"><CheckCircle size={14} /></button>
                    <button style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Reject"><AlertOctagon size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* ROW 5: Expenses, Risks & Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 9: Expense Monitoring Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><DollarSign size={18} color="#3B82F6" /> Spending Analytics</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {expenses.map((exp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: i === expenses.length - 1 ? 'none' : '1px solid var(--ceo-border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{exp.category}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px' }}>Impact: {exp.impact}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>{exp.amount}</div>
                    <div style={{ color: exp.trend === 'up' ? '#EF4444' : exp.trend === 'down' ? '#10B981' : '#64748B' }}>
                      {exp.trend === 'up' ? <TrendingUp size={14} /> : exp.trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 10: Financial Risk & Alerts */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><ShieldAlert size={18} color="#EF4444" /> Financial Risks & Alerts</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.map((alert, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: alert.type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderLeft: `3px solid ${alert.type === 'critical' ? '#EF4444' : '#F59E0B'}`, borderRadius: '6px' }}>
                  <div style={{ marginTop: '2px' }}>
                    {alert.type === 'critical' ? <AlertOctagon size={16} color="#EF4444" /> : <AlertTriangle size={16} color="#F59E0B" />}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.4', fontWeight: 500, color: alert.type === 'critical' ? '#FCA5A5' : '#FCD34D' }}>
                    {alert.msg}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 11: Finance Activity Timeline */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Activity size={18} color="#8B5CF6" /> Finance Audit Trail</div>
            </div>
            <div style={{ marginTop: '16px' }}>
              {timeline.map((log, i) => (
                <div key={i} className="ceo-timeline-item">
                  <div className="ceo-timeline-dot" style={{ borderColor: log.impact === 'Critical' ? '#EF4444' : log.impact === 'High' ? '#F59E0B' : '#3B82F6' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
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
    </div>
  );
}
