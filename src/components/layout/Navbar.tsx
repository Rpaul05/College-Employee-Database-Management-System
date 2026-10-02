import React, { useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  CheckCheck,
  Shield,
  Briefcase,
  ChevronDown,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { useAuth, AppView } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../ui/Badge';
import { NotificationItem } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, role, activeView, setActiveView, switchUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { info, success } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications: NotificationItem[] = storageService.getNotifications(role || 'employee', currentUser?.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const allEmployees = storageService.getEmployees();

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead(role || 'employee', currentUser?.id);
    success('Notifications Marked as Read');
    setShowNotifications(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset CampusHR demo database back to default initial records?')) {
      storageService.resetAll();
    }
  };

  const viewTitles: Record<AppView, { title: string; subtitle: string }> = {
    dashboard: {
      title: role === 'admin' ? 'Administrative Command Center' : 'Faculty & Staff Portal',
      subtitle: role === 'admin' ? 'College Operations, Attendance & Governance' : `Welcome back, ${currentUser?.name || 'Faculty Member'}`
    },
    employees: { title: 'Employee Directory', subtitle: 'Manage teaching and non-teaching faculty profiles' },
    'employee-detail': { title: 'Employee Comprehensive Record', subtitle: 'Academic, personal, and compensation details' },
    'add-employee': { title: 'Onboard New Employee', subtitle: 'Register faculty or administrative staff into college records' },
    departments: { title: 'Academic & Administrative Departments', subtitle: 'Faculties, budget allocations, and staff distribution' },
    attendance: { title: 'Institution Attendance Registry', subtitle: 'Daily faculty punch records, biometric sync, and analytics' },
    leave: { title: 'Faculty Leave Management', subtitle: 'Approve or reject leave requests and review coverage' },
    payroll: { title: 'Payroll & Compensation', subtitle: 'Monthly salary disbursements, tax calculations, and pay slips' },
    documents: { title: 'Institutional Documents Repository', subtitle: 'Degree validations, government IDs, and service contracts' },
    reports: { title: 'Executive Reports & Analytics', subtitle: 'Accreditation, faculty-student ratio, and compliance metrics' },
    'audit-logs': { title: 'System Security & Audit Trail', subtitle: 'Immutable log of administrative operations and changes' },
    settings: { title: 'Campus Configuration & Policies', subtitle: 'Leave allocations, working hours, and academic calendars' },
    profile: { title: 'User Profile & Preferences', subtitle: 'Manage contact information and login credentials' },
    'my-profile': { title: 'My Official Record', subtitle: 'View verified college employment and credentials' },
    'my-attendance': { title: 'My Attendance & Hours', subtitle: 'Monthly check-in logs, biometric clock-ins, and working hours' },
    'my-leave': { title: 'My Leave Balances & Applications', subtitle: 'Apply for academic, sick, or casual leaves' },
    'my-payroll': { title: 'My Compensation & Salary Slips', subtitle: 'View earnings breakdown and download printable payslips' },
    'my-documents': { title: 'My Verified Documents', subtitle: 'View and download verified degree certificates and tax records' },
    notifications: { title: 'Institutional Bulletins & Alerts', subtitle: 'Administrative announcements and individual notifications' },
  };

  const currentTitle = viewTitles[activeView] || { title: 'CampusHR', subtitle: 'College Employee Management' };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {currentTitle.title}
            </h1>
            {role === 'employee' && (
              <Badge variant="warning" size="sm">
                Employee (Read Only)
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
            {currentTitle.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick actions, notifications, theme toggle, and user dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Demo Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline text-slate-400">Persona:</span>
            <span className="font-semibold truncate max-w-[110px]">{currentUser?.name?.split(' ')[0]}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'}`}>
              {role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Demo Account</p>
                <p className="text-[11px] text-slate-500">Test different role permissions instantly</p>
              </div>

              <div className="max-h-60 overflow-y-auto py-1">
                {allEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      switchUser(emp.id);
                      setShowUserMenu(false);
                      info(`Switched persona to ${emp.name} (${emp.role})`);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${currentUser?.id === emp.id ? 'bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{emp.designation}</div>
                      </div>
                    </div>
                    <Badge variant={emp.role === 'admin' ? 'default' : 'neutral'} size="sm">
                      {emp.role === 'admin' ? 'Admin' : emp.employeeType}
                    </Badge>
                  </button>
                ))}
              </div>

              <div className="px-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleResetData}
                  className="text-[11px] flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1"
                  title="Reset sample data"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  onClick={logout}
                  className="text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:hover:text-rose-400 p-1"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications found</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        storageService.markNotificationAsRead(n.id);
                        setShowNotifications(false);
                      }}
                      className={`p-3.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Profile Avatar Trigger */}
        <div
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
          title="View Profile"
        >
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-500 transition-all"
          />
        </div>
      </div>
    </header>
  );
};
