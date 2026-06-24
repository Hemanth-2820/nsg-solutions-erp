import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Clock, CheckSquare, 
  Coins, CreditCard, Target, User, UserMinus, ShieldCheck,
  Briefcase, MessageSquare, ChevronRight, ChevronDown, Activity, Database, Share2, Workflow, Link, ArrowDown
} from 'lucide-react';

const exhaustiveData = [
  {
    id: 'dashboard',
    title: 'Employee Dashboard',
    icon: <LayoutDashboard size={20} />,
    description: 'Central landing hub aggregating real-time widgets, pending tasks, and announcements.',
    flows: [
      {
        actionName: 'Fetch Dashboard Widgets (Read)',
        trigger: 'Employee logs into the portal or clicks "Dashboard".',
        processing: 'System simultaneously fetches pending leaves, current sprint tasks, and unread announcements.',
        validation: 'Validates active JWT session and ensures employee status is "Active".',
        storage: 'Parallel queries to `leave_requests`, `tasks`, and `announcements` tables based on `user_id`.',
        routing: 'Renders data into high-level visual widgets (Pie charts, list views).'
      }
    ]
  },
  {
    id: 'attendance',
    title: 'Attendance Module',
    icon: <Clock size={20} />,
    description: 'Biometric/Web check-in, check-out, and regularization request flows.',
    flows: [
      {
        actionName: 'Web Check-In (Create)',
        trigger: 'Employee clicks the "Check-In" button at the start of the day.',
        processing: 'Captures precise server timestamp and client IP/Geo-location.',
        validation: 'System rejects if a check-in already exists for today without a check-out. Checks if time > grace period to flag as "Late".',
        storage: 'Inserts a new row into `attendance` table: `date`, `user_id`, `check_in_time`, `status`.',
        routing: 'Disables Check-in button and enables Check-out button. UI updates to "Checked In".'
      },
      {
        actionName: 'Regularization Request (Update)',
        trigger: 'Employee forgot to check out yesterday, clicks "Regularize", inputs valid time, and adds a reason.',
        processing: 'Flags the specific attendance record as "Pending Regularization".',
        validation: 'Reason text box is mandatory. Cannot regularize dates beyond a 7-day lookback window.',
        storage: 'Updates the existing `attendance` row, appending the regularization reason and setting status to `pending_approval`.',
        routing: 'Sends a WebSocket notification and Email to the reporting TL for approval.'
      }
    ]
  },
  {
    id: 'leaves',
    title: 'Leave Management',
    icon: <Calendar size={20} />,
    description: 'Applying for time off, checking balances, and viewing the holiday calendar.',
    flows: [
      {
        actionName: 'Apply for Leave (Create)',
        trigger: 'Employee selects a date range, chooses leave type (e.g., Casual, Sick), adds a reason, and submits.',
        processing: 'Calculates total working days excluding weekends/holidays to determine exact deduction count.',
        validation: 'System checks `leave_balances` table. If applied days > available balance, throws an error. Reason is mandatory.',
        storage: 'Inserts new record into `leave_requests` table with status `pending`.',
        routing: 'Routes the request to the TL dashboard for Level 1 approval.'
      },
      {
        actionName: 'Cancel Applied Leave (Delete)',
        trigger: 'Employee clicks "Cancel" on a future leave that hasn\'t been taken yet.',
        processing: 'Verifies the leave date is in the future. If already approved, refunds the days back to the quota.',
        validation: 'Cannot cancel past leaves. Can only cancel their own leaves.',
        storage: 'Updates status to `cancelled`. If refunded, increments the specific category in `leave_balances`.',
        routing: 'Notifies the TL that the leave was cancelled.'
      }
    ]
  },
  {
    id: 'timesheets',
    title: 'Timesheets & Logging',
    icon: <CheckSquare size={20} />,
    description: 'Logging billable and non-billable hours against specific client projects.',
    flows: [
      {
        actionName: 'Log Daily Hours (Create)',
        trigger: 'Employee selects a Project Code, Task Code, inputs hours (e.g., 4.5), adds a description, and saves.',
        processing: 'Aggregates hours for the current week to show total sum in the UI.',
        validation: 'Daily total cannot exceed 24 hours. Must select a valid active project.',
        storage: 'Inserts multiple rows (one per project/task) into `timesheet_rows` table.',
        routing: 'Saves as `draft` state locally until submitted at the end of the week.'
      },
      {
        actionName: 'Submit Weekly Timesheet (Update)',
        trigger: 'Employee clicks "Submit Timesheet" at the end of the Friday.',
        processing: 'Locks the timesheet UI for that specific week, preventing further edits.',
        validation: 'Total weekly hours must meet the minimum SLA (e.g., 40 hours) unless leaves are applied.',
        storage: 'Updates status of all rows for that week to `submitted`.',
        routing: 'Pushes the timesheet to the TL\'s approval queue for billing.'
      }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll & Payslips',
    icon: <Coins size={20} />,
    description: 'Viewing salary structure, downloading monthly payslips, and tax declarations.',
    flows: [
      {
        actionName: 'Download PDF Payslip (Read)',
        trigger: 'Employee clicks the "Download PDF" icon next to a specific month (e.g., May 2026).',
        processing: 'System retrieves raw salary data, calculates PF/TDS dynamically, and formats it into a PDF buffer.',
        validation: 'Validates that the requested month\'s payroll run status is `disbursed` (locked).',
        storage: 'Read-only query to `payslips` table.',
        routing: 'Triggers a browser download of the PDF file (e.g., `Payslip_May_2026.pdf`).'
      },
      {
        actionName: 'Submit IT Declarations (Create/Update)',
        trigger: 'Employee fills out Section 80C investments, uploads proofs (PDFs), and submits.',
        processing: 'Uploads proofs to a secure S3 bucket and links the URIs to the database.',
        validation: 'Must be submitted before the HR-defined cutoff date. PDF size < 5MB.',
        storage: 'Inserts/Updates `tax_declarations` table and `document_links`.',
        routing: 'Flags the submission for HR Payroll team to verify for TDS calculation.'
      }
    ]
  },
  {
    id: 'expenses',
    title: 'Expense Claims',
    icon: <CreditCard size={20} />,
    description: 'Reimbursement workflow for internet, travel, and client meeting expenses.',
    flows: [
      {
        actionName: 'File New Claim (Create)',
        trigger: 'Employee selects category (e.g., Travel), enters amount, uploads receipt PDF, and submits.',
        processing: 'System flags claims exceeding standard monthly limits for strict audit.',
        validation: 'Receipt upload is strictly mandatory. Amount must be > 0.',
        storage: 'Inserts row into `expense_claims`. Uploads receipt to cloud storage.',
        routing: 'Routes to TL for Level 1 (Verification) and Finance for Level 2 (Payout).'
      }
    ]
  },
  {
    id: 'performance',
    title: 'Performance & Appraisals',
    icon: <Target size={20} />,
    description: 'Yearly self-reviews, tracking OKRs, and receiving manager feedback.',
    flows: [
      {
        actionName: 'Submit Self-Appraisal (Update)',
        trigger: 'During review cycle, employee fills out self-ratings (1-5), adds achievements, and submits.',
        processing: 'Calculates the average self-score and locks the form.',
        validation: 'All rating fields are mandatory. Cannot submit if cycle is not active.',
        storage: 'Updates the `self_rating` and `self_comments` in `appraisal_scorecards` table.',
        routing: 'Notifies the TL that the self-appraisal is ready for manager review.'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Internal Messaging',
    icon: <MessageSquare size={20} />,
    description: 'Real-time WebSocket chat for team and direct communication.',
    flows: [
      {
        actionName: 'Send Real-time Message (Create)',
        trigger: 'Employee types a message in the Team Channel and hits Enter.',
        processing: 'Client encrypts/sanitizes payload and emits `send_message` WebSocket event.',
        validation: 'Message length < 2000 chars. Cannot send if user is deactivated.',
        storage: 'Server inserts message into `chat_messages` table and broadcasts to the room.',
        routing: 'All active clients in the channel instantly receive and render the new message.'
      },
      {
        actionName: 'Upload Chat Attachment (Create)',
        trigger: 'Employee selects an image/PDF in chat and sends.',
        processing: 'File is chunked and uploaded via REST API, returning a CDN URL, which is then sent via WebSocket.',
        validation: 'File type restrictions (No .exe/.bat). Size < 25MB.',
        storage: 'Saves file to object storage. Stores URL in `chat_messages`.',
        routing: 'Clients render the image thumbnail or PDF download link.'
      },
      {
        actionName: 'React to Message (Update)',
        trigger: 'Employee hovers over a message and clicks the "Thumbs Up" emoji.',
        processing: 'Emits a `message_reaction` WebSocket event.',
        validation: 'None.',
        storage: 'Appends user ID to the `reactions` array in the specific `chat_messages` row.',
        routing: 'Instantly updates the reaction counter on all clients.'
      }
    ]
  },
  {
    id: 'profile',
    title: 'Employee Profile',
    icon: <User size={20} />,
    description: 'Personal details, emergency contacts, and profile picture management.',
    flows: [
      {
        actionName: 'Update Display Picture (DP) (Update)',
        trigger: 'Employee clicks their avatar, selects a new image, and crops it.',
        processing: 'Image is compressed and converted to WebP format on the client/server.',
        validation: 'Must be an image format (JPG/PNG).',
        storage: 'Uploads to CDN. Updates `avatar_url` in the `users` table.',
        routing: 'Globally updates the avatar across the dashboard, chat, and headers.'
      }
    ]
  },
  {
    id: 'resignations',
    title: 'Resignations & Exits',
    icon: <UserMinus size={20} />,
    description: 'Initiating the offboarding process and tracking exit checklists.',
    flows: [
      {
        actionName: 'Submit Resignation (Create)',
        trigger: 'Employee sets a proposed Last Working Day (LWD), writes a reason, and clicks "Resign".',
        processing: 'Calculates the exact notice period shortfall (if any) based on policy.',
        validation: 'Cannot submit multiple active resignations. Requires confirmation modal.',
        storage: 'Inserts row into `resignations` with status `pending_manager_approval`.',
        routing: 'Sends High-Priority alert to TL and HR Business Partner to schedule retention discussion.'
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

export default function EmployeeInstructions() {
  const [activeModule, setActiveModule] = useState(exhaustiveData[0]);
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

  // Step colors (Blue Corporate Theme for Employee)
  const stepColors = {
    trigger: { bg: '#f1f5f9', border: '#94a3b8', icon: '#475569' },     
    validation: { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626' },   
    storage: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a' },      
    routing: { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb' }       
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '340px', backgroundColor: '#ffffff', color: '#0f172a', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', zIndex: 10 }}>
        
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(to bottom, rgba(248, 250, 252, 1), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
              <Link size={20} style={{ color: '#2563eb' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', color: '#0f172a' }}>
              Employee Operations
            </h1>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
            Visual Flowcharts for Core Features.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {exhaustiveData.map((mod) => (
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
                backgroundColor: activeModule.id === mod.id ? '#eff6ff' : 'transparent',
                border: '1px solid',
                borderColor: activeModule.id === mod.id ? '#bfdbfe' : 'transparent',
                borderRadius: '12px',
                color: activeModule.id === mod.id ? '#1e3a8a' : '#64748b',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ color: activeModule.id === mod.id ? '#2563eb' : '#94a3b8' }}>
                {mod.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{mod.title}</span>
              {activeModule.id === mod.id && <ChevronRight size={18} style={{ color: '#2563eb' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CANVAS: Interactive Flowchart */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px', position: 'relative', backgroundColor: '#f8fafc' }}>
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
                    <div style={{ backgroundColor: '#ffffff', border: isExpanded ? '2px solid #2563eb' : '1px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: isExpanded ? '0 10px 25px -5px rgba(37, 99, 235, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                      
                      {/* Action Header (Clickable) */}
                      <button 
                        onClick={() => toggleNode(index)}
                        style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ padding: '12px', backgroundColor: isExpanded ? '#dbeafe' : '#f1f5f9', borderRadius: '12px', color: isExpanded ? '#2563eb' : '#475569', transition: 'all 0.3s ease' }}>
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
