import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Building, ShieldCheck, DollarSign, Wallet, 
  Target, Users, FileLock, Briefcase, Megaphone, BarChart3, Settings, MessageSquare,
  ChevronRight, ChevronDown, Activity, Database, Share2, Workflow, Crown, ArrowDown
} from 'lucide-react';

const exhaustiveCeoData = [
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    icon: <LayoutDashboard size={20} />,
    description: 'High-level aggregation of company-wide financials, active OKRs, and critical action alerts.',
    flows: [
      {
        actionName: 'Fetch Aggregate Telemetry (Read)',
        trigger: 'CEO logs into the ERP or navigates to the Home route ("/") from the sidebar.',
        processing: 'System executes parallel high-cost queries to calculate Cash Flow, Total Headcount, and Project Profitability.',
        validation: 'Validates strict CEO `role` authorization to prevent unauthorized access to raw financial aggregates.',
        storage: 'Fetches massive datasets from `projects`, `expense_claims`, `users`, and `objectives` tables using optimized SQL Views.',
        routing: 'Renders the Executive Widgets (e.g., "Revenue vs Burn Rate", "Active Sprints").'
      },
      {
        actionName: 'Interact with Critical Alerts (Routing)',
        trigger: 'CEO clicks on a red "High Priority" alert (e.g., Pending Payroll Authorization).',
        processing: 'System intercepts the click event and packages the target route data.',
        validation: 'Ensures the pending action hasn\'t timed out or been revoked by the system.',
        storage: 'Reads cached alert data from Redux state.',
        routing: 'Navigates the CEO directly to the specific authorization modal (e.g., `/ceo/payroll`).'
      }
    ]
  },
  {
    id: 'company-setup',
    title: 'Company Setup & Admin',
    icon: <Building size={20} />,
    description: 'Configuration of corporate legal entities, bank accounts, and global branches.',
    flows: [
      {
        actionName: 'Update Legal Entity Details (Update)',
        trigger: 'CEO edits the Corporate Registration, GST Number, or HQ Address and clicks Save.',
        processing: 'System validates the format of legal identifiers and logs the modification timestamp.',
        validation: 'Mandatory fields cannot be blank. GST/Tax IDs must match regex patterns.',
        storage: 'Overwrites the JSON payload in the `company_profile` table. Inserts row into `audit_logs`.',
        routing: 'Updates company headers globally on all generated PDFs (Payslips, Invoices).'
      },
      {
        actionName: 'Add New Office Branch (Create)',
        trigger: 'CEO clicks "Add Branch", enters location details, and assigns a local HR Head.',
        processing: 'Generates a unique Branch ID and sets up default attendance rules for that location.',
        validation: 'Branch name must be unique. HR Head ID must point to an active HR user.',
        storage: 'Inserts into `office_branches` table.',
        routing: 'Unlocks the new branch in the dropdown for HR when onboarding new employees.'
      }
    ]
  },
  {
    id: 'approvals',
    title: 'Executive Approvals',
    icon: <ShieldCheck size={20} />,
    description: 'Final authorization queue for High-Value CapEx, Senior Hires, and Overrides.',
    flows: [
      {
        actionName: 'Authorize High-Value CapEx (Update)',
        trigger: 'CEO reviews an expense/invoice > $10,000 and clicks "Authorize".',
        processing: 'System verifies digital signature and releases the hold on the funds.',
        validation: 'Requires Two-Factor Authentication (2FA) or strict password re-entry for high-value actions.',
        storage: 'Updates `ceo_approval` column to `authorized` in `expense_claims` or `ap_invoices` table.',
        routing: 'Pushes the authorized transaction to the Finance queue for immediate bank API payout.'
      },
      {
        actionName: 'Override TL/HR Rejection (Update)',
        trigger: 'CEO clicks "Executive Override" on a previously rejected request (e.g., an exception leave).',
        processing: 'Bypasses standard hierarchy rules due to CEO absolute privilege.',
        validation: 'Mandatory "Override Justification" text must be entered.',
        storage: 'Force-updates the target table (e.g., `leave_requests`) status to `approved`. Logs action in `audit_logs`.',
        routing: 'Sends an automated email to the affected employee, TL, and HR notifying them of the CEO override.'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance & Accounts',
    icon: <DollarSign size={20} />,
    description: 'Management of Accounts Payable (AP), Accounts Receivable (AR), and Cash Flow.',
    flows: [
      {
        actionName: 'Approve Vendor Invoice (Update)',
        trigger: 'CEO reviews a pending vendor invoice (AP) and clicks "Approve for Payment".',
        processing: 'System checks total available cash balance against the invoice amount.',
        validation: 'Invoice must have been previously verified by the Finance Department.',
        storage: 'Updates `status` in `vendor_invoices` to `approved_for_payment`.',
        routing: 'Triggers integration with the corporate banking API to schedule the wire transfer.'
      },
      {
        actionName: 'Generate P&L Statement (Read)',
        trigger: 'CEO selects a Financial Quarter and clicks "Generate P&L".',
        processing: 'Calculates Gross Revenue (AR) minus Total Expenses (Payroll + AP + CapEx).',
        validation: 'None.',
        storage: 'Executes a massive multi-table JOIN query across `invoices`, `payslips`, and `expense_claims`.',
        routing: 'Renders the Profit & Loss statement dynamically on the canvas.'
      }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll Authorization',
    icon: <Wallet size={20} />,
    description: 'The ultimate authority to release company-wide salaries to the bank.',
    flows: [
      {
        actionName: 'Review Payroll Run (Read)',
        trigger: 'CEO clicks on the pending "Monthly Payroll Run" prepared by HR.',
        processing: 'Aggregates the total cash outflow required for the month (Net Pay + Tax Liabilities).',
        validation: 'Ensures the run status is exactly `awaiting_ceo_authorization`.',
        storage: 'Reads from the `payroll_runs` and `payslips` tables.',
        routing: 'Displays the detailed breakdown grid (Total Basic, Total HRA, Total Deductions).'
      },
      {
        actionName: 'Execute Salary Disbursement (Update)',
        trigger: 'CEO clicks "AUTHORIZE DISBURSEMENT" and confirms via 2FA/OTP.',
        processing: 'Irreversibly locks the payroll run. No further edits can be made by anyone, including HR.',
        validation: 'Requires secondary authentication (OTP).',
        storage: 'Updates `status` in `payroll_runs` to `disbursed`.',
        routing: 'Triggers the corporate banking API to deposit salaries. Unlocks payslip PDFs for all employees to download.'
      }
    ]
  },
  {
    id: 'strategy',
    title: 'Strategy & OKRs',
    icon: <Target size={20} />,
    description: 'Setting corporate-level Objectives and cascading Key Results to departments.',
    flows: [
      {
        actionName: 'Define Corporate Objective (Create)',
        trigger: 'CEO creates a new Yearly Objective (e.g., "Reach $10M ARR") and clicks Save.',
        processing: 'System creates the master parent node for the year\'s OKR tree.',
        validation: 'Objective title must be > 10 characters. Target Year must be valid.',
        storage: 'Inserts a new record into the `objectives` table with `level` = "corporate".',
        routing: 'Instantly visible to all Department Heads so they can align their team OKRs to it.'
      },
      {
        actionName: 'Track Cascading Progress (Read)',
        trigger: 'CEO opens the OKR alignment tree view.',
        processing: 'Calculates the weighted average of all department Key Results feeding into the Corporate Objective.',
        validation: 'None.',
        storage: 'Recursive query on `key_results` and `objectives` tables.',
        routing: 'Renders the interactive SVG node tree showing real-time company progress.'
      }
    ]
  },
  {
    id: 'people',
    title: 'People & Leadership',
    icon: <Users size={20} />,
    description: 'God-mode access to the entire employee registry and leadership management.',
    flows: [
      {
        actionName: 'Bypass Hierarchy Search (Read)',
        trigger: 'CEO searches for any employee across the global organization.',
        processing: 'Bypasses all TL/HR visibility restrictions.',
        validation: 'Only authorized for CEO/Superadmin roles.',
        storage: 'Queries the entire `users` table without `manager_id` limitations.',
        routing: 'Displays the full unredacted profile (Salary history, PIPs, private HR notes).'
      },
      {
        actionName: 'Modify Executive Compensation (Update)',
        trigger: 'CEO edits the ESOPs (Equity) or Yearly Bonus for a VP/Director.',
        processing: 'Logs the highly sensitive change with strict audit trails.',
        validation: 'Requires 2FA confirmation.',
        storage: 'Updates the `equity_shares` and `bonus_target` in the `users` table.',
        routing: 'Silent update. Syncs with Finance and HR Payroll engines.'
      }
    ]
  },
  {
    id: 'vault',
    title: 'Document Vault',
    icon: <FileLock size={20} />,
    description: 'Highly secure, encrypted storage for Board Resolutions and Legal Contracts.',
    flows: [
      {
        actionName: 'Upload Confidential Document (Create)',
        trigger: 'CEO uploads a PDF (e.g., Board Resolution) to the Vault.',
        processing: 'File is encrypted client-side or server-side before being pushed to an isolated S3 bucket.',
        validation: 'File must be PDF/Docx. Size < 50MB.',
        storage: 'Inserts metadata into `corporate_vault` table. Uploads encrypted blob to cloud.',
        routing: 'Document is hidden from ALL other users (including HR/Admins) unless explicitly shared.'
      },
      {
        actionName: 'Grant Vault Access (Update)',
        trigger: 'CEO selects a document and grants "View" access to the CFO.',
        processing: 'Generates a secure, time-limited presigned URL or adds the CFO\'s ID to the ACL.',
        validation: 'Only the CEO can modify vault ACLs.',
        storage: 'Updates the `access_control_list` JSON array in the `corporate_vault` table.',
        routing: 'The document appears in the CFO\'s portal.'
      }
    ]
  },
  {
    id: 'projects',
    title: 'Portfolio Management',
    icon: <Briefcase size={20} />,
    description: 'High-level monitoring of client project profitability and resource allocation.',
    flows: [
      {
        actionName: 'View Project Profitability (Read)',
        trigger: 'CEO clicks on a specific Client Project in the portfolio.',
        processing: 'Calculates Total Billed Revenue minus Resource Cost (Employee hourly rate * logged timesheet hours).',
        validation: 'None.',
        storage: 'Queries `projects`, `invoices`, and `timesheet_rows` tables.',
        routing: 'Renders the Profit Margin gauge and burn-down charts.'
      },
      {
        actionName: 'Halt/Pause Project (Update)',
        trigger: 'CEO clicks "Halt Project" due to client payment defaults.',
        processing: 'Locks all active sprints and prevents employees from logging further timesheets against this project code.',
        validation: 'Requires confirmation prompt.',
        storage: 'Updates `status` in `projects` table to `on_hold`.',
        routing: 'Instantly alerts the assigned Project Manager/TL via WebSockets.'
      }
    ]
  },
  {
    id: 'announcements',
    title: 'Global Broadcasts',
    icon: <Megaphone size={20} />,
    description: 'Issuing mandatory-read announcements to the entire organization.',
    flows: [
      {
        actionName: 'Publish Mandatory Broadcast (Create)',
        trigger: 'CEO types an announcement, checks "Require Acknowledgement", and clicks Publish.',
        processing: 'Creates an immutable global alert.',
        validation: 'Text must not be empty.',
        storage: 'Inserts into `announcements` table with `is_mandatory` = true.',
        routing: 'Pushes instantly to all active clients. Locks the ERP UI for employees until they click "I Understand".'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Executive Messaging',
    icon: <MessageSquare size={20} />,
    description: 'Participation in standard channels and highly secure C-Suite chat rooms.',
    flows: [
      {
        actionName: 'Create Private C-Suite Channel (Create)',
        trigger: 'CEO creates a new channel and adds only Directors/VPs.',
        processing: 'Generates a hidden WebSocket room.',
        validation: 'Channel name cannot be empty.',
        storage: 'Inserts into `chat_channels` with `is_private` = true.',
        routing: 'Channel is completely invisible to unauthorized employees.'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Executive Reports',
    icon: <BarChart3 size={20} />,
    description: 'Generation of dynamic, high-level PDFs for Board Meetings and Investors.',
    flows: [
      {
        actionName: 'Generate Board Report PDF (Read)',
        trigger: 'CEO selects "Q3" and clicks "Export Board Report".',
        processing: 'System compiles Revenue, Headcount, and OKR progress into a highly formatted, branded document using `jsPDF`.',
        validation: 'Ensures data for the quarter exists.',
        storage: 'Read-only queries across multiple aggregation views.',
        routing: 'Triggers secure browser download of the PDF.'
      }
    ]
  },
  {
    id: 'vendors',
    title: 'Vendor Management',
    icon: <Building size={20} />,
    description: 'Approving new vendor contracts and managing enterprise supply chains.',
    flows: [
      {
        actionName: 'Approve Vendor KYC (Update)',
        trigger: 'CEO reviews a newly added Vendor profile and clicks "Approve Vendor".',
        processing: 'Validates the vendor for active Purchase Order (PO) generation.',
        validation: 'Vendor must have valid Bank and Tax details entered by Finance.',
        storage: 'Updates `status` in `vendors` table from `pending_kyc` to `active`.',
        routing: 'Unlocks the vendor in the dropdowns for the Finance/Procurement teams.'
      }
    ]
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: <Settings size={20} />,
    description: 'God-mode configuration of global ERP parameters.',
    flows: [
      {
        actionName: 'Modify Global Overtime Multiplier (Update)',
        trigger: 'CEO changes the "Overtime Pay Multiplier" (e.g., 1.5x) in the settings panel and saves.',
        processing: 'System updates the global math logic for the Payroll engine.',
        validation: 'Input must be a valid decimal number.',
        storage: 'Updates the JSON config in `system_settings`.',
        routing: 'Takes effect immediately on the next scheduled Payroll Run.'
      }
    ]
  }
];

// Flowchart Step Component
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
          {/* Small pointer triangle pointing left */}
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


export default function CeoInstructions() {
  const [activeModule, setActiveModule] = useState(exhaustiveCeoData[0]);
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
    trigger: { bg: '#f1f5f9', border: '#94a3b8', icon: '#475569' },     // Gray
    validation: { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626' },   // Red
    storage: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a' },      // Green
    routing: { bg: '#fdf4ff', border: '#f0abfc', icon: '#c026d3' }       // Purple
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '340px', backgroundColor: '#09090b', color: '#f8fafc', display: 'flex', flexDirection: 'column', borderRight: '1px solid #27272a', zIndex: 10 }}>
        
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #27272a', background: 'linear-gradient(to bottom, rgba(24, 24, 27, 0.8), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(217, 119, 6, 0.15)', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
              <Crown size={20} style={{ color: '#d97706' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: '#f8fafc' }}>
              CEO Architecture
            </h1>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>
            Ultimate God-Mode Workflow Flowcharts.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {exhaustiveCeoData.map((mod) => (
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
                backgroundColor: activeModule.id === mod.id ? '#27272a' : 'transparent',
                border: '1px solid',
                borderColor: activeModule.id === mod.id ? '#d97706' : 'transparent',
                borderRadius: '12px',
                color: activeModule.id === mod.id ? '#fff' : '#a1a1aa',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ color: activeModule.id === mod.id ? '#d97706' : '#52525b' }}>
                {mod.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{mod.title}</span>
              {activeModule.id === mod.id && <ChevronRight size={18} style={{ color: '#d97706' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT CANVAS: Interactive Flowchart */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px', position: 'relative', backgroundColor: '#f4f4f5' }}>
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
            <div style={{ marginBottom: '48px', paddingBottom: '24px', borderBottom: '2px solid #e4e4e7' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '800', color: '#09090b', letterSpacing: '-0.5px' }}>
                {activeModule.title}
              </h2>
              <p style={{ margin: 0, fontSize: '16px', color: '#52525b', lineHeight: '1.6' }}>
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
                    <div style={{ backgroundColor: '#ffffff', border: isExpanded ? '2px solid #d97706' : '1px solid #d4d4d8', borderRadius: '16px', padding: '24px', boxShadow: isExpanded ? '0 10px 25px -5px rgba(217, 119, 6, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                      
                      {/* Action Header (Clickable) */}
                      <button 
                        onClick={() => toggleNode(index)}
                        style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ padding: '12px', backgroundColor: isExpanded ? '#fef3c7' : '#f4f4f5', borderRadius: '12px', color: isExpanded ? '#b45309' : '#52525b', transition: 'all 0.3s ease' }}>
                            <Activity size={20} />
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>System Action</p>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#09090b' }}>
                              {flow.actionName}
                            </h3>
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} style={{ color: '#a1a1aa', padding: '8px', backgroundColor: '#f4f4f5', borderRadius: '50%' }}>
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
                            <div style={{ paddingTop: '32px', marginTop: '24px', borderTop: '1px dashed #d4d4d8', paddingLeft: '16px', paddingRight: '16px' }}>
                              
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
