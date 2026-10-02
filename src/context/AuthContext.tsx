import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, UserRole } from '../types';
import { storageService } from '../services/storageService';

export type AdminView = 
  | 'dashboard'
  | 'employees'
  | 'employee-detail'
  | 'add-employee'
  | 'departments'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'documents'
  | 'reports'
  | 'notifications'
  | 'audit-logs'
  | 'settings'
  | 'profile';

export type EmployeeView =
  | 'dashboard'
  | 'my-profile'
  | 'my-attendance'
  | 'my-leave'
  | 'my-payroll'
  | 'my-documents'
  | 'notifications'
  | 'profile';

export type AppView = AdminView | EmployeeView;

interface AuthContextType {
  currentUser: Employee | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  activeView: AppView;
  selectedEmployeeId: string | null;
  setActiveView: (view: AppView) => void;
  setSelectedEmployeeId: (id: string | null) => void;
  viewEmployeeDetail: (employeeId: string) => void;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  switchUser: (employeeId: string) => void;
  toggleRolePreview: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const savedUserId = localStorage.getItem('campushr_user_id');
    const employees = storageService.getEmployees();
    if (savedUserId) {
      const found = employees.find(e => e.id === savedUserId);
      if (found) return found;
    }
    // Default to Admin Dr. Sarah Vance for initial impression
    return employees.find(e => e.role === 'admin') || employees[0] || null;
  });

  const [role, setRole] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('campushr_user_role') as UserRole | null;
    return savedRole || 'admin';
  });

  const [activeView, setActiveViewState] = useState<AppView>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campushr_user_id', currentUser.id);
      localStorage.setItem('campushr_user_role', currentUser.role);
      setRole(currentUser.role);
    } else {
      localStorage.removeItem('campushr_user_id');
      localStorage.removeItem('campushr_user_role');
      setRole(null);
    }
  }, [currentUser]);

  const setActiveView = (view: AppView) => {
    // Role protection: Employees cannot access admin views
    const adminOnlyViews: AppView[] = [
      'employees',
      'employee-detail',
      'add-employee',
      'departments',
      'reports',
      'audit-logs',
      'settings'
    ];

    if (role === 'employee' && adminOnlyViews.includes(view)) {
      console.warn('Unauthorized view access attempt by employee. Redirecting to dashboard.');
      setActiveViewState('dashboard');
      return;
    }

    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewEmployeeDetail = (employeeId: string) => {
    if (role !== 'admin') {
      // Employees cannot view other employee details!
      return;
    }
    setSelectedEmployeeId(employeeId);
    setActiveViewState('employee-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string, userRole: UserRole): boolean => {
    const employees = storageService.getEmployees();
    let target = employees.find(e => e.email.toLowerCase() === email.toLowerCase());

    if (!target) {
      // Find based on role fallback
      target = employees.find(e => e.role === userRole) || employees[0];
    }

    // Force role to match selected login mode
    const authenticatedUser: Employee = {
      ...target,
      role: userRole
    };

    setCurrentUser(authenticatedUser);
    setRole(userRole);
    setActiveViewState('dashboard');
    setSelectedEmployeeId(null);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    setActiveViewState('dashboard');
    setSelectedEmployeeId(null);
    localStorage.removeItem('campushr_user_id');
    localStorage.removeItem('campushr_user_role');
  };

  const switchUser = (employeeId: string) => {
    const employees = storageService.getEmployees();
    const target = employees.find(e => e.id === employeeId);
    if (target) {
      setCurrentUser(target);
      setRole(target.role);
      setActiveViewState('dashboard');
      setSelectedEmployeeId(null);
    }
  };

  const toggleRolePreview = () => {
    const employees = storageService.getEmployees();
    if (role === 'admin') {
      // Switch to Prof. Alex Rivera (Employee - Teaching)
      const emp = employees.find(e => e.id === 'EMP-1002') || employees[1];
      if (emp) switchUser(emp.id);
    } else {
      // Switch to Dr. Sarah Vance (Admin)
      const admin = employees.find(e => e.role === 'admin') || employees[0];
      if (admin) switchUser(admin.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        activeView,
        selectedEmployeeId,
        setActiveView,
        setSelectedEmployeeId,
        viewEmployeeDetail,
        login,
        logout,
        switchUser,
        toggleRolePreview
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
