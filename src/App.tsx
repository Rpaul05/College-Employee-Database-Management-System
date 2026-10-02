import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LoginPage } from './pages/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { EmployeesListPage } from './pages/admin/EmployeesListPage';
import { EmployeeDetailPage } from './pages/admin/EmployeeDetailPage';
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { AttendanceAdminPage } from './pages/admin/AttendanceAdminPage';
import { LeaveAdminPage } from './pages/admin/LeaveAdminPage';
import { PayrollAdminPage } from './pages/admin/PayrollAdminPage';
import { DocumentsAdminPage } from './pages/admin/DocumentsAdminPage';
import { ReportsAdminPage } from './pages/admin/ReportsAdminPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SettingsAdminPage } from './pages/admin/SettingsAdminPage';
import { AddEditEmployeeModal } from './pages/admin/AddEditEmployeeModal';

// Employee Pages
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';
import { MyProfilePage } from './pages/employee/MyProfilePage';
import { MyAttendancePage } from './pages/employee/MyAttendancePage';
import { MyLeavePage } from './pages/employee/MyLeavePage';
import { MyPayrollPage } from './pages/employee/MyPayrollPage';
import { MyDocumentsPage } from './pages/employee/MyDocumentsPage';

// Common Pages
import { NotificationsPage } from './pages/common/NotificationsPage';
import { UserProfilePage } from './pages/common/UserProfilePage';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, activeView, setActiveView } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Intercept 'add-employee' view for Admin
  const handleView = () => {
    if (activeView === 'add-employee') {
      return (
        <>
          <EmployeesListPage />
          <AddEditEmployeeModal
            isOpen={true}
            onClose={() => setActiveView('employees')}
            onSaved={() => setActiveView('employees')}
          />
        </>
      );
    }

    if (role === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <AdminDashboardPage />;
        case 'employees':
          return <EmployeesListPage />;
        case 'employee-detail':
          return <EmployeeDetailPage />;
        case 'departments':
          return <DepartmentsPage />;
        case 'attendance':
          return <AttendanceAdminPage />;
        case 'leave':
          return <LeaveAdminPage />;
        case 'payroll':
          return <PayrollAdminPage />;
        case 'documents':
          return <DocumentsAdminPage />;
        case 'reports':
          return <ReportsAdminPage />;
        case 'notifications':
          return <NotificationsPage />;
        case 'audit-logs':
          return <AuditLogsPage />;
        case 'settings':
          return <SettingsAdminPage />;
        case 'profile':
          return <UserProfilePage />;
        default:
          return <AdminDashboardPage />;
      }
    } else {
      // Employee role views
      switch (activeView) {
        case 'dashboard':
          return <EmployeeDashboardPage />;
        case 'my-profile':
          return <MyProfilePage />;
        case 'my-attendance':
          return <MyAttendancePage />;
        case 'my-leave':
          return <MyLeavePage />;
        case 'my-payroll':
          return <MyPayrollPage />;
        case 'my-documents':
          return <MyDocumentsPage />;
        case 'notifications':
          return <NotificationsPage />;
        case 'profile':
          return <UserProfilePage />;
        default:
          return <EmployeeDashboardPage />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Role-based Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {handleView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
