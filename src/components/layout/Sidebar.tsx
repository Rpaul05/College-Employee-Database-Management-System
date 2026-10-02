import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  CalendarCheck,
  CalendarClock,
  Banknote,
  FileText,
  BarChart3,
  Bell,
  ScrollText,
  Settings,
  User,
  LogOut,
  GraduationCap,
  Shield,
  Briefcase,
  ChevronRight,
  ArrowLeftRight
} from 'lucide-react';
import { useAuth, AdminView, EmployeeView, AppView } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, role, activeView, setActiveView, logout, toggleRolePreview } = useAuth();

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    onClose();
  };

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'employees', label: 'All Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'add-employee', label: 'Add Employee', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'leave', label: 'Leave Management', icon: <CalendarClock className="w-4 h-4" />, badge: '3 Pending' },
    { id: 'payroll', label: 'Payroll', icon: <Banknote className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'audit-logs', label: 'Audit Logs', icon: <ScrollText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const employeeNavItems: NavItem[] = [
    { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'my-profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'my-attendance', label: 'My Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'my-leave', label: 'My Leave', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'my-payroll', label: 'My Payroll', icon: <Banknote className="w-4 h-4" /> },
    { id: 'my-documents', label: 'My Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const navItems = role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* College & App Branding */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">CampusHR</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium">v2.4</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[130px]">Apex Institute & College</p>
            </div>
          </div>
        </div>

        {/* Current Role Banner */}
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {role === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
              </span>
            </div>
            <Badge
              variant={role === 'admin' ? 'default' : 'success'}
              size="sm"
            >
              {role === 'admin' ? 'Full Control' : 'Read Only'}
            </Badge>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            {role === 'admin' ? 'Administration' : 'Self-Service Portal'}
          </div>

          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 my-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.designation || (role === 'admin' ? 'Administrator' : 'Staff Member')}</p>
            </div>
          </div>

          {/* Quick Role Toggle for testing demo */}
          <button
            onClick={toggleRolePreview}
            title="Switch demo persona to test RBAC"
            className="w-full mt-1 flex items-center justify-center gap-2 py-1.5 px-2 text-[11px] font-medium rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch to {role === 'admin' ? 'Employee (Prof. Alex)' : 'Admin (Dr. Sarah)'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
