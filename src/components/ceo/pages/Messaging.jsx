import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Video, Phone, Hash, Users, Calendar, 
  Search, Bell, MoreVertical, Plus, PhoneMissed, PhoneForwarded,
  FileText, Image as ImageIcon, Paperclip, Mic, Smile, Send, Check, CheckCheck, CheckCircle,
  PlayCircle, Download, Share2, AlertTriangle, Monitor, Activity, 
  Globe, Clock, ChevronRight, X, MicOff, VideoOff, Maximize, PhoneOff, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Active Chats", value: "24", trend: "up", percent: "12%", icon: <MessageSquare size={16} color="#3B82F6" />, color: "info" },
  { title: "Active Meetings", value: "3", trend: "up", percent: "1", icon: <Video size={16} color="#10B981" />, color: "success" },
  { title: "Online Employees", value: "745", trend: "flat", percent: "0", icon: <Globe size={16} color="#8B5CF6" />, color: "purple" },
  { title: "Unread Messages", value: "12", trend: "down", percent: "5", icon: <Bell size={16} color="#EF4444" />, color: "critical" },
];

const chatHistory = [
  { id: 1, sender: "Sarah Jenkins (HR)", msg: "The Q2 talent review documents are ready for your approval.", time: "10:45 AM", type: "incoming", status: "read" },
  { id: 2, sender: "Vivek C.", msg: "Great, I will review them after the board meeting.", time: "10:50 AM", type: "outgoing", status: "read" },
  { id: 3, sender: "Sarah Jenkins (HR)", msg: "Perfect. Also, the new VP of Sales candidate is waiting in lobby.", time: "10:52 AM", type: "incoming", status: "delivered" },
];

const channels = [
  { name: "Leadership Team", type: "group", unread: 0 },
  { name: "Executive Board", type: "group", unread: 2 },
  { name: "Finance", type: "channel", unread: 0 },
  { name: "Engineering", type: "channel", unread: 5 },
  { name: "HR", type: "channel", unread: 0 },
];

const meetings = [
  { title: "Weekly Sync: Executive Board", time: "Today, 11:30 AM", status: "Active Now", participants: 8 },
  { title: "Q3 Strategy Planning", time: "Tomorrow, 10:00 AM", status: "Scheduled", participants: 12 },
];

const files = [
  { name: "Q2_Financial_Report.pdf", sender: "CFO", date: "Today", size: "2.4 MB" },
  { name: "Board_Deck_v3.pptx", sender: "Chief of Staff", date: "Yesterday", size: "15.1 MB" },
];

const timeline = [
  { time: "10:30 AM", user: "Vivek C.", action: "Sent Executive Broadcast to 'All Company'" },
  { time: "10:05 AM", user: "System", action: "Generated AI Notes for 'Engineering Sync'" },
  { time: "09:45 AM", user: "COO", action: "Started Screen Share in 'Operations Channel'" },
];

const chartData = [
  { name: 'Mon', vol: 4000 },
  { name: 'Tue', vol: 3000 },
  { name: 'Wed', vol: 5000 },
  { name: 'Thu', vol: 2780 },
  { name: 'Fri', vol: 6890 },
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

export default function Messaging() {
  const [activeView, setActiveView] = useState("chat"); // 'chat', 'meeting', 'broadcast'
  const [message, setMessage] = useState("");

  const getStatusDot = (status) => {
    let color = "#10B981"; // online
    if (status === 'busy') color = "#EF4444";
    if (status === 'away') color = "#F59E0B";
    if (status === 'offline') color = "#64748B";
    return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, border: '2px solid var(--ceo-bg)' }}></div>;
  };

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Communication Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Executive Portal</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Unified Communication</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Communication Command Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>12 Active Conversations</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600 }}>3 Active Meetings</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Comms Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setActiveView('broadcast')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid #8B5CF6', color: '#8B5CF6', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <AlertTriangle size={16} /> Exec Broadcast
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Video size={16} /> New Meeting
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <MessageSquare size={16} /> New Chat
          </button>
        </div>
      </motion.div>

      {/* SECTION 2: Communication KPI Dashboard */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="ceo-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        {kpiData.map((kpi, idx) => (
          <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
              <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ceo-text-primary)' }}>{kpi.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* SECTION 3: Unified Communication Layout (3-Panel) */}
      <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 280px)', minHeight: '600px' }}>
        
        {/* LEFT SIDEBAR: Communication Hub */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--ceo-card-bg)', border: '1px solid var(--ceo-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* SECTION 14: Search */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--ceo-border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--ceo-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input type="text" placeholder="Search chats, files, meetings..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px 8px 36px', color: 'white', fontSize: '13px' }} />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Direct & Groups */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between' }}>Direct & Groups <Plus size={12} style={{ cursor: 'pointer' }}/></h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div onClick={() => setActiveView('chat')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: activeView === 'chat' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', borderRadius: '8px', cursor: 'pointer', border: activeView === 'chat' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: 'white' }}>SJ</div>
                    <div style={{ position: 'absolute', bottom: -2, right: -2 }}>{getStatusDot('online')}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: activeView === 'chat' ? '#3B82F6' : 'var(--ceo-text-primary)' }}>Sarah Jenkins</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Waiting in lobby...</div>
                  </div>
                </div>
                {channels.filter(c => c.type === 'group').map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={14} color="var(--ceo-text-secondary)" /></div>
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: g.unread ? 700 : 500, color: g.unread ? 'white' : 'var(--ceo-text-secondary)' }}>{g.name}</div>
                    {g.unread > 0 && <span style={{ background: '#EF4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>{g.unread}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0', display: 'flex', justifyContent: 'space-between' }}>Departments <Plus size={12} style={{ cursor: 'pointer' }}/></h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {channels.filter(c => c.type === 'channel').map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    <Hash size={14} color="var(--ceo-text-secondary)" />
                    <div style={{ flex: 1, fontSize: '13px', fontWeight: c.unread ? 700 : 500, color: c.unread ? 'white' : 'var(--ceo-text-secondary)' }}>{c.name}</div>
                    {c.unread > 0 && <span style={{ background: '#3B82F6', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>{c.unread}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: Meetings */}
            <div>
              <h4 style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Upcoming Meetings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {meetings.map((m, i) => (
                  <div key={i} onClick={() => m.status === 'Active Now' && setActiveView('meeting')} style={{ padding: '12px', background: m.status === 'Active Now' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)', border: m.status === 'Active Now' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: m.status === 'Active Now' ? '#10B981' : 'white' }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{m.time}</span>
                      <span>{m.participants} Ppl</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* CENTER PANEL: Main Workspace */}
        <div style={{ flex: 1, background: 'var(--ceo-card-bg)', border: '1px solid var(--ceo-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          <AnimatePresence mode="wait">
            {/* SECTION 5: One-to-One Chat Workspace */}
            {activeView === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--ceo-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600, color: 'white' }}>SJ</div>
                      <div style={{ position: 'absolute', bottom: 0, right: 0 }}>{getStatusDot('online')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>Sarah Jenkins <span className="ceo-badge neutral">VP HR</span></div>
                      <div style={{ fontSize: '12px', color: '#10B981' }}>Online</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={16} /></button>
                    <button onClick={() => setActiveView('meeting')} style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Video size={16} /></button>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Today, 10:45 AM</div>
                  {chatHistory.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'outgoing' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexDirection: msg.type === 'outgoing' ? 'row-reverse' : 'row' }}>
                        {msg.type === 'incoming' && <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'white', flexShrink: 0 }}>SJ</div>}
                        <div style={{ maxWidth: '400px', background: msg.type === 'outgoing' ? '#3B82F6' : 'rgba(255,255,255,0.05)', border: msg.type === 'incoming' ? '1px solid var(--ceo-border)' : 'none', padding: '12px 16px', borderRadius: '12px', borderBottomRightRadius: msg.type === 'outgoing' ? '4px' : '12px', borderBottomLeftRadius: msg.type === 'incoming' ? '4px' : '12px', color: 'white', fontSize: '14px', lineHeight: '1.5' }}>
                          {msg.msg}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', padding: msg.type === 'outgoing' ? '0 40px 0 0' : '0 0 0 40px' }}>
                        {msg.time} {msg.type === 'outgoing' && (msg.status === 'read' ? <CheckCheck size={12} color="#34D399" /> : <Check size={12} />)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--ceo-border)' }}>
                  <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--ceo-border)', borderRadius: '8px', padding: '12px', alignItems: 'flex-end' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer', padding: '4px' }}><Plus size={20} /></button>
                    <textarea 
                      value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message to Sarah..." 
                      style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '14px', resize: 'none', height: '24px', maxHeight: '100px', outline: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer', padding: '4px' }}><Smile size={18} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer', padding: '4px' }}><Paperclip size={18} /></button>
                      <button style={{ background: message.length > 0 ? '#3B82F6' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}><Send size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECTION 9 & 11: Video Meeting & Screen Sharing Workspace */}
            {activeView === 'meeting' && (
              <motion.div key="meeting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B1220' }}>
                <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="ceo-badge critical" style={{ animation: 'pulse 2s infinite' }}>REC</span>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Weekly Sync: Executive Board</span>
                    <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>00:45:12</span>
                  </div>
                  <button onClick={() => setActiveView('chat')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Maximize size={16} /></button>
                </div>
                
                <div style={{ flex: 1, padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px' }}>
                  {/* Participant Grid (Zoom style) */}
                  <div style={{ background: '#1E293B', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '2px solid #3B82F6' }}>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Mic size={12} color="#10B981" /> Vivek C. (You)</div>
                  </div>
                  <div style={{ background: '#1E293B', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MicOff size={12} color="#EF4444" /> Sarah J.</div>
                  </div>
                  <div style={{ background: '#1E293B', borderRadius: '12px', position: 'relative', overflow: 'hidden', gridColumn: 'span 1' }}>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MicOff size={12} color="#EF4444" /> CFO</div>
                  </div>
                  
                  {/* Screen Share simulation */}
                  <div style={{ background: '#0F172A', borderRadius: '12px', gridColumn: 'span 3', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Monitor size={48} color="var(--ceo-text-secondary)" style={{ marginBottom: '16px' }} />
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ceo-text-secondary)' }}>CFO is sharing screen</div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Q2_Financial_Rollup.xlsx</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Mic size={20} /></button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Video size={20} /></button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Monitor size={20} /></button>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Smile size={20} /></button>
                  <button onClick={() => setActiveView('chat')} style={{ background: '#EF4444', border: 'none', color: 'white', padding: '0 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}><PhoneOff size={18} /> End Call</button>
                </div>
              </motion.div>
            )}

            {/* SECTION 18: Executive Broadcast Center */}
            {activeView === 'broadcast' && (
              <motion.div key="broadcast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={24} color="#8B5CF6" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Executive Broadcast</h2>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Send high-priority alerts or company-wide messages bypassing normal channels.</div>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="ceo-form-group">
                    <label>Broadcast Title</label>
                    <input type="text" className="ceo-form-input" placeholder="e.g. Q3 Strategic Realignment" />
                  </div>
                  <div className="ceo-form-group">
                    <label>Target Audience</label>
                    <select className="ceo-form-input"><option>All Company (842 Employees)</option><option>Leadership Team Only</option></select>
                  </div>
                  <div className="ceo-form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label>Broadcast Message</label>
                    <textarea className="ceo-form-input" style={{ flex: 1, minHeight: '150px', resize: 'none' }} placeholder="Type your executive message here..."></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Schedule</button>
                    <button style={{ background: '#8B5CF6', border: 'none', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={16} /> Send Broadcast Now</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: Contextual Details & Activity */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SECTION 17: Presence & Availability Center */}
          <div className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Users size={16} color="#10B981" /> Key Leadership Presence</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 600 }}>SJ</div><div style={{ position: 'absolute', bottom: -2, right: -2 }}>{getStatusDot('online')}</div></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 600 }}>VP HR</div><div style={{ fontSize: '11px', color: '#10B981' }}>Online</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 600 }}>CF</div><div style={{ position: 'absolute', bottom: -2, right: -2 }}>{getStatusDot('busy')}</div></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 600 }}>CFO</div><div style={{ fontSize: '11px', color: '#EF4444' }}>In a meeting</div></div>
              </div>
            </div>
          </div>

          {/* SECTION 15: Shared Files Hub */}
          <div className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><FileText size={16} color="#3B82F6" /> Recent Files</div>
              <button style={{ background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '11px', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--ceo-border)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={16} color="#3B82F6" /></div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{f.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ceo-text-muted)' }}>{f.sender} • {f.size}</div>
                  </div>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-muted)', cursor: 'pointer' }}><Download size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 13: AI Meeting Notes Workspace */}
          <div className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Award size={16} color="#8B5CF6" /> AI Meeting Summary</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', marginTop: '12px' }}>
              <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 600, marginBottom: '8px' }}>From: Engineering Sync (Yesterday)</div>
              <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
                • Q2 Release is on track for next Friday.<br/>
                • Need approval for additional AWS budget.<br/>
                • Action: CEO to review AWS quote by EOD.
              </div>
              <button style={{ background: 'transparent', border: 'none', color: '#8B5CF6', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>View Full Recording & Transcript →</button>
            </div>
          </div>

          {/* SECTION 20: Communication Activity Timeline */}
          <div className="ceo-dash-card" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Clock size={16} color="#F59E0B" /> Activity Log</div>
            </div>
            <div style={{ marginTop: '12px' }}>
              {timeline.map((log, i) => (
                <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                  <div className="ceo-timeline-dot" style={{ borderColor: '#3B82F6' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div className="ceo-timeline-time" style={{ margin: 0, fontSize: '10px' }}>{log.time}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ceo-text-muted)' }}>{log.user}</div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ceo-text-primary)' }}>{log.action}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
