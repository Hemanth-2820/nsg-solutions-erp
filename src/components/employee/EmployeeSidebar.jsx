import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CalendarOff,
  CheckSquare,
  FileText,
  CreditCard,
  Receipt,
  User,
  DoorOpen,
  LifeBuoy,
  Package,
  MessageCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { tab: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard'          },
  { tab: 'attendance',    icon: Clock,            label: 'Attendance'         },
  { tab: 'leave',         icon: CalendarOff,      label: 'Leave'              },
  { tab: 'tasks',         icon: CheckSquare,      label: 'Tasks'              },
  { tab: 'timesheet',     icon: FileText,         label: 'Timesheet'          },
  { tab: 'payroll',       icon: CreditCard,       label: 'Payroll'            },
  { tab: 'expenses',      icon: Receipt,          label: 'Expenses'           },
  { tab: 'profile',       icon: User,             label: 'Profile'            },
  { tab: 'resignation',   icon: DoorOpen,         label: 'Resignation'        },
  { tab: 'help',          icon: LifeBuoy,         label: 'Help'               },
  { tab: 'asset-requests',icon: Package,          label: 'Asset Requests'     },
  { tab: 'messaging',     icon: MessageCircle,    label: 'Messaging & Meet'   },
];

const EMERALD = '#10b981';

export default function EmployeeSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="nav-group">
      <span className="nav-group-title">Staff Modules</span>
      {NAV_ITEMS.map(({ tab, icon: Icon, label }) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            className={`nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={isActive ? {
              color: EMERALD,
              borderLeftColor: EMERALD,
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
            } : {}}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}