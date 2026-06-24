import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, UserPlus, GraduationCap, CheckSquare, Clock, ShieldCheck, 
  Target, BarChart3, MessageSquare, Briefcase, Settings, DoorOpen, Calendar, Coins,
  ChevronRight, ChevronDown, Activity, Database, Share2, Workflow, BookOpen, Fingerprint, ArrowDown
} from 'lucide-react';

const exhaustiveHrData = [
  {
    id: 'dashboard',
    title: 'HR Global Dashboard',
    icon: <LayoutDashboard size={20} />,
    description: 'Global overview of company headcount, pending final approvals, and systemic health.',
    flows: [
      {
        actionName: 'Fetch Global Demographics (Read)',
        trigger: 'HR logs into the ERP or navigates to the Home route ("/") from the sidebar.',
        processing: 'System executes heavy aggregation queries calculating total headcount, gender ratio, and monthly attrition.',
        validation: 'Validates HR `role` permission level before returning aggregate metrics.',
        storage: 'Fetches `COUNT` and `GROUP BY` data from the `users`, `resignations`, and `candidates` tables.',
        routing: 'Renders the top-level charts (e.g., "Active Employees", "Open Positions") on the UI.'
      },
      {
        actionName: 'Action Pending HR Queues (Routing)',
        trigger: 'HR clicks on a "Pending Final Approval" alert (e.g., Leaves already approved by TL).',
        processing: 'System filters the target table for `hr_approval = pending`.',
        validation: 'None.',
        storage: 'Reads cached or direct query data without modification.',
        routing: 'Navigates the HR Admin directly to the specific pending queue in the respective module.'
      }
    ]
  },
  {
    id: 'employees',
    title: 'Employee Registry',
    icon: <Users size={20} />,
    description: 'The master database controlling employee access, salaries, and reporting hierarchies.',
    flows: [
      {
        actionName: 'Create New Employee (Create)',
        trigger: 'HR clicks "Add Employee", fills out the global form (Name, Salary, TL Assignment) and clicks Save.',
        processing: 'System hashes the default password (e.g., using bcrypt). Generates a unique Employee ID.',
        validation: 'Ensures the provided Email ID does not already exist in the system. Ensures mandatory fields (Salary, Manager) are filled.',
        storage: 'Inserts the core identity record into the `users` table.',
        routing: 'Triggers an automated welcome email with login credentials to the new employee\'s personal email.'
      },
      {
        actionName: 'Update Salary / Role (Update)',
        trigger: 'HR edits an active employee\'s profile, changes their Base Salary or Designation, and clicks Save.',
        processing: 'System records the previous value into the `job_history` table before updating the main record.',
        validation: 'Strict RBAC check: Only HR/Admin can modify these protected fields.',
        storage: 'Overwrites `salary` and `designation` in `users`, and inserts a new row into `job_history`.',
        routing: 'Propagates changes immediately to the Payroll engine for the next cycle calculation.'
      },
      {
        actionName: 'Deactivate Employee (Update)',
        trigger: 'HR toggles an employee\'s status from "Active" to "Inactive".',
        processing: 'Instantly invalidates any active JWT session tokens for that user.',
        validation: 'Cannot deactivate an employee if they have pending unresolved escalations.',
        storage: 'Updates `status` column in `users` table to `inactive`.',
        routing: 'Logs the user out and locks their access across all portals globally.'
      }
    ]
  },
  {
    id: 'recruitment',
    title: 'Recruitment (ATS)',
    icon: <UserPlus size={20} />,
    description: 'Applicant Tracking System for managing job postings and candidate pipelines.',
    flows: [
      {
        actionName: 'Publish Job Posting (Create)',
        trigger: 'HR creates a Job Description, sets requirements, and clicks "Publish".',
        processing: 'Generates a unique public application URL for the job.',
        validation: 'Job title and department fields are mandatory.',
        storage: 'Inserts into `job_postings` table with `status` = "open".',
        routing: 'Makes the posting live on the external Careers page/API.'
      },
      {
        actionName: 'Move Candidate Stage (Update)',
        trigger: 'HR drags a candidate card from "Applied" to "Interviewing" or "Hired" on the Kanban board.',
        processing: 'System logs the timestamp of the stage change.',
        validation: 'None.',
        storage: 'Updates the `stage` column in the `candidates` table.',
        routing: 'If moved to "Hired", it triggers an alert to initiate the Onboarding flow.'
      }
    ]
  },
  {
    id: 'onboarding',
    title: 'Onboarding Checklists',
    icon: <Briefcase size={20} />,
    description: 'Automated task delegation for new hires across IT, Admin, and Finance.',
    flows: [
      {
        actionName: 'Trigger Onboarding Flow (Create)',
        trigger: 'HR clicks "Initiate Onboarding" for a hired candidate.',
        processing: 'System clones the default department-specific checklist templates.',
        validation: 'Requires the candidate to be in the "Hired" stage.',
        storage: 'Inserts multiple rows into `onboarding_tasks` assigned to IT (Laptop), Finance (Bank details), etc.',
        routing: 'Pushes task notifications to the respective department heads.'
      },
      {
        actionName: 'Verify Document Submission (Update)',
        trigger: 'HR reviews uploaded KYC docs (Aadhar, PAN) from the new hire and clicks "Verify".',
        processing: 'Flags the documents as legally compliant.',
        validation: 'Manual HR visual verification required.',
        storage: 'Updates the `is_verified` boolean in the `user_documents` table.',
        routing: 'Unlocks the final step to grant Employee Portal access.'
      }
    ]
  },
  {
    id: 'lnd',
    title: 'Learning & Development',
    icon: <GraduationCap size={20} />,
    description: 'Assignment and tracking of mandatory compliance training or skill upgrades.',
    flows: [
      {
        actionName: 'Assign Training Module (Create)',
        trigger: 'HR selects a Department and assigns a new Training Course (e.g., POSH Compliance).',
        processing: 'System identifies all active users within the target department.',
        validation: 'Course must exist in the master L&D catalog.',
        storage: 'Bulk inserts rows into `training_progress` mapping the `course_id` to each `user_id`.',
        routing: 'Sends an email to all assigned employees with a deadline to complete the module.'
      }
    ]
  },
  {
    id: 'attendance',
    title: 'Global Attendance Control',
    icon: <Clock size={20} />,
    description: 'Global override capabilities for attendance regularization and auditing.',
    flows: [
      {
        actionName: 'HR Override Correction (Update)',
        trigger: 'HR clicks "Override" on an employee\'s attendance record to manually set them as "Present".',
        processing: 'Bypasses the standard TL approval requirement due to HR Admin privilege.',
        validation: 'HR must input a mandatory system remark explaining the override (e.g., "Biometric Failure").',
        storage: 'Updates the `attendance` table directly and logs the action in `audit_logs`.',
        routing: 'Re-calculates the employee\'s total monthly present days for Payroll.'
      }
    ]
  },
  {
    id: 'leave',
    title: 'Leave & Holidays (Final)',
    icon: <Calendar size={20} />,
    description: 'Final deduction authority and global calendar management.',
    flows: [
      {
        actionName: 'Final Leave Authorization (Update)',
        trigger: 'HR reviews a TL-Approved leave and clicks "Final Approve".',
        processing: 'System calculates the exact days to deduct based on the leave policy.',
        validation: 'Ensures the leave is currently at `tl_approved` status.',
        storage: 'Updates `leave_requests` to `hr_approved`. Decrements the specific category quota in `leave_balances`.',
        routing: 'Sends final confirmation email to the employee. Locks the dates in the timesheet.'
      },
      {
        actionName: 'Set Global Holiday (Create)',
        trigger: 'HR adds a new public holiday (e.g., "Diwali") to the global calendar.',
        processing: 'System marks that specific date as non-working.',
        validation: 'Date cannot be in the past.',
        storage: 'Inserts a record into the `global_holidays` table.',
        routing: 'Instantly reflects on all employee calendars and adjusts SLA/Timesheet calculations globally.'
      }
    ]
  },
  {
    id: 'appraisals',
    title: 'Appraisals & Performance',
    icon: <Target size={20} />,
    description: 'Controlling the yearly review cycles and applying normalization curves.',
    flows: [
      {
        actionName: 'Initiate Appraisal Cycle (Create)',
        trigger: 'HR clicks "Start Cycle", sets start/end dates, and publishes.',
        processing: 'Unlocks the Self-Appraisal UI on the Employee portal.',
        validation: 'Cannot overlap with another active appraisal cycle in the same financial year.',
        storage: 'Inserts a new record into `appraisal_cycles` with status "active".',
        routing: 'Broadcasts a global announcement to all employees to begin their reviews.'
      },
      {
        actionName: 'Normalize Scores (Update)',
        trigger: 'HR reviews the Bell Curve of TL ratings and manually adjusts a specific score.',
        processing: 'Overrides the TL\'s rating with the HR normalized rating for fairness.',
        validation: 'Only allowed during the "HR Review" phase of the cycle.',
        storage: 'Updates the `hr_normalized_score` column in `appraisal_scorecards`.',
        routing: 'Finalizes the score to be used for the salary increment calculation.'
      }
    ]
  },
  {
    id: 'timesheets',
    title: 'Timesheet Audits',
    icon: <CheckSquare size={20} />,
    description: 'Pre-payroll auditing of billable hours.',
    flows: [
      {
        actionName: 'Export Audited Hours (Read)',
        trigger: 'HR selects a month and clicks "Export for Billing".',
        processing: 'Aggregates all "Approved" timesheets across all TLs.',
        validation: 'None.',
        storage: 'Queries `timesheet_rows` joined with `projects` to segment billable vs non-billable hours.',
        routing: 'Generates a CSV or Excel file for the Finance department.'
      }
    ]
  },
  {
    id: 'exits',
    title: 'Exits & Resignations',
    icon: <DoorOpen size={20} />,
    description: 'Offboarding logistics and Full & Final settlement workflows.',
    flows: [
      {
        actionName: 'Approve Resignation (Update)',
        trigger: 'HR accepts an employee\'s resignation request and sets the Last Working Day (LWD).',
        processing: 'Initiates the automated notice period countdown in the system.',
        validation: 'LWD must be > current date.',
        storage: 'Updates `status` in `resignations` to "approved".',
        routing: 'Triggers the Exit Checklist generation for IT, Admin, and Finance.'
      },
      {
        actionName: 'Process F&F Settlement (Update)',
        trigger: 'HR clicks "Generate F&F", reviews pending leave encashments, and submits.',
        processing: 'Calculates final payout including prorated salary and pending deductions.',
        validation: 'All exit checklists (IT laptop return, etc.) must be marked 100% complete.',
        storage: 'Generates final `payslips` record and marks `users` status as "inactive".',
        routing: 'Routes the final payout figure to the CEO for ultimate authorization.'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Compliance Reports',
    icon: <BarChart3 size={20} />,
    description: 'Extraction of regulatory and demographic data.',
    flows: [
      {
        actionName: 'Download EPF/TDS Report (Read)',
        trigger: 'HR applies "Compliance" filter and clicks Export.',
        processing: 'System formats data according to government portal upload schemas.',
        validation: 'None.',
        storage: 'Queries sensitive payroll and user demographic tables.',
        routing: 'Generates a highly secure PDF or CSV for local download.'
      }
    ]
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: <Settings size={20} />,
    description: 'Configuring global ERP parameters.',
    flows: [
      {
        actionName: 'Update Global Variables (Update)',
        trigger: 'HR changes the "Late Grace Period" from 15 mins to 10 mins and clicks Save.',
        processing: 'System flushes the current config cache.',
        validation: 'Only Top-Level HR Admins can access this route.',
        storage: 'Updates the JSON payload in the `system_settings` table.',
        routing: 'Changes take effect immediately globally on the next employee check-in.'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Global Broadcasts',
    icon: <MessageSquare size={20} />,
    description: 'Sending company-wide alerts bypassing standard chat channels.',
    flows: [
      {
        actionName: 'Send Global Announcement (Create)',
        trigger: 'HR types an urgent policy update and clicks "Broadcast".',
        processing: 'Creates an immutable alert banner payload.',
        validation: 'Text must not be empty.',
        storage: 'Inserts a record into the `announcements` table with `audience` = "ALL".',
        routing: 'Pushes instantly via WebSockets to every active dashboard across the ERP. Pins the message to the top.'
      }
    ]
  }
];

// Visual Flowchart Step Component
const FlowchartStep = ({ stepNumber, title, content, icon: Icon, color, isLast }) => {
  return (
    <div style={{ display: 'flex', gap: '20px', minHeight: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px' }}>
        {/* Node Circle */}
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color.bg, 
          border: `2px solid ${color.border}`, display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: color.icon, zIndex: 2, flexShrink: 0 
        }}>
          <Icon size={16} />
        </div>
        
        {/* Connecting Line */}
        {!isLast && (
          <div style={{ 
            width: '2px', flex: 1, backgroundColor: color.border, 
            position: 'relative', marginTop: '4px', marginBottom: '4px' 
          }}>
             <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', color: color.border }}>
               <ArrowDown size={10} />
             </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '24px', paddingTop: '4px' }}>
        <div style={{ 
          backgroundColor: '#ffffff', border: `1px solid ${color.border}`, borderRadius: '12px', 
          padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative' 
        }}>
          <div style={{
            position: 'absolute', left: '-6px', top: '10px', width: '10px', height: '10px',
            backgroundColor: '#ffffff', borderLeft: `1px solid ${color.border}`, borderBottom: `1px solid ${color.border}`,
            transform: 'rotate(45deg)'
          }}></div>
          
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: color.icon }}>
            {title}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#3f3f46', lineHeight: '1.6' }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};


export default function HrInstructions() {
  const [activeModule, setActiveModule] = useState(exhaustiveHrData[0]);
  const [expandedNodes, setExpandedNodes] = useState([]);

  const toggleNode = (index) => {
    setExpandedNodes(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const nodeVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: '16px', transition: { duration: 0.4, ease: 'easeOut' } }
  };

  // Step colors
  const stepColors = {
    trigger: { bg: '#f1f5f9', border: '#94a3b8', icon: '#475569' },     
    validation: { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626' },   
    storage: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a' },      
    routing: { bg: '#fdf4ff', border: '#f0abfc', icon: '#c026d3' }       
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '340px', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b', zIndex: 10 }}>
        
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #1e293b', background: 'linear-gradient(to bottom, rgba(30, 41, 59, 0.5), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
              <Fingerprint size={20} style={{ color: '#8b5cf6' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: '#f8fafc' }}>
              HR Architecture Manual
            </h1>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
            Visual Flowcharts for Global HR Admin Operations.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {exhaustiveHrData.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                marginBottom: '8px',
                backgroundColor: activeModule.id === mod.id ? '#1e293b' : 'transparent',
                border: '1px solid',
                borderColor: activeModule.id === mod.id ? '#8b5cf6' : 'transparent',
                borderRadius: '12px',
                color: activeModule.id === mod.id ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ color: activeModule.id === mod.id ? '#8b5cf6' : '#64748b' }}>
                {mod.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{mod.title}</span>
              {activeModule.id === mod.id && <ChevronRight size={18} style={{ color: '#8b5cf6' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CANVAS: Interactive Flowchart */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px', position: 'relative', backgroundColor: '#f1f5f9' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            {/* Header section for the Canvas */}
            <div style={{ marginBottom: '48px', paddingBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                {activeModule.title}
              </h2>
              <p style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: '1.6' }}>
                {activeModule.description}
              </p>
            </div>

            {/* THE FLOWCHART (Collapsible Nodes) */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
              
              {activeModule.flows.map((flow, index) => {
                const isExpanded = expandedNodes.includes(index);
                return (
                  <motion.div key={index} variants={nodeVariants} style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                    
                    {/* Main Interactive Action Node Box */}
                    <div style={{ backgroundColor: '#ffffff', border: isExpanded ? '2px solid #8b5cf6' : '1px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: isExpanded ? '0 10px 25px -5px rgba(139, 92, 246, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                      
                      {/* Action Header (Clickable) */}
                      <button 
                        onClick={() => toggleNode(index)}
                        style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ padding: '12px', backgroundColor: isExpanded ? '#f3e8ff' : '#f1f5f9', borderRadius: '12px', color: isExpanded ? '#7c3aed' : '#475569', transition: 'all 0.3s ease' }}>
                            <Activity size={20} />
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>System Action</p>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                              {flow.actionName}
                            </h3>
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} style={{ color: '#94a3b8', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                          <ChevronDown size={24} />
                        </motion.div>
                      </button>

                      {/* TRUE VISUAL FLOWCHART inside the expander */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ paddingTop: '32px', marginTop: '24px', borderTop: '1px dashed #cbd5e1', paddingLeft: '16px', paddingRight: '16px' }}>
                              
                              <FlowchartStep 
                                stepNumber={1} 
                                title="1. Trigger & Processing" 
                                content={
                                  <><span style={{fontWeight: 600}}>Trigger:</span> {flow.trigger}<br/><br/><span style={{fontWeight: 600}}>Process:</span> {flow.processing}</>
                                } 
                                icon={Workflow} 
                                color={stepColors.trigger} 
                              />

                              <FlowchartStep 
                                stepNumber={2} 
                                title="2. Business Logic & Validation" 
                                content={flow.validation} 
                                icon={ShieldCheck} 
                                color={stepColors.validation} 
                              />

                              <FlowchartStep 
                                stepNumber={3} 
                                title="3. Database Storage" 
                                content={flow.storage} 
                                icon={Database} 
                                color={stepColors.storage} 
                              />

                              <FlowchartStep 
                                stepNumber={4} 
                                title="4. System Routing & Network" 
                                content={flow.routing} 
                                icon={Share2} 
                                color={stepColors.routing} 
                                isLast={true} 
                              />

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
