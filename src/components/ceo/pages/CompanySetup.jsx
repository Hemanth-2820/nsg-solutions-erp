import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Save, Upload, Share, Download, History, 
  CheckCircle, AlertCircle, Clock, ChevronRight, Briefcase, 
  Users, MapPin, Scale, FileText, ToggleLeft, ToggleRight, 
  Plus, Edit2, Trash2, Eye, EyeOff, ShieldCheck, Activity, User, Calendar
} from 'lucide-react';
import '../CEO.css';

// ==========================================
// MOCK DATA
// ==========================================
const progressSteps = [
  { name: "Company Information", status: "completed" },
  { name: "Departments", status: "completed" },
  { name: "Designations", status: "completed" },
  { name: "Working Hours", status: "completed" },
  { name: "Leave Policies", status: "pending" },
  { name: "Salary Structures", status: "critical" },
];

const departments = [
  { name: "Engineering & Technology", head: "Sarah Connor", count: 45, status: "Active" },
  { name: "Human Resources", head: "John Doe", count: 8, status: "Active" },
  { name: "Finance & Accounts", head: "Jane Smith", count: 12, status: "Active" },
  { name: "Sales & Marketing", head: "Mike Ross", count: 24, status: "Active" },
  { name: "Operations", head: "Harvey Specter", count: 18, status: "Active" },
];

const designations = [
  { role: "CEO / Founder", level: "L1", reportsTo: "Board", count: 1 },
  { role: "Director", level: "L2", reportsTo: "CEO", count: 4 },
  { role: "Senior Manager", level: "L3", reportsTo: "Director", count: 12 },
  { role: "Team Lead", level: "L4", reportsTo: "Manager", count: 28 },
  { role: "Senior Executive", level: "L5", reportsTo: "Team Lead", count: 45 },
  { role: "Executive", level: "L6", reportsTo: "Senior Executive", count: 80 },
];

const leavePolicies = [
  { name: "Casual Leave (CL)", alloc: "12 Days", carry: "No", encash: "No", chain: "Manager" },
  { name: "Sick Leave (SL)", alloc: "12 Days", carry: "Up to 6", encash: "No", chain: "Manager" },
  { name: "Earned Leave (EL)", alloc: "18 Days", carry: "Up to 30", encash: "Yes", chain: "Manager → HR" },
  { name: "Maternity Leave", alloc: "26 Weeks", carry: "No", encash: "No", chain: "HR → CEO" },
];

const salaryComponents = [
  { name: "Basic Salary", type: "Earning", calc: "% of CTC", value: "40%", isFixed: false },
  { name: "House Rent Allowance (HRA)", type: "Earning", calc: "% of Basic", value: "50%", isFixed: false },
  { name: "Special Allowance", type: "Earning", calc: "Balancing Figure", value: "Auto", isFixed: false },
  { name: "Provident Fund (PF)", type: "Deduction", calc: "% of Basic", value: "12%", isFixed: false },
  { name: "Professional Tax", type: "Deduction", calc: "Fixed Value", value: "₹200", isFixed: true },
];

const policies = [
  { name: "Attendance Policy", status: "Published", updated: "12 Jan 2026", owner: "HR Head" },
  { name: "Work From Home Policy", status: "Draft", updated: "28 May 2026", owner: "HR Head" },
  { name: "Overtime Policy", status: "Published", updated: "05 Mar 2026", owner: "Finance" },
  { name: "Reimbursement Policy", status: "Under Review", updated: "30 May 2026", owner: "Finance" },
];

const compliance = [
  { name: "GST Registration", status: "Verified", date: "15 Jan 2026", risk: "compliant" },
  { name: "PF Registration", status: "Verified", date: "10 Feb 2026", risk: "compliant" },
  { name: "ESI Registration", status: "Pending Update", date: "28 May 2026", risk: "pending" },
  { name: "Labor Law Documentation", status: "Missing", date: "N/A", risk: "critical" },
];

const timeline = [
  { time: "Today, 10:30 AM", user: "Vivek C.", action: "Updated Working Hours Policy", impact: "High" },
  { time: "Yesterday, 4:15 PM", user: "Sarah K.", action: "Added new designation: UI/UX Lead", impact: "Low" },
  { time: "28 May 2026", user: "Vivek C.", action: "Approved new Salary Structure v2.0", impact: "Critical" },
  { time: "25 May 2026", user: "System", action: "GST Verification Complete", impact: "Medium" },
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

export default function CompanySetup() {
  const [showMask, setShowMask] = useState(false);
  const [remoteSupport, setRemoteSupport] = useState(true);

  return (
    <div style={{ padding: '0 32px 32px 32px', maxWidth: '1600px', margin: '0 auto', color: 'var(--ceo-text-primary)' }}>
      
      {/* SECTION 1: Organization Setup Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid var(--ceo-border)', paddingBottom: '24px' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="ceo-badge neutral">Administration</span>
            <ChevronRight size={14} color="var(--ceo-text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Organization Configuration Center</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Company Setup</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1, delay: 0.5 }} style={{ width: '70%', height: '100%', background: '#10B981' }}></motion.div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>70% Setup Complete</span>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'var(--ceo-border)' }}></div>
            <span style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}>Last updated 2 hours ago</span>
            <span className="ceo-badge warning" style={{ marginLeft: '8px' }}>Pre-Live Setup Phase</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <History size={16} /> Audit History
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
            <Share size={16} /> Export Config
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3B82F6', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Save size={16} /> Save Configuration
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B981', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Building2 size={16} /> Publish Changes
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECTION 2: ERP Initialization Progress Tracker */}
        <motion.div variants={itemVariants} className="ceo-dash-card" style={{ padding: '24px' }}>
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><ShieldCheck size={18} color="#8B5CF6" /> ERP Initialization Progress</div>
            <div style={{ fontSize: '13px', color: 'var(--ceo-text-muted)' }}><span style={{ color: '#EF4444', fontWeight: 600 }}>1 Critical Item</span> Missing</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {progressSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: step.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : step.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.status === 'completed' ? <CheckCircle size={14} color="#10B981" /> : step.status === 'pending' ? <Clock size={14} color="#F59E0B" /> : <AlertCircle size={14} color="#EF4444" />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: step.status === 'completed' ? 'var(--ceo-text-primary)' : 'var(--ceo-text-secondary)' }}>Step {i+1}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step.status === 'completed' ? '100%' : step.status === 'pending' ? '40%' : '10%' }} 
                    transition={{ duration: 1, delay: 0.2 + (i * 0.1) }} 
                    style={{ height: '100%', background: step.status === 'completed' ? '#10B981' : step.status === 'pending' ? '#F59E0B' : '#EF4444' }}
                  />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{step.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* SECTION 3: Company Profile Configuration */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Building2 size={18} color="#3B82F6" /> Company Profile</div>
            </div>
            
            <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
              <div style={{ width: '160px', height: '160px', border: '2px dashed var(--ceo-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'all 0.2s' }} className="ceo-btn-hover">
                <Upload size={32} color="var(--ceo-text-muted)" style={{ marginBottom: '12px' }} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Upload Logo</span>
                <span style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginTop: '4px' }}>PNG/JPG, Max 2MB</span>
              </div>
              
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="ceo-form-group">
                  <label>Company Name <span style={{color: '#EF4444'}}>*</span></label>
                  <input type="text" className="ceo-form-input success" defaultValue="NSG Enterprises" />
                  <span className="ceo-form-helper">This name appears on the dashboard</span>
                </div>
                <div className="ceo-form-group">
                  <label>Legal Entity Name <span style={{color: '#EF4444'}}>*</span></label>
                  <input type="text" className="ceo-form-input success" defaultValue="NSG Technologies Pvt Ltd" />
                </div>
                <div className="ceo-form-group">
                  <label>Registration Number (CIN)</label>
                  <input type="text" className="ceo-form-input" defaultValue="U74900MH2010PTC123456" />
                </div>
                <div className="ceo-form-group">
                  <label>GST Number <span style={{color: '#EF4444'}}>*</span></label>
                  <input type="text" className="ceo-form-input success" defaultValue="27XXXXX1234X1ZX" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="ceo-form-group">
                <label>Official Email</label>
                <input type="email" className="ceo-form-input" defaultValue="admin@nsg.com" />
              </div>
              <div className="ceo-form-group">
                <label>Contact Number</label>
                <input type="tel" className="ceo-form-input" defaultValue="+91 98765 43210" />
              </div>
              <div className="ceo-form-group">
                <label>Website</label>
                <input type="url" className="ceo-form-input" defaultValue="https://nsg-erp.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
              <div className="ceo-form-group">
                <label>Registered Address <span style={{color: '#EF4444'}}>*</span></label>
                <input type="text" className="ceo-form-input success" defaultValue="Block A, Tech Park, Hyderabad, 500081" />
              </div>
              <div className="ceo-form-group">
                <label>Base Currency</label>
                <select className="ceo-form-input" defaultValue="INR">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="ceo-form-group">
                <label>Financial Year</label>
                <select className="ceo-form-input" defaultValue="Apr">
                  <option value="Apr">April - March</option>
                  <option value="Jan">Jan - Dec</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* SECTION 4: Organization Structure Center */}
          <motion.div variants={itemVariants} className="ceo-dash-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Briefcase size={18} color="#F59E0B" /> Departments Management</div>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={14} /> Add Dept
              </button>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              {departments.map((dept, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="ceo-btn-hover">
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{dept.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', display: 'flex', gap: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {dept.head}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {dept.count} Staff</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 5: Designation Matrix */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Users size={18} color="#10B981" /> Designation Hierarchy Matrix</div>
              <button style={{ background: 'transparent', border: 'none', color: '#10B981', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Reorder</button>
            </div>

            <div className="ceo-approval-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
              <div>Designation Role</div>
              <div>Level</div>
              <div>Reports To</div>
              <div style={{ textAlign: 'right' }}>Active Emp.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {designations.map((des, i) => (
                <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px', borderBottom: i === designations.length - 1 ? 'none' : '1px solid var(--ceo-border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderLeft: '1px solid var(--ceo-border)', borderBottom: '1px solid var(--ceo-border)', marginLeft: `${i * 8}px` }}></div>
                    {des.role}
                  </div>
                  <div><span className="ceo-badge neutral">{des.level}</span></div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>{des.reportsTo}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>{des.count}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 6: Working Hours Configuration */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Clock size={18} color="#8B5CF6" /> Working Hours & Shifts</div>
              <span className="ceo-badge success">Active Policy</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className="ceo-form-group">
                <label>Office Start Time</label>
                <input type="time" className="ceo-form-input" defaultValue="09:00" />
              </div>
              <div className="ceo-form-group">
                <label>Office End Time</label>
                <input type="time" className="ceo-form-input" defaultValue="18:00" />
              </div>
              <div className="ceo-form-group">
                <label>Grace Period (Minutes)</label>
                <input type="number" className="ceo-form-input" defaultValue="15" />
              </div>
              <div className="ceo-form-group">
                <label>Weekly Working Days</label>
                <select className="ceo-form-input" defaultValue="5">
                  <option value="5">5 Days (Mon-Fri)</option>
                  <option value="6">6 Days (Mon-Sat)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--ceo-border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Overtime Eligibility</div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Allow employees to log OT hours</div>
                </div>
                <ToggleLeft size={32} color="var(--ceo-text-muted)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Remote Work Support</div>
                  <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Enable check-in from non-office IP addresses</div>
                </div>
                <div onClick={() => setRemoteSupport(!remoteSupport)} style={{ cursor: 'pointer' }}>
                  {remoteSupport ? <ToggleRight size={32} color="#10B981" /> : <ToggleLeft size={32} color="var(--ceo-text-muted)" />}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* SECTION 7: Leave Policy Engine */}
        <motion.div variants={itemVariants} className="ceo-dash-card">
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><Calendar size={18} color="#EC4899" /> Leave Policy Engine</div>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--ceo-border)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Add Policy
            </button>
          </div>

          <div className="ceo-approval-header" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 2fr 1fr' }}>
            <div>Leave Type</div>
            <div>Allocation</div>
            <div>Carry Forward</div>
            <div>Encashment</div>
            <div>Approval Chain</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {leavePolicies.map((leave, i) => (
              <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 2fr 1fr', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{leave.name}</div>
                <div style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>{leave.alloc}</div>
                <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>{leave.carry}</div>
                <div><span className={`ceo-badge ${leave.encash === 'Yes' ? 'success' : 'neutral'}`}>{leave.encash}</span></div>
                <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={12} /> {leave.chain}</div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 8: Salary Structure Configuration */}
        <motion.div variants={itemVariants} className="ceo-dash-card">
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><Scale size={18} color="#F59E0B" /> Payroll Foundation & Salary Structure</div>
            <button onClick={() => setShowMask(!showMask)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}>
              {showMask ? <EyeOff size={16} /> : <Eye size={16} />} {showMask ? "Hide Values" : "Show Values"}
            </button>
          </div>

          <div className="ceo-approval-header" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr' }}>
            <div>Component Name</div>
            <div>Type</div>
            <div>Calculation Logic</div>
            <div style={{ textAlign: 'right' }}>Value/Percentage</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {salaryComponents.map((comp, i) => (
              <div key={i} className="ceo-approval-row" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{comp.name}</div>
                <div><span className={`ceo-badge ${comp.type === 'Earning' ? 'success' : 'warning'}`}>{comp.type}</span></div>
                <div style={{ fontSize: '13px', color: 'var(--ceo-text-secondary)' }}>{comp.calc}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right', fontFamily: 'monospace' }}>
                  {showMask ? comp.value : '••••••'}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--ceo-text-secondary)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--ceo-border)' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--ceo-border)', color: 'var(--ceo-text-primary)', padding: '12px', width: '100%', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Custom Component
            </button>
          </div>
        </motion.div>

        {/* SECTION 9: Organization Policy Center */}
        <motion.div variants={itemVariants} className="ceo-dash-card">
          <div className="ceo-dash-card-header">
            <div className="ceo-dash-card-title"><FileText size={18} color="#3B82F6" /> Organization Policy Center</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {policies.map((pol, i) => (
              <div key={i} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--ceo-border)', borderRadius: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{pol.name}</div>
                <span className={`ceo-badge ${pol.status === 'Published' ? 'success' : pol.status === 'Draft' ? 'neutral' : 'warning'}`} style={{ marginBottom: '16px' }}>{pol.status}</span>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)', marginBottom: '4px' }}>Owner: <span style={{ color: 'var(--ceo-text-secondary)' }}>{pol.owner}</span></div>
                <div style={{ fontSize: '11px', color: 'var(--ceo-text-muted)' }}>Updated: {pol.updated}</div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Review</button>
                  <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          
          {/* SECTION 10: Compliance & Audit Overview */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><ShieldCheck size={18} color="#10B981" /> Compliance & Audit Overview</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {compliance.map((comp, i) => (
                <div key={i} className={`ceo-escalation-item ${comp.risk}`} style={{ margin: 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{comp.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ceo-text-muted)' }}>Last Audit: {comp.date}</div>
                  </div>
                  <span className={`ceo-badge ${comp.risk === 'compliant' ? 'success' : comp.risk === 'pending' ? 'warning' : 'critical'}`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SECTION 11: Configuration Activity Timeline */}
          <motion.div variants={itemVariants} className="ceo-dash-card">
            <div className="ceo-dash-card-header">
              <div className="ceo-dash-card-title"><Activity size={18} color="#8B5CF6" /> Configuration Audit Trail</div>
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
            <button style={{ width: '100%', marginTop: '8px', padding: '10px', background: 'transparent', border: '1px dashed var(--ceo-border)', borderRadius: '8px', color: 'var(--ceo-text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}>
              View Full Audit Log
            </button>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
