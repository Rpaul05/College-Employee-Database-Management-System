import React, { useState } from 'react';
import {
  CalendarCheck,
  CalendarClock,
  Banknote,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  Shield,
  Download,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';
import { ApplyLeaveModal } from './ApplyLeaveModal';

export const EmployeeDashboardPage: React.FC = () => {
  const { currentUser, setActiveView } = useAuth();
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  if (!currentUser) return null;

  const attendanceRecords = storageService.getAttendance({ employeeId: currentUser.id });
  const leaveRequests = storageService.getLeaveRequests(currentUser.id);
  const payrollRecords = storageService.getPayrollRecords(currentUser.id);
  const documents = storageService.getDocuments(currentUser.id);

  // Today's attendance
  const todayRecord = attendanceRecords.find(a => a.date === '2026-10-02');
  const latestPayroll = payrollRecords[0];

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Read Only Banner */}
      <ReadOnlyBadge variant="banner" />

      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome back, {currentUser.name}
                </h2>
                <Badge variant={currentUser.employeeType === 'Teaching' ? 'default' : 'neutral'} size="sm">
                  {currentUser.employeeType === 'Teaching' ? 'Faculty' : 'Staff'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {currentUser.designation} • {currentUser.department}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                <span>Faculty ID: {currentUser.id}</span>
                <span>•</span>
                <span>Status: <strong className="text-emerald-400">{currentUser.status}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="success"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsApplyLeaveOpen(true)}
            >
              Apply for Leave
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
              icon={<Banknote className="w-4 h-4" />}
              onClick={() => setActiveView('my-payroll')}
            >
              My Payslips
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Employee Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Punch Status */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Check-in</span>
            <CalendarCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {todayRecord ? todayRecord.checkIn : '08:45 AM'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Biometric Clocked In</span>
          </div>
        </div>

        {/* Casual Leave Balance */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Casual Leave Remaining</span>
            <CalendarClock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {currentUser.leaveBalances.casual} Days
          </div>
          <span className="text-[11px] text-slate-500">of 12 annual allowance</span>
        </div>

        {/* Academic / Sick Leaves */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {currentUser.employeeType === 'Teaching' ? 'Academic / Sabbatical' : 'Sick Leaves'}
            </span>
            <GraduationCap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {currentUser.employeeType === 'Teaching' ? `${currentUser.leaveBalances.academic} Days` : `${currentUser.leaveBalances.sick} Days`}
          </div>
          <span className="text-[11px] text-slate-500">Conference & Research Quota</span>
        </div>

        {/* Monthly Net Salary */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Latest Net Salary</span>
            <Banknote className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            ${currentUser.salary.netSalary.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">{latestPayroll ? latestPayroll.month : 'September 2026'} Paid</span>
        </div>
      </div>

      {/* Main Grid: Recent Leaves & Official Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Recent Leave Requests */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Leave Requests</h3>
              <p className="text-xs text-slate-500">Applications submitted for administrative review</p>
            </div>
            <button
              onClick={() => setActiveView('my-leave')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leaveRequests.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No leave requests on file.</p>
            ) : (
              leaveRequests.slice(0, 3).map(req => (
                <div key={req.id} className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{req.leaveType}</span>
                    <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'danger'} size="sm" dot>
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">{req.reason}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{req.startDate} to {req.endDate} ({req.daysCount} days)</span>
                    <span>Applied on {req.appliedOn}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Verified Official Records & Documents */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Profile Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Official Employment Details</h3>
              <ReadOnlyBadge variant="pill" />
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Designation</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.designation}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.department}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Date of Joining</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentUser.joiningDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Qualification</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]" title={currentUser.qualification}>
                  {currentUser.qualification}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('my-profile')}
              className="w-full mt-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              View Complete Verified Profile →
            </button>
          </div>

          {/* Quick Document Download */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Verified Documents</h3>
              <span className="text-xs text-slate-400">{documents.length} verified</span>
            </div>

            <div className="space-y-2">
              {documents.slice(0, 2).map(doc => (
                <div key={doc.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate font-medium text-slate-800 dark:text-slate-200">{doc.title}</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading verified document: ${doc.title}`)}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView('my-documents')}
              className="w-full mt-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline text-center block cursor-pointer"
            >
              See all documents
            </button>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
      />
    </div>
  );
};
