import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Heart,
  Award,
  Clock,
  CalendarCheck,
  CalendarClock,
  Banknote,
  FileText,
  Edit2,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AddEditEmployeeModal } from './AddEditEmployeeModal';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';

interface EmployeeDetailPageProps {
  employeeId?: string;
  isReadOnly?: boolean;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({
  employeeId,
  isReadOnly = false
}) => {
  const { selectedEmployeeId, setActiveView, role } = useAuth();
  const targetId = employeeId || selectedEmployeeId || 'EMP-1002';
  const employee = storageService.getEmployeeById(targetId);

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leaves' | 'payroll' | 'documents'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Employee Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested staff record does not exist or was deleted.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setActiveView(role === 'admin' ? 'employees' : 'dashboard')}
        >
          Return to Directory
        </Button>
      </div>
    );
  }

  // Employee-specific records
  const attendanceRecords = storageService.getAttendance({ employeeId: employee.id });
  const leaveRecords = storageService.getLeaveRequests(employee.id);
  const payrollRecords = storageService.getPayrollRecords(employee.id);
  const documents = storageService.getDocuments(employee.id);

  const effectiveReadOnly = isReadOnly || role === 'employee';

  return (
    <div className="space-y-6">
      {/* Back button (if admin viewing from list) */}
      {!isReadOnly && role === 'admin' && (
        <button
          onClick={() => setActiveView('employees')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Employees</span>
        </button>
      )}

      {/* Read Only Notice if viewing in Employee mode */}
      {effectiveReadOnly && (
        <ReadOnlyBadge variant="banner" />
      )}

      {/* Hero Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md"
              />
              <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-900 ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {employee.name}
                </h2>
                <Badge variant={employee.employeeType === 'Teaching' ? 'default' : 'neutral'} size="sm">
                  {employee.employeeType === 'Teaching' ? 'Faculty Member' : 'Non-Teaching Staff'}
                </Badge>
                {effectiveReadOnly ? (
                  <ReadOnlyBadge variant="pill" label="Read Only Profile" />
                ) : (
                  <Badge variant="purple" size="sm">
                    Admin Managed
                  </Badge>
                )}
              </div>

              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {employee.designation}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {employee.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  {employee.id}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {employee.joiningDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons (Only for Admin) */}
          {!effectiveReadOnly && (
            <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                icon={<Edit2 className="w-4 h-4" />}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Records
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Personal & Professional', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'attendance', label: `Attendance (${attendanceRecords.length})`, icon: <CalendarCheck className="w-3.5 h-3.5" /> },
            { id: 'leaves', label: `Leaves (${leaveRecords.length})`, icon: <CalendarClock className="w-3.5 h-3.5" /> },
            { id: 'payroll', label: `Payroll (${payrollRecords.length})`, icon: <Banknote className="w-3.5 h-3.5" /> },
            { id: 'documents', label: `Documents (${documents.length})`, icon: <FileText className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview (Personal, Contact, Academic, Salary) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Academic & Professional */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Academic & Professional Credentials</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Highest Academic Qualification</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{employee.qualification}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Years of Experience</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.experienceYears} Years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Institutional Faculty ID</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{employee.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Employment Status</span>
                  <Badge variant={employee.status === 'Active' ? 'success' : 'warning'} size="sm">
                    {employee.status}
                  </Badge>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">College Department</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.department}</span>
                </div>
              </div>
            </div>

            {/* Leave Balances Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Annual Leave Allocations (Remaining)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{employee.leaveBalances.casual}</div>
                  <div className="text-[11px] text-slate-500">Casual Leave</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{employee.leaveBalances.sick}</div>
                  <div className="text-[11px] text-slate-500">Sick Leave</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{employee.leaveBalances.academic}</div>
                  <div className="text-[11px] text-slate-500">Academic/Sabbatical</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{employee.leaveBalances.earned}</div>
                  <div className="text-[11px] text-slate-500">Earned Leave</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Personal & Contact + Compensation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Contact & Personal Particulars</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Contact
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.contactNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Emergency Contact
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.emergencyContact}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Blood Group / Gender</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{employee.bloodGroup} • {employee.gender}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[200px]">{employee.address}</span>
                </div>
              </div>
            </div>

            {/* Compensation & Bank Info */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Compensation Structure</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Basic Monthly Pay</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">${employee.salary.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">${employee.salary.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Dearness Allowance (DA) & Special</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">${(employee.salary.da + employee.salary.allowances).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                  <span>Statutory Deductions (PF & Tax)</span>
                  <span className="font-mono font-semibold">-${(employee.salary.pfDeduction + employee.salary.taxDeduction).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 px-3 rounded-lg border border-emerald-200/80 dark:border-emerald-800">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Net Monthly Salary</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">${employee.salary.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Attendance Logs & Clock-In History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Check-Out</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No attendance records on file</td>
                  </tr>
                ) : (
                  attendanceRecords.map(r => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{r.date}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{r.checkIn}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">{r.checkOut}</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'danger'}
                          size="sm"
                          dot
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 font-mono">{r.workHours} hrs</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Leaves */}
      {activeTab === 'leaves' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Leave Applications & Sabbatical Records
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaveRecords.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No leave requests found</p>
            ) : (
              leaveRecords.map(l => (
                <div key={l.id} className="py-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{l.leaveType} ({l.daysCount} days)</span>
                    <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'} size="sm">
                      {l.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{l.reason}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Duration: {l.startDate} to {l.endDate}</span>
                    <span>•</span>
                    <span>Applied: {l.appliedOn}</span>
                    {l.adminRemarks && <span>• Remarks: {l.adminRemarks}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Payroll */}
      {activeTab === 'payroll' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Disbursed Monthly Salary Slips
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Gross Earnings</th>
                  <th className="py-2.5 px-3">Deductions</th>
                  <th className="py-2.5 px-3">Net Disbursed</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payrollRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No payroll slips available</td>
                  </tr>
                ) : (
                  payrollRecords.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{p.month}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">${p.grossEarnings.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-rose-500">-${p.totalDeductions.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">${p.netPay.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={p.paymentStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                          {p.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{p.paymentDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Institutional Verification Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-xs text-slate-400">No documents uploaded</p>
            ) : (
              documents.map(d => (
                <div key={d.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{d.title}</h4>
                      <p className="text-[11px] text-slate-500">{d.category} • {d.fileSize} • Uploaded {d.uploadDate}</p>
                      <div className="mt-1">
                        <Badge variant={d.status === 'Verified' ? 'success' : 'warning'} size="sm">
                          {d.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading verified document: ${d.title}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Download Copy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Modal for Admin */}
      <AddEditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employeeToEdit={employee}
        onSaved={() => {
          // reloaded
        }}
      />
    </div>
  );
};
