import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, TrendingUp, AlertTriangle, Crosshair, Users, 
  Briefcase, Activity, Calendar, Download, Plus, 
  ChevronRight, ChevronDown, CheckCircle, BarChart2,
  FileText, ShieldAlert, ArrowRight, CornerDownRight, 
  Layers, Clock, Settings
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
  { title: "Total Objectives", value: "24", trend: "up", percent: "4", icon: <Target size={20} color="#3B82F6" />, color: "info" },
  { title: "Active Key Results", value: "86", trend: "up", percent: "12", icon: <Crosshair size={20} color="#8B5CF6" />, color: "purple" },
  { title: "OKR Achievement Rate", value: "68%", trend: "up", percent: "5%", icon: <TrendingUp size={20} color="#10B981" />, color: "success" },
  { title: "Alignment Score", value: "92/100", trend: "up", percent: "2 pts", icon: <Layers size={20} color="#3B82F6" />, color: "info" },
  { title: "Dept Goal Completion", value: "74%", trend: "flat", percent: "0%", icon: <Users size={20} color="#F59E0B" />, color: "warning" },
  { title: "Linked Projects", value: "45", trend: "up", percent: "8", icon: <Briefcase size={20} color="#10B981" />, color: "success" },
  { title: "At-Risk Objectives", value: "3", trend: "down", percent: "2", icon: <AlertTriangle size={20} color="#EF4444" />, color: "critical" },
  { title: "Success Forecast", value: "85%", trend: "up", percent: "3%", icon: <Activity size={20} color="#10B981" />, color: "success" },
];

const objectives = [
  { 
    id: "OBJ-1", 
    title: "Accelerate Enterprise Market Penetration", 
    desc: "Expand our footprint in the enterprise segment by securing top-tier clients.",
    owner: "Vivek C. (CEO)", 
    quarter: "Q2", 
    prio: "Critical", 
    progress: 75, 
    status: "Active",
    krs: [
      { name: "Close 5 enterprise deals over ₹10M ARR", target: "5 deals", current: "3 deals", unit: "Deals", owner: "Sales VP", due: "30 Jun 2026", progress: 60 },
      { name: "Increase enterprise pipeline by 40%", target: "40%", current: "35%", unit: "Percent", owner: "Marketing Head", due: "30 Jun 2026", progress: 87 }
    ]
  },
  { 
    id: "OBJ-2", 
    title: "Achieve Operational Excellence in Delivery", 
    desc: "Streamline project delivery to maximize margins and client satisfaction.",
    owner: "COO", 
    quarter: "Q2", 
    prio: "High", 
    progress: 42, 
    status: "Active",
    krs: [
      { name: "Reduce average sprint delay to <2 days", target: "2 days", current: "4.5 days", unit: "Days", owner: "Eng Head", due: "30 Jun 2026", progress: 40 },
      { name: "Improve resource utilization to 85%", target: "85%", current: "72%", unit: "Percent", owner: "HR Head", due: "30 Jun 2026", progress: 50 }
    ]
  },
  { 
    id: "OBJ-3", 
    title: "Establish Market-Leading Security Posture", 
    desc: "Upgrade infrastructure to meet international enterprise compliance standards.",
    owner: "CISO", 
    quarter: "Q2", 
    prio: "High", 
    progress: 90, 
    status: "Active",
    krs: [
      { name: "Obtain ISO 27001 Certification", target: "100%", current: "95%", unit: "Percent", owner: "Sec Lead", due: "15 Jun 2026", progress: 95 }
    ]
  }
];

const departments = [
  { name: "Sales & RevOps", objs: 4, krs: 12, comp: 78, align: 95 },
  { name: "Engineering & IT", objs: 6, krs: 24, comp: 62, align: 100 },
  { name: "Marketing", objs: 3, krs: 9, comp: 85, align: 90 },
  { name: "HR & Finance", objs: 4, krs: 10, comp: 45, align: 80 },
];

const timeline = [
  { time: "Today, 11:30 AM", user: "Vivek C.", action: "Updated 'Enterprise Penetration' Objective", impact: "High" },
  { time: "Yesterday, 2:15 PM", user: "Sales VP", action: "Linked 'Project Apollo' to KR-1.2", impact: "Medium" },
  { time: "28 May 2026", user: "System", action: "Flagged OBJ-2 as 'At-Risk' due to low progress", impact: "Critical" },
];

const chartData = [
  { name: 'Week 1', achievement: 15 },
  { name: 'Week 2', achievement: 28 },
  { name: 'Week 3', achievement: 42 },
  { name: 'Week 4', achievement: 55 },
  { name: 'Week 5', achievement: 68 },
];

// ==========================================
// COMPONENTS & ANIMATIONS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const ProgressBar = ({ progress, height = 8 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const color = progress >= 80 ? '#10B981' : progress >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ width: '100%', height: `${height}px`, background: 'rgba(255,255,255,0.1)', borderRadius: `${height/2}px`, overflow: 'hidden' }}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ height: '100%', background: color, borderRadius: `${height/2}px` }}
      />
    </div>
  );
};

export default function StrategyOKRs() {
  const [activeQuarter, setActiveQuarter] = useState("Q2 FY26");
  const [expandedObj, setExpandedObj] = useState(null);
  const [isChangingQuarter, setIsChangingQuarter] = useState(false);

  const handleQuarterChange = (q) => {
    setIsChangingQuarter(true);
    setActiveQuarter(q);
    setTimeout(() => setIsChangingQuarter(false), 500);
  };

  const toggleObj = (id) => {
    if (expandedObj === id) setExpandedObj(null);
    else setExpandedObj(id);
  };

  const getPrioColor = (p) => {
    if (p === 'Critical') return '#EF4444';
    if (p === 'High') return '#F97316';
    if (p === 'Medium') return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Strategy Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Strategic Execution</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Strategy & OKR Command Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>Active Quarter: {activeQuarter}</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>92% Alignment Score</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600 }}>68% Org Goal Achievement</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Strategy On Track</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <FileText size={16} /> Strategy Report
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Users size={16} /> Executive Review
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Plus size={16} /> Create Objective
          </button>
        </div>
      </motion.div>

      {/* SECTION 3: Quarter Management Center */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {['Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26'].map(q => (
          <button 
            key={q} 
            onClick={() => handleQuarterChange(q)}
            style={{ 
              background: activeQuarter === q ? '#1E293B' : 'transparent', 
              border: activeQuarter === q ? '1px solid #3B82F6' : '1px solid var(--ceo-border)', 
              color: activeQuarter === q ? 'white' : 'var(--ceo-text-muted)', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {q} {activeQuarter === q && <span style={{ marginLeft: '8px', color: '#3B82F6' }}>• Active</span>}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {!isChangingQuarter && (
          <motion.div 
            key={activeQuarter}
            variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} 
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            
            {/* SECTION 2: Strategic KPI Dashboard */}
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
                    <span style={{ color: 'var(--ceo-text-muted)' }}>vs previous quarter</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              
              {/* SECTION 4, 5 & 12: OKR Progress Board & Company Objectives Center */}
              <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: 0 }}>
                <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '16px' }}>
                  <div className="ceo-dash-card-title"><Target size={18} color="#3B82F6" /> Company Strategic Objectives</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {objectives.map((obj) => (
                    <div key={obj.id} style={{ borderBottom: '1px solid var(--ceo-border)' }}>
                      <div 
                        onClick={() => toggleObj(obj.id)}
                        style={{ padding: '20px 24px', cursor: 'pointer', background: expandedObj === obj.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '16px' }}
                      >
                        <div style={{ color: 'var(--ceo-text-muted)', transform: expandedObj === obj.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                          <ChevronDown size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 600 }}>{obj.title}</span>
                            <span className="ceo-badge neutral">{obj.status}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: getPrioColor(obj.prio), border: `1px solid ${getPrioColor(obj.prio)}`, padding: '2px 8px', borderRadius: '12px' }}>
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPrioColor(obj.prio) }}></div>
                              {obj.prio} Priority
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', marginBottom: '12px' }}>{obj.desc}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '12px' }}>
                            <span style={{ color: 'var(--ceo-text-muted)' }}>Owner: <span style={{ color: 'var(--ceo-text-primary)' }}>{obj.owner}</span></span>
                            <span style={{ color: 'var(--ceo-text-muted)' }}>{obj.krs.length} Key Results</span>
                          </div>
                        </div>
                        <div style={{ width: '150px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', fontWeight: 600 }}>
                            <span>Progress</span>
                            <span>{obj.progress}%</span>
                          </div>
                          <ProgressBar progress={obj.progress} />
                        </div>
                      </div>

                      {/* KEY RESULTS EXPANSION */}
                      <AnimatePresence>
                        {expandedObj === obj.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}
                          >
                            <div style={{ padding: '16px 24px 16px 60px' }}>
                              <h4 style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Results</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {obj.krs.map((kr, i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--ceo-card-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--ceo-border)' }}>
                                    <CornerDownRight size={16} color="var(--ceo-text-muted)" />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{kr.name}</div>
                                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Owner: {kr.owner} • Target: {kr.target} • Due: {kr.due}</div>
                                    </div>
                                    <div style={{ width: '120px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>
                                        <span>{kr.current}</span>
                                        <span>{kr.progress}%</span>
                                      </div>
                                      <ProgressBar progress={kr.progress} height={6} />
                                    </div>
                                    <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Update</button>
                                  </div>
                                ))}
                                <button style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px dashed var(--ceo-border)', color: '#3B82F6', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Plus size={14} /> Add Key Result
                                </button>
                              </div>

                              {/* SECTION 6 & 7: Strategy Execution Hierarchy & Project Alignment */}
                              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--ceo-border)' }}>
                                <h4 style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Linked Execution Projects</h4>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                  <div style={{ flex: 1, padding: '12px', border: '1px solid var(--ceo-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <Briefcase size={16} color="#10B981" />
                                      <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600 }}>Project Enterprise Scale</div>
                                        <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Contributes 40% to this objective</div>
                                      </div>
                                    </div>
                                    <span className="ceo-badge success">On Track (65%)</span>
                                  </div>
                                  <button style={{ padding: '12px', border: '1px dashed var(--ceo-border)', borderRadius: '8px', background: 'transparent', color: 'var(--ceo-text-muted)', fontSize: '12px', cursor: 'pointer' }}>+ Link Project</button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* SECTION 10: Strategic Risk Center */}
                <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #EF4444' }}>
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><ShieldAlert size={18} color="#EF4444" /> Strategic Risk Center</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#FCA5A5' }}>OBJ-2 Delivery Excellence</span>
                        <span className="ceo-badge critical">High Risk</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', marginBottom: '8px' }}>Resource utilization KR is severely lagging due to hiring freeze.</div>
                      <button style={{ background: 'transparent', border: 'none', color: '#FCA5A5', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>View Mitigation Plan →</button>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#FCD34D' }}>HR Department Alignment</span>
                        <span className="ceo-badge warning">Medium Risk</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Low goal completion rate detected for this quarter.</div>
                    </div>
                  </div>
                </motion.div>

                {/* SECTION 11: Executive Strategy Analytics */}
                <motion.div variants={itemVariants} className="ceo-dash-card">
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><Activity size={18} color="#10B981" /> Quarterly Progress Trend</div>
                  </div>
                  <div style={{ height: '180px', width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAchieve" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                        <Area type="monotone" dataKey="achievement" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAchieve)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
              
              {/* SECTION 8: Department Alignment Dashboard */}
              <motion.div variants={itemVariants} className="ceo-dash-card">
                <div className="ceo-dash-card-header">
                  <div className="ceo-dash-card-title"><Layers size={18} color="#8B5CF6" /> Department Alignment Dashboard</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  {departments.map((dept, i) => (
                    <div key={i} style={{ padding: '16px', border: '1px solid var(--ceo-border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{dept.name}</span>
                        <span style={{ fontSize: '12px', color: dept.align > 90 ? '#10B981' : '#F59E0B' }}>{dept.align}% Aligned</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ceo-text-secondary)', marginBottom: '12px' }}>
                        <span>{dept.objs} Objectives</span>
                        <span>{dept.krs} Key Results</span>
                      </div>
                      <div style={{ fontSize: '11px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Goal Completion</span>
                        <span>{dept.comp}%</span>
                      </div>
                      <ProgressBar progress={dept.comp} height={6} />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* SECTION 14: Strategy Activity Timeline */}
              <motion.div variants={itemVariants} className="ceo-dash-card">
                <div className="ceo-dash-card-header">
                  <div className="ceo-dash-card-title"><Clock size={18} color="#F59E0B" /> Strategic Audit Trail</div>
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
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
