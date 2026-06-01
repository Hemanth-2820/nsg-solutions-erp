import { useState, useEffect } from 'react';
import TicketForm from './TicketForm';
import GrievanceChat from './GrievanceChat';
import FaqBase from './FaqBase';
import { ShieldCheck, Ticket } from 'lucide-react';

export default function Help() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('nsg_employee_support_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('nsg_employee_support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleSubmitTicket = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showToast('Support ticket logged successfully.');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getPriorityColor = (lvl) => {
    switch (lvl) {
      case 'High':
        return 'hsl(0, 70%, 55%)';
      case 'Medium':
        return 'hsl(35, 90%, 60%)';
      case 'Low':
      default:
        return 'hsl(240, 20%, 40%)';
    }
  };

  return (
    <div className="component-container">
      {/* Responsive layout stylesheets */}
      <style dangerouslySetInnerHTML={{ __html: `
        .help-layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .help-layout-grid {
            grid-template-columns: 1.2fr 1fr;
            grid-template-areas: 
              "ticket chat"
              "list chat"
              "faq faq";
          }
          .area-ticket { grid-area: ticket; }
          .area-list { grid-area: list; }
          .area-chat { grid-area: chat; }
          .area-faq { grid-area: faq; }
        }

        .ticket-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
          gap: 16px;
        }

        .ticket-item:last-child {
          border-bottom: none;
        }
      ` }} />

      {/* Success Toast Notify */}
      {toast && (
        <div className="toast-notify">
          <ShieldCheck size={16} style={{ color: 'var(--accent-green)' }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="component-header">
        <div>
          <h1>Employee Support Hub</h1>
          <p>Submit IT help desk tickets, chat privately with assigned HR officers, and query FAQ topics.</p>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="help-layout-grid">
        
        {/* Submit Ticket area */}
        <div className="area-ticket">
          <TicketForm onSubmitTicket={handleSubmitTicket} />
        </div>

        {/* My Support Tickets List */}
        {tickets.length > 0 && (
          <div className="area-list">
            <div 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={14} />
                <span>My Active Support Tickets ({tickets.length})</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tickets.map((tkt) => (
                  <div key={tkt.id} className="ticket-item">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                          {tkt.id}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: getPriorityColor(tkt.priority) }}>
                          {tkt.priority} Priority
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                        Category: {tkt.issueType} | Logged: {tkt.createdAt}
                      </span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', wordBreak: 'break-word' }}>
                        {tkt.description}
                      </p>
                    </div>
                    <span 
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        color: 'var(--accent-blue)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        flexShrink: 0
                      }}
                    >
                      {tkt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HR Grievance Chat area */}
        <div className="area-chat">
          <GrievanceChat />
        </div>

        {/* FAQ base area */}
        <div className="area-faq">
          <FaqBase />
        </div>

      </div>
    </div>
  );
}
