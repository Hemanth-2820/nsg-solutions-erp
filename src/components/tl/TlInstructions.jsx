import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, CheckSquare, Clock, ShieldCheck, 
  Target, BarChart3, MessageSquare, AlertTriangle, Briefcase, 
  ChevronRight, ChevronDown, Activity, Database, Share2, Workflow, BookOpen, UserCog, ArrowDown
} from 'lucide-react';

const exhaustiveTlData = [
  {
    id: 'dashboard',
    title: 'TL Dashboard Overview',
    icon: <LayoutDashboard size={20} />,
    description: 'The managerial command center aggregating team statuses, performance metrics, and pending actions.',
    flows: [
      {
        actionName: 'Load Team Telemetry (Read)',
        trigger: 'TL logs into the ERP or navigates to the Home route ("/") from the sidebar.',
        processing: 'System performs concurrent API fetches for direct reports\' online status, active tasks, and recent commits.',
        validation: 'Validates TL\'s `user_id` to strictly fetch data only for employees where `manager_id` matches the TL\'s ID.',
        storage: 'Fetches aggregated metrics from `users`, `attendance`, `timesheets`, and `tasks` tables.',
        routing: 'Renders the managerial widgets (e.g., "Team Availability", "Pending Approvals").'
      },
      {
        actionName: 'Quick Action Execution (Routing)',
        trigger: 'TL clicks on a pending approval alert or a team member\'s avatar.',
        processing: 'System intercepts the click event and packages the target `user_id` or `request_id` into the state.',
        validation: 'Ensures the target request hasn\'t been resolved by another manager/HR in the interim.',
        storage: 'No immediate database writes. Reads cached data.',
        routing: 'Navigates the TL directly to the specific Approval Modal or the Employee\'s deeper profile page.'
      }
    ]
  },
  {
    id: 'approvals',
    title: 'Approvals Management',
    icon: <ShieldCheck size={20} />,
    description: 'Centralized queue for reviewing and authorizing team requests (Leaves, Timesheets, Expenses).',
    flows: [
      {
        actionName: 'Approve Leave Request (Update)',
        trigger: 'TL reviews the requested dates and clicks "Approve" on a pending Leave Request.',
        processing: 'System checks team calendar for overlap to prevent understaffing.',
        validation: 'Ensures the leave request status is strictly "pending".',
        storage: 'Updates the `status` column in `leave_requests` table to `tl_approved`.',
        routing: 'Pushes the request out of the TL queue and into the HR queue for final authorization. Sends Email to employee.'
      },
      {
        actionName: 'Reject Leave with Remarks (Update)',
        trigger: 'TL clicks "Reject" and inputs mandatory rejection reasons in the modal.',
        processing: 'Captures the textual reason to append to the audit log.',
        validation: 'Rejection reason text field must not be empty.',
        storage: 'Updates `leave_requests` status to `rejected` and saves the string to `tl_remarks` column.',
        routing: 'Triggers WebSocket and Email notification to the employee explaining the rejection.'
      },
      {
        actionName: 'Verify Expense Claim (Update)',
        trigger: 'TL reviews the uploaded PDF receipt and clicks "Verify".',
        processing: 'Flags the expense as visually verified by management.',
        validation: 'Ensures the claimed amount matches the uploaded PDF (manual TL check).',
        storage: 'Updates the `tl_approval` column in `expense_claims` to `verified`.',
        routing: 'Routes the claim directly to the Finance department\'s dashboard for payout processing.'
      }
    ]
  },
  {
    id: 'team',
    title: 'Team Roster & Mentorship',
    icon: <Users size={20} />,
    description: 'Read-only access to direct reports\' profiles and management of mentorship assignments.',
    flows: [
      {
        actionName: 'View Direct Reports (Read)',
        trigger: 'TL navigates to the Team page.',
        processing: 'System constructs a hierarchical tree showing only the TL\'s downstream reports.',
        validation: 'Security layer ensures TL cannot view employees mapped to other managers.',
        storage: 'Queries the `users` table where `manager_id` = TL\'s user ID.',
        routing: 'Displays the Team Grid UI.'
      },
      {
        actionName: 'Assign Mentorship/Buddy (Create)',
        trigger: 'TL drags a Senior employee\'s card onto a Junior employee\'s card to assign them as a mentor.',
        processing: 'System validates the seniority level of both employees.',
        validation: 'Ensures the mentor is not already overwhelmed (e.g., max 3 mentees).',
        storage: 'Inserts a new relationship record into the `mentorship_matrix` table.',
        routing: 'Sends an introductory automated message to both employees in the Messaging module.'
      }
    ]
  },
  {
    id: 'timesheets',
    title: 'Timesheet Review',
    icon: <Clock size={20} />,
    description: 'Reviewing, approving, and auditing the billable hours logged by the team.',
    flows: [
      {
        actionName: 'Approve Weekly Timesheet (Update)',
        trigger: 'TL reviews a submitted timesheet, checks project codes, and clicks "Approve All".',
        processing: 'Calculates the total team hours for the week and locks the records from any further edits.',
        validation: 'Timesheet must be in "submitted" status. Checks if total hours meet the 40-hour mandate.',
        storage: 'Updates the `status` column in the `timesheets` table from `submitted` to `approved`.',
        routing: 'Routes the locked data to the Payroll engine for the end-of-month salary/billing calculation.'
      },
      {
        actionName: 'Push Back for Correction (Update)',
        trigger: 'TL spots an error (e.g., wrong project billed), clicks "Needs Correction", and adds comments.',
        processing: 'Unlocks the timesheet rows for the employee.',
        validation: 'Comments field is strictly mandatory.',
        storage: 'Updates `timesheets` status back to `draft` and logs the reason in `correction_notes`.',
        routing: 'Sends an urgent alert to the employee to fix and resubmit the hours.'
      }
    ]
  },
  {
    id: 'projects',
    title: 'Projects & Sprints',
    icon: <Briefcase size={20} />,
    description: 'Creation of Agile sprints, milestones, and high-level project management.',
    flows: [
      {
        actionName: 'Create New Sprint (Create)',
        trigger: 'TL clicks "New Sprint", selects start/end dates, sets sprint goals, and submits.',
        processing: 'System calculates working days in the sprint and assigns an auto-incrementing Sprint ID.',
        validation: 'Dates cannot overlap with an existing active sprint in the same project.',
        storage: 'Inserts a new record into the `sprints` table linked to the parent `project_id`.',
        routing: 'Updates the Kanban board for all assigned team members.'
      },
      {
        actionName: 'Generate Project Burn-down (Read)',
        trigger: 'TL clicks "View Chart" on a specific Sprint.',
        processing: 'Aggregates all closed tasks versus total story points over the sprint timeline.',
        validation: 'None.',
        storage: 'Complex SQL JOIN querying `tasks`, `task_history`, and `sprints` tables.',
        routing: 'Renders the data dynamically onto a Recharts Canvas (Line Chart).'
      }
    ]
  },
  {
    id: 'tasks',
    title: 'Task Delegation',
    icon: <CheckSquare size={20} />,
    description: 'Assigning and tracking specific granular tasks to team members.',
    flows: [
      {
        actionName: 'Assign Task to Employee (Create)',
        trigger: 'TL creates a task, writes a description, sets a deadline, and selects an assignee from the dropdown.',
        processing: 'Calculates the employee\'s current workload to show a "High Load" warning if necessary.',
        validation: 'Deadline must be within the active sprint dates.',
        storage: 'Inserts a new record in the `tasks` table with `assigned_to` set to the employee\'s ID.',
        routing: 'Instantly pushes a WebSocket notification to the assigned employee and updates their To-Do list.'
      },
      {
        actionName: 'Re-prioritize Task (Update)',
        trigger: 'TL drags a task higher in the backlog or changes the Priority tag to "Critical".',
        processing: 'Resorts the index array of tasks.',
        validation: 'None.',
        storage: 'Updates the `priority` and `sort_index` columns in the `tasks` table.',
        routing: 'Silent update to all clients viewing the board.'
      }
    ]
  },
  {
    id: 'performance',
    title: 'Performance & Appraisals',
    icon: <Target size={20} />,
    description: 'Management of team OKRs and conducting formal yearly manager reviews.',
    flows: [
      {
        actionName: 'Set Team OKR (Create)',
        trigger: 'TL defines an Objective and cascading Key Results for the quarter.',
        processing: 'Calculates the overall weightage of Key Results (must equal 100%).',
        validation: 'Objective title must be > 10 characters. Target metrics must be numeric.',
        storage: 'Inserts into `objectives` and `key_results` tables linked to the department.',
        routing: 'Visible to the team for tracking.'
      },
      {
        actionName: 'Submit Manager Review (Update)',
        trigger: 'During appraisal cycle, TL reads the employee\'s self-appraisal, enters counter-ratings, and submits.',
        processing: 'Locks the scorecard. Calculates the final weighted performance score.',
        validation: 'Requires the employee to have already submitted their self-appraisal.',
        storage: 'Updates the `manager_rating` and `manager_feedback` columns in `appraisal_scorecards`.',
        routing: 'Routes the finalized scorecard to HR for salary increment processing.'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reporting & Analytics',
    icon: <BarChart3 size={20} />,
    description: 'Dynamic PDF generation and filtering for team productivity reports.',
    flows: [
      {
        actionName: 'Filter Productivity Grid (Read)',
        trigger: 'TL selects specific Date Ranges, Employees, and Task Statuses from the multi-select filters.',
        processing: 'System applies complex `WHERE` and `IN` clauses to the dataset.',
        validation: 'Date range must be logically valid.',
        storage: 'Executes a read-only query against `timesheets`, `attendance`, and `tasks` views.',
        routing: 'Refreshes the internal data grid.'
      },
      {
        actionName: 'Download PDF Report (Read)',
        trigger: 'TL clicks "Export as PDF" on the top right of the filtered grid.',
        processing: 'System uses `html2pdf.js` or `jsPDF` to compile the visual charts and tables into a printable document.',
        validation: 'Ensures data grid is not empty.',
        storage: 'No database interaction.',
        routing: 'Triggers the browser to download a dynamically named file (e.g., `Team_Report_Oct.pdf`).'
      }
    ]
  },
  {
    id: 'escalations',
    title: 'Escalations & Disciplinary',
    icon: <AlertTriangle size={20} />,
    description: 'Routing unresolved team issues or raising disciplinary tickets to HR.',
    flows: [
      {
        actionName: 'Raise HR Escalation (Create)',
        trigger: 'TL selects an employee, categorizes the issue (e.g., Performance, Behavioral), and submits the ticket.',
        processing: 'Flags the ticket as "High Severity" depending on the category.',
        validation: 'Must include detailed textual evidence/description.',
        storage: 'Inserts a new record into `escalations` or `disciplinary_tickets` table.',
        routing: 'Immediately alerts the assigned HR Business Partner. Sends a discreet notification to the CEO.'
      },
      {
        actionName: 'Close PIP/Warning (Update)',
        trigger: 'TL reviews an employee on a Performance Improvement Plan and clicks "Resolve" if goals are met.',
        processing: 'Closes the ticket and removes the system-level restrictions on the employee.',
        validation: 'Requires HR co-authorization before final closure.',
        storage: 'Updates the `status` of the `pip_records` table to `resolved`.',
        routing: 'Updates employee\'s internal status back to "Active/Good Standing".'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Team Communication',
    icon: <MessageSquare size={20} />,
    description: 'Secure enterprise chat with advanced moderation features for Team Leads.',
    flows: [
      {
        actionName: 'Moderate/Delete Message (Delete)',
        trigger: 'TL clicks the trash icon on a message sent by a team member in a public channel.',
        processing: 'Overrides standard time-limits for deletion due to Admin privileges.',
        validation: 'Must be an admin/creator of the channel.',
        storage: 'Updates the `chat_messages` record: sets `isDeleted` flag to true (Soft Delete for audit reasons).',
        routing: 'Pushes delete event via WebSocket to instantly scrub the message from all screens.'
      },
      {
        actionName: 'Pin Important Announcement (Update)',
        trigger: 'TL selects "Pin to top" on a critical policy update message.',
        processing: 'Elevates the message to the persistent channel header.',
        validation: 'Only TLs or Admins can pin in departmental channels.',
        storage: 'Updates the `isPinned` boolean in the `chat_messages` table.',
        routing: 'Refreshes the channel header for all participants.'
      },
      {
        actionName: 'Initiate Team Standup (Create)',
        trigger: 'TL clicks the "Meet Now" Video icon in the main team channel.',
        processing: 'Generates a secure WebRTC signaling room URL.',
        validation: 'Checks if TL\'s camera/microphone permissions are active.',
        storage: 'Logs the meeting start event in `meeting_logs` table.',
        routing: 'Sends a ringing "Join Call" WebSocket blast to all online team members.'
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


export default function TlInstructions() {
  const [activeModule, setActiveModule] = useState(exhaustiveTlData[0]);
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
            <div style={{ padding: '8px', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '8px', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
              <UserCog size={20} style={{ color: '#059669' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: '#f8fafc' }}>
              TL Architecture Manual
            </h1>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
            Visual Flowcharts for Managerial Operations.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {exhaustiveTlData.map((mod) => (
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
                borderColor: activeModule.id === mod.id ? '#059669' : 'transparent',
                borderRadius: '12px',
                color: activeModule.id === mod.id ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ color: activeModule.id === mod.id ? '#059669' : '#64748b' }}>
                {mod.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', flex: 1 }}>{mod.title}</span>
              {activeModule.id === mod.id && <ChevronRight size={18} style={{ color: '#059669' }} />}
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
                    <div style={{ backgroundColor: '#ffffff', border: isExpanded ? '2px solid #059669' : '1px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: isExpanded ? '0 10px 25px -5px rgba(5, 150, 105, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>
                      
                      {/* Action Header (Clickable) */}
                      <button 
                        onClick={() => toggleNode(index)}
                        style={{ display: 'flex', alignItems: 'center', width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div style={{ padding: '12px', backgroundColor: isExpanded ? '#ecfdf5' : '#f1f5f9', borderRadius: '12px', color: isExpanded ? '#059669' : '#475569', transition: 'all 0.3s ease' }}>
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
