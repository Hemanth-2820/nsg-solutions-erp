import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Plus, Calendar, FileText, Send, Clock, 
  BarChart2, Users, AlertTriangle, Eye, ArrowRight, Download,
  MoreVertical, CheckCircle, Bell, ChevronRight, X, Image,
  Paperclip, Bold, Italic, Underline, Link, List, Quote, Edit2, ShieldAlert
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
  { title: "Total Announcements", value: "142", trend: "up", percent: "12%", icon: <Megaphone size={20} color="#3B82F6" />, color: "info" },
  { title: "Published This Month", value: "18", trend: "up", percent: "5%", icon: <Send size={20} color="#10B981" />, color: "success" },
  { title: "Scheduled Posts", value: "4", trend: "down", percent: "2%", icon: <Calendar size={20} color="#F59E0B" />, color: "warning" },
  { title: "Employee Read Rate", value: "86%", trend: "up", percent: "4%", icon: <Eye size={20} color="#8B5CF6" />, color: "purple" },
  { title: "Department Reach", value: "100%", trend: "flat", percent: "0%", icon: <Users size={20} color="#10B981" />, color: "success" },
  { title: "Unread Communications", value: "320", trend: "down", percent: "15%", icon: <Bell size={20} color="#FCA5A5" />, color: "critical" },
  { title: "Engagement Score", value: "9.2/10", trend: "up", percent: "1 pt", icon: <BarChart2 size={20} color="#86EFAC" />, color: "success" },
  { title: "Priority Alerts Sent", value: "2", trend: "up", percent: "100%", icon: <AlertTriangle size={20} color="#EF4444" />, color: "critical" },
];

const announcements = [
  { id: "COM-042", title: "Q2 Townhall & Strategic Update", cat: "Leadership Message", prio: "High Priority", aud: "Entire Organization", date: "Today, 10:00 AM", status: "Published", reads: "85%" },
  { id: "COM-043", title: "Updated WFH Guidelines 2026", cat: "Policy Update", prio: "Important", aud: "Entire Organization", date: "28 May 2026", status: "Published", reads: "92%" },
  { id: "COM-044", title: "New ERP Deployment Schedule", cat: "Company Update", prio: "Normal", aud: "IT Department", date: "02 Jun 2026", status: "Scheduled", reads: "0%" },
  { id: "COM-045", title: "Draft: Q3 Financial Goals", cat: "Leadership Message", prio: "Normal", aud: "Finance Department", date: "-", status: "Draft", reads: "0%" },
];

const alerts = [
  { title: "Server Maintenance Downtime (Critical)", time: "Tomorrow, 02:00 AM", cat: "System Alert", level: "Critical" },
  { title: "Compliance Training Deadline", time: "30 May 2026", cat: "Compliance Alert", level: "High Priority" },
];

const leadership = [
  { title: "CEO Quarterly Broadcast", snippet: "Team, we have crossed ₹40M in revenue this quarter...", date: "25 May 2026" },
  { title: "Strategic OKR Realignment", snippet: "Starting next month, all departments will shift focus to...", date: "12 May 2026" },
];

const readers = [
  { name: "John Doe", dept: "Engineering", time: "Today, 10:05 AM", status: "Read" },
  { name: "Jane Smith", dept: "Marketing", time: "Today, 10:15 AM", status: "Read" },
  { name: "Mike Ross", dept: "Sales", time: "-", status: "Unread" },
  { name: "Sarah Connor", dept: "IT Infra", time: "Today, 11:30 AM", status: "Read" },
];

const timeline = [
  { time: "Today, 10:00 AM", user: "Vivek C.", action: "Published 'Q2 Townhall & Strategic Update'", cat: "Leadership Message" },
  { time: "Yesterday, 4:30 PM", user: "HR Team", action: "Scheduled 'June Payroll Cutoff Notice'", cat: "HR Communication" },
  { time: "28 May 2026", user: "Vivek C.", action: "Archived 'Q1 Results Announcement'", cat: "Archive" },
];

const chartData = [
  { name: 'Mon', reads: 420 },
  { name: 'Tue', reads: 580 },
  { name: 'Wed', reads: 490 },
  { name: 'Thu', reads: 650 },
  { name: 'Fri', reads: 720 },
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

export default function Announcements() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [receiptsOpen, setReceiptsOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);

  const getPriorityColor = (p) => {
    switch(p) {
      case 'Critical': return '#EF4444';
      case 'High Priority': return '#F97316';
      case 'Important': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'Published': return 'success';
      case 'Scheduled': return 'warning';
      case 'Draft': return 'neutral';
      case 'Expired': return 'critical';
      default: return 'neutral';
    }
  };

  const openReceipts = (comm) => {
    setSelectedComm(comm);
    setReceiptsOpen(true);
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Announcements Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Corporate Communications Center</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Organization Broadcasting</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>18 Active Announcements</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>86% Global Read Rate</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Last published: Today, 10:00 AM</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Comms Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <BarChart2 size={16} /> Comms Analytics
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Download size={16} /> Export Report
          </button>
          <button onClick={() => setComposerOpen(!composerOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: composerOpen ? 'rgba(239, 68, 68, 0.1)' : '#3B82F6', border: composerOpen ? '1px solid rgba(239, 68, 68, 0.3)' : 'none', color: composerOpen ? '#EF4444' : 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {composerOpen ? <><X size={16} /> Close Composer</> : <><Plus size={16} /> Create Announcement</>}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {composerOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '32px' }}
          >
            <div className="ceo-dash-card" style={{ padding: '0', border: '1px solid #3B82F6', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '24px', borderBottom: '1px solid var(--ceo-border)' }}>
                <div className="ceo-dash-card-title"><Megaphone size={18} color="#3B82F6" /> Executive Announcement Composer</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', padding: '0 24px 24px 24px' }}>
                {/* SECTION 3 & 4: Composer & Rich Text Editor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Announcement Title <span style={{color: '#EF4444'}}>*</span></label>
                    <input type="text" className="ceo-form-input" placeholder="Enter an executive, attention-grabbing title..." />
                  </div>
                  
                  <div style={{ border: '1px solid var(--ceo-border)', borderRadius: '8px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid var(--ceo-border)', background: 'rgba(255,255,255,0.02)' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><Bold size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><Italic size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><Underline size={16} /></button>
                      <div style={{ width: '1px', height: '16px', background: 'var(--ceo-border)', margin: '0 4px' }}></div>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><List size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><Quote size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer' }}><Link size={16} /></button>
                      <div style={{ width: '1px', height: '16px', background: 'var(--ceo-border)', margin: '0 4px' }}></div>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}><Image size={16} /> Add Image</button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}><Paperclip size={16} /> Attach PDF</button>
                    </div>
                    <textarea 
                      className="ceo-form-input" 
                      style={{ border: 'none', borderRadius: 0, minHeight: '200px', background: 'transparent', resize: 'vertical' }} 
                      placeholder="Write your corporate communication here... (Required)"
                    ></textarea>
                    <div style={{ padding: '8px 12px', fontSize: '11px', color: 'var(--ceo-text-muted)', borderTop: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Max 5MB for attachments (Images/PDFs only).</span>
                      <span>0 Attachments</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 5 & 6: Audience Selection & Scheduling */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '32px', borderLeft: '1px solid var(--ceo-border)' }}>
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Communication Category</label>
                    <select className="ceo-form-input">
                      <option>Leadership Message</option>
                      <option>Company Update</option>
                      <option>Policy Update</option>
                      <option>Emergency Notice</option>
                    </select>
                  </div>
                  
                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Priority Level</label>
                    <select className="ceo-form-input">
                      <option>Normal</option>
                      <option>Important</option>
                      <option>High Priority</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Target Audience (Required)</label>
                    <select className="ceo-form-input">
                      <option>Entire Organization (842 Users)</option>
                      <option>IT Department</option>
                      <option>Sales Department</option>
                      <option>Managers & Above</option>
                    </select>
                  </div>

                  <div className="ceo-form-group" style={{ margin: 0 }}>
                    <label>Publish Schedule</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}><input type="radio" name="sched" defaultChecked /> Publish Immediately</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}><input type="radio" name="sched" /> Schedule for Later</label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Save Draft</button>
                    <button style={{ flex: 2, background: '#10B981', border: 'none', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Send size={16} /> Publish Announcement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: Communication KPI Dashboard */}
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
                <span style={{ color: 'var(--ceo-text-muted)' }}>trend</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* SECTION 7: Active Announcements Grid */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: 0 }}>
            <div className="ceo-dash-card-header" style={{ padding: '24px 24px 0 24px', marginBottom: '16px' }}>
              <div className="ceo-dash-card-title"><FileText size={18} color="#3B82F6" /> Active Announcements Workspace</div>
            </div>
            
            <div className="ceo-approval-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px', padding: '16px 24px' }}>
              <div>Title & Category</div>
              <div>Priority</div>
              <div>Audience</div>
              <div>Publish Date</div>
              <div>Status / Reads</div>
              <div></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {announcements.map((ann, i) => (
                <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 40px', padding: '16px 24px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>{ann.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px' }}>{ann.cat}</div>
                  </div>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getPriorityColor(ann.prio)}`, color: getPriorityColor(ann.prio), fontSize: '11px', fontWeight: 600 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getPriorityColor(ann.prio) }}></div>
                      {ann.prio}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>{ann.aud}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>{ann.date}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`ceo-badge ${getStatusColor(ann.status)}`}>{ann.status}</span>
                    </div>
                    {ann.status === 'Published' && (
                      <div onClick={() => openReceipts(ann)} style={{ fontSize: '11px', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}>
                        <Eye size={12} /> {ann.reads} Read
                      </div>
                    )}
                  </div>
                  <div>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer' }}><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 8 & 10: Leadership & Emergency */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* SECTION 10: Priority Alerts Center */}
            <motion.div variants={itemVariants} className="ceo-dash-card" style={{ borderLeft: '4px solid #EF4444' }}>
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><ShieldAlert size={18} color="#EF4444" /> Emergency Communications</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {alerts.map((alert, i) => (
                  <div key={i} style={{ padding: '16px', background: alert.level === 'Critical' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)', border: `1px solid ${alert.level === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`ceo-badge ${alert.level === 'Critical' ? 'critical' : 'warning'}`}>{alert.cat}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{alert.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: alert.level === 'Critical' ? '#FCA5A5' : '#FCD34D' }}>
                      {alert.title}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SECTION 8: Leadership Broadcast Center */}
            <motion.div variants={itemVariants} className="ceo-dash-card">
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><Megaphone size={18} color="#10B981" /> Leadership Broadcasts</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {leadership.map((lead, i) => (
                  <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{lead.title}</div>
                      <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{lead.date}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.4' }}>
                      "{lead.snippet}"
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#10B981', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Engagement <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
          
          {/* SECTION 11: Communication Analytics Dashboard */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><BarChart2 size={18} color="#3B82F6" /> Communication Read Trends (Last 5 Days)</div>
            </div>
            <div style={{ height: '220px', width: '100%', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#F8FAFC' }} />
                  <Area type="monotone" dataKey="reads" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorReads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* SECTION 13: Communication Activity Timeline */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Clock size={18} color="#8B5CF6" /> Communications Audit Trail</div>
            </div>
            <div style={{ marginTop: '8px' }}>
              {timeline.map((log, i) => (
                <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                  <div className="ceo-timeline-dot" style={{ borderColor: log.cat === 'Archive' ? '#F59E0B' : '#3B82F6' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div className="ceo-timeline-time" style={{ margin: 0 }}>{log.time}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{log.user} • {log.cat}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{log.action}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </motion.div>

      {/* SECTION 9: Read Receipts & Engagement Center (Slide-in Drawer) */}
      <AnimatePresence>
        {receiptsOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999 }}
            onClick={() => setReceiptsOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '480px', background: 'var(--ceo-bg)', borderLeft: '1px solid var(--ceo-border)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Read Receipts & Engagement</div>
                  <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>{selectedComm?.title}</div>
                </div>
                <button onClick={() => setReceiptsOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              
              <div style={{ padding: '24px', borderBottom: '1px solid var(--ceo-border)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ceo-text-primary)' }}>842</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>Recipients</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>724</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>Read</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>118</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase' }}>Unread</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-secondary)', margin: 0 }}>Employee Status</h4>
                  <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}><Filter size={12} style={{ display: 'inline' }} /> Filter</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {readers.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{r.dept}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`ceo-badge ${r.status === 'Read' ? 'success' : 'critical'}`}>{r.status}</span>
                        {r.status === 'Read' && <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px' }}>{r.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '24px', borderTop: '1px solid var(--ceo-border)', background: 'var(--ceo-card-bg)' }}>
                <button style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Download size={16} /> Export Engagement Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
