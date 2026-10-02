import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplyLeaveModal } from './ApplyLeaveModal';

export const MyLeavePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (!currentUser) return null;

  const leaveRequests = storageService.getLeaveRequests(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>My Leave Balances & Applications</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit new leave requests, monitor approvals, and review your annual quotas
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Quota Balances */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-500">Casual Leave</span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {currentUser.leaveBalances.casual} Days
          </div>
          <span className="text-[11px] text-slate-400">Personal & Family</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-500">Sick / Medical</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {currentUser.leaveBalances.sick} Days
          </div>
          <span className="text-[11px] text-slate-400">Medical Certificate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-500">
            {currentUser.employeeType === 'Teaching' ? 'Academic / Sabbatical' : 'Earned Leave'}
          </span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {currentUser.employeeType === 'Teaching' ? `${currentUser.leaveBalances.academic} Days` : `${currentUser.leaveBalances.earned} Days`}
          </div>
          <span className="text-[11px] text-slate-400">Conferences & Research</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs text-center">
          <span className="text-xs font-semibold text-slate-500">Vacation Earned</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {currentUser.leaveBalances.earned} Days
          </div>
          <span className="text-[11px] text-slate-400">Semester Breaks</span>
        </div>
      </div>

      {/* Leave Application History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Application History</h3>

        <div className="space-y-3">
          {leaveRequests.length === 0 ? (
            <p className="p-8 text-center text-xs text-slate-400">No leave applications found.</p>
          ) : (
            leaveRequests.map(l => (
              <div
                key={l.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{l.leaveType}</span>
                    <span className="font-mono text-[11px] text-slate-400">({l.daysCount} days)</span>
                  </div>
                  <Badge
                    variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}
                    size="sm"
                    dot
                  >
                    {l.status}
                  </Badge>
                </div>

                <p className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Reason: </span>
                  {l.reason}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                  <span>Duration: <strong>{l.startDate}</strong> through <strong>{l.endDate}</strong></span>
                  <span>Submitted on: {l.appliedOn}</span>
                </div>

                {l.adminRemarks && (
                  <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 text-xs border border-indigo-100 dark:border-indigo-900/60">
                    <span className="font-semibold">Dean/Admin Response: </span>
                    {l.adminRemarks} (by {l.reviewedBy} on {l.reviewedOn})
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
