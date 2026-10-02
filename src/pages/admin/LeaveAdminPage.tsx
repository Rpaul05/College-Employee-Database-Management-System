import React, { useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertCircle,
  FileCheck,
  Building2,
  Calendar,
  UserCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { LeaveRequest, LeaveStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const LeaveAdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [statusFilter, setStatusFilter] = useState<'All' | LeaveStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [reviewModalCandidate, setReviewModalCandidate] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [adminRemarks, setAdminRemarks] = useState('');

  const leaves = storageService.getLeaveRequests();

  const filteredLeaves = leaves.filter(l => {
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'Rejected').length;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalCandidate) return;

    storageService.reviewLeave(
      reviewModalCandidate.id,
      reviewAction,
      adminRemarks,
      currentUser?.name || 'Dr. Sarah Vance'
    );

    success(
      `Leave Request ${reviewAction}`,
      `${reviewAction} leave request for ${reviewModalCandidate.employeeName}.`
    );

    setReviewModalCandidate(null);
    setAdminRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Faculty Leave & Sabbatical Governance</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Approve, review, or reject faculty leave requests and review substitute arrangements
          </p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Pending'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Requires immediate administrative review</p>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Approved'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved Leaves</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{approvedCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Substitutes notified and logged to attendance</p>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'Rejected'
              ? 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rejected / Denied</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{rejectedCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Returned with administrative justification</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by faculty or department..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Leave Requests Cards / Table */}
      <div className="space-y-3">
        {filteredLeaves.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <CalendarClock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No leave requests found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or search query</p>
          </div>
        ) : (
          filteredLeaves.map(req => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{req.employeeName}</span>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{req.employeeId}</span>
                    <Badge variant={req.employeeType === 'Teaching' ? 'default' : 'neutral'} size="sm">
                      {req.employeeType}
                    </Badge>
                    <Badge
                      variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'danger'}
                      size="sm"
                      dot
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {req.department}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {req.leaveType}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {req.startDate} to {req.endDate} ({req.daysCount} days)
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-900 dark:text-white">Reason: </span>
                    {req.reason}
                  </p>

                  {req.substituteFaculty && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Class handover / substitute faculty: <strong>{req.substituteFaculty}</strong></span>
                    </p>
                  )}

                  {req.adminRemarks && (
                    <div className="mt-2 text-xs bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60">
                      <span className="font-semibold">Dean/Admin Remarks ({req.reviewedBy}): </span>
                      {req.adminRemarks}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400">Applied {req.appliedOn}</span>
                  {req.status === 'Pending' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setReviewModalCandidate(req);
                          setReviewAction('Approved');
                          setAdminRemarks('Approved after syllabus review.');
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircle className="w-3.5 h-3.5" />}
                        onClick={() => {
                          setReviewModalCandidate(req);
                          setReviewAction('Rejected');
                          setAdminRemarks('Academic commitments preclude absence during this week.');
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReviewModalCandidate(req);
                        setReviewAction(req.status === 'Approved' ? 'Rejected' : 'Approved');
                        setAdminRemarks(req.adminRemarks || '');
                      }}
                    >
                      Change Decision
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModalCandidate}
        onClose={() => setReviewModalCandidate(null)}
        title={`${reviewAction} Leave Request: ${reviewModalCandidate?.employeeName}`}
        description="Provide optional administrative remarks or notes for the institutional record."
        maxWidth="md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">{reviewModalCandidate?.leaveType} ({reviewModalCandidate?.daysCount} days)</div>
            <div className="text-slate-500">{reviewModalCandidate?.startDate} through {reviewModalCandidate?.endDate}</div>
            <div className="text-slate-600 dark:text-slate-300 italic">"{reviewModalCandidate?.reason}"</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Decision
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewAction('Approved')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewAction === 'Approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Approve Leave
              </button>
              <button
                type="button"
                onClick={() => setReviewAction('Rejected')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewAction === 'Rejected'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Reject / Deny
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Administrator Remarks
            </label>
            <textarea
              rows={3}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="e.g. Sabbatical approved. Lab sessions covered by teaching assistant."
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setReviewModalCandidate(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={reviewAction === 'Approved' ? 'success' : 'danger'}
            >
              Confirm {reviewAction}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
