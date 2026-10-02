import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { LeaveType } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onApplied
}) => {
  const { currentUser } = useAuth();
  const { success, error } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState('2026-10-15');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [reason, setReason] = useState('');
  const [substituteFaculty, setSubstituteFaculty] = useState('');

  if (!currentUser) return null;

  // Calculate day count
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      error('Please provide a reason for the leave application.');
      return;
    }

    storageService.applyLeave({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      employeeType: currentUser.employeeType,
      leaveType,
      startDate,
      endDate,
      daysCount: calculatedDays,
      reason: reason.trim(),
      substituteFaculty: substituteFaculty.trim() || undefined
    });

    success(
      'Leave Application Submitted',
      `Your request for ${calculatedDays} day(s) of ${leaveType} has been submitted for Dean/Admin review.`
    );

    if (onApplied) onApplied();
    onClose();
    setReason('');
    setSubstituteFaculty('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Faculty Leave / Absence"
      description="Submit your leave application for academic or personal absence."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Balances Pill Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Your Current Quota:</div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Casual: <strong>{currentUser.leaveBalances.casual} days</strong></span>
            <span>•</span>
            <span>Sick: <strong>{currentUser.leaveBalances.sick} days</strong></span>
            {currentUser.employeeType === 'Teaching' && (
              <>
                <span>•</span>
                <span>Academic: <strong>{currentUser.leaveBalances.academic} days</strong></span>
              </>
            )}
          </div>
        </div>

        <Select
          label="Leave Type *"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { label: 'Casual Leave (Personal)', value: 'Casual Leave' },
            { label: 'Sick / Medical Leave', value: 'Sick Leave' },
            { label: 'Academic / Sabbatical / Conference Leave', value: 'Academic/Sabbatical' },
            { label: 'Earned Vacation Leave', value: 'Earned Leave' }
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date *"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date *"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
          Total Duration: {calculatedDays} Day(s)
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Reason for Leave *
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Attending academic conference / family emergency / medical consultation..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {currentUser.employeeType === 'Teaching' && (
          <Input
            label="Handover / Substitute Faculty"
            value={substituteFaculty}
            onChange={(e) => setSubstituteFaculty(e.target.value)}
            placeholder="e.g. Prof. Arthur Campbell (Covering CS301 Lecture)"
            helperText="Nominate a colleague to cover ongoing lab or lecture obligations."
          />
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
