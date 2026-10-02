import {
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  DocumentRecord,
  AuditLog,
  NotificationItem,
  UserRole
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from './mockData';

const STORAGE_KEYS = {
  EMPLOYEES: 'campushr_employees_v1',
  DEPARTMENTS: 'campushr_departments_v1',
  ATTENDANCE: 'campushr_attendance_v1',
  LEAVES: 'campushr_leaves_v1',
  PAYROLL: 'campushr_payroll_v1',
  DOCUMENTS: 'campushr_documents_v1',
  AUDIT_LOGS: 'campushr_audit_logs_v1',
  NOTIFICATIONS: 'campushr_notifications_v1',
};

function getItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function setItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const storageService = {
  // Reset all to default demo data
  resetAll: () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.PAYROLL);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    window.location.reload();
  },

  // Employees
  getEmployees: (): Employee[] => {
    return getItem<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  },

  getEmployeeById: (id: string): Employee | undefined => {
    const employees = storageService.getEmployees();
    return employees.find(e => e.id === id);
  },

  addEmployee: (employee: Employee): Employee => {
    const employees = storageService.getEmployees();
    const updated = [employee, ...employees];
    setItem(STORAGE_KEYS.EMPLOYEES, updated);

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: 'Admin',
      actorRole: 'admin',
      action: 'Added New Employee',
      category: 'Employee',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `Added ${employee.name} (${employee.employeeType} - ${employee.department})`
    });

    return employee;
  },

  updateEmployee: (employee: Employee): Employee => {
    const employees = storageService.getEmployees();
    const index = employees.findIndex(e => e.id === employee.id);
    if (index !== -1) {
      employees[index] = employee;
      setItem(STORAGE_KEYS.EMPLOYEES, employees);

      storageService.addAuditLog({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        actorName: 'Admin',
        actorRole: 'admin',
        action: 'Updated Employee Record',
        category: 'Employee',
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.104',
        details: `Modified details for ${employee.name} (${employee.id})`
      });
    }
    return employee;
  },

  deleteEmployee: (id: string): boolean => {
    const employees = storageService.getEmployees();
    const empToDelete = employees.find(e => e.id === id);
    const updated = employees.filter(e => e.id !== id);
    setItem(STORAGE_KEYS.EMPLOYEES, updated);

    if (empToDelete) {
      storageService.addAuditLog({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        actorName: 'Admin',
        actorRole: 'admin',
        action: 'Removed Employee',
        category: 'Employee',
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.104',
        details: `Deleted employee record for ${empToDelete.name} (${id})`
      });
    }
    return true;
  },

  // Departments
  getDepartments: (): Department[] => {
    return getItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  // Attendance
  getAttendance: (filters?: { employeeId?: string; department?: string; date?: string; status?: string }): AttendanceRecord[] => {
    let records = getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_RECORDS);
    if (!filters) return records;

    if (filters.employeeId) {
      records = records.filter(r => r.employeeId === filters.employeeId);
    }
    if (filters.department && filters.department !== 'All') {
      records = records.filter(r => r.department === filters.department);
    }
    if (filters.date) {
      records = records.filter(r => r.date === filters.date);
    }
    if (filters.status && filters.status !== 'All') {
      records = records.filter(r => r.status === filters.status);
    }
    return records;
  },

  markAttendance: (record: AttendanceRecord): void => {
    const records = storageService.getAttendance();
    const existingIndex = records.findIndex(r => r.employeeId === record.employeeId && r.date === record.date);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    setItem(STORAGE_KEYS.ATTENDANCE, records);

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: 'Admin',
      actorRole: 'admin',
      action: 'Marked Staff Attendance',
      category: 'Attendance',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `Marked ${record.employeeName} as ${record.status} on ${record.date}`
    });
  },

  // Leave Requests
  getLeaveRequests: (employeeId?: string): LeaveRequest[] => {
    const requests = getItem<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVE_REQUESTS);
    if (employeeId) {
      return requests.filter(r => r.employeeId === employeeId);
    }
    return requests;
  },

  applyLeave: (request: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>): LeaveRequest => {
    const requests = storageService.getLeaveRequests();
    const newRequest: LeaveRequest = {
      ...request,
      id: `LR-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const updated = [newRequest, ...requests];
    setItem(STORAGE_KEYS.LEAVES, updated);

    // Add notification for admin
    storageService.addNotification({
      id: `NOTIF-${Date.now()}`,
      title: 'New Leave Request Submitted',
      message: `${request.employeeName} submitted a ${request.leaveType} request for ${request.daysCount} day(s).`,
      timestamp: 'Just now',
      read: false,
      type: 'leave',
      targetRole: 'admin'
    });

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: request.employeeName,
      actorRole: 'employee',
      action: 'Submitted Leave Request',
      category: 'Leave',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.2.11',
      details: `Applied for ${request.leaveType} (${request.daysCount} days from ${request.startDate} to ${request.endDate})`
    });

    return newRequest;
  },

  reviewLeave: (id: string, status: 'Approved' | 'Rejected', adminRemarks: string, reviewerName: string): boolean => {
    const requests = storageService.getLeaveRequests();
    const req = requests.find(r => r.id === id);
    if (!req) return false;

    req.status = status;
    req.adminRemarks = adminRemarks;
    req.reviewedBy = reviewerName;
    req.reviewedOn = new Date().toISOString().split('T')[0];
    setItem(STORAGE_KEYS.LEAVES, requests);

    // Notify employee
    storageService.addNotification({
      id: `NOTIF-${Date.now()}`,
      title: `Leave Request ${status}`,
      message: `Your ${req.leaveType} request for ${req.daysCount} day(s) was ${status.toLowerCase()} by administration. Remarks: ${adminRemarks || 'None'}`,
      timestamp: 'Just now',
      read: false,
      type: status === 'Approved' ? 'success' : 'warning',
      targetRole: 'employee',
      targetEmployeeId: req.employeeId
    });

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: reviewerName,
      actorRole: 'admin',
      action: `${status} Leave Request`,
      category: 'Leave',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `${status} leave for ${req.employeeName} (${req.id}). Remarks: ${adminRemarks || 'None'}`
    });

    return true;
  },

  // Payroll
  getPayrollRecords: (employeeId?: string): PayrollRecord[] => {
    const records = getItem<PayrollRecord[]>(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL_RECORDS);
    if (employeeId) {
      return records.filter(r => r.employeeId === employeeId);
    }
    return records;
  },

  generatePayrollSlip: (record: PayrollRecord): PayrollRecord => {
    const records = storageService.getPayrollRecords();
    const existingIndex = records.findIndex(r => r.employeeId === record.employeeId && r.month === record.month);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    setItem(STORAGE_KEYS.PAYROLL, records);

    storageService.addNotification({
      id: `NOTIF-${Date.now()}`,
      title: 'Salary Slip Released',
      message: `Your salary slip for ${record.month} is generated. Net Pay: $${record.netPay.toLocaleString()}`,
      timestamp: 'Just now',
      read: false,
      type: 'payroll',
      targetRole: 'employee',
      targetEmployeeId: record.employeeId
    });

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: 'Admin',
      actorRole: 'admin',
      action: 'Generated Salary Slip',
      category: 'Payroll',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `Generated payslip for ${record.employeeName} for ${record.month}. Net: $${record.netPay}`
    });

    return record;
  },

  // Documents
  getDocuments: (employeeId?: string): DocumentRecord[] => {
    const docs = getItem<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    if (employeeId) {
      return docs.filter(d => d.employeeId === employeeId);
    }
    return docs;
  },

  addDocument: (doc: DocumentRecord): DocumentRecord => {
    const docs = storageService.getDocuments();
    const updated = [doc, ...docs];
    setItem(STORAGE_KEYS.DOCUMENTS, updated);

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: doc.employeeName,
      actorRole: 'admin',
      action: 'Uploaded Document',
      category: 'Document',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `Added document "${doc.title}" for ${doc.employeeName}`
    });

    return doc;
  },

  verifyDocument: (id: string, status: 'Verified' | 'Rejected'): boolean => {
    const docs = storageService.getDocuments();
    const doc = docs.find(d => d.id === id);
    if (!doc) return false;

    doc.status = status;
    setItem(STORAGE_KEYS.DOCUMENTS, docs);

    storageService.addAuditLog({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actorName: 'Dr. Sarah Vance',
      actorRole: 'admin',
      action: `${status} Document`,
      category: 'Document',
      timestamp: new Date().toLocaleString(),
      ipAddress: '192.168.1.104',
      details: `Status set to ${status} for "${doc.title}" of ${doc.employeeName}`
    });

    return true;
  },

  deleteDocument: (id: string): boolean => {
    const docs = storageService.getDocuments();
    const docToDelete = docs.find(d => d.id === id);
    const updated = docs.filter(d => d.id !== id);
    setItem(STORAGE_KEYS.DOCUMENTS, updated);

    if (docToDelete) {
      storageService.addAuditLog({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        actorName: 'Admin',
        actorRole: 'admin',
        action: 'Deleted Document',
        category: 'Document',
        timestamp: new Date().toLocaleString(),
        ipAddress: '192.168.1.104',
        details: `Deleted "${docToDelete.title}" for ${docToDelete.employeeName}`
      });
    }
    return true;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog: (log: AuditLog): void => {
    const logs = storageService.getAuditLogs();
    const updated = [log, ...logs.slice(0, 99)]; // keep latest 100
    setItem(STORAGE_KEYS.AUDIT_LOGS, updated);
  },

  // Notifications
  getNotifications: (role: UserRole, employeeId?: string): NotificationItem[] => {
    const all = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => {
      if (n.targetRole === 'all') return true;
      if (role === 'admin' && n.targetRole === 'admin') return true;
      if (role === 'employee' && n.targetRole === 'employee') {
        if (!n.targetEmployeeId) return true;
        return n.targetEmployeeId === employeeId;
      }
      return false;
    });
  },

  addNotification: (item: NotificationItem): void => {
    const notifications = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = [item, ...notifications];
    setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markNotificationAsRead: (id: string): void => {
    const notifications = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = notifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  markAllNotificationsRead: (role: UserRole, employeeId?: string): void => {
    const notifications = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifications.forEach(n => {
      if (n.targetRole === 'all' || (role === 'admin' && n.targetRole === 'admin') || (role === 'employee' && n.targetEmployeeId === employeeId)) {
        n.read = true;
      }
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};
