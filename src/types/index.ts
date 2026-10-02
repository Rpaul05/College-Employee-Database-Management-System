export type UserRole = 'admin' | 'employee';

export type EmployeeType = 'Teaching' | 'Non-Teaching';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive';

export interface SalaryStructure {
  basic: number;
  hra: number;
  da: number;
  allowances: number;
  pfDeduction: number;
  taxDeduction: number;
  netSalary: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface LeaveBalances {
  casual: number;
  sick: number;
  academic: number;
  earned: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  employeeType: EmployeeType;
  department: string;
  designation: string;
  joiningDate: string;
  qualification: string;
  experienceYears: number;
  contactNumber: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  status: EmployeeStatus;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  salary: SalaryStructure;
  leaveBalances: LeaveBalances;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  employeeCount: number;
  budget: string;
  building: string;
  establishedYear: number;
  description: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  workHours: number;
}

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Academic/Sabbatical' | 'Earned Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  employeeType: EmployeeType;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
  adminRemarks?: string;
  substituteFaculty?: string;
}

export type PayrollStatus = 'Paid' | 'Processing' | 'Pending';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  hra: number;
  da: number;
  academicAllowance: number;
  grossEarnings: number;
  pf: number;
  tax: number;
  totalDeductions: number;
  netPay: number;
  paymentStatus: PayrollStatus;
  paymentDate: string;
  transactionId: string;
}

export type DocumentCategory = 
  | 'Degree Certificate' 
  | 'Government ID' 
  | 'Appointment Letter' 
  | 'Research Publication' 
  | 'Tax Document' 
  | 'Contract';

export type DocumentStatus = 'Verified' | 'Pending Verification' | 'Rejected';

export interface DocumentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  category: DocumentCategory;
  fileSize: string;
  uploadDate: string;
  fileType: string;
  status: DocumentStatus;
  downloadUrl?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  category: 'Employee' | 'Attendance' | 'Leave' | 'Payroll' | 'Document' | 'Security';
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'leave' | 'payroll';
  targetRole: 'all' | 'admin' | 'employee';
  targetEmployeeId?: string;
}
