import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Shield, Bell, Globe, User, 
  FileText, History, CheckCircle, AlertTriangle, Smartphone, 
  Monitor, LogOut, Save, RotateCcw, ChevronRight, Activity, 
  Lock, Key, Eye, Clock, ShieldCheck, Mail, MessageSquare, Edit2
} from 'lucide-react';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const kpiData = [
  { title: "Security Score", value: "98/100", status: "Healthy", trend: "up", percent: "2 pts", icon: <Shield size={20} color="#86EFAC" />, color: "success" },
  { title: "Active Sessions", value: "14", status: "Normal", trend: "flat", percent: "0%", icon: <Monitor size={20} color="#93C5FD" />, color: "info" },
  { title: "MFA Adoption", value: "100%", status: "Enforced", trend: "up", percent: "5%", icon: <Key size={20} color="#86EFAC" />, color: "success" },
  { title: "Config Changes", value: "3", status: "Last 7 Days", trend: "down", percent: "12%", icon: <SettingsIcon size={20} color="#FCD34D" />, color: "warning" },
];

const policies = [
  { name: "Global Access Policy", version: "v2.4", updated: "12 May 2026", owner: "Security Team", status: "Active" },
  { name: "Data Retention Policy", version: "v1.2", updated: "01 Jan 2026", owner: "Compliance", status: "Active" },
  { name: "Financial Approval Policy", version: "v3.1", updated: "28 May 2026", owner: "CFO", status: "Pending Review" },
];

const sessions = [
  { device: "MacBook Pro M3", browser: "Chrome 124.0", os: "macOS Sonoma", time: "Active Now", location: "Hyderabad, India", isCurrent: true },
  { device: "iPhone 15 Pro", browser: "Safari Mobile", os: "iOS 17.4", time: "2 hours ago", location: "Hyderabad, India", isCurrent: false },
  { device: "ThinkPad X1", browser: "Edge 123.0", os: "Windows 11", time: "Yesterday, 4:30 PM", location: "Mumbai, India", isCurrent: false },
];

const timeline = [
  { time: "Today, 09:15 AM", user: "Vivek C.", action: "Updated Password Complexity Policy", category: "Security", impact: "High" },
  { time: "Yesterday, 2:30 PM", user: "System", action: "Auto-disabled inactive session (IP: 192.168.1.45)", category: "Access", impact: "Medium" },
  { time: "28 May 2026", user: "Vivek C.", action: "Enabled SMS Notifications for Critical Alerts", category: "Notifications", impact: "Low" },
];

const Toggle = ({ isOn, onToggle }) => (
  <div 
    onClick={onToggle}
    style={{ width: '44px', height: '24px', background: isOn ? '#10B981' : 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 2px', cursor: 'pointer', transition: 'background 0.3s' }}
  >
    <motion.div 
      layout transition={{ type: "spring", stiffness: 700, damping: 30 }}
      style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
      animate={{ x: isOn ? 20 : 0 }}
    />
  </div>
);

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

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Security");
  const [hasChanges, setHasChanges] = useState(false);

  // Form states to trigger changes
  const [toggles, setToggles] = useState({
    mfaEnforced: true,
    geoBlock: false,
    sessionTimeout: true,
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleInput = () => setHasChanges(true);

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Executive Settings Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Administration</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>System Governance</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Enterprise Settings Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ceo-text-primary)' }}>System Governance Dashboard</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Updated 2 days ago</span>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span className="ceo-badge success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> System Healthy</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <History size={16} /> View Audit Logs
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <RotateCcw size={16} /> Restore Defaults
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Save size={16} /> Publish Settings
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2 & 14: Settings Overview KPI & System Health */}
        <div className="ceo-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {kpiData.map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="ceo-dash-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)', fontWeight: 500 }}>{kpi.title}</span>
                <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{kpi.icon}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div className="ceo-kpi-value" style={{ margin: 0 }}>{kpi.value}</div>
                <span className={`ceo-badge ${kpi.color}`}>{kpi.status}</span>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: kpi.trend === 'up' && kpi.color === 'success' ? '#34D399' : kpi.trend === 'down' ? '#F87171' : '#94A3B8', fontWeight: 600 }}>
                  {kpi.trend === 'up' ? '↗' : kpi.trend === 'down' ? '↘' : '→'} {kpi.percent}
                </span>
                <span style={{ color: 'var(--ceo-text-muted)' }}>trend</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 3: Settings Navigation Tabs */}
        <motion.div variants={itemVariants}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '0', gap: '32px' }}>
            {[
              { name: "Security", icon: <Shield size={16} /> },
              { name: "Notifications", icon: <Bell size={16} /> },
              { name: "Localization", icon: <Globe size={16} /> },
              { name: "Account", icon: <User size={16} /> },
              { name: "Governance", icon: <FileText size={16} /> },
              { name: "Audit Logs", icon: <History size={16} /> }
            ].map(tab => (
              <div key={tab.name} onClick={() => setActiveTab(tab.name)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0', fontSize: '14px', fontWeight: 600, color: activeTab === tab.name ? '#3B82F6' : 'var(--ceo-text-muted)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                {tab.icon} {tab.name}
                {activeTab === tab.name && <motion.div layoutId="settingsTab" style={{ position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '2px', background: '#3B82F6' }}></motion.div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* TAB CONTENTS */}
        <div style={{ minHeight: '500px' }}>
          
          {activeTab === 'Security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* SECTION 5: MFA Configuration Panel */}
                <div className="ceo-dash-card">
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><Key size={18} color="#10B981" /> Multi-Factor Authentication (MFA)</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--ceo-border)', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Enforce MFA company-wide</div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Require all employees to use MFA on login</div>
                    </div>
                    <Toggle isOn={toggles.mfaEnforced} onToggle={() => handleToggle('mfaEnforced')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>Authenticator App</span>
                        <span className="ceo-badge success">Primary</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Google Auth, Authy, MS Auth</div>
                    </div>
                    <div style={{ padding: '16px', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>SMS Verification</span>
                        <span className="ceo-badge neutral">Backup</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>OTP sent via Text Message</div>
                    </div>
                  </div>
                </div>

                {/* SECTION 6: Password Policy Center */}
                <div className="ceo-dash-card">
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><Lock size={18} color="#8B5CF6" /> Password Policy & Governance</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="ceo-form-group">
                      <label>Minimum Length</label>
                      <select className="ceo-form-input" defaultValue="12" onChange={handleInput}><option value="8">8 characters</option><option value="12">12 characters (Recommended)</option><option value="16">16 characters</option></select>
                    </div>
                    <div className="ceo-form-group">
                      <label>Password Expiration</label>
                      <select className="ceo-form-input" defaultValue="90" onChange={handleInput}><option value="30">30 Days</option><option value="90">90 Days</option><option value="never">Never</option></select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked onChange={handleInput} /> Require at least one uppercase letter</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked onChange={handleInput} /> Require at least one number</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}><input type="checkbox" defaultChecked onChange={handleInput} /> Require at least one special character (!@#$%^&*)</label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* SECTION 4: Security Control Center */}
                <div className="ceo-dash-card">
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><ShieldCheck size={18} color="#F59E0B" /> Access Control & Monitoring</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--ceo-border)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>Geo-Blocking</div>
                        <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Block logins from unauthorized countries</div>
                      </div>
                      <Toggle isOn={toggles.geoBlock} onToggle={() => handleToggle('geoBlock')} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--ceo-border)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>Session Timeout</div>
                        <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Auto-logout after 30 minutes of inactivity</div>
                      </div>
                      <Toggle isOn={toggles.sessionTimeout} onToggle={() => handleToggle('sessionTimeout')} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>New Device Verification</div>
                        <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Require email verification for unknown devices</div>
                      </div>
                      <Toggle isOn={true} onToggle={() => handleInput()} />
                    </div>
                  </div>
                </div>

                {/* SECTION 11: Active Sessions & Device Monitoring */}
                <div className="ceo-dash-card">
                  <div className="ceo-dash-card-header">
                    <div className="ceo-dash-card-title"><Activity size={18} color="#3B82F6" /> Your Active Sessions</div>
                    <button style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Sign out all other sessions</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessions.map((sess, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                          {sess.os.includes('iOS') ? <Smartphone size={20} color="var(--ceo-text-secondary)" /> : <Monitor size={20} color="var(--ceo-text-secondary)" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>{sess.device} {sess.isCurrent && <span className="ceo-badge success" style={{ marginLeft: '8px' }}>Current Session</span>}</span>
                            {!sess.isCurrent && <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Revoke Session"><LogOut size={16} /></button>}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>{sess.browser} • {sess.os}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px' }}>{sess.location} • {sess.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {/* SECTION 7: Notification Management Center */}
              <div className="ceo-dash-card">
                <div className="ceo-dash-card-header">
                  <div className="ceo-dash-card-title"><Bell size={18} color="#F59E0B" /> Notification Channels</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--ceo-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={16} color="#3B82F6"/> <div style={{ fontSize: '14px', fontWeight: 600 }}>Email Alerts</div></div>
                    <Toggle isOn={toggles.emailAlerts} onToggle={() => handleToggle('emailAlerts')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--ceo-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MessageSquare size={16} color="#10B981"/> <div style={{ fontSize: '14px', fontWeight: 600 }}>SMS Alerts</div></div>
                    <Toggle isOn={toggles.smsAlerts} onToggle={() => handleToggle('smsAlerts')} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={16} color="#8B5CF6"/> <div style={{ fontSize: '14px', fontWeight: 600 }}>In-App Push Alerts</div></div>
                    <Toggle isOn={toggles.pushAlerts} onToggle={() => handleToggle('pushAlerts')} />
                  </div>
                </div>
              </div>
              
              <div className="ceo-dash-card">
                <div className="ceo-dash-card-header">
                  <div className="ceo-dash-card-title"><SettingsIcon size={18} color="#3B82F6" /> Alert Preferences</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Payroll Approvals', 'Budget Overruns', 'Critical Compliance Risks', 'New Project Sign-offs'].map((item, i) => (
                     <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                       <span>{item}</span>
                       <input type="checkbox" defaultChecked onChange={handleInput} />
                     </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Localization' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ceo-dash-card" style={{ maxWidth: '800px' }}>
              {/* SECTION 8: Localization Center */}
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><Globe size={18} color="#3B82F6" /> Regional Settings & Localization</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="ceo-form-group">
                  <label>System Language</label>
                  <select className="ceo-form-input" defaultValue="en" onChange={handleInput}>
                    <option value="en">English (US)</option>
                    <option value="te">Telugu</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                <div className="ceo-form-group">
                  <label>Timezone</label>
                  <select className="ceo-form-input" defaultValue="ist" onChange={handleInput}>
                    <option value="ist">(UTC+05:30) Asia/Kolkata (IST)</option>
                    <option value="est">(UTC-05:00) Eastern Time</option>
                  </select>
                </div>
                <div className="ceo-form-group">
                  <label>Base Currency</label>
                  <select className="ceo-form-input" defaultValue="inr" onChange={handleInput}>
                    <option value="inr">₹ Indian Rupee (INR)</option>
                    <option value="usd">$ US Dollar (USD)</option>
                  </select>
                </div>
                <div className="ceo-form-group">
                  <label>Date Format</label>
                  <select className="ceo-form-input" defaultValue="dmy" onChange={handleInput}>
                    <option value="dmy">DD/MM/YYYY (31/12/2026)</option>
                    <option value="mdy">MM/DD/YYYY (12/31/2026)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Account' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ceo-dash-card" style={{ maxWidth: '800px' }}>
              {/* SECTION 9: Executive Account Settings */}
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><User size={18} color="#10B981" /> Executive Profile</div>
                <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}><Edit2 size={12} style={{ display: 'inline', marginRight: '4px' }}/> Edit Profile</button>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--ceo-border)', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'white' }}>
                  VC
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Vivek Chamanthula</div>
                  <div style={{ fontSize: '14px', color: 'var(--ceo-text-secondary)', marginBottom: '8px' }}>Chief Executive Officer (CEO)</div>
                  <span className="ceo-badge success">Super Admin Privilege</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="ceo-form-group">
                  <label>Primary Email</label>
                  <input type="email" className="ceo-form-input" defaultValue="ceo@nsg.com" disabled />
                </div>
                <div className="ceo-form-group">
                  <label>Contact Number</label>
                  <input type="tel" className="ceo-form-input" defaultValue="+91 9876543210" onChange={handleInput} />
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Change Password</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'Governance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ceo-dash-card">
              {/* SECTION 10: Governance & Policy Center */}
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><FileText size={18} color="#8B5CF6" /> Enterprise Governance Policies</div>
                <button style={{ background: '#3B82F6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ New Policy</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {policies.map((pol, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{pol.name} <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', fontFamily: 'monospace', marginLeft: '8px' }}>{pol.version}</span></div>
                      <div style={{ fontSize: '12px', color: 'var(--ceo-text-secondary)' }}>Owner: {pol.owner} • Last Updated: {pol.updated}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span className={`ceo-badge ${pol.status === 'Active' ? 'success' : 'warning'}`}>{pol.status}</span>
                      <button style={{ background: 'transparent', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Audit Logs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ceo-dash-card">
              {/* SECTION 12: Audit Logs Center */}
              <div className="ceo-dash-card-header">
                <div className="ceo-dash-card-title"><History size={18} color="#F59E0B" /> System Audit Trail</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                {timeline.map((log, i) => (
                  <div key={i} className="ceo-timeline-item" style={{ paddingBottom: '16px' }}>
                    <div className="ceo-timeline-dot" style={{ borderColor: log.impact === 'High' ? '#F59E0B' : '#3B82F6' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <div className="ceo-timeline-time" style={{ margin: 0 }}>{log.time}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>{log.user} • {log.category}</div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--ceo-text-primary)' }}>{log.action}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* SECTION 13: Unsaved Changes Warning System */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', background: '#1E293B', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '24px', border: '1px solid #3B82F6', zIndex: 900 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} color="#F59E0B" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>You have unsaved changes</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setHasChanges(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
              <button onClick={() => setHasChanges(false)} style={{ background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
